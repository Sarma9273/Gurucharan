type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  count: number;
};
export default function ProjectExplorer({query,onQueryChange,category,onCategoryChange,categories,count}:Props){
 return <div className="project-explorer" aria-label="Project explorer">
  <label className="project-search"><span className="sr-only">Search projects</span><input type="search" value={query} onChange={e=>onQueryChange(e.target.value)} placeholder="Search systems, tools, domains…" /></label>
  <div className="project-filters" role="group" aria-label="Project categories">
   {categories.map(item=><button key={item} type="button" className={category===item?'active':''} aria-pressed={category===item} onClick={()=>onCategoryChange(item)}>{item}</button>)}
  </div>
  <small>{count} system{count===1?'':'s'} indexed · interactive explorer</small>
 </div>
}