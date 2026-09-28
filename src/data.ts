export type FocusMode = 'ai' | 'soc' | 'data';
export type Experience = { company:string; role:string; duration:string; location:string; description:string; technologies:string[] };
export type Research = { title:string; category:string; description:string; technologies:string[]; status:string; difficulty:string; featured?:boolean; link?:string };


export const focusModes = {
  ai: {
    eyebrow: 'AI SECURITY ENGINEERING',
    headline: 'Intelligence that explains before it acts.',
    summary:
      'I am building retrieval, reasoning and reliability systems that help analysts make safer security decisions.',
    colour: '#9f7cff',
    capabilities: [
      'AI-assisted incident response',
      'Explainable recommendations',
      'Agent reliability and provenance',
      'Threat intelligence retrieval',
    ],
  },
  soc: {
    eyebrow: 'SOC ENGINEERING',
    headline: 'Signals become decisions, not dashboard noise.',
    summary:
      'I practise monitoring, detection, investigation and response through hands-on security labs and structured playbooks.',
    colour: '#55e6ff',
    capabilities: [
      'SIEM and detection use cases',
      'Incident investigation',
      'Sysmon and Windows telemetry',
      'Security automation',
    ],
  },
  data: {
    eyebrow: 'APPLIED AI & DATA',
    headline: 'Research prototypes grounded in evidence.',
    summary:
      'My work connects embeddings, optimisation, data analysis and machine learning with practical engineering problems.',
    colour: '#f7b955',
    capabilities: [
      'Embeddings and vector retrieval',
      'Optimisation research',
      'Data analysis and visualisation',
      'Machine-learning prototyping',
    ],
  },
} as const;

export const journey = [
  {
    year: '2021',
    title: 'Electrical Engineering',
    text: 'Started with circuits, systems thinking and a habit of understanding how parts influence the whole.',
    signal: 'SYSTEMS',
  },
  {
    year: '2022',
    title: 'Cybersecurity curiosity',
    text: 'A practical workshop introduced the question that still drives me: how do we understand and contain failure before it spreads?',
    signal: 'SECURITY',
  },
  {
    year: '2024',
    title: 'Web, Python and research',
    text: 'Built early web projects and modelled solar optimisation in MATLAB and Simulink, learning through repeated experiments.',
    signal: 'BUILD',
  },
  {
    year: '2025',
    title: 'Teaching and SOC practice',
    text: 'Teaching computer fundamentals strengthened my communication while a home SOC lab turned security theory into observable evidence.',
    signal: 'OPERATE',
  },
  {
    year: '2026',
    title: 'M.Tech AI & DSE',
    text: 'Now combining AI, data science and cybersecurity through RA-XSOC, retrieval engineering and explainable security systems.',
    signal: 'INTELLIGENCE',
  },
];

export const projects = [
  {
    number: '01',
    title: 'RA-XSOC Security Copilot',
    subtitle: 'AI × SOC × Retrieval Engineering',
    status: 'Flagship · Active development',
    description:
      'A modular incident-response copilot evolving CyberGPT into a testable retrieval and reasoning architecture with persistent embeddings, confidence analysis and safer analyst guidance.',
    evidence: ['30 structured knowledge documents', 'FAISS retrieval pipeline', 'Typed domain contracts', 'Regression-focused development'],
    accent: '#9f7cff', category:'Cybersecurity', technologies:['Python','FAISS','SentenceTransformers','MITRE ATT&CK','FastAPI'], repo:'https://github.com/Sarma9273/ra-xsoc-security-copilot', overview:'A modular incident-response copilot evolving CyberGPT into a retrieval and reasoning architecture for security analysts.', problem:'Security analysts need structured evidence retrieval and repeatable response guidance across heterogeneous incident context.', solution:'Retrieve relevant security knowledge, map behavior to MITRE ATT&CK, surface confidence and provide analyst-oriented response guidance.', architecture:['Incident input','Knowledge normalization','Embeddings','FAISS retrieval','Confidence & novelty','MITRE ATT&CK mapping','Response guidance'], workflow:['Capture incident context','Normalize evidence','Embed query','Retrieve evidence','Assess confidence','Map techniques','Generate response guidance'], achievements:['30 structured knowledge documents','FAISS retrieval pipeline','Typed domain contracts','Regression-focused development'], , code: 'RETRIEVE / REASON / RESPOND',
  },
  {
    number: '02',
    title: 'CyberGPT V1',
    subtitle: 'Retrieval-Augmented Incident Response',
    status: 'Functional research prototype',
    description:
      'A Google Colab prototype that classifies incidents, retrieves relevant security knowledge, maps MITRE ATT&CK and generates containment, investigation, recovery and prevention guidance.',
    evidence: ['Novel-threat signal', 'MITRE ATT&CK mapping', 'Review queue', 'SOC report generation'],
    accent: '#55e6ff', category:'AI', technologies:['Python','FAISS','SentenceTransformers','RAG','MITRE ATT&CK'], overview:'A retrieval-augmented security incident response copilot for attack analysis and structured reporting.', problem:'Incident descriptions often lack immediately relevant security context and response structure.', solution:'Classify incidents, retrieve relevant knowledge, map attack behavior and generate structured investigation and response guidance.', architecture:['Security incident input','Incident classification','Knowledge base','SentenceTransformer embeddings','FAISS retrieval','Hybrid ranking','MITRE ATT&CK mapping','Response generation'], workflow:['Receive alert','Identify attack context','Create embedding','Retrieve knowledge','Rank context','Map ATT&CK','Generate response','Produce report'], achievements:['Novel-threat signal','MITRE ATT&CK mapping','Review queue','SOC report generation'], code: 'INCIDENT → KNOWLEDGE → PLAYBOOK',
  },
  {
    number: '03',
    title: 'Practical SOC Home Lab',
    subtitle: 'Kali · Windows · Ubuntu · Splunk',
    status: 'Implemented · Expanding',
    description:
      'A controlled virtual environment for producing attacks, collecting endpoint and network telemetry, investigating alerts and documenting response decisions.',
    evidence: ['Sysmon telemetry', 'Windows auditing', 'Splunk investigation', 'Isolated SOC-LAB network'],
    accent: '#67f0b8', category:'Cybersecurity', technologies:['Kali Linux','Windows','Ubuntu','Splunk','Sysmon','Wireshark'], overview:'A controlled virtual environment for generating attack evidence, collecting telemetry and practising SOC investigations.', code: 'SIMULATE / OBSERVE / INVESTIGATE',
  },
  {
    number: '04',
    title: 'Sahaaya360',
    subtitle: 'Institutional Operations Platform',
    status: 'MVP-oriented prototype',
    description:
      'A low-cost operational system for tickets, assets, vendors, safety checks and reporting using Google Sheets, Forms and Apps Script.',
    evidence: ['Ticket automation', 'Risk classification', 'SLA tracking', 'Institution-ready workflows'],
    accent: '#f7b955', category:'Software Engineering', technologies:['Google Sheets','Forms','Apps Script','Automation'], repo:'https://github.com/Sarma9273', overview:'A low-cost institutional operations concept for tickets, assets, vendors, safety checks and reporting.', code: 'REQUEST → CLASSIFY → RESOLVE',
  },
  {
    number: '05',
    title: 'Osprey MPPT Research',
    subtitle: 'Solar PV Optimisation',
    status: 'Academic research',
    description:
      'A MATLAB and Simulink comparison of PSO, Osprey Optimisation and a modified Osprey method for maximum-power-point tracking under partial shading.',
    evidence: ['Partial-shading cases', 'Algorithm comparison', 'Simulation evidence', 'Renewable-energy research'],
    accent: '#ff7a90', category:'Research', technologies:['MATLAB','Simulink','PSO','Osprey Optimization','Solar PV'], overview:'A comparative solar MPPT research project under partial-shading conditions.', code: 'SENSE → OPTIMISE → TRACK',
  },
  {
    number: '06',
    title: 'Portfolio Intelligence Platform',
    subtitle: 'Identity · Publishing · Automation',
    status: 'V5 cinematic rebuild',
    description:
      'This portfolio itself: an original React and WebGL experience connected to a Drive-powered learning journal and contact backend.',
    evidence: ['React Three Fiber', 'GSAP storytelling', 'Drive CMS', 'GitHub Pages automation'],
    accent: '#7bb7ff', category:'Portfolio', technologies:['React','TypeScript','Vite','React Three Fiber','Three.js','GSAP'], repo:'https://github.com/Sarma9273/Gurucharan', demo:'https://sarma9273.github.io/Gurucharan/', overview:'The cinematic portfolio experience itself, now extended with GURUVERSE intelligence and exploration capabilities.', code: 'IDENTITY → EVIDENCE → CONNECTION',
  },
];



export const experience: Experience[] = [
  { company:'Swaminarayan Gurukul International School', role:'Computer Teacher', duration:'Jun 2025 – Present', location:'Tirupati, Andhra Pradesh', description:'Teaching programming fundamentals, Python, HTML, CSS, digital literacy and practical software development concepts.', technologies:['Python','HTML','CSS','Programming','Teaching'] },
  { company:'SynthoQuest', role:'Cybersecurity Trainer', duration:'Dec 2024 – May 2025', location:'Remote', description:'Designed and delivered cybersecurity and SOC training covering SIEM, threat intelligence, incident response and security operations.', technologies:['SOC','SIEM','Threat Intelligence','Incident Response'] },
  { company:'APTRANSCO', role:'Substation Documentation Intern', duration:'May 2024 – Jun 2024', location:'Simhachalam', description:'Supported technical documentation activities in a substation environment.', technologies:['Documentation','Electrical Engineering','Systems'] },
];

export const research: Research[] = [
  { title:'Modified Osprey Optimization Algorithm for MPPT', category:'IEEE Research', description:'Research on improving maximum-power-point tracking under partial shading using MATLAB/Simulink optimisation experiments.', technologies:['MATLAB','Simulink','PV Systems','Optimization'], status:'Published', difficulty:'Advanced', featured:true },
  { title:'Retrieval-Augmented AI Security', category:'Artificial Intelligence', description:'Research on combining retrieval-augmented generation with cybersecurity incident response for evidence-aware analyst assistance.', technologies:['RAG','FAISS','LLMs','Python'], status:'Ongoing', difficulty:'Expert', featured:true },
  { title:'Autonomous SOC', category:'Future Research', description:'Exploration of AI-driven security operations combining detection, reasoning, threat intelligence and response orchestration.', technologies:['AI Agents','SOAR','SOC','Threat Intelligence'], status:'Future', difficulty:'Expert', featured:true },
];

export const architectureStages = [
  {
    id: '01',
    title: 'Incident Input',
    purpose: 'Capture the analyst narrative without hiding the source evidence.',
    input: 'Alerts, indicators, affected assets',
    output: 'Normalised incident context',
    tech: 'Domain models · validation',
    status: 'Implemented',
  },
  {
    id: '02',
    title: 'Knowledge Normalisation',
    purpose: 'Convert heterogeneous security notes into consistent retrieval documents.',
    input: 'Knowledge files and metadata',
    output: 'Versioned retrieval corpus',
    tech: 'Python · JSONL · checksums',
    status: 'Implemented',
  },
  {
    id: '03',
    title: 'Embeddings',
    purpose: 'Represent incident meaning as numerical vectors.',
    input: 'Incident and knowledge text',
    output: 'Normalised float32 vectors',
    tech: 'Sentence Transformers',
    status: 'In progress',
  },
  {
    id: '04',
    title: 'FAISS Retrieval',
    purpose: 'Rank the closest security knowledge while preserving traceability.',
    input: 'Query vector',
    output: 'Ranked evidence candidates',
    tech: 'FAISS · cosine similarity',
    status: 'Core pipeline complete',
  },
  {
    id: '05',
    title: 'Confidence & Novelty',
    purpose: 'Make uncertainty visible and route weak matches to human review.',
    input: 'Retrieval scores and signals',
    output: 'Confidence and review decision',
    tech: 'Thresholds · hybrid signals',
    status: 'V1 complete · V2 redesign',
  },
  {
    id: '06',
    title: 'MITRE Mapping',
    purpose: 'Connect likely behaviour to a shared defensive language.',
    input: 'Attack hypothesis',
    output: 'Tactics, techniques and severity',
    tech: 'MITRE ATT&CK',
    status: 'Implemented',
  },
  {
    id: '07',
    title: 'Response Guidance',
    purpose: 'Organise evidence-aware actions without removing analyst accountability.',
    input: 'Mapped context and risk',
    output: 'Containment, investigation, recovery and prevention',
    tech: 'Playbooks · reporting',
    status: 'Implemented',
  },
];

export const techClusters = {
  Security: [
    ['Splunk', 'SOC home-lab investigations'],
    ['Sysmon', 'Windows endpoint telemetry'],
    ['MITRE ATT&CK', 'Behaviour mapping'],
    ['Kali Linux', 'Controlled attack simulation'],
    ['Wireshark', 'Packet-level observation'],
  ],
  Engineering: [
    ['Python', 'Security and data prototypes'],
    ['Git', 'Versioned project development'],
    ['Linux', 'Lab operations and tooling'],
    ['Networking', 'Traffic and protocol analysis'],
    ['APIs', 'System integration'],
  ],
  'AI & Data': [
    ['Sentence Transformers', 'Semantic embeddings'],
    ['FAISS', 'Vector retrieval'],
    ['NumPy', 'Numerical experiments'],
    ['Pandas', 'Data preparation'],
    ['Machine Learning', 'Research prototyping'],
  ],
};

export const fallbackBlogs = [
  {
    title: 'CyberGPT V1 → V2: Mistakes, Learning and the Meaning of Every Upgrade',
    domain: 'AI & Cybersecurity',
    status: 'Featured build note',
    description:
      'How a working prototype became a modular security copilot—and what broken deployments, weak contracts and retrieval mistakes taught me.',
  },
  {
    title: 'Designing a Practical SOC Home Lab',
    domain: 'Cybersecurity',
    status: 'Learning journal',
    description:
      'A hands-on environment for generating evidence, investigating alerts and practising incident response.',
  },
  {
    title: '30 Days, 30 Kali Linux Tools',
    domain: 'Cybersecurity Education',
    status: 'Series in progress',
    description:
      'A structured learning series focused on purpose, safe lab use, defensive meaning and ethical boundaries.',
  },
];
