/**
 * GURUVERSE — UNIFIED PORTFOLIO BACKEND
 *
 * One Google Apps Script project powers:
 * 1. GURUVERSE BLOGS — one Google Doc, multiple tabs, one tab = one blog.
 * 2. Portfolio contact form — messages delivered to the configured mailbox.
 *
 * ONE-TIME SETUP:
 * 1. Paste this file into your Apps Script project.
 * 2. Run setupGuruverseBackend().
 * 3. Deploy as Web App: Execute as Me; access Anyone.
 * 4. Use the resulting /exec URL as VITE_PORTFOLIO_API_URL in GitHub Actions.
 */

const GC = Object.freeze({
  SITE_NAME: 'Guru Charan — Security Intelligence Universe',
  CONTACT_TO: 'charanmavuduru9273@gmail.com',

  // GURUVERSE BLOGS master Google Doc.
  MASTER_BLOG_DOCUMENT_ID: '1-MxM94hbJAUfj6wZAEKeyb2uB35Elsf8hQ0YqEGlyog',

  CACHE_KEY: 'gc-guruverse-tabs-v1',
  CACHE_SECONDS: 120,
  MAX_BLOGS: 100,

  CONTACT_COOLDOWN_SECONDS: 60,
  GLOBAL_CONTACT_COOLDOWN_SECONDS: 15,
});

function setupGuruverseBackend() {
  const doc = DocumentApp.openById(GC.MASTER_BLOG_DOCUMENT_ID);
  const properties = PropertiesService.getScriptProperties();

  properties.setProperties({
    GC_MASTER_BLOG_DOCUMENT_ID: GC.MASTER_BLOG_DOCUMENT_ID,
    GC_SITE_NAME: GC.SITE_NAME,
    GC_CONTACT_TO: GC.CONTACT_TO,
  }, false);

  CacheService.getScriptCache().remove(GC.CACHE_KEY);

  const tabs = getAllTabs_(doc);
  Logger.log('GURUVERSE BLOGS connected: ' + doc.getName());
  Logger.log('Document ID: ' + doc.getId());
  Logger.log('Blog tabs found: ' + tabs.length);

  tabs.forEach(function(tab, index) {
    Logger.log((index + 1) + '. ' + tab.getTitle() + ' [' + tab.getId() + ']');
  });

  return {
    ok: true,
    documentName: doc.getName(),
    documentId: doc.getId(),
    tabCount: tabs.length,
  };
}

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || 'health');

  if (action === 'health') {
    return jsonOrJsonp_({
      ok: true,
      service: GC.SITE_NAME,
      blogDocument: 'GURUVERSE BLOGS',
      timestamp: new Date().toISOString(),
    }, e);
  }

  if (action === 'blogs') {
    return jsonOrJsonp_({
      ok: true,
      blogs: getBlogs_(String(e.parameter.refresh || '') === '1'),
    }, e);
  }

  if (action === 'read') {
    const tabId = String(e.parameter.id || '');
    if (String(e.parameter.format || '') === 'json') {
      return jsonOrJsonp_(getArticleData_(tabId), e);
    }
    return renderArticle_(tabId);
  }

  if (action === 'diagnostics') {
    return jsonOrJsonp_({
      ok: false,
      error: 'Diagnostics are not public.',
    }, e);
  }

  return jsonOrJsonp_({ ok: false, error: 'Unknown action' }, e);
}

function doPost(e) {
  try {
    const data = e && e.parameter ? e.parameter : {};

    if (String(data.action || '') !== 'contact') {
      return contactResponse_({ ok: false, error: 'Unknown action' });
    }

    if (String(data.company_website || '').trim()) {
      return contactResponse_({ ok: true });
    }

    const name = clean_(data.name, 100);
    const email = clean_(data.email, 180);
    const subject = clean_(data.subject, 180);
    const message = clean_(data.message, 5000);
    const source = clean_(data.source || 'Portfolio', 180);

    if (!name || !isEmail_(email) || !subject || message.length < 8) {
      return contactResponse_({
        ok: false,
        error: 'Please provide valid contact details.',
      });
    }

    enforceContactCooldown_(email);
    enforceGlobalContactCooldown_();

    const body = [
      'New portfolio message',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Subject: ' + subject,
      'Source: ' + source,
      '',
      'Message:',
      message,
      '',
      'Received: ' + new Date().toString(),
    ].join('\n');

    MailApp.sendEmail({
      to: GC.CONTACT_TO,
      subject: '[Portfolio] ' + subject,
      body: body,
      replyTo: email,
      name: GC.SITE_NAME,
    });

    return contactResponse_({ ok: true, message: 'Message sent.' });
  } catch (error) {
    console.error(error);
    return contactResponse_({
      ok: false,
      error: 'The message could not be delivered. Please use the email link instead.',
    });
  }
}

function getAllTabs_(doc) {
  const allTabs = [];
  doc.getTabs().forEach(function(tab) {
    addCurrentAndChildTabs_(tab, allTabs);
  });
  return allTabs;
}

function addCurrentAndChildTabs_(tab, allTabs) {
  allTabs.push(tab);
  tab.getChildTabs().forEach(function(childTab) {
    addCurrentAndChildTabs_(childTab, allTabs);
  });
}

function getMasterBlogDocument_() {
  const id =
    PropertiesService.getScriptProperties().getProperty('GC_MASTER_BLOG_DOCUMENT_ID') ||
    GC.MASTER_BLOG_DOCUMENT_ID;

  return DocumentApp.openById(id);
}

function getBlogs_(refresh) {
  const cache = CacheService.getScriptCache();

  if (!refresh) {
    const cached = cache.get(GC.CACHE_KEY);
    if (cached) return JSON.parse(cached);
  }

  const doc = getMasterBlogDocument_();
  const tabs = getAllTabs_(doc);
  const blogs = [];

  tabs.forEach(function(tab) {
    if (blogs.length >= GC.MAX_BLOGS) return;

    const documentTab = tab.asDocumentTab();
    const body = documentTab.getBody();
    const text = body.getText().trim();

    if (!text && body.getNumChildren() === 0) return;

    const title = tab.getTitle().trim() || 'Untitled';
    const description = descriptionFromText_(text);
    const domain = inferDomain_(title + ' ' + text);
    const tags = inferTags_(title + ' ' + text);
    const readingTime = Math.max(1, Math.ceil((text ? text.split(/\s+/).length : 0) / 220));

    blogs.push({
      id: tab.getId(),
      title: title,
      description: description || 'A GURUVERSE learning journal entry.',
      domain: domain,
      status: inferStatus_(text),
      tags: tags,
      featured: blogs.length === 0,
      updatedAt: new Date().toISOString(),
      readingTime: readingTime,
      url: ScriptApp.getService().getUrl() + '?action=read&id=' + encodeURIComponent(tab.getId()),
    });
  });

  cache.put(GC.CACHE_KEY, JSON.stringify(blogs), GC.CACHE_SECONDS);
  return blogs;
}

function findTabById_(doc, tabId) {
  const tabs = getAllTabs_(doc);

  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].getId() === tabId) return tabs[i];
  }

  return null;
}

function getArticleData_(tabId) {
  if (!/^[a-zA-Z0-9._-]{1,128}$/.test(tabId)) {
    return { ok: false, error: 'Article not found.' };
  }

  const doc = getMasterBlogDocument_();
  const tab = findTabById_(doc, tabId);

  if (!tab) return { ok: false, error: 'Article not found.' };

  const documentTab = tab.asDocumentTab();
  const body = documentTab.getBody();
  const title = tab.getTitle().trim() || 'GURUVERSE Blog';

  return {
    ok: true,
    title: title,
    html: renderBody_(body),
  };
}

function renderArticle_(tabId) {
  const data = getArticleData_(tabId);
  if (!data.ok) return HtmlService.createHtmlOutput(escapeHtml_(data.error || 'Article not found.'));

  const title = data.title;
  const articleHtml = data.html;

  const html =
    '<!doctype html><html><head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="theme-color" content="#05070b">' +
    '<meta name="referrer" content="no-referrer">' +
    '<title>' + escapeHtml_(title) + ' — GURUVERSE</title>' +
    '<style>' +
    'body{margin:0;background:#05070b;color:#f4f1e8;font:17px/1.8 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
    '.wrap{max-width:900px;margin:auto;padding:64px 24px 100px}' +
    '.eyebrow{font:12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#55e6ff;letter-spacing:.14em;text-transform:uppercase;border-bottom:1px solid #24303e;padding-bottom:18px;margin-bottom:42px}' +
    'h1{font-size:clamp(42px,8vw,86px);line-height:.95;letter-spacing:-.05em;margin:0 0 50px}' +
    'h2{font-size:36px;line-height:1.1;margin:2em 0 .7em}' +
    'h3{font-size:25px;line-height:1.2;margin:1.6em 0 .6em}' +
    'p,li{color:#b0bac6}' +
    'p{margin:1em 0}' +
    'ul,ol{padding-left:1.5em}' +
    'li{margin:.45em 0}' +
    'a{color:#55e6ff}' +
    'blockquote{border-left:2px solid #55e6ff;margin:2em 0;padding:.2em 0 .2em 22px;color:#cbd3dc}' +
    'hr{border:0;border-top:1px solid #24303e;margin:3em 0}' +
    'table{width:100%;border-collapse:collapse;margin:2em 0;font-size:15px}' +
    'th,td{border:1px solid #24303e;padding:12px;text-align:left;vertical-align:top}' +
    'th{color:#f4f1e8}' +
    'td{color:#b0bac6}' +
    '.article-image{display:block;max-width:100%;height:auto;margin:28px auto;border:1px solid #24303e}' +
    '.caption{font-size:13px;color:#7f8a96;text-align:center;margin-top:-18px}' +
    '.footer{margin-top:70px;padding-top:20px;border-top:1px solid #24303e;color:#66717d;font:12px monospace;letter-spacing:.08em}' +
    '</style></head><body><main class="wrap">' +
    '<div class="eyebrow">GURUVERSE / LIVE LEARNING JOURNAL</div>' +
    '<h1>' + escapeHtml_(title) + '</h1>' +
    articleHtml +
    '<div class="footer">GURU CHARAN · GURUVERSE BLOGS</div>' +
    '</main></body></html>';

  return HtmlService.createHtmlOutput(html)
    .setTitle(title + ' — GURUVERSE')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function renderBody_(body) {
  const chunks = [];

  for (let i = 0; i < body.getNumChildren(); i++) {
    const element = body.getChild(i);
    chunks.push(renderElement_(element));
  }

  return chunks.filter(Boolean).join('\n');
}

function renderElement_(element) {
  const type = element.getType();

  if (type === DocumentApp.ElementType.PARAGRAPH) {
    return renderParagraph_(element.asParagraph());
  }

  if (type === DocumentApp.ElementType.LIST_ITEM) {
    return renderListItem_(element.asListItem());
  }

  if (type === DocumentApp.ElementType.TABLE) {
    return renderTable_(element.asTable());
  }

  if (type === DocumentApp.ElementType.HORIZONTAL_RULE) {
    return '<hr>';
  }

  return '';
}

function renderParagraph_(paragraph) {
  const heading = paragraph.getHeading();
  const tag = headingTag_(heading);
  const inner = renderInlineChildren_(paragraph);

  if (!inner.trim()) return '';

  if (tag) return '<' + tag + '>' + inner + '</' + tag + '>';

  return '<p>' + inner + '</p>';
}

function renderListItem_(item) {
  const inner = renderInlineChildren_(item);
  return '<li>' + inner + '</li>';
}

function renderInlineChildren_(container) {
  const chunks = [];

  for (let i = 0; i < container.getNumChildren(); i++) {
    const child = container.getChild(i);
    const type = child.getType();

    if (type === DocumentApp.ElementType.TEXT) {
      chunks.push(escapeHtml_(child.asText().getText()));
    } else if (type === DocumentApp.ElementType.INLINE_IMAGE) {
      chunks.push(renderInlineImage_(child.asInlineImage()));
    }
  }

  return chunks.join('');
}

function renderInlineImage_(image) {
  try {
    const blob = image.getBlob();
    const mimeType = blob.getContentType() || 'image/png';

    if (!/^image\/(?:png|jpeg|gif|webp)$/i.test(mimeType)) return '';

    const base64 = Utilities.base64Encode(blob.getBytes());
    return '<img class="article-image" src="data:' + mimeType + ';base64,' + base64 + '" alt="GURUVERSE article image">';
  } catch (error) {
    return '';
  }
}

function renderTable_(table) {
  const rows = [];

  for (let r = 0; r < table.getNumRows(); r++) {
    const row = table.getRow(r);
    const cells = [];

    for (let c = 0; c < row.getNumCells(); c++) {
      const text = escapeHtml_(row.getCell(c).getText());
      cells.push((r === 0 ? '<th>' : '<td>') + text + (r === 0 ? '</th>' : '</td>'));
    }

    rows.push('<tr>' + cells.join('') + '</tr>');
  }

  return '<table><tbody>' + rows.join('') + '</tbody></table>';
}

function headingTag_(heading) {
  if (heading === DocumentApp.ParagraphHeading.TITLE ||
      heading === DocumentApp.ParagraphHeading.HEADING1) return 'h2';

  if (heading === DocumentApp.ParagraphHeading.HEADING2) return 'h3';

  if (heading === DocumentApp.ParagraphHeading.HEADING3) return 'h3';

  return '';
}

function enforceGlobalContactCooldown_() {
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(5000)) {
    throw new Error('Please try again in a few seconds.');
  }

  try {
    const cache = CacheService.getScriptCache();
    const key = 'contact-global';

    if (cache.get(key)) {
      throw new Error('Please wait before sending another message.');
    }

    cache.put(key, '1', GC.GLOBAL_CONTACT_COOLDOWN_SECONDS);
  } finally {
    lock.releaseLock();
  }
}

function enforceContactCooldown_(email) {
  const cache = CacheService.getScriptCache();
  const key = 'contact-' +
    Utilities.base64EncodeWebSafe(email.toLowerCase()).substring(0, 40);

  if (cache.get(key)) {
    throw new Error('Please wait before sending another message.');
  }

  cache.put(key, '1', GC.CONTACT_COOLDOWN_SECONDS);
}

function descriptionFromText_(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > 280
    ? clean.substring(0, 277).replace(/\s+\S*$/, '') + '…'
    : clean;
}

function inferDomain_(text) {
  const value = String(text || '').toLowerCase();

  if (/cybergpt|ra-xsoc|embedding|faiss|artificial intelligence|ai /.test(value)) {
    return 'AI & Cybersecurity';
  }

  if (/soc|splunk|sysmon|kali|incident response|security/.test(value)) {
    return 'Cybersecurity';
  }

  if (/solar|mppt|matlab|simulink|partial shading/.test(value)) {
    return 'Engineering Research';
  }

  if (/sahaaya|saas|automation|apps script/.test(value)) {
    return 'Product & Automation';
  }

  if (/portfolio|html|css|javascript|react|web development/.test(value)) {
    return 'Web Development';
  }

  if (/teaching|school|student|education/.test(value)) {
    return 'Education Technology';
  }

  return 'Technical Learning';
}

function inferTags_(text) {
  const value = String(text || '').toLowerCase();

  const mapping = [
    ['Python', /python/],
    ['SOC', /\bsoc\b|security operations/],
    ['Cybersecurity', /cybersecurity|security/],
    ['Artificial Intelligence', /artificial intelligence|\bai\b/],
    ['FAISS', /faiss/],
    ['MITRE ATT&CK', /mitre/],
    ['Splunk', /splunk/],
    ['Kali Linux', /kali/],
    ['MATLAB', /matlab/],
    ['Simulink', /simulink/],
    ['Automation', /automation|apps script/],
    ['Web Development', /web development|html|css|react/],
  ];

  return mapping
    .filter(function(item) { return item[1].test(value); })
    .map(function(item) { return item[0]; })
    .slice(0, 9);
}

function inferStatus_(text) {
  const value = String(text || '').toLowerCase();

  if (/completed|complete/.test(value)) return 'Completed';
  if (/functional prototype|prototype/.test(value)) return 'Functional prototype';
  if (/implemented/.test(value)) return 'Implemented';
  if (/in progress|ongoing|expanding/.test(value)) return 'In progress';
  if (/research/.test(value)) return 'Research project';

  return 'Learning journal';
}

function clean_(value, limit) {
  return String(value || '')
    .replace(/[\u0000-\u001F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, limit);
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function contactResponse_(payload) {
  const message = Object.assign({ type: 'portfolio-contact' }, payload);
  const safePayload = JSON.stringify(message).replace(/</g, '\\u003c');

  // The response is embedded by the production GitHub Pages site.
  // Keep the postMessage target exact instead of broadcasting it to every origin.
  const targetOrigin = 'https://sarma9273.github.io';

  return HtmlService.createHtmlOutput(
    '<!doctype html><html><body><script>' +
    'window.parent.postMessage(' +
    safePayload +
    ', ' + JSON.stringify(targetOrigin) + ');' +
    '</script></body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonOrJsonp_(payload, e) {
  const callback = String((e && e.parameter && e.parameter.callback) || '');

  if (callback && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(payload) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return json_(payload);
}
