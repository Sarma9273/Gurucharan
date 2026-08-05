import { useEffect, useMemo, useState } from 'react';
import { fallbackBlogs } from '../data';
import { hasLiveBackend, PORTFOLIO_API_URL } from '../config';

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

export default function LiveJournal() {
  const [blogs, setBlogs] = useState<Blog[]>(fallbackBlogs);
  const [source, setSource] = useState<'live' | 'fallback'>('fallback');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!hasLiveBackend) return;

    const callback = `gcBlogs_${Date.now()}`;
    const script = document.createElement('script');
    const timeout = window.setTimeout(() => script.remove(), 9000);

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
    script.onerror = () => script.remove();
    document.body.appendChild(script);

    return () => {
      window.clearTimeout(timeout);
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];
    };
  }, []);

  const domains = useMemo(
    () => ['All', ...Array.from(new Set(blogs.map((blog) => blog.domain)))],
    [blogs],
  );
  const visible = filter === 'All' ? blogs : blogs.filter((blog) => blog.domain === filter);

  return (
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
        {visible.map((blog, index) => {
          const href =
            blog.url ||
            (blog.id && hasLiveBackend
              ? `${PORTFOLIO_API_URL}?action=read&id=${encodeURIComponent(blog.id)}`
              : undefined);
          return (
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
                {href ? <a href={href} target="_blank" rel="noreferrer">Open article ↗</a> : <span>Connect backend to read</span>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
