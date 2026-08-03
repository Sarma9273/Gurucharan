(() => {
  const grid = document.querySelector('[data-blog-grid]');
  if (!grid) return;
  const status = document.querySelector('[data-blog-status]');
  const filter = document.querySelector('[data-blog-filter]');
  const api = window.GC_CONFIG?.portfolioApiUrl || '';
  let blogs = window.GC_DATA?.fallbackBlogs || [];

  const createCard = (blog) => {
    const article = document.createElement('article'); article.className = 'blog-card reveal visible';
    const top = document.createElement('div'); top.className = 'blog-top';
    const domain = document.createElement('span'); domain.textContent = blog.domain || 'Technical Learning';
    const date = document.createElement('span');
    try { date.textContent = new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(blog.updatedAt)); }
    catch { date.textContent = 'Recently updated'; }
    top.append(domain,date);
    const title = document.createElement('h3'); title.textContent = blog.title;
    const description = document.createElement('p'); description.textContent = blog.description;
    const tags = document.createElement('div'); tags.className = 'chips';
    (blog.tags || []).slice(0,4).forEach((tag) => { const span=document.createElement('span'); span.textContent=tag; tags.append(span); });
    const footer = document.createElement('div'); footer.className='blog-footer';
    const state=document.createElement('span'); state.textContent=blog.status || 'Learning note';
    const link=document.createElement('a');
    if (blog.url && blog.url !== '#') { link.href=blog.url; link.target='_blank'; link.rel='noreferrer'; link.textContent='Read transmission ↗'; }
    else { link.href='#'; link.textContent='Connect new Apps Script'; link.setAttribute('aria-disabled','true'); link.addEventListener('click',(e)=>e.preventDefault()); }
    footer.append(state,link); article.append(top,title,description,tags,footer); return article;
  };
  const render = (domain='all') => {
    const visible = domain==='all' ? blogs : blogs.filter((blog)=>blog.domain===domain);
    grid.replaceChildren(...visible.map(createCard));
  };
  const updateFilters = () => {
    if (!(filter instanceof HTMLSelectElement)) return;
    const domains=[...new Set(blogs.map((b)=>b.domain).filter(Boolean))].sort();
    filter.replaceChildren(new Option('All domains','all'),...domains.map((d)=>new Option(d,d)));
  };
  filter?.addEventListener('change',()=>render(filter.value));
  render(); updateFilters();

  if (!api.startsWith('https://script.google.com/macros/s/') || !api.endsWith('/exec')) {
    if (status) status.textContent='Local preview entries — paste the new /exec URL in assets/js/config.js';
    return;
  }
  const callback=`gcBlogs_${Date.now()}`;
  window[callback]=(payload)=>{
    if (payload?.ok && Array.isArray(payload.blogs)) {
      blogs=payload.blogs; render(); updateFilters();
      if(status) status.textContent=`${blogs.length} live Drive journal entries synchronised`;
    } else if(status) status.textContent='Drive feed unavailable — showing local preview entries';
    delete window[callback]; script.remove();
  };
  const script=document.createElement('script');
  script.src=`${api}?action=blogs&callback=${encodeURIComponent(callback)}&t=${Date.now()}`;
  script.onerror=()=>{ if(status) status.textContent='Drive feed unavailable — showing local preview entries'; delete window[callback]; script.remove(); };
  document.head.append(script);
})();
