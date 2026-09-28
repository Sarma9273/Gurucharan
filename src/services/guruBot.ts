export interface GuruProjectContext {
  number: string; title: string; subtitle: string; status: string; description: string;
  category: string; technologies: string[]; overview: string; problem?: string;
  solution?: string; architecture?: string[]; workflow?: string[]; achievements?: string[];
  repo?: string; demo?: string; caseStudy?: string;
}
export type GuruIntent = "overview"|"architecture"|"workflow"|"technologies"|"problem"|"solution"|"results"|"help";
const normalize=(value:string)=>value.toLowerCase().trim().replace(/\s+/g," ");
export function detectGuruIntent(message:string):GuruIntent{
 const text=normalize(message); if(!text)return "help";
 if(/architecture|structure|components|design/.test(text))return "architecture";
 if(/workflow|process|works|working|pipeline/.test(text))return "workflow";
 if(/technology|technologies|stack|tools|built with/.test(text))return "technologies";
 if(/problem|challenge|need|why/.test(text))return "problem";
 if(/solution|solve|approach|implementation/.test(text))return "solution";
 if(/result|results|achievement|impact|outcome/.test(text))return "results";
 if(/help|what can you|commands|ask/.test(text))return "help";
 return "overview";
}
const list=(items?:string[])=>items?.length?items.map((item,i)=>`${i+1}. ${item}`).join("\n"):"No additional information is documented yet.";
export function answerGuruQuery(message:string,project:GuruProjectContext):{intent:GuruIntent;text:string}{
 const intent=detectGuruIntent(message);
 switch(intent){
  case "architecture": return {intent,text:`Architecture of ${project.title}:\n\n${list(project.architecture)}`};
  case "workflow": return {intent,text:`Workflow of ${project.title}:\n\n${list(project.workflow)}`};
  case "technologies": return {intent,text:`Technology stack:\n\n${project.technologies.map(t=>`• ${t}`).join("\n")||"Not documented yet."}`};
  case "problem": return {intent,text:project.problem?`Problem / challenge:\n\n${project.problem}`:`Purpose:\n\n${project.description}`};
  case "solution": return {intent,text:project.solution?`Solution:\n\n${project.solution}`:`Solution overview:\n\n${project.overview}`};
  case "results": return {intent,text:project.achievements?.length?`Documented outcomes:\n\n${list(project.achievements)}`:"No quantitative results are currently documented."};
  case "help": return {intent,text:"Ask about architecture, workflow, technology stack, problem, solution, results, or overview."};
  default: return {intent,text:`${project.title} — ${project.subtitle}\n\n${project.overview}\n\nStatus: ${project.status} · Category: ${project.category}`};
 }
}