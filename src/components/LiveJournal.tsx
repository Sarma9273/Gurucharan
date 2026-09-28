import { useEffect, useMemo, useState } from 'react';
import { fallbackBlogs } from '../data';
import { hasLiveBackend, PORTFOLIO_API_URL } from '../config';
import CinematicLoader from './CinematicLoader';

type Blog = {
  id?: string;
  title: string;
  description: string;
  domain: string;
  status: string;
  tags?: string[];
  updatedAt?: string;
  readingTime?: number;
  url?: string;
  featured?: boolean;
};

type ArticlePayload = {
  ok: boolean;
  title?: string;
  html?: string;
  error?: string;
};

const ALLOWED_TAGS = new Set([
  'A', 'ABBR', 'B', 'BLOCKQUOTE', 'BR', 'CODE', 'DIV', 'EM', 'H1', 'H2', 'H3',
  'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'LI', 'MARK', 'OL', 'P', 'PRE', 'SMALL',
  'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH', 'THEAD', 'TR', 'UL',
]);

const ALLOWED_ATTRS = new Set([
  'ALT', 'COLSPAN', 'HEIGHT', 'HREF', 'REL', 'ROWSPAN', 'SRC', 'TARGET', 'TITLE', 'WIDTH', 'CLASS',
]);

function isSafeUrl(value: string, kind: 'href' | 'src') {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(trimmed, window.location.href);
    if (url.protocol === 'https:') return true;
    if (url.origin === window.location.origin) return true;
    return kind === 'href' && url.protocol === 'mailto:';
  } catch {
    return false;
  }
}

function sanitizeArticleHtml(dirtyHtml: string) {
  const document = new DOMParser().parseFromString(dirtyHtml, 'text/html');

  for (const element of Array.from(document.body.querySelectorAll('*'))) {
    if (!ALLOWED_TAGS.has(element.tagName)) {
      element.remove();
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toUpperCase();
      if (!ALLOWED_ATTRS.has(name) || name.startsWith('ON') || name === 'STYLE') {
        element.removeAttribute(attribute.name);
      }
    }

    if (element instanceof HTMLAnchorElement) {
      if (!isSafeUrl(element.getAttribute('href') || '', 'href')) {
        element.removeAttribute('href');
      }
      if (element.getAttribute('target') === '_blank') {
        element.setAttribute('rel', 'noopener noreferrer');
      } else {
        element.removeAttribute('target');
      }
    }

    if (element instanceof HTMLImageElement) {
      if (!isSafeUrl(element.getAttribute('src') || '', 'src')) {
        element.remove();
        continue;
      }
      element.setAttribute('loading', 'lazy');
      element.setAttribute('decoding', 'async');
    }
  }

  return document.body.innerHTML;
}

export default function LiveJournal() {
  const [blogs, setBlogs] = useState<Blog[]>(fallbackBlogs);
  const [source, setSource] = useState<'live' | 'fallback'>('fallback');
  const [filter, setFilter] = useState('All');
  const [article, setArticle] = useState<{ title: string; html: string } | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState('');
  const [articleLoaderDone, setArticleLoaderDone] = useState(false);

  useEffect(() => {
    if (!hasLiveBackend) return;

    const callback = `gcBlogs_${Date.now()}`;
    const script = document.createElement('script');
    const timeout = window.setTimeout(() => {
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];
    }, 9000);

    (window as unknown as Record<string, unknown>)[callback] = (payload: { ok: boolean; blogs?: Blog[] }) => {
      if (payload.ok && payload.blogs?.length) {
        setBlogs(payload.blogs);
        setSource('live');
      }
      window.clearTimeout(timeout);
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];
    };

    script.src = `${PORTFOLIO_API_URL}?action=blogs&callback=${callback}&refresh=1`;
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];
    };
    document.body.appendChild(script);

    return () => {
      window.clearTimeout(timeout);
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];
    };
  }, []);

  useEffect(() => {
    if (!article && !articleLoading && !articleError) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setArticle(null);
        setArticleLoading(false);
        setArticleError('');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [article, articleLoading, articleError]);

  const openArticle = (blog: Blog) => {
    if (!blog.id || !hasLiveBackend) return;

    setArticle(null);
    setArticleError('');
    setArticleLoaderDone(false);
    setArticleLoading(true);

    const callback = `gcArticle_${Date.now()}`;
    const script = document.createElement('script');
    const timeout = window.setTimeout(() => {
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];
      setArticleLoading(false);
      setArticleError('The learning journal could not be loaded. Please try again.');
    }, 12000);

    (window as unknown as Record<string, unknown>)[callback] = (payload: ArticlePayload) => {
      window.clearTimeout(timeout);
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];

      if (payload.ok && payload.title && payload.html) {
        setArticle({ title: payload.title, html: sanitizeArticleHtml(payload.html) });
        setArticleError('');
      } else {
        setArticleError(payload.error || 'The learning journal could not be loaded.');
      }
      setArticleLoading(false);
    };

    script.src =
      `${PORTFOLIO_API_URL}?action=read&id=${encodeURIComponent(blog.id)}&format=json&callback=${callback}`;
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];
      setArticleLoading(false);
      setArticleError('The learning journal could not be loaded. Please try again.');
    };

    document.body.appendChild(script);
  };

  const domains = useMemo(
    () => ['All', ...Array.from(new Set(blogs.map((blog) => blog.domain)))],
    [blogs],
  );
  const visible = filter === 'All' ? blogs : blogs.filter((blog) => blog.domain === filter);

  return (
    <>
      <section id="journal" className="journal section">
        <div className="journal-head">
          <div className="section-heading compact">
            <span className="micro-label">05 / LIVE LEARNING JOURNAL</span>
            <h2>Notes from systems<br />still being built.</h2>
          </div>
          <div className={`journal-source ${source}`}>
            <i /> {source === 'live' ? 'SYNCHRONISED WITH GOOGLE DRIVE' : 'LOCAL PREVIEW DATA'}
          </div>
        </div>

        <div className="journal-filters">
          {domains.map((domain) => (
            <button
              type="button"
              key={domain}
              className={filter === domain ? 'active' : ''}
              onClick={() => setFilter(domain)}
            >
              {domain}
            </button>
          ))}
        </div>

        <div className="journal-grid">
          {visible.map((blog, index) => (
            <article className="journal-card" key={`${blog.title}-${index}`}>
              <div className="journal-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="journal-meta">
                <span>{blog.domain}</span><small>{blog.status}</small>
              </div>
              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
              {blog.tags?.length ? (
                <div className="journal-tags">{blog.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
              ) : null}
              <div className="journal-card-footer">
                <span>{blog.readingTime ? `${blog.readingTime} MIN READ` : 'BUILD NOTE'}</span>
                {blog.id && hasLiveBackend ? (
                  <button type="button" className="journal-open" onClick={() => openArticle(blog)}>
                    Open article ↗
                  </button>
                ) : (
                  <span>Connect backend to read</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {(articleLoading || articleError || article) && (
        <div className="article-reader" role="dialog" aria-modal="true" aria-label="GURUVERSE learning journal">
          <div className="article-reader-backdrop" onClick={() => !articleLoading && setArticle(null)} />
          {articleLoading && !articleLoaderDone ? (
            <CinematicLoader variant="article" onComplete={() => setArticleLoaderDone(true)} />
          ) : null}
          <div className="article-reader-shell">
            <div className="article-reader-bar">
              <div>
                <span className="micro-label">GURUVERSE / LIVE LEARNING JOURNAL</span>
                <strong>KNOWLEDGE STREAM</strong>
              </div>
              <button
                type="button"
                className="article-reader-close"
                onClick={() => setArticle(null)}
                aria-label="Close article"
              >
                ESC / CLOSE ×
              </button>
            </div>

            <div className="article-reader-body">
              {articleLoading ? (
                <div className="article-reader-state">
                  <span className="article-reader-pulse" />
                  <span>DECODING LEARNING JOURNAL…</span>
                </div>
              ) : articleError ? (
                <div className="article-reader-state article-reader-error">
                  <span>READ ERROR</span>
                  <strong>{articleError}</strong>
                  <button type="button" onClick={() => setArticle(null)}>RETURN TO JOURNAL</button>
                </div>
              ) : article ? (
                <article className="article-content">
                  <div className="article-kicker">GURUVERSE / FIELD NOTE</div>
                  <h1>{article.title}</h1>
                  <div className="article-rule" />
                  <div dangerouslySetInnerHTML={{ __html: article.html }} />
                  <footer>GURU CHARAN · GURUVERSE BLOGS</footer>
                </article>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
