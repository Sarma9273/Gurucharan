/**
 * GURU CHARAN PORTFOLIO BACKEND — CLEAN INDEPENDENT VERSION
 *
 * This one Apps Script file provides:
 * 1. Fresh Drive CMS setup
 * 2. Live Google Doc blog feed
 * 3. Custom article reader
 * 4. Automatic metadata for future blogs
 * 5. Hourly metadata trigger
 * 6. Contact-form email delivery
 * 7. Health and diagnostic endpoints
 *
 * FIRST-TIME ORDER:
 *   setupPortfolioSystem()
 *   installPortfolioAutomation()
 *   deploy as Web App
 *
 * Web App access: Anyone
 * Execute as: Me
 */

const PORTFOLIO_SETTINGS = Object.freeze({
  SITE_NAME: 'Guru Charan — Security Intelligence Journey',
  CONTACT_TO: 'charanmavuduru9273@gmail.com',
  CONTACT_PREFIX: '[Gurucharan Portfolio]',
  ROOT_FOLDER_NAME: 'Gurucharan Portfolio CMS',
  BLOGS_FOLDER_NAME: 'Blogs',
  MEDIA_FOLDER_NAME: 'Media',
  ARCHIVE_FOLDER_NAME: 'Archive',
  METADATA_FILE: 'portfolio.meta.json',
  CACHE_KEY: 'gc-portfolio-live-blogs-v1',
  CACHE_SECONDS: 180,
  MAX_BLOGS: 150,
  CONTACT_COOLDOWN_SECONDS: 60,
  PROPERTY_ROOT_ID: 'GC_PORTFOLIO_ROOT_FOLDER_ID',
  PROPERTY_BLOGS_ID: 'GC_PORTFOLIO_BLOGS_FOLDER_ID',
  AUTOMATION_HANDLER: 'syncFutureBlogMetadata',
});

const PORTFOLIO_CATEGORIES = Object.freeze([
  Object.freeze({
    domain: 'AI & Cybersecurity',
    keywords: ['ai security', 'cybergpt', 'ra-xsoc', 'embedding', 'faiss', 'retrieval', 'mitre att&ck', 'incident response', 'agent reliability'],
    tags: ['Artificial Intelligence', 'Cybersecurity', 'SOC', 'Retrieval', 'Incident Response'],
  }),
  Object.freeze({
    domain: 'Cybersecurity',
    keywords: ['soc', 'splunk', 'sysmon', 'siem', 'kali linux', 'threat detection', 'malware', 'phishing', 'security monitoring'],
    tags: ['Cybersecurity', 'SOC', 'SIEM', 'Threat Detection'],
  }),
  Object.freeze({
    domain: 'Network Security & Python',
    keywords: ['network traffic', 'packet', 'pcap', 'wireshark', 'protocol', 'source ip', 'python dashboard'],
    tags: ['Python', 'Network Security', 'Traffic Analysis'],
  }),
  Object.freeze({
    domain: 'Product & Automation',
    keywords: ['sahaaya360', 'saas', 'apps script', 'google sheets', 'ticket', 'workflow automation', 'startup', 'mvp'],
    tags: ['SaaS', 'Google Apps Script', 'Automation', 'Product Development'],
  }),
  Object.freeze({
    domain: 'Engineering Research',
    keywords: ['solar pv', 'mppt', 'matlab', 'simulink', 'partial shading', 'optimisation', 'optimization', 'renewable energy'],
    tags: ['Solar PV', 'MPPT', 'MATLAB', 'Simulink', 'Optimisation'],
  }),
  Object.freeze({
    domain: 'Web Development & Personal Branding',
    keywords: ['personal portfolio', 'astro', 'github pages', 'technical blog', 'personal brand', 'three.js', 'gsap'],
    tags: ['Portfolio', 'Astro', 'Web Development', 'Personal Branding'],
  }),
  Object.freeze({
    domain: 'Education Technology',
    keywords: ['school', 'computer lab', 'teaching', 'student', 'digital learning', 'shared drive', 'classroom'],
    tags: ['Education Technology', 'Teaching', 'Computer Lab', 'Digital Learning'],
  }),
]);

function setupPortfolioSystem() {
  const properties = PropertiesService.getScriptProperties();
  let rootFolder = getFolderFromProperty_(PORTFOLIO_SETTINGS.PROPERTY_ROOT_ID);

  if (!rootFolder) {
    rootFolder = DriveApp.createFolder(PORTFOLIO_SETTINGS.ROOT_FOLDER_NAME);
    properties.setProperty(PORTFOLIO_SETTINGS.PROPERTY_ROOT_ID, rootFolder.getId());
  }

  const blogsFolder = getOrCreateChildFolder_(rootFolder, PORTFOLIO_SETTINGS.BLOGS_FOLDER_NAME);
  const mediaFolder = getOrCreateChildFolder_(rootFolder, PORTFOLIO_SETTINGS.MEDIA_FOLDER_NAME);
  const archiveFolder = getOrCreateChildFolder_(rootFolder, PORTFOLIO_SETTINGS.ARCHIVE_FOLDER_NAME);
  properties.setProperty(PORTFOLIO_SETTINGS.PROPERTY_BLOGS_ID, blogsFolder.getId());

  createCmsReadme_(rootFolder, blogsFolder);
  createBlogTemplate_(blogsFolder);
  CacheService.getScriptCache().remove(PORTFOLIO_SETTINGS.CACHE_KEY);

  const result = {
    ok: true,
    rootFolderId: rootFolder.getId(),
    rootFolderUrl: rootFolder.getUrl(),
    blogsFolderId: blogsFolder.getId(),
    blogsFolderUrl: blogsFolder.getUrl(),
    mediaFolderId: mediaFolder.getId(),
    archiveFolderId: archiveFolder.getId(),
    next: 'Run installPortfolioAutomation(), then deploy this project as a Web App.',
  };

  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function installPortfolioAutomation() {
  setupPortfolioSystem();
  removePortfolioAutomation();
  const trigger = ScriptApp.newTrigger(PORTFOLIO_SETTINGS.AUTOMATION_HANDLER)
    .timeBased()
    .everyHours(1)
    .create();
  const sync = syncFutureBlogMetadata();
  const result = {
    ok: true,
    triggerId: trigger.getUniqueId(),
    frequency: 'hourly',
    initialSync: sync,
  };
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function removePortfolioAutomation() {
  let removed = 0;
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === PORTFOLIO_SETTINGS.AUTOMATION_HANDLER) {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  });
  Logger.log('Removed portfolio automation triggers: ' + removed);
  return { ok: true, removed: removed };
}

function checkPortfolioSystem() {
  const root = getPortfolioRoot_();
  const blogs = getBlogsFolder_();
  const triggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === PORTFOLIO_SETTINGS.AUTOMATION_HANDLER;
  });
  const result = {
    ok: true,
    rootFolder: root.getUrl(),
    blogsFolder: blogs.getUrl(),
    automationInstalled: triggers.length === 1,
    automationTriggerCount: triggers.length,
    visibleBlogCount: listBlogs_(true).length,
  };
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function seedStarterContent() {
  setupPortfolioSystem();
  const blogsFolder = getBlogsFolder_();
  const starters = getStarterArticles_();
  const results = [];

  starters.forEach(function(article, index) {
    const folderName = String(index + 1).padStart(2, '0') + '_' + article.slug.replace(/-/g, '_');
    const folder = getOrCreateChildFolder_(blogsFolder, folderName);
    const docs = folder.getFilesByType(MimeType.GOOGLE_DOCS);
    let docFile = null;
    while (docs.hasNext()) {
      const candidate = docs.next();
      if (candidate.getName() === article.title) {
        docFile = candidate;
        break;
      }
    }

    if (!docFile) {
      const doc = DocumentApp.create(article.title);
      const body = doc.getBody();
      body.appendParagraph(article.title).setHeading(DocumentApp.ParagraphHeading.TITLE);
      body.appendParagraph('Portfolio Description: ' + article.description);
      body.appendParagraph('Portfolio Domain: ' + article.domain);
      body.appendParagraph('Portfolio Tags: ' + article.tags.join(', '));
      body.appendParagraph('Portfolio Status: ' + article.status);
      body.appendParagraph('Portfolio Featured: ' + article.featured);
      body.appendHorizontalRule();
      article.sections.forEach(function(section) {
        body.appendParagraph(section.heading).setHeading(DocumentApp.ParagraphHeading.HEADING1);
        body.appendParagraph(section.body);
      });
      doc.saveAndClose();
      docFile = DriveApp.getFileById(doc.getId());
      folder.addFile(docFile);
      DriveApp.getRootFolder().removeFile(docFile);
    }

    const metadata = {
      title: article.title,
      slug: article.slug,
      description: article.description,
      domain: article.domain,
      tags: article.tags,
      status: article.status,
      featured: article.featured,
      autoGenerated: false,
      sourceDocumentId: docFile.getId(),
      sourceUpdatedAt: docFile.getLastUpdated().toISOString(),
      generatedAt: new Date().toISOString(),
    };
    writeMetadata_(folder, metadata);
    results.push({ folder: folderName, title: article.title, documentId: docFile.getId() });
  });

  CacheService.getScriptCache().remove(PORTFOLIO_SETTINGS.CACHE_KEY);
  Logger.log('Starter content ready: ' + results.length);
  return { ok: true, createdOrFound: results.length, results: results };
}

function syncFutureBlogMetadata() {
  setupPortfolioSystem();
  const blogsFolder = getBlogsFolder_();
  const folders = blogsFolder.getFolders();
  const results = [];

  while (folders.hasNext()) {
    const folder = folders.next();
    try {
      results.push(processBlogFolder_(folder));
    } catch (error) {
      results.push({ folder: folder.getName(), action: 'ERROR', reason: error.message });
    }
  }

  CacheService.getScriptCache().remove(PORTFOLIO_SETTINGS.CACHE_KEY);
  const summary = {
    ok: true,
    scanned: results.length,
    created: results.filter(function(item) { return item.action === 'CREATED'; }).length,
    updated: results.filter(function(item) { return item.action === 'UPDATED'; }).length,
    preserved: results.filter(function(item) { return item.action === 'PRESERVED'; }).length,
    skipped: results.filter(function(item) { return item.action === 'SKIPPED'; }).length,
    errors: results.filter(function(item) { return item.action === 'ERROR'; }).length,
    results: results,
  };
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;
}

function doGet(e) {
  const parameters = (e && e.parameter) || {};
  const action = String(parameters.action || 'health').toLowerCase();

  try {
    if (action === 'health') {
      return outputData_({
        ok: true,
        service: PORTFOLIO_SETTINGS.SITE_NAME,
        timestamp: new Date().toISOString(),
        setupComplete: Boolean(PropertiesService.getScriptProperties().getProperty(PORTFOLIO_SETTINGS.PROPERTY_BLOGS_ID)),
      }, parameters.callback);
    }

    if (action === 'blogs') {
      const refresh = parameters.refresh === '1';
      return outputData_({ ok: true, blogs: listBlogs_(refresh) }, parameters.callback);
    }

    if (action === 'read') {
      return renderBlogReader_(parameters.id);
    }

    if (action === 'sync') {
      return outputData_(syncFutureBlogMetadata(), parameters.callback);
    }

    return outputData_({ ok: false, error: 'Unknown action.' }, parameters.callback);
  } catch (error) {
    return outputData_({ ok: false, error: error.message }, parameters.callback);
  }
}

function doPost(e) {
  try {
    const result = processContact_((e && e.parameter) || {});
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function listBlogs_(refresh) {
  const cache = CacheService.getScriptCache();
  if (!refresh) {
    const cached = cache.get(PORTFOLIO_SETTINGS.CACHE_KEY);
    if (cached) return JSON.parse(cached);
  }

  syncFutureBlogMetadata();
  const blogsFolder = getBlogsFolder_();
  const folders = blogsFolder.getFolders();
  const blogs = [];

  while (folders.hasNext() && blogs.length < PORTFOLIO_SETTINGS.MAX_BLOGS) {
    const folder = folders.next();
    const docFile = findPrimaryDoc_(folder);
    if (!docFile) continue;
    const metadata = readMetadata_(folder);
    if (!metadata) continue;

    blogs.push({
      id: docFile.getId(),
      slug: metadata.slug,
      title: metadata.title,
      description: metadata.description,
      domain: metadata.domain,
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      status: metadata.status,
      featured: metadata.featured === true,
      updatedAt: docFile.getLastUpdated().toISOString(),
      folderName: folder.getName(),
      readingMinutes: estimateReadingTime_(docFile.getId()),
      url: ScriptApp.getService().getUrl() + '?action=read&id=' + encodeURIComponent(docFile.getId()),
    });
  }

  blogs.sort(function(a, b) {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  cache.put(PORTFOLIO_SETTINGS.CACHE_KEY, JSON.stringify(blogs), PORTFOLIO_SETTINGS.CACHE_SECONDS);
  return blogs;
}

function processBlogFolder_(folder) {
  const docFile = findPrimaryDoc_(folder);
  if (!docFile) return { folder: folder.getName(), action: 'SKIPPED', reason: 'No native Google Doc found' };

  const existing = readMetadata_(folder);
  if (existing && existing.autoGenerated !== true) {
    return { folder: folder.getName(), action: 'PRESERVED', reason: 'Manual metadata is locked' };
  }

  if (existing && new Date(existing.sourceUpdatedAt || 0).getTime() >= docFile.getLastUpdated().getTime()) {
    return { folder: folder.getName(), action: 'PRESERVED', reason: 'Automatic metadata already current' };
  }

  const metadata = generateMetadata_(folder, docFile, existing);
  writeMetadata_(folder, metadata);
  return { folder: folder.getName(), action: existing ? 'UPDATED' : 'CREATED', title: metadata.title };
}

function generateMetadata_(folder, docFile, existing) {
  const doc = DocumentApp.openById(docFile.getId());
  const text = doc.getBody().getText().replace(/\r/g, '');
  const lines = text.split('\n').map(function(line) { return line.replace(/^[\s•·▪◦*-]+/, '').replace(/\s+/g, ' ').trim(); }).filter(String);
  const title = cleanTitle_(extractField_(lines, ['Portfolio Title', 'Blog Title']) || findTitle_(lines) || docFile.getName());
  const explicitDescription = extractField_(lines, ['Portfolio Description', 'Short Portfolio Description', 'Blog Description']);
  const description = truncate_(explicitDescription || inferDescription_(lines, title), 320);
  const combined = (title + '\n' + description + '\n' + text + '\n' + folder.getName()).toLowerCase();
  const inferred = inferCategory_(combined);
  const explicitTags = extractField_(lines, ['Portfolio Tags', 'Tags']);
  const tags = unique_((explicitTags ? splitTags_(explicitTags) : inferred.tags)).slice(0, 10);
  const featuredValue = extractField_(lines, ['Portfolio Featured', 'Featured']);

  return {
    title: title,
    slug: slugify_(extractField_(lines, ['Portfolio Slug', 'Slug']) || title),
    description: description,
    domain: extractField_(lines, ['Portfolio Domain', 'Domain']) || inferred.domain,
    tags: tags.length ? tags : ['Technical Learning'],
    status: extractField_(lines, ['Portfolio Status', 'Project Status', 'Status']) || inferStatus_(combined),
    featured: featuredValue ? /^(true|yes|1|featured)$/i.test(featuredValue) : Boolean(existing && existing.featured),
    autoGenerated: true,
    sourceDocumentId: docFile.getId(),
    sourceUpdatedAt: docFile.getLastUpdated().toISOString(),
    generatedAt: new Date().toISOString(),
  };
}

function processContact_(data) {
  const name = cleanText_(data.name, 80);
  const email = cleanText_(data.email, 160);
  const topic = cleanText_(data.topic, 120);
  const subject = cleanText_(data.subject, 140);
  const message = cleanText_(data.message, 4000);
  const source = cleanText_(data.source, 200);
  const honeypot = cleanText_(data.company_website, 200);

  if (honeypot) return { ok: true };
  if (!name || !email || !topic || !subject || message.length < 20) throw new Error('Please complete all required fields.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please use a valid email address.');

  const fingerprint = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email.toLowerCase()));
  const cache = CacheService.getScriptCache();
  if (cache.get('contact-' + fingerprint)) throw new Error('Please wait before sending another message.');
  cache.put('contact-' + fingerprint, '1', PORTFOLIO_SETTINGS.CONTACT_COOLDOWN_SECONDS);

  const body = [
    'New portfolio message',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Topic: ' + topic,
    'Subject: ' + subject,
    'Source: ' + source,
    'Time: ' + new Date().toString(),
    '',
    'Message:',
    message,
  ].join('\n');

  MailApp.sendEmail({
    to: PORTFOLIO_SETTINGS.CONTACT_TO,
    subject: PORTFOLIO_SETTINGS.CONTACT_PREFIX + ' ' + subject,
    body: body,
    replyTo: email,
    name: PORTFOLIO_SETTINGS.SITE_NAME,
  });

  return { ok: true, message: 'Message delivered.' };
}

function renderBlogReader_(documentId) {
  if (!documentId) return HtmlService.createHtmlOutput('<h1>Document ID missing</h1>');
  const file = DriveApp.getFileById(documentId);
  if (file.getMimeType() !== MimeType.GOOGLE_DOCS) return HtmlService.createHtmlOutput('<h1>Unsupported document</h1>');
  const doc = DocumentApp.openById(documentId);
  const title = escapeHtml_(doc.getName());
  const html = documentToHtml_(doc);
  const page = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' + title + '</title><style>' + readerCss_() + '</style></head><body><header><a href="javascript:history.back()">← Back</a><span>GURU CHARAN // LEARNING JOURNAL</span></header><main><p class="eyebrow">LIVE GOOGLE DOC</p><h1>' + title + '</h1><p class="updated">Updated ' + file.getLastUpdated().toDateString() + '</p><article>' + html + '</article><aside>This article is rendered from a Google Doc through the independent portfolio backend.</aside></main></body></html>';
  return HtmlService.createHtmlOutput(page).setTitle(doc.getName()).addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function documentToHtml_(doc) {
  const body = doc.getBody();
  const output = [];
  for (let i = 0; i < body.getNumChildren(); i++) {
    output.push(renderElement_(body.getChild(i)));
  }
  return output.join('');
}

function renderElement_(element) {
  const type = element.getType();
  if (type === DocumentApp.ElementType.PARAGRAPH) {
    const paragraph = element.asParagraph();
    const text = escapeHtml_(paragraph.getText());
    const heading = paragraph.getHeading();
    if (!text) return '<br>';
    if (heading === DocumentApp.ParagraphHeading.TITLE) return '';
    if (heading === DocumentApp.ParagraphHeading.HEADING1) return '<h2>' + text + '</h2>';
    if (heading === DocumentApp.ParagraphHeading.HEADING2) return '<h3>' + text + '</h3>';
    if (heading === DocumentApp.ParagraphHeading.HEADING3) return '<h4>' + text + '</h4>';
    return '<p>' + linkify_(text) + '</p>';
  }
  if (type === DocumentApp.ElementType.LIST_ITEM) {
    return '<ul><li>' + linkify_(escapeHtml_(element.asListItem().getText())) + '</li></ul>';
  }
  if (type === DocumentApp.ElementType.HORIZONTAL_RULE) return '<hr>';
  if (type === DocumentApp.ElementType.TABLE) {
    const table = element.asTable();
    let html = '<div class="table-wrap"><table>';
    for (let r = 0; r < table.getNumRows(); r++) {
      html += '<tr>';
      const row = table.getRow(r);
      for (let c = 0; c < row.getNumCells(); c++) html += '<td>' + escapeHtml_(row.getCell(c).getText()) + '</td>';
      html += '</tr>';
    }
    return html + '</table></div>';
  }
  return '';
}

function outputData_(payload, callback) {
  const json = JSON.stringify(payload);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function getPortfolioRoot_() {
  const folder = getFolderFromProperty_(PORTFOLIO_SETTINGS.PROPERTY_ROOT_ID);
  if (!folder) throw new Error('Portfolio CMS is not set up. Run setupPortfolioSystem().');
  return folder;
}

function getBlogsFolder_() {
  const folder = getFolderFromProperty_(PORTFOLIO_SETTINGS.PROPERTY_BLOGS_ID);
  if (!folder) throw new Error('Blogs folder is not configured. Run setupPortfolioSystem().');
  return folder;
}

function getFolderFromProperty_(key) {
  const id = PropertiesService.getScriptProperties().getProperty(key);
  if (!id) return null;
  try {
    const folder = DriveApp.getFolderById(id);
    return folder.isTrashed() ? null : folder;
  } catch (error) {
    return null;
  }
}

function getOrCreateChildFolder_(parent, name) {
  const matches = parent.getFoldersByName(name);
  return matches.hasNext() ? matches.next() : parent.createFolder(name);
}

function createCmsReadme_(rootFolder, blogsFolder) {
  const name = 'README - Portfolio CMS.txt';
  if (rootFolder.getFilesByName(name).hasNext()) return;
  const text = [
    'GURU CHARAN PORTFOLIO CMS',
    '',
    'Blogs folder: ' + blogsFolder.getUrl(),
    '',
    'FUTURE BLOG WORKFLOW',
    '1. Create a new subfolder inside Blogs.',
    '2. Put one native Google Doc inside the subfolder.',
    '3. Add optional Portfolio metadata lines near the top.',
    '4. The hourly trigger creates portfolio.meta.json automatically.',
    '5. Run syncFutureBlogMetadata() for immediate publication.',
    '',
    'OPTIONAL LINES',
    'Portfolio Title: Public title',
    'Portfolio Description: Short summary',
    'Portfolio Domain: AI & Cybersecurity',
    'Portfolio Tags: Python, SOC, Retrieval',
    'Portfolio Status: In progress',
    'Portfolio Featured: false',
  ].join('\n');
  rootFolder.createFile(name, text, MimeType.PLAIN_TEXT);
}

function createBlogTemplate_(blogsFolder) {
  const folder = getOrCreateChildFolder_(blogsFolder, '00_Blog_Template');
  const existing = folder.getFilesByName('Portfolio Blog Template');
  if (existing.hasNext()) return;
  const doc = DocumentApp.create('Portfolio Blog Template');
  const body = doc.getBody();
  body.appendParagraph('Your Blog Title').setHeading(DocumentApp.ParagraphHeading.TITLE);
  body.appendParagraph('Portfolio Description: Write a concise portfolio summary.');
  body.appendParagraph('Portfolio Domain: AI & Cybersecurity');
  body.appendParagraph('Portfolio Tags: Python, SOC, Retrieval');
  body.appendParagraph('Portfolio Status: Draft');
  body.appendParagraph('Portfolio Featured: false');
  body.appendHorizontalRule();
  body.appendParagraph('Why I started').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Explain the problem, context and motivation.');
  body.appendParagraph('What I built').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Describe the architecture, experiment or workflow.');
  body.appendParagraph('Mistakes and learning').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Document failures, fixes and the meaning of each update.');
  body.appendParagraph('What comes next').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('State limitations and the next planned phase.');
  doc.saveAndClose();
  const file = DriveApp.getFileById(doc.getId());
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
}

function findPrimaryDoc_(folder) {
  const files = folder.getFilesByType(MimeType.GOOGLE_DOCS);
  let selected = null;
  while (files.hasNext()) {
    const file = files.next();
    const lower = file.getName().toLowerCase();
    if (lower.indexOf('template') >= 0 || lower.indexOf('readme') === 0) continue;
    if (!selected || file.getLastUpdated().getTime() > selected.getLastUpdated().getTime()) selected = file;
  }
  return selected;
}

function readMetadata_(folder) {
  const files = folder.getFilesByName(PORTFOLIO_SETTINGS.METADATA_FILE);
  if (!files.hasNext()) return null;
  try {
    return JSON.parse(files.next().getBlob().getDataAsString('UTF-8'));
  } catch (error) {
    throw new Error('Invalid portfolio.meta.json in ' + folder.getName() + ': ' + error.message);
  }
}

function writeMetadata_(folder, metadata) {
  const content = JSON.stringify(metadata, null, 2);
  const files = folder.getFilesByName(PORTFOLIO_SETTINGS.METADATA_FILE);
  if (files.hasNext()) return files.next().setContent(content);
  return folder.createFile(PORTFOLIO_SETTINGS.METADATA_FILE, content, MimeType.PLAIN_TEXT);
}

function extractField_(lines, labels) {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < labels.length; j++) {
      const escaped = labels[j].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = new RegExp('^' + escaped + '\\s*[:–—-]\\s*(.+)$', 'i').exec(lines[i]);
      if (match && match[1]) return match[1].trim();
    }
  }
  return '';
}

function findTitle_(lines) {
  const ignored = ['portfolio description', 'portfolio domain', 'portfolio tags', 'portfolio status', 'portfolio featured', 'project status', 'domain', 'tags'];
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const lower = lines[i].toLowerCase();
    if (ignored.some(function(prefix) { return lower.indexOf(prefix) === 0; })) continue;
    if (lines[i].length >= 8 && lines[i].length <= 180) return lines[i];
  }
  return '';
}

function inferDescription_(lines, title) {
  const candidates = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    if (line === title || lower.indexOf('portfolio ') === 0 || lower === 'introduction') continue;
    if (line.length >= 45) candidates.push(line);
    if (candidates.join(' ').length > 320) break;
  }
  return candidates.join(' ') || 'A technical learning note from Guru Charan Mavuduru.';
}

function inferCategory_(text) {
  let best = { domain: 'Technical Learning', tags: ['Technical Learning'], score: 0 };
  PORTFOLIO_CATEGORIES.forEach(function(category) {
    let score = 0;
    category.keywords.forEach(function(keyword) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = text.match(new RegExp(escaped, 'gi'));
      if (matches) score += matches.length;
    });
    if (score > best.score) best = { domain: category.domain, tags: category.tags, score: score };
  });
  return best;
}

function inferStatus_(text) {
  if (/\bcompleted\b|\bcomplete\b/.test(text)) return 'Completed';
  if (/\bimplemented\b/.test(text)) return 'Implemented';
  if (/\bprototype\b/.test(text)) return 'Functional prototype';
  if (/\bmvp\b/.test(text)) return 'MVP-oriented prototype';
  if (/\bin progress\b|\bongoing\b|\bactive development\b/.test(text)) return 'In progress';
  return 'Learning note';
}

function splitTags_(value) {
  return String(value || '').split(/[,;|•·\n]+/).map(function(tag) { return tag.trim(); }).filter(String);
}

function unique_(values) {
  const seen = {};
  return values.filter(function(value) {
    const key = String(value).toLowerCase();
    if (!value || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function cleanTitle_(value) {
  return String(value || '').replace(/^\s*\d{1,2}[._\s-]+/, '').replace(/\s+/g, ' ').trim();
}

function slugify_(value) {
  return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 100) || 'portfolio-blog';
}

function truncate_(value, maxLength) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength - 1).replace(/\s+\S*$/, '') + '…';
}

function cleanText_(value, maxLength) {
  return String(value || '').replace(/[<>]/g, '').trim().substring(0, maxLength);
}

function estimateReadingTime_(documentId) {
  try {
    const words = DocumentApp.openById(documentId).getBody().getText().trim().split(/\s+/).filter(String).length;
    return Math.max(1, Math.ceil(words / 210));
  } catch (error) {
    return 1;
  }
}

function escapeHtml_(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function linkify_(escapedText) {
  return escapedText.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
}

function readerCss_() {
  return ':root{color-scheme:dark;--bg:#050b14;--panel:#0b1725;--text:#edf8ff;--muted:#94aabd;--line:rgba(143,184,211,.2);--cyan:#38bdf8}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 80% 0,rgba(56,189,248,.1),transparent 35%),var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif;line-height:1.75}header{position:sticky;top:0;display:flex;justify-content:space-between;gap:20px;padding:16px max(20px,calc((100vw - 900px)/2));border-bottom:1px solid var(--line);background:rgba(5,11,20,.88);backdrop-filter:blur(14px);font:700 11px/1.2 monospace;letter-spacing:.1em}header a{color:var(--cyan);text-decoration:none}main{width:min(900px,calc(100vw - 32px));margin:0 auto;padding:80px 0}.eyebrow{color:var(--cyan);font:700 11px/1.2 monospace;letter-spacing:.14em}h1{margin:16px 0;font-size:clamp(2.5rem,7vw,5.8rem);line-height:.95;letter-spacing:-.055em}.updated{color:var(--muted);font:12px monospace}article{margin-top:55px;padding:clamp(24px,5vw,60px);border:1px solid var(--line);background:rgba(11,23,37,.74)}article h2{margin-top:2.2em;font-size:2rem;line-height:1.15}article h3{margin-top:1.8em;font-size:1.5rem}article p,article li{color:#b7c7d2}article a{color:var(--cyan)}article hr{border:0;border-top:1px solid var(--line);margin:40px 0}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse}td{padding:12px;border:1px solid var(--line);color:#b7c7d2}aside{margin-top:25px;padding:20px;border-left:2px solid var(--cyan);background:var(--panel);color:var(--muted);font-size:.9rem}';
}

function getStarterArticles_() {
  return [
    {
      title: 'From Portfolio V1 to V2 — Mistakes, Learning and Automation',
      slug: 'portfolio-v1-to-v2',
      description: 'A practical reflection on repository mistakes, GitHub Pages deployment, Drive publishing, contact messaging and the shift from a generic website to a personal technical platform.',
      domain: 'Web Development & Personal Branding',
      tags: ['Astro', 'GitHub Pages', 'Apps Script', 'Automation', 'Personal Branding'],
      status: 'Published learning note',
      featured: true,
      sections: [
        { heading: 'Why the rebuild became necessary', body: 'Portfolio V1 proved that I could publish a website, but it gradually became outdated, difficult to maintain and too corporate for a personal learning journey.' },
        { heading: 'Mistakes that shaped the architecture', body: 'Incorrect folder uploads, mixed repository versions, dependency-registry failures and GitHub Pages configuration problems taught me that deployment and repository structure are part of software design.' },
        { heading: 'What changed in V2', body: 'Astro introduced a clean architecture, GitHub Actions automated deployment, Google Drive separated writing from application code and Apps Script provided live blogs and contact messaging.' },
        { heading: 'What the updates mean', body: 'The portfolio is no longer only a page. It is a maintainable publishing and project-documentation system that can evolve with my skills.' },
      ],
    },
    {
      title: 'RA-XSOC — Turning CyberGPT into a Testable Security Copilot',
      slug: 'ra-xsoc-security-copilot',
      description: 'The engineering journey from a functional retrieval prototype to a modular, reproducible and testable AI-security system.',
      domain: 'AI & Cybersecurity',
      tags: ['RA-XSOC', 'FAISS', 'Retrieval', 'Testing', 'SOC'],
      status: 'Active project journal',
      featured: true,
      sections: [
        { heading: 'The V1 lesson', body: 'CyberGPT demonstrated the value of retrieval-augmented incident guidance, but the notebook structure made artifacts, configuration and tests difficult to separate.' },
        { heading: 'The V2 direction', body: 'RA-XSOC introduces normalised knowledge records, checksums, serialization, typed domain models and testable embedding artifacts.' },
        { heading: 'Why the changes matter', body: 'A security copilot must be inspectable. Reproducible artifacts and explicit contracts make it easier to understand why a result changed.' },
        { heading: 'Current phase', body: 'The next focus is persistent embeddings and FAISS artifacts before service, CLI and UI layers.' },
      ],
    },
  ];
}
