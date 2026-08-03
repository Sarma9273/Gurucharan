(() => {
  const container=document.querySelector('[data-project-content]'); if(!container) return;
  const slug=new URLSearchParams(location.search).get('slug');
  const project=window.GC_DATA?.projects?.find((item)=>item.slug===slug) || window.GC_DATA?.projects?.[0];
  if(!project) { container.innerHTML='<h1>Project not found</h1>'; return; }
  document.title=`${project.title} — Guru Charan`;
  const list=(items)=>items.map((item)=>`<li>${item}</li>`).join('');
  container.innerHTML=`<div class="project-detail-head"><div><p class="micro">${project.number} // ${project.domain}</p><h1>${project.title}</h1><p class="accent-copy">${project.subtitle}</p></div><aside><span>Current state</span><strong>${project.status}</strong><p>${project.summary}</p></aside></div><div class="case-grid"><article><p class="micro">THE PROBLEM</p><h2>What this project is trying to solve</h2><p>${project.problem}</p></article><article><p class="micro">THE APPROACH</p><h2>How I approached it</h2><ol>${list(project.approach)}</ol></article><article><p class="micro">EVIDENCE</p><h2>What currently exists</h2><ul>${list(project.evidence)}</ul></article><article><p class="micro">NEXT PHASE</p><h2>What remains honest and unfinished</h2><p>${project.next}</p><div class="chips">${project.technologies.map((t)=>`<span>${t}</span>`).join('')}</div></article></div>`;
})();
