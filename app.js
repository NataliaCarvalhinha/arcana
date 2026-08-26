
const STORAGE_KEY="arcana-v5";
const LEGACY_KEYS=["arcana-activity-hub-v4","arcana-activity-hub-v3","arcana-activity-hub-v2"];
const STARTER_CONTENT_VERSION=2;
const STARTER_CURRICULUM_VERSION=1;
const DATA_SAFETY=window.ArcanaDataSafety;
const DATA_SCHEMA_VERSION=DATA_SAFETY?.DATA_SCHEMA_VERSION||1;
const CURRICULUM_FETCHED_AT="2026-08-17T00:00:00.000Z";
const OBSIDIAN_BRIDGE_URL="http://127.0.0.1:8765";
const OBSIDIAN_BRIDGE_TOKEN_KEY="arcana-obsidian-bridge-token";
const OBSIDIAN_BRIDGE_TOKEN_HEADER="X-Arcana-Bridge-Token";
const DEFAULT_OBSIDIAN_STATE={available:false,connected:false,vaultName:"",vaultPath:"",lastSyncAt:null,noteCount:0,fichamentoCount:0,attachmentCount:0,flashcardCount:0,conflicts:0,autoSync:"manual",syncStatus:"saved",pendingCount:0,pendingReason:"",lastPendingAt:null,lastPush:{},openUrl:"",bridgeUrl:OBSIDIAN_BRIDGE_URL,bridge:"",bridgeApiVersion:null,bridgePaired:false,bridgeStatus:"unknown",error:null};
const ROUTINE_WEEKDAYS=[{key:1,label:"Segunda",short:"Seg"},{key:2,label:"Terça",short:"Ter"},{key:3,label:"Quarta",short:"Qua"},{key:4,label:"Quinta",short:"Qui"},{key:5,label:"Sexta",short:"Sex"},{key:6,label:"Sábado",short:"Sáb"},{key:7,label:"Domingo",short:"Dom"}];
const ROUTINE_CATEGORIES={work:{label:"Trabalho",icon:"▦"},class:{label:"Aula",icon:"◐"},study:{label:"Estudo",icon:"☿"},sport:{label:"Esporte",icon:"◇"},meal:{label:"Refeição",icon:"◒"},personal:{label:"Pessoal",icon:"☽"},appointment:{label:"Compromisso",icon:"◎"},hobby:{label:"Hobby",icon:"✧"},travel:{label:"Deslocamento",icon:"→"},sleep:{label:"Sono/descanso",icon:"☾"},other:{label:"Outro",icon:"•"}};
const DEFAULT_PLANNING_PREFERENCES={dayStart:"07:00",dayEnd:"23:00",minimumSessionMinutes:15,preferredSessionMinutes:30,planningBufferMinutes:5,useOnlyStudyBlocks:false,allowHobbySuggestions:false};
const KNOWLEDGE_EXTRACTION_SCHEMA_VERSION=2;
const DEFAULT_KNOWLEDGE_EXTRACTION_SETTINGS={provider:"local",ai:{endpoint:"",model:"",allowBrowserDevSecret:false,lastStatus:"not_configured"}};
const ROUTINE_EXCEL_FORMAT_VERSION=1;
const ROUTINE_EXCEL_HEADERS={
  routine:["ID","Atividade","Categoria","Dias","Início","Fim","Local","Endereço","Ida (min)","Volta (min)","Repetição","Ativo","Observações"],
  hobbies:["ID","Hobby","Ícone","Duração preferida (min)","Duração mínima (min)","Meta semanal","Dias preferidos","Horários preferidos","Ativo","Observações"],
  config:["Configuração","Valor"]
};
const ROUTINE_EXCEL_REQUIRED_HEADERS=["ID","Atividade","Dias","Início","Fim"];
const ROUTINE_EXCEL_CONFIG=[
  {key:"dayStart",label:"Início do dia",type:"time"},
  {key:"dayEnd",label:"Fim do dia",type:"time"},
  {key:"planningBufferMinutes",label:"Buffer de planejamento (min)",type:"minutes"},
  {key:"minimumSessionMinutes",label:"Sessão mínima (min)",type:"minutes"},
  {key:"preferredSessionMinutes",label:"Sessão preferida (min)",type:"minutes"},
  {key:"useOnlyStudyBlocks",label:"Usar apenas blocos de estudo",type:"boolean"},
  {key:"allowHobbySuggestions",label:"Permitir sugestões de hobbies",type:"boolean"}
];
const GOOGLE_CALENDAR_SCOPE="https://www.googleapis.com/auth/calendar.readonly";
const GOOGLE_CALENDAR_API_BASE="https://www.googleapis.com/calendar/v3";
const GOOGLE_IDENTITY_SCRIPT="https://accounts.google.com/gsi/client";
const EXTERNAL_CALENDAR_SYNC_THROTTLE_MS=5*60*1000;
const DEFAULT_EXTERNAL_CALENDAR_STATE={google:{provider:"google",connected:false,clientId:"",accountEmail:"",calendars:[],selectedCalendarIds:[],events:[],lastSyncAt:null,lastAttemptAt:null,lastSyncError:null,syncStatus:"idle",syncWindowDays:14,syncHorizonDays:120,privacy:{storeEventTitles:false},preferences:{allDayBlocksPlanning:false,defaultTravelBeforeMinutes:0,defaultTravelAfterMinutes:0,eventTravelOverrides:{}}}};
const ACTIVITY_LOG_VERSION=1;
const ACTIVITY_TYPES={study:"Estudo",youtube:"YouTube",review:"Revisão",hobby:"Hobby",sport:"Esporte",journaling:"Journaling",appointment:"Compromisso",routine:"Rotina",other:"Outro"};
const STARTER_HOBBIES=[
  {id:"hobby-tarot",name:"Tarot",icon:"☽",description:"Prática reflexiva curta.",preferredMinutes:20,minimumMinutes:10,frequencyPerWeek:1,preferredDays:[],preferredTimes:["evening"],lastDoneAt:null,sessions:[],active:true,location:"",notes:"",tags:["reflexão"]},
  {id:"hobby-journaling",name:"Journaling",icon:"✎",description:"Escrita livre ou revisão do dia.",preferredMinutes:15,minimumMinutes:10,frequencyPerWeek:2,preferredDays:[],preferredTimes:["morning","evening"],lastDoneAt:null,sessions:[],active:true,location:"",notes:"",tags:["escrita"]},
  {id:"hobby-games",name:"Jogos",icon:"◇",description:"Tempo de jogo consciente.",preferredMinutes:45,minimumMinutes:20,frequencyPerWeek:1,preferredDays:[6,7],preferredTimes:["evening"],lastDoneAt:null,sessions:[],active:true,location:"",notes:"",tags:["lazer"]}
];
const DEFAULT_STATE={activeTrack:"default",tracks:[{id:"default",name:"Principal",sigil:"☽",subtitle:"Seu caminho inicial",description:"Uma trilha vazia para começar sem publicar dados pessoais.",weeklyGoal:120,progression:"sequential"}],items:[],playlists:[{id:"main-playlist",youtubePlaylistId:"",name:"Playlist de foco",url:"",enabled:true,createdAt:null,updatedAt:null,lastSyncAt:null,lastSyncError:null,catalogGeneratedAt:null,catalogTitle:null}],activePlaylist:"main-playlist",youtubeQueue:[],youtubeDaily:{},youtubeSettings:{mode:"either",minutes:45,count:3,hideAfterLimit:true},knowledgeExtraction:structuredClone(DEFAULT_KNOWLEDGE_EXTRACTION_SETTINGS),obsidian:structuredClone(DEFAULT_OBSIDIAN_STATE),externalCalendars:structuredClone(DEFAULT_EXTERNAL_CALENDAR_STATE),inbox:[],sessions:[],activityLog:[],activityLogVersion:ACTIVITY_LOG_VERSION,weeklyGoals:[],dailyCheckins:{},xp:0,streak:0,lastStudyDate:null,weeklyProgress:{default:0},shortcuts:[{label:"YouTube",url:"https://www.youtube.com/",glyph:"▶"},{label:"GitHub",url:"https://github.com/",glyph:"⌘"},{label:"ChatGPT",url:"https://chatgpt.com/",glyph:"✧"}],lastAutoBackup:null,dailyPlan:{date:null,minutes:60,items:[],freeWindows:[],availableMinutes:0,notices:[]},routineBlocks:[],routineExceptions:[],hobbies:structuredClone(STARTER_HOBBIES),planningPreferences:structuredClone(DEFAULT_PLANNING_PREFERENCES),starterContentVersion:0,starterCurriculumVersion:0};
const STARTER_TRACKS=[
  {id:"track-electronics",name:"Eletrônica",sigil:"☿",subtitle:"Circuitos · FPGA · RISC-V · Verificação",description:"Trilha técnica de sistemas embarcados, lógica digital, FPGA, arquitetura de computadores, RISC-V, SystemVerilog, UVM e VLSI.",weeklyGoal:240,progression:"sequential"},
  {id:"track-finance",name:"Finanças",sigil:"♃",subtitle:"Planejamento · Mercados · Investimentos · Portfólio",description:"Trilha para construir uma base sólida de finanças pessoais, mercados financeiros, investimentos, portfólio e finanças corporativas.",weeklyGoal:120,progression:"sequential"}
];
const STARTER_COURSES=[
  {id:"course-elec-01",track:"track-electronics",title:"Microcontrollers: Basic Architecture and Design",source:"Coursera",url:"https://www.coursera.org/learn/microcontrollers-basic-architecture-and-design",estimatedMinutes:900,important:true,urgent:false,description:"Arquitetura de MCU, processador, memória, interfaces, desempenho, energia e custo.",catalogOrder:1},
  {id:"course-elec-02",track:"track-electronics",title:"Introduction to FPGA Design for Embedded Systems",source:"Coursera · University of Colorado Boulder",url:"https://www.coursera.org/learn/intro-fpga-design-embedded-systems",estimatedMinutes:900,important:true,urgent:false,description:"Introdução prática a FPGA, arquiteturas, ferramentas e primeiros projetos.",catalogOrder:2},
  {id:"course-elec-03",track:"track-electronics",title:"Hardware Description Languages for FPGA Design",source:"Coursera · University of Colorado Boulder",url:"https://www.coursera.org/learn/fpga-hardware-description-languages",estimatedMinutes:900,important:true,urgent:false,description:"VHDL e Verilog para projeto lógico e FPGA. Base antes de SystemVerilog e UVM.",catalogOrder:3},
  {id:"course-elec-04",track:"track-electronics",title:"FPGA Design for Embedded Systems Specialization",source:"Coursera · University of Colorado Boulder",url:"https://www.coursera.org/specializations/fpga-design",estimatedMinutes:7200,important:true,urgent:false,description:"Trilha principal de FPGA. Usar o progresso deste item como progresso global da especialização.",catalogOrder:4},
  {id:"course-elec-05",track:"track-electronics",title:"Computer Architecture",source:"Coursera · Princeton University",url:"https://www.coursera.org/learn/comparch",estimatedMinutes:1800,important:true,urgent:false,description:"Arquitetura de microprocessadores modernos.",catalogOrder:5},
  {id:"course-elec-06",track:"track-electronics",title:"Introduction to RISC-V (LFD110)",source:"Linux Foundation",url:"https://training.linuxfoundation.org/training/introduction-to-riscv-lfd110/",estimatedMinutes:480,important:true,urgent:false,description:"Introdução à ISA RISC-V, arquitetura, ecossistema e prática inicial.",catalogOrder:6},
  {id:"course-elec-07",track:"track-electronics",title:"Building a RISC-V CPU Core (LFD111x)",source:"Linux Foundation",url:"https://training.linuxfoundation.org/training/building-a-riscv-cpu-core-lfd111x/",estimatedMinutes:960,important:true,urgent:false,description:"Projeto hands-on de um core RISC-V. Fazer depois da base de HDL/FPGA e arquitetura.",catalogOrder:7},
  {id:"course-elec-08",track:"track-electronics",title:"SystemVerilog Tutorials: Hardware Design & Verification",source:"Coursera",url:"https://www.coursera.org/learn/systemverilog-tutorials-hardware-design--verification",estimatedMinutes:720,important:true,urgent:false,description:"SystemVerilog aplicado a RTL e verificação. Preparação para UVM.",catalogOrder:8},
  {id:"course-elec-09",track:"track-electronics",title:"Introduction to the UVM",source:"Siemens Verification Academy",url:"https://verificationacademy.com/topics/uvm-universal-verification-methodology/introduction-to-the-uvm/",estimatedMinutes:720,important:true,urgent:false,description:"Introdução progressiva a Universal Verification Methodology até a construção de um testbench UVM.",catalogOrder:9},
  {id:"course-elec-10",track:"track-electronics",title:"Chip based VLSI design for Industrial Applications",source:"Coursera",url:"https://www.coursera.org/specializations/chip-based-vlsi-design-for-industrial-applications",estimatedMinutes:5400,important:true,urgent:false,description:"Etapa complementar de VLSI, chip design, HDL e sistemas baseados em FPGA.",catalogOrder:10},
  {id:"course-fin-01",track:"track-finance",title:"Personal & Family Financial Planning",source:"Coursera · University of Florida",url:"https://www.coursera.org/learn/family-planning",estimatedMinutes:1080,important:true,urgent:false,description:"Base prática de orçamento, fluxo de caixa, crédito, impostos, seguros e planejamento financeiro pessoal.",catalogOrder:1},
  {id:"course-fin-02",track:"track-finance",title:"Financial Markets",source:"Coursera · Yale University",url:"https://www.coursera.org/learn/financial-markets-global",estimatedMinutes:1980,important:true,urgent:false,description:"Mercados financeiros, risco, behavioral finance, securities, seguros e sistema bancário.",catalogOrder:2},
  {id:"course-fin-03",track:"track-finance",title:"Understanding Financial Markets",source:"Coursera · University of Geneva",url:"https://www.coursera.org/learn/understanding-financial-markets",estimatedMinutes:600,important:true,urgent:false,description:"Instrumentos, mercados e fundamentos do processo de investimento.",catalogOrder:3},
  {id:"course-fin-04",track:"track-finance",title:"Meeting Investors' Goals",source:"Coursera · University of Geneva",url:"https://www.coursera.org/learn/meeting-investors-goals",estimatedMinutes:600,important:true,urgent:false,description:"Objetivos, restrições, perfil de risco e construção do processo de investimento.",catalogOrder:4},
  {id:"course-fin-05",track:"track-finance",title:"Portfolio and Risk Management",source:"Coursera · University of Geneva",url:"https://www.coursera.org/learn/portfolio-risk-management",estimatedMinutes:600,important:true,urgent:false,description:"Construção de portfólio, diversificação, risco e avaliação de carteiras.",catalogOrder:5},
  {id:"course-fin-06",track:"track-finance",title:"Securing Investment Returns in the Long Run",source:"Coursera · University of Geneva",url:"https://www.coursera.org/learn/investment-returns-long-run",estimatedMinutes:600,important:true,urgent:false,description:"Investimento ativo e passivo, performance ajustada ao risco, estratégia de longo prazo, sustainable finance e fintech.",catalogOrder:6},
  {id:"course-fin-07",track:"track-finance",title:"Fundamentals of Finance",source:"Coursera · University of Pennsylvania (Wharton)",url:"https://www.coursera.org/learn/finance-fundamentals",estimatedMinutes:600,important:true,urgent:false,description:"Juros simples e compostos, NPV, anuidades, perpetuidades e fundamentos de corporate finance.",catalogOrder:7}
];
function starterLesson(id,title,order,type="video",estimatedMinutes=0,description=""){
  return {id,title,order,type,estimatedMinutes,minutes:estimatedMinutes,description,progress:0,status:"nao_iniciado",done:false}
}
function starterModule(id,title,order,estimatedMinutes=0,description="",lessons=[]){
  return {id,title,order,estimatedMinutes,minutes:estimatedMinutes,description,progress:0,status:"nao_iniciado",done:false,lessons}
}
function starterCurriculum(source,sourceUrl,modules,extra={}){
  return {curriculumSource:source,curriculumSourceUrl:sourceUrl,modules,...extra}
}
const STARTER_CURRICULUM={
  "course-elec-01":starterCurriculum("Coursera","https://www.coursera.org/learn/microcontrollers-basic-architecture-and-design",[
    starterModule("module-elec-01-01","MCU Background and Analysis",1,300,"Microcontroller background, constraints, and analysis."),
    starterModule("module-elec-01-02","MCU Components",2,180,"Core components and how they fit together."),
    starterModule("module-elec-01-03","MCU Power Control and Timing",3,180,"Power behavior, timing, and control concerns."),
    starterModule("module-elec-01-04","MCU Processors",4,180,"Processor organization and processor-facing design tradeoffs."),
    starterModule("module-elec-01-05","MCU Processor Details",5,540,"Detailed processor behavior for microcontroller design.")
  ]),
  "course-elec-02":starterCurriculum("Coursera","https://www.coursera.org/learn/intro-fpga-design-embedded-systems",[
    starterModule("module-elec-02-01","What's this programmable logic stuff anyway? History and Architecture",1,300,"Programmable logic history and architecture."),
    starterModule("module-elec-02-02","FPGA Design Tool Flow; An Example Design",2,240,"FPGA design tools and an example design flow."),
    starterModule("module-elec-02-03","FPGA Architectures: SRAM, FLASH, and Anti-fuse",3,240,"SRAM, FLASH, and anti-fuse FPGA architectures."),
    starterModule("module-elec-02-04","Programmable logic design using schematic entry design tools",4,360,"Programmable logic design with schematic entry tools.")
  ]),
  "course-elec-03":starterCurriculum("Coursera","https://www.coursera.org/learn/fpga-hardware-description-languages",[
    starterModule("module-elec-03-01","Basics of VHDL",1,540,"VHDL fundamentals for FPGA design."),
    starterModule("module-elec-03-02","VHDL Logic Design Techniques",2,720,"Logic design techniques with VHDL."),
    starterModule("module-elec-03-03","Basics of Verilog",3,420,"Verilog fundamentals."),
    starterModule("module-elec-03-04","Verilog and System Verilog Design Techniques",4,600,"Verilog and SystemVerilog design techniques.")
  ]),
  "course-elec-04":starterCurriculum("Coursera","https://www.coursera.org/specializations/fpga-design",[
    starterModule("module-elec-04-01","Introduction to FPGA Design for Embedded Systems",1,1140,"Course 1 in the FPGA Design for Embedded Systems Specialization."),
    starterModule("module-elec-04-02","Hardware Description Languages for FPGA Design",2,2220,"Course 2 in the FPGA Design for Embedded Systems Specialization."),
    starterModule("module-elec-04-03","FPGA Softcore Processors and IP Acquisition",3,660,"Course 3 in the FPGA Design for Embedded Systems Specialization."),
    starterModule("module-elec-04-04","FPGA Capstone: Building FPGA Projects",4,1800,"Course 4 in the FPGA Design for Embedded Systems Specialization.")
  ],{programType:"specialization",childCourseIds:["course-elec-02","course-elec-03"],childCourses:[
    {id:"program-elec-04-course-03",title:"FPGA Softcore Processors and IP Acquisition",order:3,estimatedMinutes:660,sourceUrl:"https://www.coursera.org/specializations/fpga-design",progress:0,status:"nao_iniciado"},
    {id:"program-elec-04-course-04",title:"FPGA Capstone: Building FPGA Projects",order:4,estimatedMinutes:1800,sourceUrl:"https://www.coursera.org/specializations/fpga-design",progress:0,status:"nao_iniciado"}
  ]}),
  "course-elec-05":starterCurriculum("Coursera","https://www.coursera.org/learn/comparch",[
    starterModule("module-elec-05-01","Introduction, Instruction Set Architecture, and Microcode",1,240,"Architecture foundations, ISA, and microcode."),
    starterModule("module-elec-05-02","Pipelining Review",2,180,"Pipeline concepts review."),
    starterModule("module-elec-05-03","Cache Review",3,180,"Cache concepts review."),
    starterModule("module-elec-05-04","Superscalar 1",4,180,"Superscalar processor concepts."),
    starterModule("module-elec-05-05","Superscalar 2 & Exceptions",5,120,"Superscalar execution and exceptions."),
    starterModule("module-elec-05-06","Superscalar 3",6,120,"Further superscalar design."),
    starterModule("module-elec-05-07","Superscalar 4",7,60,"Final superscalar topics."),
    starterModule("module-elec-05-08","VLIW 1",8,120,"Very long instruction word architectures."),
    starterModule("module-elec-05-09","VLIW2",9,180,"Additional VLIW topics."),
    starterModule("module-elec-05-10","Branch Prediction",10,120,"Branch prediction techniques."),
    starterModule("module-elec-05-11","Advanced Caches 1",11,180,"Advanced cache design."),
    starterModule("module-elec-05-12","Advanced Caches 2",12,120,"Additional advanced cache design."),
    starterModule("module-elec-05-13","Memory Protection",13,180,"Memory protection mechanisms."),
    starterModule("module-elec-05-14","Vector Processors and GPUs",14,180,"Vector processors and GPU architecture."),
    starterModule("module-elec-05-15","Multithreading",15,120,"Hardware multithreading."),
    starterModule("module-elec-05-16","Parallel Programming 1",16,60,"Parallel programming foundations."),
    starterModule("module-elec-05-17","Parallel Programming 2",17,60,"Additional parallel programming topics."),
    starterModule("module-elec-05-18","Small Multiprocessors",18,120,"Small multiprocessor systems."),
    starterModule("module-elec-05-19","Multiprocessor Interconnect 1",19,180,"Multiprocessor interconnects."),
    starterModule("module-elec-05-20","Multiprocessor Interconnect 2",20,180,"Additional interconnect topics."),
    starterModule("module-elec-05-21","Large Multiprocessors (Directory Protocols)",21,180,"Large multiprocessors and directory protocols.")
  ]),
  "course-elec-06":starterCurriculum("Linux Foundation","https://training.linuxfoundation.org/training/introduction-to-riscv-lfd110/",[
    starterModule("module-elec-06-01","Welcome!",1,30,"Course welcome and orientation."),
    starterModule("module-elec-06-02","Chapter 1. Getting to Know RISC-V",2,150,"RISC-V origins, goals, and ecosystem."),
    starterModule("module-elec-06-03","Chapter 2. Exploring the RISC-V Instruction Set Architecture",3,180,"RISC-V ISA structure and concepts."),
    starterModule("module-elec-06-04","Chapter 3. Hands-On RISC-V Assembly Language",4,180,"Hands-on RISC-V assembly language."),
    starterModule("module-elec-06-05","Chapter 4. RISC-V Development Tools",5,180,"RISC-V tools and development workflow."),
    starterModule("module-elec-06-06","Chapter 5. Meeting the Demands of Today's Computing",6,180,"How RISC-V addresses modern computing demands.")
  ]),
  "course-elec-07":starterCurriculum("Linux Foundation","https://training.linuxfoundation.org/training/building-a-riscv-cpu-core-lfd111x/",[
    starterModule("module-elec-07-01","Welcome!",1,20,"Course welcome and orientation."),
    starterModule("module-elec-07-02","Chapter 1. Learning Platform",2,60,"Learning platform setup and usage."),
    starterModule("module-elec-07-03","Chapter 2. Digital Logic",3,60,"Digital logic foundations for the CPU core."),
    starterModule("module-elec-07-04","Chapter 3. The Role of RISC-V",4,60,"RISC-V's role in the CPU design."),
    starterModule("module-elec-07-05","Chapter 4. RISC-V-Subset CPU",5,120,"Build a RISC-V-subset CPU."),
    starterModule("module-elec-07-06","Chapter 5. Completing Your RISC-V CPU",6,90,"Complete the CPU core."),
    starterModule("module-elec-07-07","Final Exam",7,30,"Final verified-track assessment.")
  ]),
  "course-elec-08":starterCurriculum("Coursera","https://www.coursera.org/learn/systemverilog-tutorials-hardware-design--verification",[
    starterModule("module-elec-08-01","SystemVerilog Foundations & Basic Modules",1,60,"Foundations, modules, ports, types, arrays, and iteration.",[
      starterLesson("lesson-elec-08-01-01","Quartus Prime Installation and Testing",1),
      starterLesson("lesson-elec-08-01-02","Understanding Modules, Ports, and Instantiation",2),
      starterLesson("lesson-elec-08-01-03","Introduction to SystemVerilog's Data and Numeric Types",3),
      starterLesson("lesson-elec-08-01-04","Practical Guide to SystemVerilog Arrays for FPGA Design",4),
      starterLesson("lesson-elec-08-01-05","SystemVerilog Arrays and Iteration",5)
    ]),
    starterModule("module-elec-08-02","Dynamic Data Structures, Custom Types & Operators",2,60,"Dynamic arrays, queues, associative arrays, operators, and custom types.",[
      starterLesson("lesson-elec-08-02-01","Dynamic Arrays, Queues & Associative Arrays",1),
      starterLesson("lesson-elec-08-02-02","SystemVerilog Operators",2),
      starterLesson("lesson-elec-08-02-03","Custom Types: Typedef, Enum, Struct",3),
      starterLesson("lesson-elec-08-02-04","Custom Data Types in SystemVerilog",4),
      starterLesson("lesson-elec-08-02-05","Combinational Logic: Continuous Assignment",5),
      starterLesson("lesson-elec-08-02-06","Continuous Assignments and Multiplexers in SystemVerilog",6)
    ]),
    starterModule("module-elec-08-03","Sequential Logic and State Machine",3,180,"Sequential logic, decision logic, state machines, loops, and functions.",[
      starterLesson("lesson-elec-08-03-01","Sequential Logic: Modeling sequential logic",1),
      starterLesson("lesson-elec-08-03-02","Combinational Decision Logic, State Machines, and Priority Encoders",2),
      starterLesson("lesson-elec-08-03-03","Loops in SystemVerilog",3),
      starterLesson("lesson-elec-08-03-04","Functions in SystemVerilog",4),
      starterLesson("lesson-elec-08-03-05","SystemVerilog Functions and Recursion",5),
      starterLesson("lesson-elec-08-03-06","Course Wrap-Up",6)
    ])
  ]),
  "course-elec-09":starterCurriculum("Siemens Verification Academy","https://verificationacademy.com/topics/uvm-universal-verification-methodology/introduction-to-the-uvm/",[
    starterModule("module-elec-09-01","Introduction to the UVM",1,720,"Official Siemens Verification Academy session sequence.",[
      starterLesson("lesson-elec-09-01-01","Overview and Welcome",1),
      starterLesson("lesson-elec-09-01-02","SystemVerilog Primer for VHDL Engineers",2),
      starterLesson("lesson-elec-09-01-03","Object Oriented Programming",3),
      starterLesson("lesson-elec-09-01-04","SystemVerilog Interfaces",4),
      starterLesson("lesson-elec-09-01-05","Packages, Includes and Macros",5),
      starterLesson("lesson-elec-09-01-06","UVM Components and Tests",6),
      starterLesson("lesson-elec-09-01-07","UVM Environments",7),
      starterLesson("lesson-elec-09-01-08","Connecting Objects",8),
      starterLesson("lesson-elec-09-01-09","Transaction-Level Testing",9),
      starterLesson("lesson-elec-09-01-10","The Analysis Layer",10),
      starterLesson("lesson-elec-09-01-11","UVM Reporting",11),
      starterLesson("lesson-elec-09-01-12","Functional Coverage with Covergroups",12),
      starterLesson("lesson-elec-09-01-13","Introduction to Sequences",13)
    ])
  ]),
  "course-elec-10":starterCurriculum("Coursera","https://www.coursera.org/specializations/chip-based-vlsi-design-for-industrial-applications",[
    starterModule("module-elec-10-01","Fundamentals of Digital Design for VLSI Chip Design",1,1080,"Course 1 in the Chip based VLSI design for Industrial Applications Specialization."),
    starterModule("module-elec-10-02","VLSI Chip Design and Simulation with Electric VLSI EDA Tool",2,840,"Course 2 in the specialization."),
    starterModule("module-elec-10-03","Design of Digital Circuits with VHDL Programming",3,840,"Course 3 in the specialization."),
    starterModule("module-elec-10-04","FPGA Architecture Based System for Industrial Application Using Vivado",4,1080,"Course 4 in the specialization.")
  ],{programType:"specialization",childCourseIds:[],childCourses:[
    {id:"program-elec-10-course-01",title:"Fundamentals of Digital Design for VLSI Chip Design",order:1,estimatedMinutes:1080,sourceUrl:"https://www.coursera.org/specializations/chip-based-vlsi-design-for-industrial-applications",progress:0,status:"nao_iniciado"},
    {id:"program-elec-10-course-02",title:"VLSI Chip Design and Simulation with Electric VLSI EDA Tool",order:2,estimatedMinutes:840,sourceUrl:"https://www.coursera.org/specializations/chip-based-vlsi-design-for-industrial-applications",progress:0,status:"nao_iniciado"},
    {id:"program-elec-10-course-03",title:"Design of Digital Circuits with VHDL Programming",order:3,estimatedMinutes:840,sourceUrl:"https://www.coursera.org/specializations/chip-based-vlsi-design-for-industrial-applications",progress:0,status:"nao_iniciado"},
    {id:"program-elec-10-course-04",title:"FPGA Architecture Based System for Industrial Application Using Vivado",order:4,estimatedMinutes:1080,sourceUrl:"https://www.coursera.org/specializations/chip-based-vlsi-design-for-industrial-applications",progress:0,status:"nao_iniciado"}
  ]}),
  "course-fin-01":starterCurriculum("Coursera","https://www.coursera.org/learn/family-planning",[
    starterModule("module-fin-01-01","Understanding Personal Finance",1,120,"Introduction to the basic concepts of personal finance."),
    starterModule("module-fin-01-02","Financial Statements, Tools, and Budgets",2,120,"Financial statements, personal finance tools, and budgeting."),
    starterModule("module-fin-01-03","Managing Income Taxes",3,120,"Income tax management in personal financial planning."),
    starterModule("module-fin-01-04","Building and Maintaining Good Credit",4,120,"Credit reports, credit scores, and maintaining good credit."),
    starterModule("module-fin-01-05","Managing Risk",5,120,"Risk management and insurance planning."),
    starterModule("module-fin-01-06","Investment Fundamentals",6,120,"Investment fundamentals for personal finance."),
    starterModule("module-fin-01-07","Investing Through Mutual Funds",7,120,"Mutual funds and fund-based investing."),
    starterModule("module-fin-01-08","Personal Plan of Action",8,18,"Build a personal financial plan of action."),
    starterModule("module-fin-01-09","Bonus Module",9,10,"Bonus reading module.")
  ]),
  "course-fin-02":starterCurriculum("Coursera","https://www.coursera.org/learn/financial-markets-global",[
    starterModule("module-fin-02-01","Module 1",1,360,"Basics of financial markets, insurance, and CAPM."),
    starterModule("module-fin-02-02","Module 2",2,240,"Behavioral finance, forecasting, pricing, debt, and inflation."),
    starterModule("module-fin-02-03","Module 3",3,240,"Stocks, bonds, dividends, shares, market capitalization, and corporation history."),
    starterModule("module-fin-02-04","Module 4",4,420,"Recent financial history, recessions, bubbles, mortgage crisis, and regulation."),
    starterModule("module-fin-02-05","Module 5",5,240,"Options and bond markets."),
    starterModule("module-fin-02-06","Module 6",6,240,"Investment banking, underwriting, brokers, dealers, exchanges, and innovations."),
    starterModule("module-fin-02-07","Module 7",7,300,"Nonprofits, corporations, and career paths in finance.")
  ]),
  "course-fin-03":starterCurriculum("Coursera","https://www.coursera.org/learn/understanding-financial-markets",[
    starterModule("module-fin-03-01","General Introduction and Key Concepts",1,180,"General introduction and key concepts."),
    starterModule("module-fin-03-02","Major Financial Markets",2,180,"Major financial markets."),
    starterModule("module-fin-03-03","Other Financial Markets",3,180,"Other financial markets."),
    starterModule("module-fin-03-04","Financial Markets and the Economy",4,120,"Financial markets and the economy.")
  ]),
  "course-fin-04":starterCurriculum("Coursera","https://www.coursera.org/learn/meeting-investors-goals",[
    starterModule("module-fin-04-01","General Introduction and Key Concepts",1,60,"General introduction and key concepts."),
    starterModule("module-fin-04-02","How Individuals Make Financial Decisions",2,120,"How individuals make financial decisions."),
    starterModule("module-fin-04-03","Market Efficiency, Bubbles & Crises",3,180,"Market efficiency, bubbles, and crises."),
    starterModule("module-fin-04-04","Portfolio Construction and Investment Styles",4,120,"Portfolio construction and investment styles.")
  ]),
  "course-fin-05":starterCurriculum("Coursera","https://www.coursera.org/learn/portfolio-risk-management",[
    starterModule("module-fin-05-01","General Introduction and Key Concepts",1,60,"General introduction and key concepts."),
    starterModule("module-fin-05-02","Modern Portfolio Theory and Beyond",2,120,"Modern Portfolio Theory and beyond."),
    starterModule("module-fin-05-03","Asset Allocation",3,180,"Asset allocation."),
    starterModule("module-fin-05-04","Risk Management",4,120,"Risk management.")
  ]),
  "course-fin-06":starterCurriculum("Coursera","https://www.coursera.org/learn/investment-returns-long-run",[
    starterModule("module-fin-06-01","General Introduction and Key Concepts",1,120,"General introduction and key concepts."),
    starterModule("module-fin-06-02","Assessing Performance",2,120,"Assessing investment performance."),
    starterModule("module-fin-06-03","Investment Vehicles",3,120,"Investment vehicles."),
    starterModule("module-fin-06-04","Future Trends",4,120,"Future trends.")
  ]),
  "course-fin-07":starterCurriculum("Coursera","https://www.coursera.org/learn/finance-fundamentals",[
    starterModule("module-fin-07-01","Module 1 - Introduction and Net Present Value (NPV)",1,180,"Introduction and net present value."),
    starterModule("module-fin-07-02","Module 2 - Fixed Income Valuation",2,180,"Fixed income valuation."),
    starterModule("module-fin-07-03","Module 3 - Equity Valuation",3,120,"Equity valuation."),
    starterModule("module-fin-07-04","Module 4 - NPV vs. Internal Rate of Return",4,120,"NPV versus internal rate of return."),
    starterModule("module-fin-07-05","Module 5",5,120,"Additional course topics related to finance fundamentals.")
  ])
};
const STARTER_PLAYLISTS=[
  {id:"playlist-learning-main",youtubePlaylistId:"PLNur2Ccbfc5k",name:"Playlist de aprendizado",url:"https://www.youtube.com/playlist?list=PLNur2Ccbfc5k",enabled:true,createdAt:"2026-08-17T00:00:00.000Z",updatedAt:"2026-08-17T00:00:00.000Z",lastSyncAt:null,lastSyncError:null,catalogGeneratedAt:null,catalogTitle:null}
];
const ARCANA_PLAYLIST_ISSUE_URL="https://github.com/NataliaCarvalhinha/arcana/issues/new";
let state=structuredClone(DEFAULT_STATE),currentView="home",focusRef=null,timer=0,timerHandle=null,notesRef=null,calendarCursor=new Date(),journalCursor=new Date(),syncing=false,expandedCourseId=null,activeKnowledgeTab="all",globalSearchQuery="",routineViewMode="week",routineImportPreview=null;
let vaultNotes=[],activeVaultNote=null,activeVaultMode="notes",vaultSaveTimer=null,focusNoteId=null,focusSaveTimer=null,focusBlocks=[],currentReviewNote=null,knowledgeExtractionDraft=null;
let youtubeCatalogMeta={version:null,generatedAt:null,lastLoadedAt:null,playlistIds:[],playlistCount:0,videoCount:0,error:null};
let youtubeCatalogPollHandle=null;
let obsidianAutoSyncHandle=null,obsidianSyncInFlight=false;
let calendarFilters={routine:true,external:true,plan:true,completed:true};
let externalCalendarSyncing=false;
let calendarRuntime={googleAccessToken:null,googleTokenExpiresAt:0,tokenClient:null,identityScript:null};
const NOTE_TYPE_LABELS={literature:"Fichamento",permanent:"Permanente",concept:"Conceito",question:"Pergunta",insight:"Insight",quote:"Citação",example:"Exemplo",formula_command:"Fórmula / comando",reference:"Referência",next_action:"Ação",quick:"Rápida",session:"Sessão"};
const FOCUS_BLOCK_TYPE_ALIASES={concept:"concept",question:"question",insight:"insight",quote:"quote",example:"example",formula:"formula-command",formula_command:"formula-command","formula-command":"formula-command",next_action:"next-action","next-action":"next-action",free:"free-note","free-note":"free-note"};
const FOCUS_BLOCK_TYPES={concept:{label:"Conceito",target:"concept"},question:{label:"Pergunta",target:"question"},insight:{label:"Insight",target:"permanent"},quote:{label:"Citação"},example:{label:"Exemplo"},"formula-command":{label:"Fórmula / comando"},"next-action":{label:"Próximo passo"},"free-note":{label:"Nota livre"},formula:{label:"Fórmula / comando"},next_action:{label:"Próximo passo"},free:{label:"Nota livre"}};
const KNOWLEDGE_CANDIDATE_TYPES={concept:{label:"Conceito",targetNoteType:"concept",section:"concepts"},"permanent-note":{label:"Nota permanente",targetNoteType:"permanent",section:"permanentNotes"},question:{label:"Pergunta",targetNoteType:"question",section:"questions"},quote:{label:"Citação",targetNoteType:"quote",section:"quotes"},example:{label:"Exemplo",targetNoteType:"example",section:"examples"},"formula-command":{label:"Fórmula / comando",targetNoteType:"formula_command",section:"formulas"},"next-action":{label:"Próximo passo",targetNoteType:"next_action",section:"nextActions"}};
const KNOWLEDGE_EXTRACTION_SECTIONS=[["concepts","Conceitos"],["permanentNotes","Notas permanentes"],["questions","Perguntas"],["quotes","Citações"],["examples","Exemplos"],["formulas","Fórmulas e comandos"],["nextActions","Próximos passos"]];
const $=id=>document.getElementById(id);
const YOUTUBE_PLAYLIST_ID_RE=/^[A-Za-z0-9_-]{8,}$/;

function createFreshDefaultState(){
  const fresh=applyStarterContent(structuredClone(DEFAULT_STATE));
  fresh.dataSchemaVersion=DATA_SCHEMA_VERSION;
  fresh.migrationMeta={previousSchemaVersion:0,currentSchemaVersion:DATA_SCHEMA_VERSION,lastMigrationAt:new Date().toISOString(),lastMigrationStatus:"fresh"};
  return normalize(fresh)
}
function preparePersistedState(raw,options={}){
  if(!DATA_SAFETY?.prepareStateMigration){
    throw new Error("Arcana data safety layer is unavailable.")
  }
  return DATA_SAFETY.prepareStateMigration(raw,{normalize,applyStarterContent,starterCurriculumVersion:STARTER_CURRICULUM_VERSION,now:()=>new Date().toISOString(),...options})
}
function loadLocalStateRecord(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw){
      return {status:"VALID_DATA",state:JSON.parse(raw),source:STORAGE_KEY}
    }
    for(const key of LEGACY_KEYS){
      const old=localStorage.getItem(key);
      if(old){
        return {status:"VALID_DATA",state:migrate(JSON.parse(old)),source:key,legacy:true}
      }
    }
  }catch(error){
    return {status:"LOAD_ERROR",error}
  }
  return {status:"NO_DATA"}
}
function loadState(){
  const record=loadLocalStateRecord();
  if(record.status==="NO_DATA"){
    return createFreshDefaultState()
  }
  if(record.status==="LOAD_ERROR"){
    throw record.error
  }
  return preparePersistedState(record.state,{source:record.source}).state
}
function normalize(s){
  const d=structuredClone(DEFAULT_STATE);
  s={...d,...s};
  const previousActivityLogVersion=Math.max(0,Number(s.activityLogVersion)||0);
  s.tracks=Array.isArray(s.tracks)?s.tracks:d.tracks;
  s.tracks=s.tracks.map(t=>({...t,progression:t?.progression||"sequential"}));
  s.items=Array.isArray(s.items)?s.items:d.items;
  s.playlists=Array.isArray(s.playlists)&&s.playlists.length?s.playlists:d.playlists;
  s.youtubeQueue=Array.isArray(s.youtubeQueue)?s.youtubeQueue:[];
  s.sessions=Array.isArray(s.sessions)?s.sessions:[];
  s.activityLog=Array.isArray(s.activityLog)?s.activityLog.map(normalizeActivityEntry).filter(Boolean):[];
  s.weeklyGoals=Array.isArray(s.weeklyGoals)?s.weeklyGoals.map(normalizeWeeklyGoal).filter(Boolean):[];
  s.dailyCheckins=s.dailyCheckins&&typeof s.dailyCheckins==="object"?s.dailyCheckins:{};
  s.inbox=Array.isArray(s.inbox)?s.inbox:[];
  s.youtubeSettings={...d.youtubeSettings,...(s.youtubeSettings||{})};
  s.knowledgeExtraction=normalizeKnowledgeExtractionSettings(s.knowledgeExtraction||d.knowledgeExtraction);
  s.obsidian={...structuredClone(DEFAULT_OBSIDIAN_STATE),...(s.obsidian||{})};
  s.externalCalendars=normalizeExternalCalendars(s.externalCalendars||d.externalCalendars);
  s.dailyPlan={...structuredClone(d.dailyPlan),...(s.dailyPlan||{})};
  s.dailyPlan.items=Array.isArray(s.dailyPlan.items)?s.dailyPlan.items:[];
  s.dailyPlan.freeWindows=Array.isArray(s.dailyPlan.freeWindows)?s.dailyPlan.freeWindows:[];
  s.dailyPlan.notices=Array.isArray(s.dailyPlan.notices)?s.dailyPlan.notices:[];
  s.routineBlocks=Array.isArray(s.routineBlocks)?s.routineBlocks.map(normalizeRoutineBlock).filter(Boolean):[];
  s.routineExceptions=Array.isArray(s.routineExceptions)?s.routineExceptions.map(normalizeRoutineException).filter(Boolean):[];
  s.hobbies=Array.isArray(s.hobbies)&&s.hobbies.length?s.hobbies.map(normalizeHobby).filter(Boolean):structuredClone(d.hobbies);
  s.planningPreferences=normalizePlanningPreferences({...structuredClone(d.planningPreferences),...(s.planningPreferences||{})});
  s.weeklyProgress=s.weeklyProgress&&typeof s.weeklyProgress==="object"?s.weeklyProgress:{};
  s.starterContentVersion=Math.max(0,Number(s.starterContentVersion)||0);
  s.starterCurriculumVersion=Math.max(0,Number(s.starterCurriculumVersion)||0);
  s.activeTrack=s.tracks.some(t=>t?.id===s.activeTrack)?s.activeTrack:(s.tracks[0]?.id||null);
  s.playlists=s.playlists.map((playlist,index)=>normalizePlaylistRecord(playlist,index));
  s.activePlaylist=s.playlists.some(p=>p?.id===s.activePlaylist)?s.activePlaylist:(s.playlists[0]?.id||null);
  s.tracks.forEach(t=>{if(t?.id&&!Object.prototype.hasOwnProperty.call(s.weeklyProgress,t.id)){s.weeklyProgress[t.id]=0}});
  s.items.forEach(i=>{i.important=i.important!==false;i.urgent=!!i.urgent;i.modules=Array.isArray(i.modules)?i.modules:[];i.modules.forEach((m,moduleIndex)=>{m.lessons=Array.isArray(m.lessons)?m.lessons:[];m.order=Number(m.order)||moduleIndex+1;m.lessons.forEach((lesson,lessonIndex)=>{lesson.order=Number(lesson.order)||lessonIndex+1});m.progress=Number(m.progress)||0;m.status=m.status||statusFromProgress(m.progress)});i.notes=typeof i.notes==="string"?i.notes:"";i.description=typeof i.description==="string"?i.description:"";i.catalogOrder=Number(i.catalogOrder)||0;if(i.kind==="course"){i.order=Number(i.order)||Number(i.catalogOrder)||0}});
  s.youtubeQueue.forEach(v=>{v.catalogManaged=v.catalogManaged!==false;v.activeInCatalog=v.activeInCatalog!==false;v.archivedAt=v.archivedAt||null;const playlistId=youtubePlaylistIdFromUrl(v.youtubePlaylistId);if(playlistId){v.youtubePlaylistId=playlistId}});
  if(previousActivityLogVersion<ACTIVITY_LOG_VERSION){
    backfillActivityLog(s)
  }
  s.activityLogVersion=ACTIVITY_LOG_VERSION;
  return s
}
function migrate(old){
  const s=structuredClone(DEFAULT_STATE);
  if(old.activeTrack)s.activeTrack=old.activeTrack;if(old.tracks)s.tracks=old.tracks;if(old.items)s.items=old.items;if(old.inbox)s.inbox=old.inbox;if(old.sessions)s.sessions=old.sessions;if(old.activityLog)s.activityLog=old.activityLog;if(old.weeklyProgress)s.weeklyProgress=old.weeklyProgress;if(old.shortcuts)s.shortcuts=old.shortcuts;
  if(old.youtubeQueue)s.youtubeQueue=old.youtubeQueue;
  if(old.youtube?.playlistUrl)s.playlists=[{id:"main-playlist",youtubePlaylistId:youtubePlaylistIdFromUrl(old.youtube.playlistUrl)||"",name:old.youtube.playlistName||"Playlist de foco",url:old.youtube.playlistUrl,enabled:true,createdAt:old.youtube.lastSyncAt||null,updatedAt:old.youtube.lastSyncAt||null,lastSyncAt:old.youtube.lastSyncAt||null,lastSyncError:old.youtube.lastSyncError||null,catalogGeneratedAt:null,catalogTitle:null}];
  if(old.youtubeDailyGlobal)s.youtubeDaily=old.youtubeDailyGlobal;
  if(old.externalCalendars)s.externalCalendars=old.externalCalendars;
  if(old.youtube)s.youtubeSettings={...s.youtubeSettings,mode:old.youtube.mode||"either",minutes:old.youtube.minutes||45,count:old.youtube.count||3,hideAfterLimit:old.youtube.hideAfterLimit!==false};
  s.items.forEach(i=>{i.important=i.important!==false;i.urgent=!!i.urgent;i.modules=i.modules||[];i.notes=i.notes||""});
  return s
}
function starterCourse(seed){
  return {id:seed.id,kind:"course",track:seed.track,title:seed.title,url:seed.url,source:seed.source,description:seed.description,estimatedMinutes:seed.estimatedMinutes,progress:0,status:"nao_iniciado",important:seed.important!==false,urgent:!!seed.urgent,modules:[],notes:"",catalogOrder:seed.catalogOrder,order:seed.catalogOrder,createdAt:new Date().toISOString()}
}
function mergeStarterCourse(existing,seed){
  const base=starterCourse(seed);
  const merged={...existing,...base};
  merged.progress=Number(existing.progress??base.progress)||0;
  merged.status=existing.status||statusFromProgress(merged.progress);
  merged.modules=Array.isArray(existing.modules)?existing.modules:[...base.modules];
  merged.notes=typeof existing.notes==="string"?existing.notes:base.notes;
  merged.important=existing.important??base.important;
  merged.urgent=existing.urgent??base.urgent;
  merged.order=Number(existing.order)||Number(base.order)||Number(existing.catalogOrder)||0;
  merged.createdAt=existing.createdAt||base.createdAt;
  return merged
}
function mergeStarterTrack(existing,seed){
  return {
    ...existing,
    id:seed.id,
    name:existing.name||seed.name,
    sigil:existing.sigil||seed.sigil,
    subtitle:existing.subtitle||seed.subtitle,
    description:existing.description||seed.description,
    weeklyGoal:existing.weeklyGoal??seed.weeklyGoal
  }
}
function mergeStarterPlaylist(existing,seed){
  return {...existing,...seed,lastSyncAt:existing.lastSyncAt??seed.lastSyncAt??null,lastSyncError:existing.lastSyncError??seed.lastSyncError??null}
}
function curriculumMetadata(course,curriculum){
  return {starterManaged:true,curriculumSource:curriculum.curriculumSource,curriculumSourceUrl:curriculum.curriculumSourceUrl||course.url||"",curriculumFetchedAt:CURRICULUM_FETCHED_AT,curriculumVersion:STARTER_CURRICULUM_VERSION}
}
function preserveManagedFields(merged,existing={}){
  for(const key of ["progress","status","done","notes","vaultNoteId","focusDraftNoteId","completedAt","startedAt","important","urgent","custom","metadata","sessions","fichamentos","fichamentoIds"]){
    if(Object.prototype.hasOwnProperty.call(existing,key)){
      merged[key]=existing[key]
    }
  }
  return merged
}
function mergeOfficialLesson(existing,lesson,module,course,curriculum){
  const meta=curriculumMetadata(course,curriculum);
  const merged=preserveManagedFields({...existing,...lesson,...meta,sourceUrl:lesson.sourceUrl||module.sourceUrl||curriculum.curriculumSourceUrl||course.url||"",courseId:course.id,moduleId:module.id,kind:"lesson"},existing||{});
  merged.order=Number(lesson.order)||Number(existing?.order)||0;
  merged.estimatedMinutes=Number(lesson.estimatedMinutes)||Number(existing?.estimatedMinutes)||0;
  merged.minutes=Number(lesson.minutes)||merged.estimatedMinutes;
  merged.progress=Math.max(0,Math.min(100,Number(merged.done?100:merged.progress)||0));
  merged.status=merged.status||statusFromProgress(merged.progress);
  merged.done=!!merged.done||merged.progress>=100;
  return merged
}
function mergeOfficialModule(existing,module,course,curriculum){
  const meta=curriculumMetadata(course,curriculum);
  const existingLessons=Array.isArray(existing?.lessons)?existing.lessons:[];
  const officialLessons=Array.isArray(module.lessons)?module.lessons:[];
  const officialIds=new Set(officialLessons.map(lesson=>lesson.id));
  const oldById=new Map(existingLessons.filter(lesson=>lesson?.id).map(lesson=>[lesson.id,lesson]));
  const lessons=officialLessons.map(lesson=>mergeOfficialLesson(oldById.get(lesson.id),lesson,module,course,curriculum));
  for(const lesson of existingLessons){
    if(!lesson?.id||!officialIds.has(lesson.id)){
      lessons.push(lesson)
    }
  }
  const merged=preserveManagedFields({...existing,...module,...meta,sourceUrl:module.sourceUrl||curriculum.curriculumSourceUrl||course.url||"",courseId:course.id,kind:"module",lessons},existing||{});
  merged.order=Number(module.order)||Number(existing?.order)||0;
  merged.estimatedMinutes=Number(module.estimatedMinutes)||Number(existing?.estimatedMinutes)||0;
  merged.minutes=Number(module.minutes)||merged.estimatedMinutes;
  merged.progress=moduleProgress(merged);
  merged.status=statusFromProgress(merged.progress);
  merged.done=moduleDone(merged);
  return merged
}
function mergeOfficialChildCourse(existing,child,course,curriculum){
  const meta=curriculumMetadata(course,curriculum);
  const merged=preserveManagedFields({...existing,...child,...meta,sourceUrl:child.sourceUrl||curriculum.curriculumSourceUrl||course.url||"",kind:"program-course",parentCourseId:course.id},existing||{});
  merged.progress=Math.max(0,Math.min(100,Number(merged.progress)||0));
  merged.status=merged.status||statusFromProgress(merged.progress);
  return merged
}
function applyCourseCurriculum(course,curriculum){
  const meta=curriculumMetadata(course,curriculum);
  Object.assign(course,meta);
  if(curriculum.programType){
    course.programType=curriculum.programType
  }
  if(Array.isArray(curriculum.childCourseIds)){
    course.childCourseIds=[...curriculum.childCourseIds]
  }
  const existingChildren=Array.isArray(course.childCourses)?course.childCourses:[];
  const oldChildren=new Map(existingChildren.filter(child=>child?.id).map(child=>[child.id,child]));
  course.childCourses=Array.isArray(curriculum.childCourses)?curriculum.childCourses.map(child=>mergeOfficialChildCourse(oldChildren.get(child.id),child,course,curriculum)):[...existingChildren];
  const existingModules=Array.isArray(course.modules)?course.modules:[];
  const officialModules=Array.isArray(curriculum.modules)?curriculum.modules:[];
  const officialIds=new Set(officialModules.map(module=>module.id));
  const oldById=new Map(existingModules.filter(module=>module?.id).map(module=>[module.id,module]));
  course.modules=officialModules.map(module=>mergeOfficialModule(oldById.get(module.id),module,course,curriculum));
  for(const module of existingModules){
    if(!module?.id||!officialIds.has(module.id)){
      course.modules.push(module)
    }
  }
  if(course.status===undefined||course.status===null||course.status===""){
    course.status=statusFromProgress(course.progress)
  }
  return course
}
function isDefaultTrackPlaceholder(track){
  return !!track&&track.id==="default"&&track.name==="Principal"&&track.sigil==="☽"&&track.subtitle==="Seu caminho inicial"&&track.description==="Uma trilha vazia para começar sem publicar dados pessoais."&&Number(track.weeklyGoal||0)===120
}
function isDefaultPlaylistPlaceholder(playlist){
  return !!playlist&&playlist.id==="main-playlist"&&playlist.name==="Playlist de foco"&&!playlist.url&&!playlist.lastSyncAt&&!playlist.lastSyncError
}
function canReplaceDefaultTrackPlaceholder(s){
  return s.tracks.length===1&&isDefaultTrackPlaceholder(s.tracks[0])&&!s.items.some(i=>i.track==="default")&&Object.keys(s.weeklyProgress||{}).every(key=>key==="default")&&Number(s.weeklyProgress?.default||0)===0&&(s.activeTrack==="default"||!s.activeTrack)
}
function canReplaceDefaultPlaylistPlaceholder(s){
  return s.playlists.length===1&&isDefaultPlaylistPlaceholder(s.playlists[0])&&!s.youtubeQueue.some(v=>v.playlistId==="main-playlist")&&(s.activePlaylist==="main-playlist"||!s.activePlaylist)
}
function normalizedIdentity(value=""){
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()
}
function starterTrackSeedFor(track){
  return STARTER_TRACKS.find(seed=>track?.id===seed.id||normalizedIdentity(track?.name)===normalizedIdentity(seed.name))||null
}
function mergeDuplicateStarterTrack(existing,duplicate,seed){
  const merged={...duplicate,...existing,id:seed.id};
  for(const key of ["name","sigil","subtitle","description","weeklyGoal","progression"]){
    if((merged[key]===undefined||merged[key]===null||merged[key]==="")&&duplicate[key]!==undefined&&duplicate[key]!==null&&duplicate[key]!==""){
      merged[key]=duplicate[key]
    }
  }
  return mergeStarterTrack(merged,seed)
}
function repairStarterTrackDuplicates(s){
  const tracks=[],indexById=new Map(),idMap=new Map();
  for(const track of s.tracks){
    if(!track?.id){
      continue
    }
    const seed=starterTrackSeedFor(track),canonicalId=seed?.id||track.id;
    if(seed&&track.id!==canonicalId){
      idMap.set(track.id,canonicalId)
    }
    if(indexById.has(canonicalId)){
      const index=indexById.get(canonicalId);
      tracks[index]=seed?mergeDuplicateStarterTrack(tracks[index],track,seed):{...track,...tracks[index],id:canonicalId};
      idMap.set(track.id,canonicalId);
    }else{
      indexById.set(canonicalId,tracks.length);
      tracks.push(seed?mergeStarterTrack({...track,id:canonicalId},seed):{...track,id:canonicalId})
    }
  }
  s.tracks=tracks;
  for(const item of s.items){
    if(idMap.has(item.track)){
      item.track=idMap.get(item.track)
    }
  }
  for(const session of s.sessions){
    if(idMap.has(session.track)){
      session.track=idMap.get(session.track)
    }
  }
  if(Array.isArray(s.dailyPlan?.items)){
    for(const item of s.dailyPlan.items){
      if(idMap.has(item.track)){
        item.track=idMap.get(item.track)
      }
    }
  }
  for(const [from,to] of idMap){
    if(from!==to&&Object.prototype.hasOwnProperty.call(s.weeklyProgress,from)){
      s.weeklyProgress[to]=(Number(s.weeklyProgress[to])||0)+(Number(s.weeklyProgress[from])||0);
      delete s.weeklyProgress[from]
    }
  }
  if(idMap.has(s.activeTrack)){
    s.activeTrack=idMap.get(s.activeTrack)
  }
  return s
}
function applyStarterContentV1(s){
  if(canReplaceDefaultTrackPlaceholder(s)){
    s.tracks=[];
    delete s.weeklyProgress.default;
    s.activeTrack=null
  }
  if(canReplaceDefaultPlaylistPlaceholder(s)){
    s.playlists=[];
    s.activePlaylist=null
  }
  for(const seed of STARTER_TRACKS){
    const index=s.tracks.findIndex(t=>t?.id===seed.id);
    if(index>=0){
      s.tracks[index]=mergeStarterTrack(s.tracks[index],seed)
    }else{
      s.tracks.push({...seed})
    }
    if(!Object.prototype.hasOwnProperty.call(s.weeklyProgress,seed.id)){
      s.weeklyProgress[seed.id]=0
    }
  }
  for(const seed of STARTER_COURSES){
    const index=s.items.findIndex(i=>i?.id===seed.id);
    if(index>=0){
      s.items[index]=mergeStarterCourse(s.items[index],seed)
    }else{
      s.items.push(starterCourse(seed))
    }
  }
  for(const seed of STARTER_PLAYLISTS){
    const index=s.playlists.findIndex(p=>p?.id===seed.id);
    if(index>=0){
      s.playlists[index]=mergeStarterPlaylist(s.playlists[index],seed)
    }else{
      s.playlists.push({...seed})
    }
  }
  if(!s.tracks.some(t=>t?.id===s.activeTrack)){
    s.activeTrack=s.tracks[0]?.id||null
  }
  if(!s.playlists.some(p=>p?.id===s.activePlaylist)){
    s.activePlaylist=STARTER_PLAYLISTS[0]?.id||s.playlists[0]?.id||null
  }
  s.starterContentVersion=1;
  return s
}
function applyStarterContentV2(s){
  repairStarterTrackDuplicates(s);
  if(!s.tracks.some(t=>t?.id===s.activeTrack)){
    s.activeTrack=s.tracks[0]?.id||null
  }
  s.starterContentVersion=2;
  return s
}
function applyStarterCurriculumV1(s){
  for(const [courseId,curriculum] of Object.entries(STARTER_CURRICULUM)){
    const course=s.items.find(i=>i?.id===courseId);
    if(course){
      applyCourseCurriculum(course,curriculum)
    }
  }
  s.starterCurriculumVersion=STARTER_CURRICULUM_VERSION;
  return s
}
function applyStarterContent(input){
  const s=normalize(structuredClone(input));
  let version=s.starterContentVersion;
  if(version<1){
    applyStarterContentV1(s);
    version=1
  }
  if(version<2){
    applyStarterContentV2(s);
    version=2
  }
  s.starterContentVersion=version;
  if(s.starterCurriculumVersion<STARTER_CURRICULUM_VERSION){
    applyStarterCurriculumV1(s)
  }
  s.starterCurriculumVersion=STARTER_CURRICULUM_VERSION;
  return normalize(s)
}
function save(render=true,reason="change"){
  let persisted;
  try{
    if(window.ArcanaStorage?.ready){
      persisted=ArcanaStorage.saveState(state)
    }else{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
      persisted=Promise.resolve()
    }
  }catch(e){
    persisted=Promise.reject(e)
  }
  const done=Promise.resolve(persisted).then(()=>{
    if(render){renderAll()}
    scheduleAutoBackup(reason);
    return state
  });
  done.catch(e=>console.warn("[Arcana] save failed",e));
  return done
}
function dayKey(d=new Date()){return d.toLocaleDateString("en-CA")}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function jsArg(v=""){return `'${String(v).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r")}'`}
function fmtMin(m){m=Math.round(Number(m)||0);return m<60?`${m} min`:`${Math.floor(m/60)}h${m%60?` ${m%60}m`:""}`}
function validDate(value,fallback=new Date()){
  const date=value instanceof Date?value:new Date(value);
  if(Number.isNaN(date.getTime())){
    return fallback instanceof Date?fallback:new Date(fallback)
  }
  return date
}
function isoFromDateTime(dateValue,timeValue=""){
  const date=String(dateValue||dayKey()).trim(),time=String(timeValue||"").trim();
  const value=time?`${date}T${time}`:`${date}T12:00`;
  return validDate(value).toISOString()
}
function safeIdPart(value="entry"){
  return String(value||"entry").trim().replace(/[^a-zA-Z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)||"entry"
}
function activityIdFor(source,sourceRecordId){
  return `activity-${safeIdPart(source)}-${safeIdPart(sourceRecordId)}`
}
function activitySubtypeSlug(value="session"){
  return safeIdPart(String(value||"session").toLowerCase()).replace(/_/g,"-")
}
function normalizeActivityEntry(entry={}){
  if(!entry||typeof entry!=="object"){
    return null
  }
  const fallbackNow=new Date(),type=ACTIVITY_TYPES[entry.type]?entry.type:"other";
  const startedDate=validDate(entry.startedAt||entry.timestamp||entry.createdAt||entry.date||fallbackNow,fallbackNow);
  const duration=Math.max(0,Math.round(Number(entry.durationMinutes??entry.minutes??0)||0));
  const endedDate=entry.endedAt?validDate(entry.endedAt,new Date(startedDate.getTime()+duration*60000)):(duration?new Date(startedDate.getTime()+duration*60000):startedDate);
  const source=String(entry.source||"manual").trim()||"manual";
  const sourceRecordId=String(entry.sourceRecordId||entry.sessionId||entry.id||crypto.randomUUID()).trim();
  const title=String(entry.title||ACTIVITY_TYPES[type]||"Atividade").trim()||ACTIVITY_TYPES[type]||"Atividade";
  return {
    id:String(entry.id||activityIdFor(source,sourceRecordId)),
    type,
    subtype:String(entry.subtype||type).trim()||type,
    title,
    date:entry.date||dayKey(startedDate),
    startedAt:startedDate.toISOString(),
    endedAt:endedDate.toISOString(),
    durationMinutes:duration,
    source,
    sourceRecordId,
    status:String(entry.status||"completed"),
    trackId:entry.trackId||entry.track||null,
    courseId:entry.courseId||null,
    moduleId:entry.moduleId||null,
    lessonId:entry.lessonId||null,
    hobbyId:entry.hobbyId||null,
    noteId:entry.noteId||null,
    sourceId:entry.sourceId||entry.id||null,
    notes:typeof entry.notes==="string"?entry.notes:"",
    metadata:entry.metadata&&typeof entry.metadata==="object"?entry.metadata:{},
    createdAt:entry.createdAt||startedDate.toISOString(),
    updatedAt:entry.updatedAt||new Date().toISOString()
  }
}
function normalizeWeeklyGoal(goal={}){
  const title=String(goal.title||"").trim();
  if(!title){
    return null
  }
  const type=ACTIVITY_TYPES[goal.type]?goal.type:"study";
  return {id:goal.id||crypto.randomUUID(),title,type,targetMinutes:Math.max(0,Math.round(Number(goal.targetMinutes)||0)),trackId:goal.trackId||null,hobbyId:goal.hobbyId||null,active:goal.active!==false,createdAt:goal.createdAt||new Date().toISOString()}
}
function activityFromSession(session={}){
  if(!session?.id){
    return null
  }
  const rawType=String(session.type||"study");
  const type=rawType==="video"||rawType==="youtube"?"youtube":"study";
  return normalizeActivityEntry({
    id:activityIdFor("session",session.id),
    type,
    subtype:type==="youtube"?"youtube.video":`study.${activitySubtypeSlug(rawType)}`,
    title:session.title||ACTIVITY_TYPES[type],
    date:session.date,
    startedAt:session.timestamp||session.createdAt||session.date,
    durationMinutes:session.minutes,
    source:"session",
    sourceRecordId:session.id,
    sourceId:session.sourceId||null,
    trackId:session.trackId||session.track||null,
    courseId:session.courseId||null,
    moduleId:session.moduleId||null,
    lessonId:session.lessonId||null,
    metadata:{legacySessionType:rawType}
  })
}
function activityFromFocusSession(session,resource,scope,sourcePayload={}){
  const base=activityFromSession(session);
  if(!base){
    return null
  }
  base.type=scope==="youtube"?"youtube":"study";
  base.subtype=scope==="youtube"?"youtube.video":`study.${activitySubtypeSlug(scope)}`;
  base.title=resource?.title||session.title||base.title;
  base.trackId=sourcePayload.trackId||base.trackId;
  base.courseId=sourcePayload.courseId||base.courseId;
  base.moduleId=sourcePayload.moduleId||base.moduleId;
  base.lessonId=sourcePayload.lessonId||base.lessonId;
  base.sourceId=resource?.id||session.sourceId||base.sourceId;
  base.metadata={...base.metadata,scope,sourceTitle:sourcePayload.sourceTitle||base.title};
  return base
}
function backfillActivityLog(targetState=state){
  targetState.activityLog=Array.isArray(targetState.activityLog)?targetState.activityLog:[];
  const seen=new Set(targetState.activityLog.map(entry=>`${entry.source}:${entry.sourceRecordId}`));
  for(const session of targetState.sessions||[]){
    const activity=activityFromSession(session);
    if(activity&&!seen.has(`${activity.source}:${activity.sourceRecordId}`)){
      targetState.activityLog.push(activity);
      seen.add(`${activity.source}:${activity.sourceRecordId}`)
    }
  }
}
function upsertActivityLogEntry(entry){
  const activity=normalizeActivityEntry(entry);
  if(!activity){
    return null
  }
  state.activityLog=Array.isArray(state.activityLog)?state.activityLog:[];
  const index=state.activityLog.findIndex(item=>item.id===activity.id||(item.source===activity.source&&item.sourceRecordId===activity.sourceRecordId));
  if(index>=0){
    state.activityLog[index]={...state.activityLog[index],...activity,updatedAt:new Date().toISOString()}
  }else{
    state.activityLog.push(activity)
  }
  state.activityLogVersion=ACTIVITY_LOG_VERSION;
  return activity
}
function sortedActivityLog(entries=state.activityLog||[]){
  return [...entries].filter(Boolean).sort((a,b)=>new Date(b.startedAt)-new Date(a.startedAt))
}
function activityLogForDate(dateKey=dayKey()){
  return sortedActivityLog().filter(entry=>(entry.date||dayKey(validDate(entry.startedAt)))===dateKey)
}
function weekStartDate(date=new Date()){
  const d=new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate()-(weekdayKeyForDate(d)-1));
  return d
}
function activityLogForWeek(date=new Date()){
  const start=weekStartDate(date),end=new Date(start);
  end.setDate(start.getDate()+7);
  return sortedActivityLog().filter(entry=>{
    const started=validDate(entry.startedAt);
    return started>=start&&started<end
  })
}
function activityMinutesForDate(dateKey=dayKey(),types=null){
  const allowed=types?new Set(types):null;
  return activityLogForDate(dateKey).filter(entry=>!allowed||allowed.has(entry.type)).reduce((sum,entry)=>sum+Number(entry.durationMinutes||0),0)
}
function activityMinutesForWeek(date=new Date(),types=null){
  const allowed=types?new Set(types):null;
  return activityLogForWeek(date).filter(entry=>!allowed||allowed.has(entry.type)).reduce((sum,entry)=>sum+Number(entry.durationMinutes||0),0)
}
function trackById(id){return state.tracks.find(t=>t.id===id)}
function ensureActiveTrack(){
  if(!Array.isArray(state.tracks)){state.tracks=[]}
  if(!state.weeklyProgress||typeof state.weeklyProgress!=="object"){state.weeklyProgress={}}
  for(const t of state.tracks){
    if(t?.id&&!Object.prototype.hasOwnProperty.call(state.weeklyProgress,t.id)){state.weeklyProgress[t.id]=0}
  }
  if(!state.tracks.length){
    state.activeTrack=null;
    return null
  }
  if(!trackById(state.activeTrack)){state.activeTrack=state.tracks[0].id}
  return trackById(state.activeTrack)
}
function track(){return ensureActiveTrack()}
function activePlaylist(){return state.playlists.find(p=>p.id===state.activePlaylist)||state.playlists[0]}
function sequenceOrderValue(item,index=0){
  const order=Number(item?.order);
  if(Number.isFinite(order)&&order>0){
    return order
  }
  const catalogOrder=Number(item?.catalogOrder);
  if(Number.isFinite(catalogOrder)&&catalogOrder>0){
    return catalogOrder
  }
  return index+1
}
function courseOrderValue(item){const order=sequenceOrderValue(item,Number.MAX_SAFE_INTEGER-1);return order>0?order:Number.MAX_SAFE_INTEGER}
function orderedCoursesForTrack(trackId){
  return state.items.filter(i=>i?.track===trackId&&i.kind==="course").sort((a,b)=>courseOrderValue(a)-courseOrderValue(b)||String(a.createdAt||"").localeCompare(String(b.createdAt||""))||String(a.title||"").localeCompare(String(b.title||""),"pt-BR"))
}
function orderedModules(course){
  return (Array.isArray(course?.modules)?course.modules:[]).map((module,index)=>({module,index})).sort((a,b)=>sequenceOrderValue(a.module,a.index)-sequenceOrderValue(b.module,b.index)).map(entry=>entry.module)
}
function orderedLessons(module){
  return (Array.isArray(module?.lessons)?module.lessons:[]).map((lesson,index)=>({lesson,index})).sort((a,b)=>sequenceOrderValue(a.lesson,a.index)-sequenceOrderValue(b.lesson,b.index)).map(entry=>entry.lesson)
}
function assignCourseOrder(course){
  if(course?.kind!=="course"){
    return course
  }
  const current=Number(course.order);
  if(Number.isFinite(current)&&current>0){
    return course
  }
  const catalogOrder=Number(course.catalogOrder);
  if(Number.isFinite(catalogOrder)&&catalogOrder>0){
    course.order=catalogOrder;
    return course
  }
  const maxOrder=state.items.filter(item=>item?.kind==="course"&&item.track===course.track&&item.id!==course.id).reduce((max,item)=>Math.max(max,Number(item.order)||Number(item.catalogOrder)||0),0);
  course.order=maxOrder+1;
  return course
}
function priorityCode(i){return i.important?(i.urgent?"IU":"I"):(i.urgent?"U":"N")}
function priorityLabel(i){return i.important?(i.urgent?"Agora":"Essencial"):(i.urgent?"Rápido":"Depois")}
function score(i){const p=priorityCode(i);let s=p==="IU"?100:p==="I"?70:p==="U"?55:20;if(i.status==="em_andamento"){s+=15}if((i.estimatedMinutes||999)<=30){s+=6}return s-itemProgress(i)/10}
function boundedProgress(value){return Math.max(0,Math.min(100,Number(value)||0))}
function lessonProgress(lesson){return boundedProgress(lesson?.done?100:lesson?.progress)}
function moduleProgress(module){
  if(module?.lessons?.length){
    const lessons=orderedLessons(module);
    return Math.round(lessons.reduce((sum,lesson)=>sum+lessonProgress(lesson),0)/lessons.length)
  }
  return boundedProgress(module?.done?100:module?.progress)
}
function moduleDone(module){return moduleProgress(module)>=100}
function childCourseProgress(child){
  if(child?.modules?.length){
    const modules=orderedModules(child);
    return Math.round(modules.reduce((sum,module)=>sum+moduleProgress(module),0)/modules.length)
  }
  return boundedProgress(child?.progress)
}
function specializationProgress(course){
  const children=[];
  for(const id of course?.childCourseIds||[]){
    const child=state.items.find(item=>item?.id===id);
    if(child){
      children.push(child)
    }
  }
  for(const child of course?.childCourses||[]){
    if(!children.some(item=>item.id===child.id)){
      children.push(child)
    }
  }
  if(children.length){
    return Math.round(children.reduce((sum,child)=>sum+childCourseProgress(child),0)/children.length)
  }
  return boundedProgress(course?.progress)
}
function itemProgress(i){
  if(i?.programType==="specialization"){
    return specializationProgress(i)
  }
  if(i?.kind==="course"&&i.modules?.length){
    const modules=orderedModules(i);
    return Math.round(modules.reduce((sum,module)=>sum+moduleProgress(module),0)/modules.length)
  }
  return boundedProgress(i?.progress)
}
function statusFromProgress(p){return p>=100?"concluido":p>0?"em_andamento":"nao_iniciado"}
function activeCourseForTrack(trackId){return orderedCoursesForTrack(trackId).find(course=>itemProgress(course)<100)||null}
function courseSequenceState(course){
  if(!course||course.kind!=="course"){
    return "active"
  }
  if(itemProgress(course)>=100){
    return "completed"
  }
  const active=activeCourseForTrack(course.track);
  return !active||active.id===course.id?"active":"locked"
}
function activeModuleForCourse(course){return orderedModules(course).find(module=>moduleProgress(module)<100)||null}
function moduleSequenceState(course,module){
  if(courseSequenceState(course)==="locked"){
    return "locked"
  }
  if(moduleProgress(module)>=100){
    return "completed"
  }
  const active=activeModuleForCourse(course);
  return !active||active.id===module?.id?"active":"locked"
}
function activeLessonForModule(module){return orderedLessons(module).find(lesson=>lessonProgress(lesson)<100)||null}
function lessonSequenceState(course,module,lesson){
  if(moduleSequenceState(course,module)==="locked"){
    return "locked"
  }
  if(lessonProgress(lesson)>=100){
    return "completed"
  }
  const active=activeLessonForModule(module);
  return !active||active.id===lesson?.id?"active":"locked"
}
function sequenceStatusLabel(stateName){
  return stateName==="completed"?"Concluído":stateName==="locked"?"Bloqueado":"Atual"
}
function activeRequirementTitle(id,scope){
  if(scope==="lesson"){
    const lesson=resourceByScope(id,"lesson"),module=lesson?resourceByScope(lesson.moduleId,"module"):null,active=module?activeLessonForModule(module):null;
    return active?.title||"a aula ativa"
  }
  if(scope==="module"){
    const module=resourceByScope(id,"module"),course=module?state.items.find(item=>item.id===module.courseId):null,active=course?activeModuleForCourse(course):null;
    return active?.title||"o módulo ativo"
  }
  const item=state.items.find(candidate=>candidate.id===id),active=item?.track?activeCourseForTrack(item.track):null;
  return active?.title||"o curso ativo"
}
function lockedFocusMessage(id,scope){
  const title=activeRequirementTitle(id,scope);
  if(scope==="lesson"){
    return `Esta aula ainda está bloqueada.\n\nConclua primeiro: ${title}\n\nEstudar mesmo assim?`
  }
  if(scope==="module"){
    return `Este módulo ainda está bloqueado.\n\nConclua primeiro: ${title}\n\nEstudar mesmo assim?`
  }
  return `Este curso ainda está bloqueado.\n\nConclua primeiro: ${title}\n\nEstudar mesmo assim?`
}
function focusLockState(id,scope){
  if(scope==="item"){
    const item=state.items.find(candidate=>candidate.id===id);
    if(item?.kind==="course"){
      return courseSequenceState(item)
    }
    return "active"
  }
  if(scope==="module"){
    const module=resourceByScope(id,"module"),course=module?state.items.find(item=>item.id===module.courseId):null;
    return module&&course?moduleSequenceState(course,module):"active"
  }
  if(scope==="lesson"){
    const lesson=resourceByScope(id,"lesson"),module=lesson?resourceByScope(lesson.moduleId,"module"):null,course=lesson?state.items.find(item=>item.id===lesson.courseId):null;
    return lesson&&module&&course?lessonSequenceState(course,module,lesson):"active"
  }
  return "active"
}
function getActiveLearningTarget(track){
  const trackId=typeof track==="string"?track:track?.id;
  const trackInfo=typeof track==="string"?trackById(track):track;
  const course=activeCourseForTrack(trackId);
  if(!course){
    return null
  }
  const module=activeModuleForCourse(course);
  const lesson=module?activeLessonForModule(module):null;
  const target=lesson||module||course;
  const type=lesson?"lesson":module?"module":"item";
  return {
    type,
    id:target.id,
    trackId,
    track:trackId,
    trackName:trackInfo?.name||"",
    trackSigil:trackInfo?.sigil||"",
    courseId:course.id,
    courseTitle:course.title,
    moduleId:module?.id||null,
    moduleTitle:module?.title||"",
    lessonId:lesson?.id||null,
    lessonTitle:lesson?.title||"",
    title:target.title,
    estimatedMinutes:target.estimatedMinutes||module?.estimatedMinutes||course.estimatedMinutes||30,
    prioritySource:course
  }
}
function getDailyYT(){const k=dayKey();if(!state.youtubeDaily[k])state.youtubeDaily[k]={minutes:0,count:0};return state.youtubeDaily[k]}

function clampNumber(value,min,max,fallback=min){
  const next=Number(value);
  if(!Number.isFinite(next)){
    return fallback
  }
  return Math.max(min,Math.min(max,next))
}
function parseClock(value,fallback=0){
  const match=String(value||"").match(/^(\d{1,2}):(\d{2})$/);
  if(!match){
    return fallback
  }
  const h=clampNumber(match[1],0,23,0),m=clampNumber(match[2],0,59,0);
  return h*60+m
}
function formatClock(total){
  const safe=clampNumber(total,0,24*60,0),h=Math.floor(safe/60),m=safe%60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`
}
function clockRangeLabel(start,end){
  return `${formatClock(start)}-${formatClock(end)}`
}
function weekdayKeyForDate(date=new Date()){
  const day=date.getDay();
  return day===0?7:day
}
function routineBlockWeekdays(block={}){
  const source=Array.isArray(block.weekdays)&&block.weekdays.length?block.weekdays:Array.isArray(block.days)&&block.days.length?block.days:[block.weekday];
  const days=source.map(day=>Number(day)).filter(day=>Number.isFinite(day)&&day>=1&&day<=7).map(day=>Math.round(day)).filter((day,index,arr)=>arr.indexOf(day)===index).sort((a,b)=>a-b);
  return days.length?days:[weekdayKeyForDate()]
}
function normalizePlanningPreferences(input={}){
  const start=parseClock(input.dayStart,parseClock(DEFAULT_PLANNING_PREFERENCES.dayStart));
  let end=parseClock(input.dayEnd,parseClock(DEFAULT_PLANNING_PREFERENCES.dayEnd));
  if(end<=start){
    end=24*60
  }
  return {
    dayStart:formatClock(start),
    dayEnd:formatClock(end),
    minimumSessionMinutes:clampNumber(input.minimumSessionMinutes,5,240,DEFAULT_PLANNING_PREFERENCES.minimumSessionMinutes),
    preferredSessionMinutes:clampNumber(input.preferredSessionMinutes,5,360,DEFAULT_PLANNING_PREFERENCES.preferredSessionMinutes),
    planningBufferMinutes:clampNumber(input.planningBufferMinutes,0,60,DEFAULT_PLANNING_PREFERENCES.planningBufferMinutes),
    useOnlyStudyBlocks:!!input.useOnlyStudyBlocks,
    allowHobbySuggestions:!!input.allowHobbySuggestions
  }
}
function normalizeKnowledgeExtractionSettings(input={}){
  const defaults=structuredClone(DEFAULT_KNOWLEDGE_EXTRACTION_SETTINGS);
  const provider=input.provider==="ai"?"ai":"local";
  const ai={...defaults.ai,...(input.ai||{})};
  return {
    provider,
    ai:{
      endpoint:String(ai.endpoint||"").trim(),
      model:String(ai.model||"").trim(),
      allowBrowserDevSecret:!!ai.allowBrowserDevSecret,
      lastStatus:ai.lastStatus==="configured"?"configured":"not_configured"
    }
  }
}
function safeDate(value){
  const date=new Date(value);
  return Number.isNaN(date.getTime())?null:date
}
function dateOnlyToLocalDate(value){
  const match=String(value||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!match){
    return null
  }
  return new Date(Number(match[1]),Number(match[2])-1,Number(match[3]),0,0,0,0)
}
function normalizeExternalDateValue(value){
  return dateOnlyToLocalDate(value)||safeDate(value)
}
function normalizeExternalCalendar(calendar={}){
  const id=String(calendar.id||"").trim();
  if(!id){
    return null
  }
  return {id,name:String(calendar.name||calendar.summary||id).trim()||id,primary:!!calendar.primary,selected:calendar.selected!==false,backgroundColor:String(calendar.backgroundColor||"").trim(),foregroundColor:String(calendar.foregroundColor||"").trim(),accessRole:String(calendar.accessRole||"").trim(),updatedAt:calendar.updatedAt||new Date().toISOString()}
}
function normalizeExternalCalendars(value={}){
  const base=structuredClone(DEFAULT_EXTERNAL_CALENDAR_STATE.google),input=value.google||value||{};
  const google={...base,...input};
  google.clientId=String(google.clientId||"").trim();
  google.accountEmail=String(google.accountEmail||"").trim();
  google.calendars=Array.isArray(google.calendars)?google.calendars.map(normalizeExternalCalendar).filter(Boolean):[];
  const knownIds=new Set(google.calendars.map(calendar=>calendar.id));
  google.selectedCalendarIds=Array.isArray(google.selectedCalendarIds)?google.selectedCalendarIds.map(String).filter(id=>id&&(!knownIds.size||knownIds.has(id))):google.calendars.filter(calendar=>calendar.selected!==false).map(calendar=>calendar.id);
  google.events=Array.isArray(google.events)?google.events.map(event=>normalizeExternalEvent(event,google)).filter(Boolean):[];
  google.privacy={...base.privacy,...(google.privacy||{}),storeEventTitles:!!google.privacy?.storeEventTitles};
  google.preferences={...base.preferences,...(google.preferences||{})};
  google.preferences.allDayBlocksPlanning=!!google.preferences.allDayBlocksPlanning;
  google.preferences.defaultTravelBeforeMinutes=clampNumber(google.preferences.defaultTravelBeforeMinutes,0,240,0);
  google.preferences.defaultTravelAfterMinutes=clampNumber(google.preferences.defaultTravelAfterMinutes,0,240,0);
  google.preferences.eventTravelOverrides=google.preferences.eventTravelOverrides&&typeof google.preferences.eventTravelOverrides==="object"?google.preferences.eventTravelOverrides:{};
  google.syncWindowDays=clampNumber(google.syncWindowDays,0,365,14);
  google.syncHorizonDays=clampNumber(google.syncHorizonDays,1,730,120);
  google.connected=!!google.connected;
  google.syncStatus=google.syncStatus||"idle";
  return {google}
}
function externalCalendarConfig(){
  state.externalCalendars=normalizeExternalCalendars(state.externalCalendars||DEFAULT_EXTERNAL_CALENDAR_STATE);
  return state.externalCalendars.google
}
function selectedExternalCalendarIds(config=externalCalendarConfig()){
  return new Set((config.selectedCalendarIds||[]).map(String))
}
function externalEventBusyValue(event={}){
  return event.busy!==false&&event.transparency!=="transparent"
}
function normalizeExternalEvent(event={},config={}){
  const provider=String(event.provider||config.provider||"google");
  const calendarId=String(event.calendarId||event.calendarID||"").trim();
  const sourceId=String(event.id||event.iCalUID||event.etag||"").trim();
  const rawStart=event.start?.dateTime||event.start?.date||event.start;
  const rawEnd=event.end?.dateTime||event.end?.date||event.end;
  const start=normalizeExternalDateValue(rawStart),end=normalizeExternalDateValue(rawEnd);
  const id=sourceId||`${provider}:${calendarId}:${rawStart||""}:${rawEnd||""}`;
  if(!id||!calendarId){
    return null
  }
  if(event.status==="cancelled"||event.deleted){
    return {id,externalId:id,provider,calendarId,status:"cancelled",deleted:true,updatedAt:event.updated||event.updatedAt||new Date().toISOString(),importedAt:event.importedAt||new Date().toISOString()}
  }
  if(!start||!end||end<=start){
    return null
  }
  const privacy={storeEventTitles:false,...(config.privacy||{})};
  const prefs={defaultTravelBeforeMinutes:0,defaultTravelAfterMinutes:0,eventTravelOverrides:{},...(config.preferences||{})};
  const override=prefs.eventTravelOverrides?.[id]||{};
  const allDay=!!(event.allDay||event.start?.date||String(rawStart||"").match(/^\d{4}-\d{2}-\d{2}$/));
  const title=privacy.storeEventTitles?String(event.title||event.summary||"Sem título").trim()||"Sem título":"Busy";
  return {
    id,
    externalId:id,
    provider,
    calendarId,
    title,
    description:privacy.storeEventTitles?String(event.description||"").trim():"",
    status:String(event.status||"confirmed").trim()||"confirmed",
    start:start.toISOString(),
    end:end.toISOString(),
    allDay,
    busy:externalEventBusyValue(event),
    transparency:event.transparency==="transparent"?"transparent":"opaque",
    location:privacy.storeEventTitles?String(event.location||"").trim():"",
    sourceUrl:String(event.sourceUrl||event.htmlLink||"").trim(),
    updatedAt:event.updated||event.updatedAt||new Date().toISOString(),
    importedAt:event.importedAt||new Date().toISOString(),
    travelBeforeMinutes:clampNumber(override.beforeMinutes??event.travelBeforeMinutes??prefs.defaultTravelBeforeMinutes,0,240,0),
    travelAfterMinutes:clampNumber(override.afterMinutes??event.travelAfterMinutes??prefs.defaultTravelAfterMinutes,0,240,0)
  }
}
function mergeExternalCalendars(existing=[],incoming=[]){
  const byId=new Map((existing||[]).map(calendar=>[calendar.id,calendar]));
  for(const calendar of incoming||[]){
    const normalized=normalizeExternalCalendar(calendar);
    if(normalized){
      byId.set(normalized.id,{...(byId.get(normalized.id)||{}),...normalized})
    }
  }
  return [...byId.values()].sort((a,b)=>(b.primary?1:0)-(a.primary?1:0)||a.name.localeCompare(b.name))
}
function mergeExternalCalendarEvents(previous=[],incoming=[],options={}){
  const rangeStart=options.rangeStart?new Date(options.rangeStart):null,rangeEnd=options.rangeEnd?new Date(options.rangeEnd):null,provider=options.provider||"google",config=options.config||{};
  const incomingIds=new Set(),deletedIds=new Set(),byKey=new Map();
  for(const event of previous||[]){
    const start=safeDate(event.start),end=safeDate(event.end);
    const inProvider=event.provider===provider;
    const inRange=rangeStart&&rangeEnd&&start&&end&&end>=rangeStart&&start<=rangeEnd;
    if(!inProvider||!inRange){
      byKey.set(`${event.provider}:${event.calendarId}:${event.id}`,event)
    }
  }
  for(const raw of incoming||[]){
    const event=normalizeExternalEvent(raw,config);
    if(!event){
      continue
    }
    const key=`${event.provider}:${event.calendarId}:${event.id}`;
    incomingIds.add(key);
    if(event.deleted){
      deletedIds.add(key);
      byKey.delete(key);
      continue
    }
    byKey.set(key,event)
  }
  for(const key of deletedIds){
    byKey.delete(key)
  }
  return [...byKey.values()].filter(event=>!event.deleted).sort((a,b)=>(a.start||"").localeCompare(b.start||"")||(a.title||"").localeCompare(b.title||""))
}
function externalCalendarSyncRange(now=new Date(),config=externalCalendarConfig()){
  const start=new Date(now),end=new Date(now);
  start.setDate(start.getDate()-Number(config.syncWindowDays||14));
  start.setHours(0,0,0,0);
  end.setDate(end.getDate()+Number(config.syncHorizonDays||120));
  end.setHours(23,59,59,999);
  return {start,end}
}
class ExternalCalendarProvider{
  constructor(config={}){
    this.config=config
  }
  async connect(){
    throw new Error("Provider connection is not implemented")
  }
  async getCalendars(){
    throw new Error("Provider calendars are not implemented")
  }
  async getEvents(){
    throw new Error("Provider events are not implemented")
  }
}
function googleCalendarTokenStorageKey(){
  return "arcana.googleCalendarToken"
}
function setGoogleCalendarToken(response={}){
  const expiresIn=Number(response.expires_in||0);
  const payload={accessToken:response.access_token||"",expiresAt:Date.now()+Math.max(0,expiresIn-60)*1000,scope:response.scope||GOOGLE_CALENDAR_SCOPE};
  calendarRuntime.googleAccessToken=payload.accessToken;
  calendarRuntime.googleTokenExpiresAt=payload.expiresAt;
  if(payload.accessToken){
    sessionStorage.setItem(googleCalendarTokenStorageKey(),JSON.stringify(payload))
  }
  return payload.accessToken
}
function getGoogleCalendarToken(){
  if(calendarRuntime.googleAccessToken&&calendarRuntime.googleTokenExpiresAt>Date.now()){
    return calendarRuntime.googleAccessToken
  }
  try{
    const payload=JSON.parse(sessionStorage.getItem(googleCalendarTokenStorageKey())||"{}");
    if(payload.accessToken&&payload.expiresAt>Date.now()){
      calendarRuntime.googleAccessToken=payload.accessToken;
      calendarRuntime.googleTokenExpiresAt=payload.expiresAt;
      return payload.accessToken
    }
  }catch(e){}
  return ""
}
function clearGoogleCalendarToken(){
  calendarRuntime.googleAccessToken=null;
  calendarRuntime.googleTokenExpiresAt=0;
  try{sessionStorage.removeItem(googleCalendarTokenStorageKey())}catch(e){}
}
function loadGoogleIdentityScript(){
  if(window.google?.accounts?.oauth2){
    return Promise.resolve()
  }
  if(calendarRuntime.identityScript){
    return calendarRuntime.identityScript
  }
  calendarRuntime.identityScript=new Promise((resolve,reject)=>{
    const existing=document.querySelector(`script[src="${GOOGLE_IDENTITY_SCRIPT}"]`);
    if(existing){
      existing.addEventListener("load",resolve,{once:true});
      existing.addEventListener("error",()=>reject(new Error("Google Identity Services indisponível.")),{once:true});
      return
    }
    const script=document.createElement("script");
    script.src=GOOGLE_IDENTITY_SCRIPT;
    script.async=true;
    script.defer=true;
    script.onload=resolve;
    script.onerror=()=>reject(new Error("Google Identity Services indisponível."));
    document.head.appendChild(script)
  });
  return calendarRuntime.identityScript
}
async function requestGoogleCalendarAccessToken(config=externalCalendarConfig()){
  if(!config.clientId){
    throw new Error("Informe o Client ID OAuth do Google Calendar.")
  }
  await loadGoogleIdentityScript();
  return new Promise((resolve,reject)=>{
    calendarRuntime.tokenClient=window.google.accounts.oauth2.initTokenClient({
      client_id:config.clientId,
      scope:GOOGLE_CALENDAR_SCOPE,
      callback:response=>{
        if(response.error){
          reject(new Error(response.error_description||response.error));
          return
        }
        resolve(setGoogleCalendarToken(response))
      }
    });
    calendarRuntime.tokenClient.requestAccessToken({prompt:getGoogleCalendarToken()?"":"consent"})
  })
}
class GoogleCalendarProvider extends ExternalCalendarProvider{
  async connect(){
    const token=await requestGoogleCalendarAccessToken(this.config);
    this.config.connected=!!token;
    this.config.lastSyncError=null;
    return token
  }
  async fetchJson(path,params={}){
    const token=getGoogleCalendarToken()||await requestGoogleCalendarAccessToken(this.config);
    const url=new URL(`${GOOGLE_CALENDAR_API_BASE}${path}`);
    Object.entries(params).forEach(([key,value])=>{if(value!==undefined&&value!==null&&value!==""){url.searchParams.set(key,value)}});
    const response=await fetch(url.toString(),{headers:{Authorization:`Bearer ${token}`}});
    if(!response.ok){
      throw new Error(`Google Calendar ${response.status}`)
    }
    return response.json()
  }
  async fetchPages(path,params={}){
    const items=[];
    let pageToken="";
    for(let page=0;page<20;page++){
      const data=await this.fetchJson(path,{...params,pageToken});
      items.push(...(data.items||[]));
      pageToken=data.nextPageToken||"";
      if(!pageToken){
        return items
      }
    }
    throw new Error("Google Calendar retornou muitas páginas.")
  }
  async getCalendars(){
    const items=await this.fetchPages("/users/me/calendarList",{minAccessRole:"reader"});
    return items.map(item=>normalizeExternalCalendar({id:item.id,name:item.summary,primary:item.primary,backgroundColor:item.backgroundColor,foregroundColor:item.foregroundColor,accessRole:item.accessRole}))
  }
  async getEvents(calendarIds=[],range={}){
    const events=[];
    for(const calendarId of calendarIds){
      const items=await this.fetchPages(`/calendars/${encodeURIComponent(calendarId)}/events`,{singleEvents:"true",orderBy:"startTime",showDeleted:"true",timeMin:range.start?.toISOString(),timeMax:range.end?.toISOString(),maxResults:"2500"});
      events.push(...items.map(item=>({...item,calendarId,provider:"google",title:item.summary,sourceUrl:item.htmlLink})))
    }
    return events
  }
}
function calendarSyncStatusText(config=externalCalendarConfig()){
  if(config.syncStatus==="syncing"){
    return "Sincronizando..."
  }
  if(config.lastSyncError){
    return `Erro: ${config.lastSyncError}${config.lastSyncAt?` · cache de ${new Date(config.lastSyncAt).toLocaleString("pt-BR")}`:""}`
  }
  if(config.connected&&config.lastSyncAt){
    return `Conectado · última sincronização ${new Date(config.lastSyncAt).toLocaleString("pt-BR")}`
  }
  if(config.connected){
    return "Conectado · aguardando sincronização"
  }
  return "Não conectado"
}
async function syncExternalCalendars(options={}){
  const config=externalCalendarConfig(),now=Date.now(),lastAttempt=config.lastAttemptAt?new Date(config.lastAttemptAt).getTime():0;
  if(!options.force&&lastAttempt&&now-lastAttempt<EXTERNAL_CALENDAR_SYNC_THROTTLE_MS){
    return {throttled:true}
  }
  if(externalCalendarSyncing){
    return {throttled:true}
  }
  if(!config.connected&&!options.provider){
    return {skipped:true}
  }
  externalCalendarSyncing=true;
  config.syncStatus="syncing";
  config.lastAttemptAt=new Date().toISOString();
  renderExternalCalendarSettings();
  try{
    const provider=options.provider||new GoogleCalendarProvider(config);
    const calendars=await provider.getCalendars();
    config.calendars=mergeExternalCalendars(config.calendars,calendars);
    if(!config.selectedCalendarIds.length){
      config.selectedCalendarIds=config.calendars.filter(calendar=>calendar.selected!==false).map(calendar=>calendar.id)
    }
    const selected=[...selectedExternalCalendarIds(config)];
    const range=externalCalendarSyncRange(new Date(),config);
    const events=await provider.getEvents(selected,range);
    config.events=mergeExternalCalendarEvents(config.events,events,{rangeStart:range.start,rangeEnd:range.end,provider:"google",config});
    config.connected=true;
    config.lastSyncAt=new Date().toISOString();
    config.lastSyncError=null;
    config.syncStatus="synced";
    state.dailyPlan.date=null;
    await save(false,"calendar-sync");
    renderAll();
    return {ok:true,events:config.events.length}
  }catch(err){
    config.lastSyncError=err.message||"Falha ao sincronizar calendário";
    config.syncStatus="error";
    await save(false,"calendar-sync-error");
    renderAll();
    return {error:config.lastSyncError}
  }finally{
    externalCalendarSyncing=false
  }
}
function applyCalendarSettingsFromForm(){
  const form=$("calendarIntegrationForm");
  if(!form){
    return externalCalendarConfig()
  }
  const config=externalCalendarConfig(),fields=form.elements;
  config.clientId=String(fields.clientId?.value||"").trim();
  config.privacy.storeEventTitles=!!fields.storeEventTitles?.checked;
  config.preferences.allDayBlocksPlanning=!!fields.allDayBlocksPlanning?.checked;
  config.preferences.defaultTravelBeforeMinutes=clampNumber(fields.defaultTravelBeforeMinutes?.value,0,240,0);
  config.preferences.defaultTravelAfterMinutes=clampNumber(fields.defaultTravelAfterMinutes?.value,0,240,0);
  return config
}
async function connectGoogleCalendar(){
  const config=applyCalendarSettingsFromForm(),provider=new GoogleCalendarProvider(config);
  try{
    await provider.connect();
    await syncExternalCalendars({force:true,provider});
    toast("Google Calendar conectado.","ok")
  }catch(err){
    config.lastSyncError=err.message||"Não consegui conectar ao Google Calendar.";
    config.syncStatus="error";
    await save(false,"calendar-connect-error");
    renderAll();
    toast(config.lastSyncError,"error")
  }
}
async function disconnectGoogleCalendar(){
  const config=externalCalendarConfig();
  const keepConfig=config.calendars.length&&confirm("Manter calendários selecionados e preferências locais para reconectar depois?");
  const kept={clientId:config.clientId,calendars:config.calendars,selectedCalendarIds:config.selectedCalendarIds,privacy:config.privacy,preferences:config.preferences};
  clearGoogleCalendarToken();
  config.connected=false;
  config.accountEmail="";
  config.clientId=keepConfig?kept.clientId:"";
  config.calendars=keepConfig?kept.calendars:[];
  config.selectedCalendarIds=keepConfig?kept.selectedCalendarIds:[];
  config.privacy=kept.privacy;
  config.preferences=kept.preferences;
  config.events=[];
  config.lastSyncError=null;
  config.syncStatus="idle";
  state.dailyPlan.date=null;
  await save(false,"calendar-disconnect");
  renderAll();
  toast("Calendário desconectado.","ok")
}
async function saveCalendarSettings(event){
  event.preventDefault();
  applyCalendarSettingsFromForm();
  state.dailyPlan.date=null;
  await save(false,"calendar-settings");
  renderAll();
  toast("Preferências de calendário salvas.","ok")
}
async function saveCalendarSelection(){
  const config=externalCalendarConfig(),list=$("googleCalendarList");
  config.selectedCalendarIds=[...(list?.querySelectorAll("input[data-calendar-id]:checked")||[])].map(input=>input.dataset.calendarId);
  state.dailyPlan.date=null;
  await save(false,"calendar-selection");
  renderAll()
}
function renderExternalCalendarSettings(){
  const form=$("calendarIntegrationForm");
  if(!form){
    return
  }
  const config=externalCalendarConfig(),fields=form.elements;
  fields.clientId.value=config.clientId||"";
  fields.storeEventTitles.checked=!!config.privacy.storeEventTitles;
  fields.allDayBlocksPlanning.checked=!!config.preferences.allDayBlocksPlanning;
  fields.defaultTravelBeforeMinutes.value=config.preferences.defaultTravelBeforeMinutes||0;
  fields.defaultTravelAfterMinutes.value=config.preferences.defaultTravelAfterMinutes||0;
  if($("googleCalendarStatus")){
    const selected=config.selectedCalendarIds?.length||0,total=config.calendars?.length||0,events=config.events?.length||0;
    $("googleCalendarStatus").innerHTML=`<p class="hint">${esc(calendarSyncStatusText(config))}</p><p class="hint">${selected}/${total} agendas selecionadas · ${events} eventos em cache local.</p>`
  }
  if($("googleCalendarList")){
    const selected=selectedExternalCalendarIds(config);
    $("googleCalendarList").innerHTML=config.calendars.length?config.calendars.map(calendar=>`<label class="check calendar-picker-row"><input type="checkbox" data-calendar-id="${esc(calendar.id)}" ${selected.has(calendar.id)?"checked":""}> <span>${esc(calendar.name)}</span></label>`).join(""):`<div class="hint">Conecte e sincronize para escolher agendas.</div>`
  }
  if($("googleCalendarConnectBtn")){
    $("googleCalendarConnectBtn").disabled=!config.clientId&&!fields.clientId.value.trim()
  }
  if($("googleCalendarSyncBtn")){
    $("googleCalendarSyncBtn").disabled=!config.connected||externalCalendarSyncing
  }
  if($("googleCalendarDisconnectBtn")){
    $("googleCalendarDisconnectBtn").disabled=!config.connected
  }
}
function normalizeRoutineBlock(block={}){
  const title=String(block.title||"").trim();
  const start=parseClock(block.startTime,NaN),end=parseClock(block.endTime,NaN);
  if(!title||!Number.isFinite(start)||!Number.isFinite(end)||end<=start){
    return null
  }
  const weekdays=routineBlockWeekdays(block);
  const weekday=weekdays[0]||clampNumber(block.weekday,1,7,weekdayKeyForDate());
  const category=ROUTINE_CATEGORIES[block.category]?block.category:"other";
  return {
    id:block.id||crypto.randomUUID(),
    title,
    category,
    weekday,
    weekdays,
    startTime:formatClock(start),
    endTime:formatClock(end),
    location:String(block.location||"").trim(),
    address:String(block.address||"").trim(),
    travelBeforeMinutes:clampNumber(block.travelBeforeMinutes,0,240,0),
    travelAfterMinutes:clampNumber(block.travelAfterMinutes,0,240,0),
    fixed:block.fixed!==false,
    recurrence:block.recurrence||"weekly",
    notes:String(block.notes||"").trim(),
    colorKey:String(block.colorKey||category).trim()||category,
    active:block.active!==false,
    createdAt:block.createdAt||new Date().toISOString(),
    updatedAt:block.updatedAt||null
  }
}
function normalizeRoutineException(ex={}){
  const date=String(ex.date||"").trim();
  if(!date){
    return null
  }
  return {id:ex.id||crypto.randomUUID(),routineId:ex.routineId||"",date,type:ex.type==="add"?"add":"cancel",routine:ex.routine?normalizeRoutineBlock(ex.routine):null,createdAt:ex.createdAt||new Date().toISOString()}
}
function normalizeHobby(hobby={}){
  const name=String(hobby.name||"").trim();
  if(!name){
    return null
  }
  return {
    id:hobby.id||crypto.randomUUID(),
    name,
    icon:String(hobby.icon||"✧").trim()||"✧",
    description:String(hobby.description||"").trim(),
    preferredMinutes:clampNumber(hobby.preferredMinutes,5,360,30),
    minimumMinutes:clampNumber(hobby.minimumMinutes,5,240,10),
    frequencyPerWeek:clampNumber(hobby.frequencyPerWeek,0,14,1),
    preferredDays:Array.isArray(hobby.preferredDays)?hobby.preferredDays.map(day=>clampNumber(day,1,7,1)).filter((day,index,arr)=>arr.indexOf(day)===index):[],
    preferredTimes:Array.isArray(hobby.preferredTimes)?hobby.preferredTimes.map(String):[],
    lastDoneAt:hobby.lastDoneAt||null,
    sessions:Array.isArray(hobby.sessions)?hobby.sessions:[],
    active:hobby.active!==false,
    location:String(hobby.location||"").trim(),
    notes:String(hobby.notes||"").trim(),
    tags:Array.isArray(hobby.tags)?hobby.tags.map(tag=>String(tag).trim()).filter(Boolean):[]
  }
}
function routineExceptionFor(block,date){
  const key=dayKey(date);
  return (state.routineExceptions||[]).find(ex=>ex.date===key&&ex.routineId===block.id&&ex.type==="cancel")||null
}
function activeRoutineBlocksForDate(date=new Date()){
  const weekday=weekdayKeyForDate(date),key=dayKey(date);
  const weekly=(state.routineBlocks||[]).filter(block=>block.active!==false&&routineBlockWeekdays(block).includes(weekday)&&!routineExceptionFor(block,date));
  const added=(state.routineExceptions||[]).filter(ex=>ex.date===key&&ex.type==="add"&&ex.routine).map(ex=>({...ex.routine,id:ex.id,exceptionId:ex.id}));
  return [...weekly,...added].sort((a,b)=>parseClock(a.startTime)-parseClock(b.startTime)||parseClock(a.endTime)-parseClock(b.endTime))
}
function interval(start,end,kind="busy",source=null){
  return {start:Math.max(0,start),end:Math.min(24*60,end),kind,source}
}
function mergeIntervals(intervals=[]){
  const sorted=intervals.filter(item=>item.end>item.start).sort((a,b)=>a.start-b.start||a.end-b.end),merged=[];
  for(const item of sorted){
    const last=merged[merged.length-1];
    if(last&&item.start<=last.end){
      last.end=Math.max(last.end,item.end);
      last.sources=[...(last.sources||[last.source]).filter(Boolean),item.source].filter(Boolean)
    }else{
      merged.push({...item,sources:item.source?[item.source]:[]})
    }
  }
  return merged
}
function subtractIntervals(openIntervals=[],busyIntervals=[]){
  let available=openIntervals.map(item=>({...item}));
  for(const busy of mergeIntervals(busyIntervals)){
    const next=[];
    for(const open of available){
      if(busy.end<=open.start||busy.start>=open.end){
        next.push(open);
        continue
      }
      if(busy.start>open.start){
        next.push({...open,end:busy.start})
      }
      if(busy.end<open.end){
        next.push({...open,start:busy.end})
      }
    }
    available=next
  }
  return available.filter(item=>item.end>item.start)
}
function routineBusyIntervalsForDate(date=new Date()){
  const blocks=activeRoutineBlocksForDate(date),busy=[],study=[];
  for(const block of blocks){
    const start=parseClock(block.startTime),end=parseClock(block.endTime);
    if(block.travelBeforeMinutes>0){
      busy.push(interval(start-block.travelBeforeMinutes,start,"commute-before",block))
    }
    if(block.category==="study"){
      study.push(interval(start,end,"study",block))
    }else{
      busy.push(interval(start,end,"routine",block))
    }
    if(block.travelAfterMinutes>0){
      busy.push(interval(end,end+block.travelAfterMinutes,"commute-after",block))
    }
  }
  return {busy:mergeIntervals(busy),study:mergeIntervals(study),blocks}
}
function localDayRange(date=new Date()){
  const start=new Date(date),end=new Date(date);
  start.setHours(0,0,0,0);
  end.setHours(23,59,59,999);
  return {start,end}
}
function externalEventsForRange(start,end){
  const config=externalCalendarConfig(),selected=selectedExternalCalendarIds(config);
  return (config.events||[]).filter(event=>{
    const eventStart=safeDate(event.start),eventEnd=safeDate(event.end);
    return selected.has(event.calendarId)&&externalEventBusyValue(event)&&eventStart&&eventEnd&&eventEnd>start&&eventStart<end
  })
}
function externalCommitmentsForDate(date=new Date()){
  const range=localDayRange(date);
  return externalEventsForRange(range.start,range.end)
}
function eventMinuteRangeForDate(event,date=new Date()){
  const range=localDayRange(date),start=safeDate(event.start),end=safeDate(event.end);
  if(!start||!end){
    return null
  }
  const clippedStart=Math.max(range.start.getTime(),start.getTime()),clippedEnd=Math.min(range.end.getTime()+1,end.getTime());
  if(clippedEnd<=clippedStart){
    return null
  }
  const startMinute=Math.floor((clippedStart-range.start.getTime())/60000),endMinute=Math.ceil((clippedEnd-range.start.getTime())/60000);
  return {start:Math.max(0,startMinute),end:Math.min(24*60,endMinute)}
}
function externalEventBusyIntervalsForDate(date=new Date()){
  const config=externalCalendarConfig();
  if(!config.connected){
    return []
  }
  return externalCommitmentsForDate(date).map(event=>{
    if(event.allDay&&!config.preferences.allDayBlocksPlanning){
      return null
    }
    const range=eventMinuteRangeForDate(event,date);
    if(!range){
      return null
    }
    return interval(range.start-Number(event.travelBeforeMinutes||0),range.end+Number(event.travelAfterMinutes||0),event.allDay?"external-all-day":"external",event)
  }).filter(Boolean)
}
function getBusyIntervals(date=new Date()){
  const routine=routineBusyIntervalsForDate(date),external=externalEventBusyIntervalsForDate(date);
  return {busy:mergeIntervals([...routine.busy,...external]),study:routine.study,blocks:routine.blocks,external}
}
function getFreeWindows(date=new Date(),options={}){
  const prefs=normalizePlanningPreferences({...state.planningPreferences,...(options.preferences||{})});
  const dayStart=parseClock(prefs.dayStart),dayEnd=parseClock(prefs.dayEnd,24*60),min=Number(options.minimumSessionMinutes||prefs.minimumSessionMinutes)||15;
  const now=options.now||new Date(),today=dayKey(date)===dayKey(now);
  const currentMinute=today?now.getHours()*60+now.getMinutes():dayStart;
  const floor=Math.max(dayStart,currentMinute);
  const busy=getBusyIntervals(date);
  const base=prefs.useOnlyStudyBlocks&&busy.study.length?busy.study.map(item=>interval(Math.max(item.start,floor),Math.min(item.end,dayEnd),"study-window",item.source)):[interval(floor,dayEnd,"free",null)];
  const windows=subtractIntervals(base,busy.busy).filter(item=>item.end-item.start>=min);
  return windows.map((item,index)=>({id:`${dayKey(date)}-${index}`,start:item.start,end:item.end,startTime:formatClock(item.start),endTime:formatClock(item.end),minutes:item.end-item.start,kind:item.kind||"free"}))
}
function getActivityDuration(activity,window=null){
  const prefs=state.planningPreferences||DEFAULT_PLANNING_PREFERENCES;
  if(activity?.type==="review"){
    return Math.min(Number(window?.minutes||20),20)
  }
  if(activity?.type==="youtube"){
    return Math.max(1,Number(activity.requiredDuration||activity.estimatedMinutes||activity.minutes||15))
  }
  if(activity?.type==="hobby"){
    return Math.min(Number(activity.preferredMinutes||30),Number(window?.minutes||activity.preferredMinutes||30))
  }
  return Math.min(Number(activity.estimatedMinutes||prefs.preferredSessionMinutes||30),Number(prefs.preferredSessionMinutes||30))
}
function activityFitsWindow(activity,window){
  const required=activity?.type==="youtube"?getActivityDuration(activity,window):Number(activity.minimumMinutes||getActivityDuration(activity,window));
  return !!window&&window.minutes>=required
}
function hobbySessionsThisWeek(hobby,date=new Date()){
  const d=new Date(date),start=new Date(d);
  start.setDate(d.getDate()-(weekdayKeyForDate(d)-1));
  start.setHours(0,0,0,0);
  const logged=(state.activityLog||[]).filter(entry=>(entry.type==="hobby"||entry.type==="journaling")&&entry.hobbyId===hobby.id&&validDate(entry.startedAt)>=start);
  if(logged.length){
    return logged.length
  }
  return (hobby.sessions||[]).filter(session=>session.date&&new Date(session.date)>=start).length
}
function buildPlanningCandidates(date=new Date(),minutes=60){
  const prefs=state.planningPreferences||DEFAULT_PLANNING_PREFERENCES,candidates=[],scheduledTracks=new Set();
  const due=vaultNotes.filter(n=>n.reviewAt&&n.reviewAt<=dayKey(date)&&n.status!=="archived").length;
  if(due&&minutes>=10){
    candidates.push({type:"review",id:"review",minimumMinutes:10,title:`Revisar ${due} nota${due>1?"s":""}`,estimatedMinutes:20,minutes:20})
  }
  const targets=state.tracks.map(track=>getActiveLearningTarget(track)).filter(Boolean).sort((a,b)=>score(b.prioritySource)-score(a.prioritySource));
  for(const target of targets){
    if(target.trackId&&scheduledTracks.has(target.trackId)){
      continue
    }
    if(target.trackId){
      scheduledTracks.add(target.trackId)
    }
    candidates.push({...target,minimumMinutes:prefs.minimumSessionMinutes,estimatedMinutes:target.estimatedMinutes||prefs.preferredSessionMinutes,prioritySource:undefined})
  }
  const loose=state.items.filter(i=>itemProgress(i)<100&&i.kind!=="course"&&(!trackById(i.track)||!activeCourseForTrack(i.track))).sort((a,b)=>score(b)-score(a));
  for(const i of loose){
    if(i.track&&scheduledTracks.has(i.track)){
      continue
    }
    if(i.track){
      scheduledTracks.add(i.track)
    }
    candidates.push({type:"item",id:i.id,trackId:i.track||null,track:i.track||null,trackName:trackById(i.track)?.name||"",trackSigil:trackById(i.track)?.sigil||"",courseId:null,courseTitle:"",moduleId:null,moduleTitle:"",lessonId:null,lessonTitle:"",title:i.title,estimatedMinutes:i.estimatedMinutes||prefs.preferredSessionMinutes,minimumMinutes:prefs.minimumSessionMinutes})
  }
  const video=todaysYoutube()[0];
  if(video){
    const required=Math.max(1,Number(video.estimatedMinutes||video.minutes||15));
    candidates.push({type:"youtube",id:video.id,title:video.title,requiredDuration:required,estimatedMinutes:required,minimumMinutes:required})
  }
  if(prefs.allowHobbySuggestions){
    const weekday=weekdayKeyForDate(date);
    for(const hobby of (state.hobbies||[]).filter(item=>item.active!==false)){
      if(hobby.frequencyPerWeek<=0||hobbySessionsThisWeek(hobby,date)>=hobby.frequencyPerWeek){
        continue
      }
      const dayBoost=!hobby.preferredDays.length||hobby.preferredDays.includes(weekday);
      candidates.push({type:"hobby",id:hobby.id,title:hobby.name,icon:hobby.icon,preferredMinutes:hobby.preferredMinutes,minimumMinutes:hobby.minimumMinutes,estimatedMinutes:hobby.preferredMinutes,trackName:"Hobbies",dayBoost})
    }
  }
  const rank={review:0,lesson:1,module:1,item:1,youtube:2,hobby:3};
  return candidates.sort((a,b)=>(rank[a.type]??4)-(rank[b.type]??4)||(b.dayBoost?1:0)-(a.dayBoost?1:0))
}
function planActivitiesIntoWindows(date=new Date(),options={}){
  const prefs=normalizePlanningPreferences({...state.planningPreferences,...(options.preferences||{})});
  const targetMinutes=Number(options.minutes||state.dailyPlan?.minutes||60),windows=getFreeWindows(date,{...options,preferences:prefs}),slots=windows.map(window=>({...window,cursor:window.start})),items=[],notices=[];
  let planned=0;
  const candidates=buildPlanningCandidates(date,targetMinutes);
  for(const candidate of candidates){
    if(planned>=targetMinutes&&candidate.type!=="youtube"){
      continue
    }
    let placed=false;
    for(const slot of slots){
      const remaining=slot.end-slot.cursor;
      const window={...slot,start:slot.cursor,startTime:formatClock(slot.cursor),minutes:remaining};
      const minimum=candidate.type==="youtube"?getActivityDuration(candidate,window):Number(candidate.minimumMinutes||prefs.minimumSessionMinutes);
      if(remaining<minimum){
        continue
      }
      const duration=candidate.type==="youtube"?getActivityDuration(candidate,window):Math.min(getActivityDuration(candidate,window),remaining,Math.max(minimum,targetMinutes-planned));
      if(duration<minimum){
        continue
      }
      items.push({...candidate,minutes:duration,startMinute:slot.cursor,endMinute:slot.cursor+duration,startTime:formatClock(slot.cursor),endTime:formatClock(slot.cursor+duration),prioritySource:undefined});
      slot.cursor+=duration+prefs.planningBufferMinutes;
      planned+=duration;
      placed=true;
      break
    }
    if(candidate.type==="youtube"&&!placed){
      notices.push(`O próximo vídeo da playlist tem ${fmtMin(candidate.requiredDuration)} e não cabe nas janelas livres de hoje. A ordem da playlist foi preservada.`)
    }
  }
  return {items,freeWindows:windows,availableMinutes:windows.reduce((sum,window)=>sum+window.minutes,0),notices}
}
function freeTimeSnapshot(date=new Date()){
  const windows=getFreeWindows(date),available=windows.reduce((sum,window)=>sum+window.minutes,0),externalCommitments=externalCommitmentsForDate(date);
  return {windows,available,externalCommitments}
}

function runtimeEnvironment(){return DATA_SAFETY?.detectEnvironment?DATA_SAFETY.detectEnvironment(location):{production:false,local:["localhost","127.0.0.1",""].includes(location.hostname),label:"Unknown",origin:location.origin||"local",path:location.pathname||"/"}}
function isLocalBackend(){return runtimeEnvironment().local}
function appBaseUrl(){
  const fallback=`${location.origin||""}${location.pathname||"/"}`;
  return document.baseURI||location.href||fallback
}
function obsidianModeLabel(value){
  if(value==="after_session"){
    return "após sessão"
  }
  return "manual"
}
function obsidianEnvironmentLabel(){
  if(state.obsidian?.available){
    return state.obsidian.connected?`Bridge local conectado: ${state.obsidian.vaultName||"vault sem nome"}`:"Bridge local indisponível: nenhum vault conectado"
  }
  return "Bridge local indisponível"
}
function canonicalYoutubePlaylistUrl(playlistId){
  const url=new URL("https://www.youtube.com/playlist");
  url.searchParams.set("list",String(playlistId||"").trim());
  return url.toString()
}
function youtubePlaylistSearchParams(raw){
  const url=new URL("https://www.youtube.com/playlist");
  url.search=String(raw||"").trim().replace(/^\?/,"");
  return url.searchParams
}
function normalizeYoutubePlaylistReference(raw){
  const value=String(raw||"").trim();
  if(!value){
    throw new Error("URL não informada.")
  }
  let playlistId="";
  const looksLikeUrl=value.includes("://")||/^(?:www\.|m\.)?youtube\.com\//i.test(value);
  if(looksLikeUrl){
    const candidate=value.includes("://")?value:`https://${value}`;
    let url;
    try{
      url=new URL(candidate)
    }catch{
      throw new Error("Use uma URL de playlist do YouTube.")
    }
    const host=url.hostname.toLowerCase();
    if(!["youtube.com","www.youtube.com","m.youtube.com"].includes(host)){
      throw new Error("Use uma URL de playlist do YouTube.")
    }
    playlistId=(url.searchParams.get("list")||"").trim()
    if(!playlistId){
      throw new Error("A URL precisa conter o parâmetro list da playlist.")
    }
  }else{
    const directParams=youtubePlaylistSearchParams(value);
    playlistId=(directParams.get("list")||"").trim();
    if(!playlistId){
      const wrappedParams=youtubePlaylistSearchParams(`list=${value}`);
      playlistId=(wrappedParams.get("list")||"").trim()
    }
  }
  if(!playlistId){
    throw new Error("ID de playlist inválido.")
  }
  if(!YOUTUBE_PLAYLIST_ID_RE.test(playlistId)){
    throw new Error("ID de playlist inválido.")
  }
  return {youtubePlaylistId:playlistId,url:canonicalYoutubePlaylistUrl(playlistId)}
}
function normalizeYoutubePlaylistInput(raw){
  return normalizeYoutubePlaylistReference(raw)
}
function youtubePlaylistIdFromUrl(raw){
  if(!raw){
    return ""
  }
  try{
    return normalizeYoutubePlaylistReference(raw).youtubePlaylistId
  }catch{
    return ""
  }
}
function normalizePlaylistRecord(playlist,index=0){
  const input=playlist&&typeof playlist==="object"?playlist:{};
  const now=new Date().toISOString();
  const createdAt=input.createdAt||input.updatedAt||input.lastSyncAt||input.catalogGeneratedAt||now;
  const updatedAt=input.updatedAt||input.createdAt||input.lastSyncAt||input.catalogGeneratedAt||createdAt;
  const fallbackId=String(input.id||`playlist-${index+1}`).trim()||`playlist-${index+1}`;
  const fallbackName=String(input.name||`Playlist ${index+1}`).trim()||`Playlist ${index+1}`;
  let youtubePlaylistId=String(input.youtubePlaylistId||"").trim();
  let url=String(input.url||"").trim();
  let normalizedPlaylist=null;
  if(url){
    try{
      normalizedPlaylist=normalizeYoutubePlaylistReference(url)
    }catch{}
  }
  if(!normalizedPlaylist&&youtubePlaylistId){
    try{
      normalizedPlaylist=normalizeYoutubePlaylistReference(youtubePlaylistId)
    }catch{}
  }
  if(normalizedPlaylist){
    youtubePlaylistId=normalizedPlaylist.youtubePlaylistId;
    url=normalizedPlaylist.url
  }else{
    if(!youtubePlaylistId&&url){
      youtubePlaylistId=youtubePlaylistIdFromUrl(url)
    }
    if(!url&&youtubePlaylistId){
      url=canonicalYoutubePlaylistUrl(youtubePlaylistId)
    }
  }
  return {
    ...input,
    id:fallbackId,
    youtubePlaylistId,
    name:fallbackName,
    url,
    enabled:input.enabled!==false,
    createdAt,
    updatedAt,
    lastSyncAt:input.lastSyncAt||null,
    lastSyncError:input.lastSyncError||null,
    catalogGeneratedAt:input.catalogGeneratedAt||null,
    catalogTitle:input.catalogTitle||null
  }
}
function playlistCatalogId(playlist){
  if(!playlist){
    return ""
  }
  return youtubePlaylistIdFromUrl(playlist.youtubePlaylistId)||youtubePlaylistIdFromUrl(playlist.url)||""
}
function publishedCatalogUrl(){
  return new URL("./data/youtube/catalog.json",appBaseUrl()).toString()
}
function publishedCatalogRequestUrl(force=false){
  const url=new URL(publishedCatalogUrl());
  if(force){
    url.searchParams.set("_arcana",Date.now().toString())
  }
  return url.toString()
}
function playlistPendingCount(playlist){
  return state.youtubeQueue.filter(v=>v.playlistId===playlist?.id&&v.activeInCatalog!==false&&itemProgress(v)<100).length
}
function playlistArchivedCount(playlist){
  return state.youtubeQueue.filter(v=>v.playlistId===playlist?.id&&v.activeInCatalog===false).length
}
function formatCatalogStamp(value){
  if(!value){
    return ""
  }
  const date=new Date(value);
  if(Number.isNaN(date.getTime())){
    return ""
  }
  return date.toLocaleString("pt-BR")
}
function catalogSyncNote(playlist){
  const stamp=formatCatalogStamp(playlist?.catalogGeneratedAt||youtubeCatalogMeta.generatedAt);
  if(!stamp){
    return ""
  }
  return `Catálogo público atualizado em ${stamp}`
}
function catalogPlaylistIds(){
  return Array.isArray(youtubeCatalogMeta.playlistIds)?youtubeCatalogMeta.playlistIds:[]
}
function playlistPublishedInCatalog(playlist){
  const catalogId=playlistCatalogId(playlist);
  return !!catalogId&&catalogPlaylistIds().includes(catalogId)
}
function playlistAwaitingCatalog(playlist){
  if(isLocalBackend()){
    return false
  }
  const catalogId=playlistCatalogId(playlist);
  if(!catalogId||youtubeCatalogMeta.error||!youtubeCatalogMeta.lastLoadedAt){
    return false
  }
  return !playlistPublishedInCatalog(playlist)
}
function playlistStatusSummary(playlist){
  if(!playlist){
    return {tone:"muted",label:"Sem playlist",message:"Nenhuma playlist ativa.",detail:""}
  }
  if(playlist.lastSyncError){
    return {tone:"error",label:"Erro",message:`Erro: ${playlist.lastSyncError}`,detail:"O Arcana preservou a fila local e não descartou seu progresso."}
  }
  if(playlist.enabled===false){
    return {tone:"muted",label:"Pausada",message:"Playlist pausada.",detail:"Ative novamente quando quiser voltar a sincronizar esta fila."}
  }
  if(isLocalBackend()){
    if(playlist.lastSyncAt){
      return {tone:"ok",label:"Local",message:`Sincronizada localmente em ${new Date(playlist.lastSyncAt).toLocaleString("pt-BR")}`,detail:"Este navegador pode atualizar a playlist direto com yt-dlp."}
    }
    return {tone:"local",label:"Local",message:"Pronta para sincronizar com yt-dlp.",detail:"No Arcana Local, a playlist pode ser atualizada imediatamente sem depender do catálogo público."}
  }
  if(playlistAwaitingCatalog(playlist)){
    return {tone:"pending",label:"Aguardando catálogo",message:"Aguardando catálogo público.",detail:"A playlist já foi salva no IndexedDB. Use “Solicitar sincronização” para registrá-la no catálogo público do Arcana."}
  }
  if(playlistPublishedInCatalog(playlist)){
    if(playlist.lastSyncAt){
      return {tone:"ok",label:"Publicada",message:`Sincronizada em ${new Date(playlist.lastSyncAt).toLocaleString("pt-BR")}`,detail:"Os metadados públicos foram aplicados sem apagar seu progresso local."}
    }
    return {tone:"ok",label:"Publicada",message:"Catálogo público disponível para sincronizar.",detail:"Clique em atualizar para trazer os vídeos publicados para esta playlist."}
  }
  if(youtubeCatalogMeta.error&&!playlist.lastSyncAt){
    return {tone:"error",label:"Erro",message:"Catálogo público indisponível agora.",detail:youtubeCatalogMeta.error}
  }
  return {tone:"muted",label:"Local",message:"Ainda não sincronizada.",detail:"Salve uma URL canônica de playlist para conectar esta fila ao catálogo público."}
}
function playlistStatusChip(playlist){
  const status=playlistStatusSummary(playlist);
  return `<span class="status-chip ${status.tone}">${esc(status.label)}</span>`
}
function catalogRequestPayload(playlist){
  const catalogId=playlistCatalogId(playlist);
  if(!catalogId){
    return ""
  }
  return JSON.stringify({
    id:catalogId,
    name:playlist.name,
    url:playlist.url||canonicalYoutubePlaylistUrl(catalogId),
    enabled:playlist.enabled!==false
  },null,2)
}
function catalogRequestIssueUrl(playlist){
  const catalogId=playlistCatalogId(playlist);
  if(!catalogId){
    return ""
  }
  const title=String(playlist?.name||"Nova playlist").trim()||"Nova playlist";
  const canonicalUrl=playlist?.url||canonicalYoutubePlaylistUrl(catalogId);
  const url=new URL(ARCANA_PLAYLIST_ISSUE_URL);
  url.searchParams.set("template","arcana-playlist.yml");
  url.searchParams.set("title",`[Arcana Playlist] ${title}`);
  url.searchParams.set("playlist_name",title);
  url.searchParams.set("youtube_playlist_id",catalogId);
  url.searchParams.set("canonical_url",canonicalUrl);
  return url.toString()
}
function syncPlaylistButtonLabel(playlist){
  if(syncing){
    return "Sincronizando..."
  }
  if(isLocalBackend()){
    return "↻ Sincronizar"
  }
  if(playlistAwaitingCatalog(playlist)){
    return "↻ Verificar novamente"
  }
  if(playlistPublishedInCatalog(playlist)){
    return "↻ Atualizar"
  }
  return "↻ Verificar catálogo"
}
function updatePlaylistCatalogActions(playlist,status){
  const requestBtn=$("requestCatalogBtn");
  const optionsBtn=$("catalogOptionsBtn");
  const issueUrl=catalogRequestIssueUrl(playlist);
  const canRequest=status?.label==="Aguardando catálogo"&&!!issueUrl;
  if(requestBtn){
    requestBtn.href=canRequest?issueUrl:"#";
    requestBtn.style.display=canRequest?"inline-flex":"none";
  }
  if(optionsBtn){
    optionsBtn.style.display=playlist?"inline-flex":"none";
  }
}
function shouldPollYoutubeCatalog(){
  if(isLocalBackend()||currentView!=="youtube"||syncing){
    return false
  }
  if(typeof document.hidden==="boolean"&&document.hidden){
    return false
  }
  return playlistAwaitingCatalog(activePlaylist())
}
function stopYoutubeCatalogPolling(){
  if(youtubeCatalogPollHandle){
    clearInterval(youtubeCatalogPollHandle);
    youtubeCatalogPollHandle=null;
  }
}
function scheduleYoutubeCatalogPolling(){
  stopYoutubeCatalogPolling();
  if(!shouldPollYoutubeCatalog()){
    return
  }
  youtubeCatalogPollHandle=setInterval(()=>{
    if(!shouldPollYoutubeCatalog()){
      stopYoutubeCatalogPolling();
      return
    }
    syncPlaylist().catch(()=>{});
  },60000)
}
function normalizeCatalogVideo(entry,pos){
  if(!entry||typeof entry!=="object"){
    return null
  }
  const id=String(entry.id||entry.videoId||youtubeVideoId(entry.url)||"").trim();
  const title=String(entry.title||"").trim();
  if(!id||!title){
    return null
  }
  const url=String(entry.url||`https://www.youtube.com/watch?v=${id}`).trim();
  return {
    id,
    title,
    url,
    channel:String(entry.channel||"YouTube").trim()||"YouTube",
    duration:Number(entry.duration)||0,
    position:Number(entry.position)||pos+1,
    thumbnail:String(entry.thumbnail||"").trim()
  }
}
function normalizePublishedCatalog(data){
  if(!data||typeof data!=="object"||!Array.isArray(data.playlists)){
    throw new Error("Catálogo público inválido.")
  }
  const playlists=data.playlists.map((playlist,pos)=>{
    if(!playlist||typeof playlist!=="object"){
      return null
    }
    const normalizedSource=playlist.id||playlist.url||"";
    const normalizedPlaylist=normalizeYoutubePlaylistReference(normalizedSource);
    const id=normalizedPlaylist.youtubePlaylistId;
    if(!id){
      throw new Error(`Playlist inválida na posição ${pos+1}.`)
    }
    const canonicalUrl=normalizedPlaylist.url;
    let url=canonicalUrl;
    if(playlist.url){
      try{
        const normalizedUrl=normalizeYoutubePlaylistReference(String(playlist.url).trim());
        url=normalizedUrl.youtubePlaylistId===id?normalizedUrl.url:canonicalUrl
      }catch{
        url=canonicalUrl
      }
    }
    const videos=Array.isArray(playlist.videos)?playlist.videos.map((entry,index)=>normalizeCatalogVideo(entry,index)).filter(Boolean):[];
    return {
      id,
      name:String(playlist.name||playlist.title||`Playlist ${pos+1}`).trim()||`Playlist ${pos+1}`,
      url,
      videos
    }
  }).filter(Boolean);
  return {
    version:Number(data.version)||1,
    generatedAt:data.generatedAt?String(data.generatedAt):null,
    playlists
  }
}
async function fetchPublishedCatalog(force=false){
  const response=await fetch(publishedCatalogRequestUrl(force),{cache:"no-store"});
  const text=await response.text();
  if(!response.ok){
    throw new Error(`Catálogo público indisponível (${response.status}).`)
  }
  let data={};
  try{
    data=text?JSON.parse(text):{}
  }catch{
    throw new Error("Catálogo público retornou JSON inválido.")
  }
  const catalog=normalizePublishedCatalog(data);
  youtubeCatalogMeta={
    version:catalog.version||1,
    generatedAt:catalog.generatedAt||null,
    lastLoadedAt:new Date().toISOString(),
    playlistIds:catalog.playlists.map(playlist=>playlist.id),
    playlistCount:catalog.playlists.length,
    videoCount:catalog.playlists.reduce((total,playlist)=>total+playlist.videos.length,0),
    error:null
  };
  return catalog
}
function catalogPlaylistStateId(catalogPlaylist){
  const slug=String(catalogPlaylist?.id||"playlist").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"playlist";
  return `playlist-${slug}`
}
function ensurePlaylistFromCatalog(catalogPlaylist){
  const catalogId=playlistCatalogId(catalogPlaylist);
  let local=state.playlists.find(p=>playlistCatalogId(p)===catalogId);
  if(local){
    local.url=catalogPlaylist.url||local.url;
    if(!local.name){
      local.name=catalogPlaylist.name
    }
    local.youtubePlaylistId=catalogId;
    local.catalogTitle=catalogPlaylist.name;
    local.updatedAt=new Date().toISOString();
    return local
  }
  const now=new Date().toISOString();
  local={id:catalogPlaylistStateId(catalogPlaylist),youtubePlaylistId:catalogId,name:catalogPlaylist.name,url:catalogPlaylist.url,enabled:true,createdAt:now,updatedAt:now,lastSyncAt:null,lastSyncError:null,catalogGeneratedAt:null,catalogTitle:catalogPlaylist.name};
  state.playlists.push(local);
  if(!state.activePlaylist){
    state.activePlaylist=local.id
  }
  return local
}
function catalogPlaylistToSyncData(playlist,catalog){
  return {
    title:playlist.name,
    playlistId:playlist.id,
    generatedAt:catalog.generatedAt||null,
    items:playlist.videos.map(video=>({
      videoId:video.id,
      title:video.title,
      url:video.url,
      channel:video.channel,
      thumbnail:video.thumbnail,
      durationSeconds:Number(video.duration)||0,
      position:Number(video.position)||0
    }))
  }
}
function applyPublishedCatalog(catalog,{targetPlaylist=null}={}){
  if(targetPlaylist){
    const catalogId=playlistCatalogId(targetPlaylist);
    if(!catalogId){
      throw new Error("Use uma URL de playlist do YouTube com o parâmetro list.")
    }
    const match=catalog.playlists.find(playlist=>playlist.id===catalogId);
    if(!match){
      return 0
    }
    mergePlaylistData(catalogPlaylistToSyncData(match,catalog),targetPlaylist);
    return 1
  }
  let merged=0;
  for(const playlist of catalog.playlists){
    const local=ensurePlaylistFromCatalog(playlist);
    mergePlaylistData(catalogPlaylistToSyncData(playlist,catalog),local);
    merged+=1
  }
  return merged
}
async function refreshPublishedCatalog(force=false){
  const catalog=await fetchPublishedCatalog(force);
  const merged=applyPublishedCatalog(catalog);
  await save(false,"youtube-catalog");
  return merged
}
async function api(path,opts={}){
  const method=(opts.method||"GET").toUpperCase();
  if(window.ArcanaStorage?.ready&&ArcanaStorage.canHandle(path,method)){
    return ArcanaStorage.route(path,opts)
  }
  const r=await fetch(path,{...opts,headers:{"Content-Type":"application/json",...(opts.headers||{})}});
  const text=await r.text();let data={};
  try{data=text?JSON.parse(text):{}}catch{throw new Error(`Resposta inválida (${r.status}).`)}
  if(!r.ok){throw new Error(data.error||`Falha (${r.status})`)}
  return data
}
function applyObsidianStatus(payload={}){
  const next={...structuredClone(DEFAULT_OBSIDIAN_STATE),...state.obsidian,...payload};
  if(!Object.prototype.hasOwnProperty.call(payload,"error")){
    next.error=null
  }
  state.obsidian=next;
  ensureObsidianAutoSyncLoop();
  renderSettings();
  return state.obsidian
}
function obsidianBridgeToken(){
  try{return localStorage.getItem(OBSIDIAN_BRIDGE_TOKEN_KEY)||""}catch{return ""}
}
function setObsidianBridgeToken(token){
  try{
    if(token){
      localStorage.setItem(OBSIDIAN_BRIDGE_TOKEN_KEY,token)
    }else{
      localStorage.removeItem(OBSIDIAN_BRIDGE_TOKEN_KEY)
    }
  }catch{}
}
function obsidianBridgeUrl(path=""){
  const base=(state.obsidian?.bridgeUrl||OBSIDIAN_BRIDGE_URL).replace(/\/+$/,"");
  return `${base}${path.startsWith("/")?path:`/${path}`}`
}
function validBridgeStatus(data){
  return data?.ok===true&&data.bridge==="arcana-obsidian"&&Number(data.bridgeApiVersion)===1
}
async function bridgeFetch(path,opts={}){
  const headers={"Content-Type":"application/json",...(opts.headers||{})};
  const token=obsidianBridgeToken();
  if(token){
    headers[OBSIDIAN_BRIDGE_TOKEN_HEADER]=token
  }
  const r=await fetch(obsidianBridgeUrl(path),{mode:"cors",cache:"no-store",...opts,headers});
  const text=await r.text();let data={};
  try{data=text?JSON.parse(text):{}}catch{throw new Error(`Resposta inválida do bridge (${r.status}).`)}
  if(!r.ok){
    throw new Error(data.error||`Falha no bridge (${r.status}).`)
  }
  return data
}
async function pairObsidianBridge(){
  const token=prompt("Pairing code do Arcana Bridge local");
  if(token===null){
    return state.obsidian
  }
  setObsidianBridgeToken(token.trim());
  const status=await refreshObsidianStatus();
  if(!status.bridgePaired){
    setObsidianBridgeToken("");
    throw new Error("Pairing code inválido.")
  }
  return status
}
function markObsidianPending(reason="change"){
  const count=Math.max(1,state.obsidian?.pendingCount||0);
  applyObsidianStatus({syncStatus:"pending",pendingCount:count,pendingReason:reason,lastPendingAt:new Date().toISOString()});
  if(window.ArcanaStorage?.ready){
    ArcanaStorage.saveState(state).catch(()=>{})
  }
}
async function refreshObsidianStatus(){
  try{
    const data=await bridgeFetch("/api/bridge/status");
    if(!validBridgeStatus(data)){
      throw new Error("Resposta de bridge inválida.")
    }
    const obs=data.obsidian||{};
    return applyObsidianStatus({available:true,bridge:data.bridge,bridgeApiVersion:data.bridgeApiVersion,bridgePaired:!!data.paired,bridgeStatus:data.vaultConnected?"connected":"no_vault",connected:!!data.vaultConnected,vaultName:data.vaultName||obs.vaultName||"",vaultPath:isLocalBackend()?state.obsidian.vaultPath:"",lastSyncAt:obs.lastSyncAt||state.obsidian.lastSyncAt,autoSync:obs.autoSync||state.obsidian.autoSync||"manual",conflicts:obs.conflicts||0,lastPush:obs.lastPush||state.obsidian.lastPush||{},openUrl:obs.openUrl||"",error:null})
  }catch(e){
    return applyObsidianStatus({available:false,connected:false,bridgePaired:false,bridgeStatus:"offline",error:e.message||String(e)})
  }
}
function ensureObsidianAutoSyncLoop(){
  clearInterval(obsidianAutoSyncHandle);
  obsidianAutoSyncHandle=null;
}
async function runObsidianSync(mode="push",silent=false){
  if(obsidianSyncInFlight){
    return state.obsidian
  }
  if(!state.obsidian.available||!state.obsidian.connected){
    applyObsidianStatus({syncStatus:"pending",error:"Bridge local indisponível ou sem vault conectado."});
    if(!silent){
      alert("Sincronização direta indisponível. Inicie o Arcana Bridge neste computador ou exporte o Vault em ZIP.")
    }
    return state.obsidian
  }
  if(!state.obsidian.bridgePaired||!obsidianBridgeToken()){
    applyObsidianStatus({syncStatus:"pending",error:"Conecte o bridge local com o pairing code antes de sincronizar."});
    if(!silent){
      await pairObsidianBridge()
    }
    if(!state.obsidian.bridgePaired||!obsidianBridgeToken()){
      return state.obsidian
    }
  }
  obsidianSyncInFlight=true;
  applyObsidianStatus({syncStatus:"syncing"});
  try{
    const payload=await ArcanaStorage.obsidianPayload(state);
    const data=await bridgeFetch(`/api/obsidian/${mode==="sync"?"push":mode}`,{method:"POST",body:JSON.stringify({autoSync:state.obsidian.autoSync,payload})});
    applyObsidianStatus({available:true,syncStatus:"synced",pendingCount:0,pendingReason:"",...(data.obsidian||{}),lastPush:{ok:data.ok,created:data.created,updated:data.updated,unchanged:data.unchanged,errors:data.errors||[],warnings:data.warnings||[]}});
    return state.obsidian
  }catch(e){
    applyObsidianStatus({syncStatus:"pending",error:e.message||String(e)});
    if(!silent){
      alert(e.message||String(e))
    }
    throw e
  }finally{
    obsidianSyncInFlight=false
  }
}
function queueObsidianAutoSync(reason){
  if(!state.obsidian.connected){
    markObsidianPending(reason);
    return
  }
  if(reason!=="after_session"||state.obsidian.autoSync!=="after_session"){
    return
  }
  Promise.resolve().then(()=>runObsidianSync("push",true)).catch(()=>{})
}
async function connectObsidianVault(){
  if(!isLocalBackend()){
    await pairObsidianBridge();
    return
  }
  const suggestion=state.obsidian.vaultPath||"";
  const path=prompt("Caminho absoluto da pasta raiz do seu vault Obsidian",suggestion);
  if(path===null){
    return
  }
  if(!obsidianBridgeToken()){
    await pairObsidianBridge();
    if(!obsidianBridgeToken()){
      return
    }
  }
  const data=await bridgeFetch("/api/obsidian/connect",{method:"POST",body:JSON.stringify({vaultPath:path.trim(),autoSync:state.obsidian.autoSync||"manual"})});
  applyObsidianStatus({available:true,bridgePaired:true,...(data.obsidian||{})});
}
async function disconnectObsidianVault(){
  if(!isLocalBackend()){
    setObsidianBridgeToken("");
    applyObsidianStatus({bridgePaired:false,connected:false,syncStatus:"pending",error:null});
    return
  }
  if(!confirm("Desconectar o vault Obsidian do Arcana Local?")){
    return
  }
  const data=await bridgeFetch("/api/obsidian/disconnect",{method:"POST",body:JSON.stringify({})});
  applyObsidianStatus({available:true,...(data.obsidian||{})})
}
function openObsidianVault(){
  if(state.obsidian.openUrl){
    location.href=state.obsidian.openUrl
  }
}
async function updateObsidianAutoSync(value){
  state.obsidian.autoSync=value;
  ensureObsidianAutoSyncLoop();
  renderSettings();
  if(isLocalBackend()&&state.obsidian.connected&&state.obsidian.vaultPath&&obsidianBridgeToken()){
    const data=await bridgeFetch("/api/obsidian/connect",{method:"POST",body:JSON.stringify({vaultPath:state.obsidian.vaultPath,autoSync:value})});
    applyObsidianStatus({available:true,...(data.obsidian||{})})
  }
}
function courseForModuleId(moduleId){
  return state.items.find(course=>course?.kind==="course"&&Array.isArray(course.modules)&&course.modules.some(module=>module?.id===moduleId))||null
}
function courseForLessonId(lessonId){
  return state.items.find(course=>course?.kind==="course"&&Array.isArray(course.modules)&&course.modules.some(module=>Array.isArray(module.lessons)&&module.lessons.some(lesson=>lesson?.id===lessonId)))||null
}
function decorateModuleResource(course,module){
  if(!course||!module){
    return null
  }
  Object.assign(module,{kind:"module",sourceType:"module",courseId:course.id,track:course.track,url:module.sourceUrl||course.url||"",source:course.source||module.source||""});
  return module
}
function decorateLessonResource(course,module,lesson){
  if(!course||!module||!lesson){
    return null
  }
  Object.assign(lesson,{kind:"lesson",sourceType:"lesson",courseId:course.id,moduleId:module.id,track:course.track,url:lesson.sourceUrl||module.sourceUrl||course.url||"",source:course.source||lesson.source||""});
  return lesson
}
function resourceByScope(id,scope){
  if(scope==="track"){
    return trackById(id)
  }
  if(scope==="youtube"){
    return state.youtubeQueue.find(x=>x.id===id)
  }
  if(scope==="module"){
    const course=courseForModuleId(id),module=course?.modules?.find(x=>x.id===id);
    return decorateModuleResource(course,module)
  }
  if(scope==="lesson"){
    const course=courseForLessonId(id),module=course?.modules?.find(m=>m.lessons?.some(lesson=>lesson.id===id)),lesson=module?.lessons?.find(x=>x.id===id);
    return decorateLessonResource(course,module,lesson)
  }
  return state.items.find(x=>x.id===id)
}
function noteCount(sourceId){return vaultNotes.filter(n=>n.sourceId===sourceId&&n.status!=="archived").length}
function splitTags(v){return String(v||"").split(/[,\s]+/).map(x=>x.trim().replace(/^#/,"")).filter(Boolean)}
function isoDate(days=0){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function trackOptions(value="all"){return `<option value="all">Todas as trilhas</option>`+state.tracks.map(t=>`<option value="${esc(t.id)}" ${value===t.id?"selected":""}>${esc(t.name)}</option>`).join("")}
function mdToHtml(md=""){
  let html=esc(md).replace(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g,'<span class="wiki-link">$1</span>').replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/`([^`]+)`/g,"<code>$1</code>");
  html=html.split(/\n{2,}/).map(block=>{
    if(/^###\s+/.test(block))return `<h3>${block.replace(/^###\s+/,"")}</h3>`;
    if(/^##\s+/.test(block))return `<h2>${block.replace(/^##\s+/,"")}</h2>`;
    if(/^#\s+/.test(block))return `<h1>${block.replace(/^#\s+/,"")}</h1>`;
    if(/^[-*]\s+/m.test(block))return `<ul>${block.split("\n").filter(Boolean).map(x=>`<li>${x.replace(/^[-*]\s+/,"").replace(/^\[[ x]\]\s+/,"")}</li>`).join("")}</ul>`;
    return `<p>${block.replace(/\n/g,"<br>")}</p>`
  }).join("");
  return html||"<p class='hint'>Sem conteúdo.</p>"
}
function literatureTemplate(title="Nova fonte",sourceType="book"){
  return `# ${title}\n\n## Dados da fonte\n\n- Tipo: ${sourceType}\n- Autor/canal:\n- URL/ISBN/DOI:\n- Progresso:\n\n## Resumo\n\n\n## Citações\n\n- \n\n## Ideias e conexões\n\n- [[Conceito relacionado]]\n\n## Próximas ações\n\n- [ ] `
}
function noteTemplate(type="quick",title="Nova nota"){
  const head=`# ${title}\n\n`;
  if(type==="permanent")return head+"## Ideia atômica\n\n\n## Por que importa\n\n\n## Conexões\n\n- [[Outra nota]]\n";
  if(type==="concept")return head+"## Conceito\n\n\n## Definição em uma frase\n\n\n## Exemplos\n\n- \n\n## Conexões\n\n- [[Conceito relacionado]]\n";
  if(type==="insight")return head+"## Insight\n\n\n## Por que importa\n\n\n## Próximo teste\n\n- [ ] \n";
  if(type==="question")return head+"## Pergunta\n\n\n## Evidências\n\n\n## Próxima investigação\n\n- [ ] \n";
  if(type==="session")return head+"## Registro\n\n\n## Conceitos\n\n\n## Perguntas\n\n\n## Próximas ações\n\n- [ ] \n";
  return head+"## Nota\n\n\n## Links\n\n- [[Conceito relacionado]]\n"
}
async function loadVaultNotes(){
  try{
    const data=await api("/api/notes?sort=updated");
    vaultNotes=data.notes||[];
    if($("vaultTrackFilter")){$("vaultTrackFilter").innerHTML=trackOptions($("vaultTrackFilter").value||"all")}
    renderVaultHome();renderKnowledge();renderNotes();renderFichamentos();renderReviews();renderGlobalSearchResults();
  }catch(e){
    ["homeKnowledge","knowledgeList","vaultList","fichamentoList","reviewQueue"].forEach(id=>{if($(id))$(id).innerHTML=`<div class="hint">Vault indisponível: ${esc(e.message)}</div>`})
  }
}

const KNOWLEDGE_CHILD_VIEWS=new Set(["library","fichamentos","notes","review"]);
function primaryNavView(view){return KNOWLEDGE_CHILD_VIEWS.has(view)?"knowledge":view}
function pageTitleForView(view){return {home:"Santuário",tracks:"Trilhas",youtube:"YouTube",knowledge:"Conhecimento",library:"Biblioteca",fichamentos:"Fichamentos",notes:"Notas",review:"Revisão",calendar:"Calendário",routine:"Rotina",hobbies:"Hobbies",inbox:"Inbox",settings:"Configurações"}[view]||"Arcana"}
function setNavigationActive(view){
  const primary=primaryNavView(view);
  document.querySelectorAll(".nav-btn,.mobile-nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===primary))
}
function showView(v){
  currentView=v;
  document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
  const viewEl=$(v+"View");
  if(!viewEl){
    missingTarget();
    return
  }
  viewEl.classList.add("active");
  setNavigationActive(v);
  $("pageTitle").textContent=pageTitleForView(v);
  if(["home","knowledge","fichamentos","notes","review"].includes(v)){
    loadVaultNotes()
  }
  if(v==="youtube"){
    scheduleYoutubeCatalogPolling()
  }else{
    stopYoutubeCatalogPolling()
  }
  if(v==="routine"){
    renderRoutine()
  }
  if(v==="hobbies"){
    renderHobbies()
  }
  if(v==="calendar"){
    renderCalendar();
    renderJournal();
    renderWeeklyAnalytics()
  }
}
function toast(message,tone="info"){
  const host=$("toastHost");
  if(!host){
    return false
  }
  const html=`<div class="toast ${esc(tone)}">${esc(message)}</div>`;
  if(host.insertAdjacentHTML){
    host.insertAdjacentHTML("beforeend",html);
    const item=host.lastElementChild;
    setTimeout(()=>item?.remove?.(),3200)
  }else{
    host.innerHTML=html
  }
  return true
}
function notice(message){
  if(toast(message)){
    return
  }
  let el=$("appNotice");
  if(!el&&document.body){
    el=document.createElement("div");
    el.id="appNotice";
    el.className="app-notice";
    document.body.appendChild(el)
  }
  if(!el){
    return
  }
  el.textContent=message;
  el.classList.add("show");
  clearTimeout(notice._timer);
  notice._timer=setTimeout(()=>el.classList.remove("show"),2600)
}
function missingTarget(){
  notice("Este item não existe mais.");
  loadVaultNotes().catch(()=>{})
}
function activateRow(event,el){
  if(event.key!=="Enter"&&event.key!==" "){
    return
  }
  event.preventDefault();
  el.click()
}
async function navigateTo(view,options={}){
  if(!$(view+"View")){
    missingTarget();
    return
  }
  if(view==="tracks"&&options.trackId){
    if(!trackById(options.trackId)){
      missingTarget();
      renderHomeTracks();
      return
    }
    state.activeTrack=options.trackId;
    await save(false,"navigation");
    renderTracks()
  }
  if(view==="youtube"&&options.playlistId){
    if(!state.playlists.some(p=>p.id===options.playlistId)){
      missingTarget();
      return
    }
    state.activePlaylist=options.playlistId;
    await save(false,"navigation");
    renderYoutube()
  }
  if(view==="knowledge"&&options.knowledgeTab){
    activeKnowledgeTab=options.knowledgeTab
  }
  showView(view);
  try{
    if(options.fichamentoId){
      await selectFichamento(options.fichamentoId)
    }else if(options.noteId&&view==="review"){
      await openReviewNote(options.noteId)
    }else if(options.noteId&&view==="fichamentos"){
      await selectFichamento(options.noteId)
    }else if(options.noteId){
      await selectVaultNote(options.noteId)
    }
  }catch(e){
    missingTarget()
  }
}

function registerCourseOptions(trackId=""){
  const courses=state.items.filter(item=>item.kind==="course"&&(!trackId||item.track===trackId));
  return `<option value="">Nenhum curso específico</option>`+courses.map(course=>`<option value="${esc(course.id)}">${esc(course.title)}</option>`).join("")
}
function registerModuleOptions(courseId=""){
  const course=state.items.find(item=>item.id===courseId);
  return `<option value="">Nenhum módulo específico</option>`+(course?orderedModules(course).map(module=>`<option value="${esc(module.id)}">${esc(module.title)}</option>`).join(""):"")
}
function registerLessonOptions(courseId="",moduleId=""){
  const course=state.items.find(item=>item.id===courseId),module=course?.modules?.find(item=>item.id===moduleId);
  return `<option value="">Nenhuma aula específica</option>`+(module?orderedLessons(module).map(lesson=>`<option value="${esc(lesson.id)}">${esc(lesson.title)}</option>`).join(""):"")
}
function renderRegisterCurriculumOptions(){
  const form=$("registerForm");
  if(!form){
    return
  }
  const e=form.elements,trackId=e.trackId.value,courseId=e.courseId.value,moduleId=e.moduleId.value;
  e.courseId.innerHTML=registerCourseOptions(trackId);
  if(courseId&&Array.from(e.courseId.options||[]).some(option=>option.value===courseId)){
    e.courseId.value=courseId
  }
  e.moduleId.innerHTML=registerModuleOptions(e.courseId.value);
  if(moduleId&&Array.from(e.moduleId.options||[]).some(option=>option.value===moduleId)){
    e.moduleId.value=moduleId
  }
  e.lessonId.innerHTML=registerLessonOptions(e.courseId.value,e.moduleId.value)
}
function registerTrackOptions(value=""){
  return `<option value="">Sem trilha</option>`+state.tracks.map(item=>`<option value="${esc(item.id)}" ${value===item.id?"selected":""}>${esc(item.name)}</option>`).join("")
}
function registerHobbyOptions(value=""){
  return `<option value="">Sem hobby</option>`+(state.hobbies||[]).map(item=>`<option value="${esc(item.id)}" ${value===item.id?"selected":""}>${esc(item.name)}</option>`).join("")
}
function parseQuickRegistration(text=""){
  const raw=String(text||"").trim(),lower=raw.toLowerCase();
  const parsed={type:"other",title:raw||"Atividade registrada",durationMinutes:30,date:dayKey(),time:new Date().toTimeString().slice(0,5),trackId:"",hobbyId:"",confidence:"baixa"};
  const duration=lower.match(/(\d+)\s*(h|hora|horas|min|m)\b/);
  if(duration){
    parsed.durationMinutes=duration[2].startsWith("h")?Number(duration[1])*60:Number(duration[1])
  }
  if(/\b(estudei|estudo|aula|curso|lição|modulo|módulo)\b/.test(lower)){
    parsed.type="study";
    parsed.confidence="média"
  }else if(/\b(youtube|video|vídeo|assisti)\b/.test(lower)){
    parsed.type="youtube";
    parsed.confidence="média"
  }else if(/\b(revisei|revisão|flashcard)\b/.test(lower)){
    parsed.type="review";
    parsed.durationMinutes=Math.min(parsed.durationMinutes,20);
    parsed.confidence="média"
  }else if(/\b(journal|journaling|diário|escrevi)\b/.test(lower)){
    parsed.type="journaling";
    parsed.confidence="média"
  }else if(/\b(treino|corrida|academia|yoga|esporte)\b/.test(lower)){
    parsed.type="sport";
    parsed.confidence="média"
  }
  const trackMatch=state.tracks.find(track=>lower.includes(String(track.name||"").toLowerCase()));
  if(trackMatch){
    parsed.trackId=trackMatch.id;
    parsed.type="study";
    parsed.confidence="alta"
  }
  const hobbyMatch=(state.hobbies||[]).find(hobby=>lower.includes(String(hobby.name||"").toLowerCase()));
  if(hobbyMatch){
    parsed.hobbyId=hobbyMatch.id;
    parsed.type=hobbyMatch.id==="hobby-journaling"?"journaling":"hobby";
    parsed.title=hobbyMatch.name;
    parsed.confidence="alta"
  }else{
    parsed.title=raw.replace(/(\d+)\s*(h|hora|horas|min|m)\b/gi,"").replace(/^(eu\s+)?(estudei|assisti|fiz|revisei|li|joguei|registrei)\s+/i,"").trim()||parsed.title
  }
  return parsed
}
function fillRegisterForm(parsed={}){
  const form=$("registerForm");
  if(!form){
    return
  }
  const e=form.elements;
  e.type.value=parsed.type||"other";
  e.title.value=parsed.title||"";
  e.date.value=parsed.date||dayKey();
  e.time.value=parsed.time||new Date().toTimeString().slice(0,5);
  e.durationMinutes.value=String(parsed.durationMinutes||30);
  e.trackId.value=parsed.trackId||"";
  e.hobbyId.value=parsed.hobbyId||"";
  renderRegisterCurriculumOptions();
  renderRegisterPreview(parsed)
}
function renderRegisterPreview(parsed=null){
  const form=$("registerForm"),preview=$("registerPreview");
  if(!form||!preview){
    return
  }
  const e=form.elements,data=parsed||{type:e.type.value,title:e.title.value,durationMinutes:Number(e.durationMinutes.value)||0,date:e.date.value,time:e.time.value,confidence:"manual"};
  const typeLabel=ACTIVITY_TYPES[data.type]||ACTIVITY_TYPES.other;
  preview.innerHTML=`<strong>${esc(typeLabel)} · ${esc(data.title||"Atividade")}</strong><span>${esc(data.date||dayKey())} ${esc(data.time||"")} · ${fmtMin(data.durationMinutes||0)} · confiança ${esc(data.confidence||"manual")}</span>`
}
function openRegisterDialog(){
  const form=$("registerForm");
  if(!form){
    return
  }
  form.reset();
  form.elements.trackId.innerHTML=registerTrackOptions(state.activeTrack||"");
  form.elements.hobbyId.innerHTML=registerHobbyOptions("");
  fillRegisterForm({type:"study",title:"Sessão registrada",durationMinutes:30,date:dayKey(),time:new Date().toTimeString().slice(0,5),trackId:state.activeTrack||"",confidence:"manual"});
  $("registerStatus").textContent="";
  $("registerDialog").showModal();
  setTimeout(()=>$("registerQuickInput")?.focus?.(),40)
}
function markLessonComplete(lesson,module,course,completedAt=new Date().toISOString()){
  if(lesson){
    lesson.progress=100;lesson.done=true;lesson.status="concluido";lesson.completedAt=completedAt
  }
  if(module){
    module.progress=moduleProgress(module);module.done=moduleDone(module);module.status=statusFromProgress(module.progress);if(module.done&&!module.completedAt){module.completedAt=completedAt}
  }
  if(course){
    course.progress=itemProgress(course);course.status=statusFromProgress(course.progress);if(itemProgress(course)>=100&&!course.completedAt){course.completedAt=completedAt}
  }
}
function completionUndoLabel(scope){
  return scope==="youtube"?"Marcar como não assistido":"Marcar como não concluída"
}
function completionUndoEligible(resource,scope){
  if(!(scope==="youtube"||scope==="lesson")){
    return false
  }
  const progress=scope==="lesson"?lessonProgress(resource):itemProgress(resource);
  return progress>=100||resource?.status==="concluido"||resource?.done===true||!!resource?.completedAt
}
function completionUndoSnapshot(resource,scope){
  const progress=scope==="lesson"?lessonProgress(resource):itemProgress(resource);
  return {status:resource?.status||statusFromProgress(progress),progress,done:!!resource?.done,completedAt:resource?.completedAt||null}
}
function syncParentCompletionState(module,course){
  if(module){
    module.progress=moduleProgress(module);module.done=moduleDone(module);module.status=statusFromProgress(module.progress);
    if(!module.done){
      module.completedAt=null
    }
  }
  if(course){
    course.progress=itemProgress(course);course.done=itemProgress(course)>=100;course.status=statusFromProgress(course.progress);
    if(!course.done){
      course.completedAt=null
    }
  }
}
function markDailyPlanItemPending(id,type){
  if(state.dailyPlan?.date!==dayKey()){
    return null
  }
  const plan=findDailyPlanItem(id,type);
  if(plan){
    plan.status="pending";plan.completedAt=null
  }
  return plan
}
function recordCompletionUndoActivity(resource,scope,previous,next,context,at){
  upsertActivityLogEntry({
    type:scope==="youtube"?"youtube":"study",
    subtype:scope==="youtube"?"youtube.completion.undo":"study.lesson.completion.undo",
    title:completionUndoLabel(scope),
    startedAt:at,
    endedAt:at,
    durationMinutes:0,
    source:"completion-undo",
    sourceRecordId:`completion-undo:${scope}:${resource.id}:${at}`,
    sourceId:resource.id,
    trackId:context.trackId,
    courseId:context.courseId,
    moduleId:context.moduleId,
    lessonId:scope==="lesson"?resource.id:context.lessonId,
    metadata:{action:"completion_undo",scope,resourceId:resource.id,previousStatus:previous.status,previousProgress:previous.progress,newStatus:next.status,newProgress:next.progress,timestamp:at}
  })
}
function markStudyItemIncomplete(id,scope,options={}){
  const resource=resourceByScope(id,scope);
  if(!resource||!(scope==="youtube"||scope==="lesson")){
    return {changed:false,resource:null,scope}
  }
  if(!completionUndoEligible(resource,scope)){
    return {changed:false,resource,scope}
  }
  const at=options.at||new Date().toISOString(),previous=completionUndoSnapshot(resource,scope),context=studyContextForResource(resource,scope);
  resource.progress=0;resource.done=false;resource.status="nao_iniciado";resource.completedAt=null;
  if(scope==="lesson"){
    const module=resourceByScope(resource.moduleId,"module"),course=state.items.find(item=>item.id===resource.courseId);
    syncParentCompletionState(module,course);
    markDailyPlanItemPending(resource.id,"lesson")
  }else{
    markDailyPlanItemPending(resource.id,"youtube")
  }
  const next=completionUndoSnapshot(resource,scope);
  recordCompletionUndoActivity(resource,scope,previous,next,context,at);
  return {changed:true,resource,scope,previous,next,context}
}
function updateFocusUndoButton(resource=null,scope=null){
  const button=$("focusUndoBtn");
  if(!button){
    return
  }
  const eligible=completionUndoEligible(resource,scope);
  button.classList.toggle("hidden",!eligible);
  button.textContent=completionUndoLabel(scope);
  button.disabled=!eligible
}
async function confirmUndoCompletion(id,scope){
  const resource=resourceByScope(id,scope);
  if(!resource){
    missingTarget();
    return
  }
  if(!completionUndoEligible(resource,scope)){
    toast("Este item já está pendente.","info");
    return
  }
  if(!confirm(`${completionUndoLabel(scope)}?\n\nIsso mantém sessões, notas, fichamentos, XP, sequência e histórico de tempo.`)){
    return
  }
  const result=markStudyItemIncomplete(id,scope);
  if(!result.changed){
    toast("Este item já está pendente.","info");
    return
  }
  markObsidianPending("completion_undo");
  await save(true,"completion-undo");
  if(focusRef?.id===id&&focusRef?.scope===scope){
    updateFocusUndoButton(result.resource,scope)
  }
  toast(scope==="youtube"?"Vídeo marcado como não assistido.":"Aula marcada como não concluída.","success")
}
function undoFocusedCompletion(){
  if(!focusRef){
    return
  }
  return confirmUndoCompletion(focusRef.id,focusRef.scope)
}
function applyStudyRegistrationResult(payload){
  const result=payload.studyResult;
  if(!result||result==="session_only"){
    return
  }
  const course=state.items.find(item=>item.id===payload.courseId),module=course?.modules?.find(item=>item.id===payload.moduleId),lesson=module?.lessons?.find(item=>item.id===payload.lessonId),completedAt=payload.endedAt||new Date().toISOString();
  if(result==="lesson_completed"){
    markLessonComplete(lesson,module,course,completedAt)
  }else if(result==="module_completed"&&module){
    for(const item of module.lessons||[]){
      item.progress=100;item.done=true;item.status="concluido";item.completedAt=item.completedAt||completedAt
    }
    module.progress=100;module.done=true;module.status="concluido";module.completedAt=completedAt;
    if(course){course.progress=itemProgress(course);course.status=statusFromProgress(course.progress)}
  }else if(result==="course_completed"&&course){
    for(const mod of course.modules||[]){
      for(const item of mod.lessons||[]){
        item.progress=100;item.done=true;item.status="concluido";item.completedAt=item.completedAt||completedAt
      }
      mod.progress=100;mod.done=true;mod.status="concluido";mod.completedAt=mod.completedAt||completedAt
    }
    course.progress=100;course.done=true;course.status="concluido";course.completedAt=completedAt
  }
}
async function saveManualRegistration(event){
  event.preventDefault();
  const form=event.currentTarget,e=form.elements,type=ACTIVITY_TYPES[e.type.value]?e.type.value:"other",duration=Math.max(0,Math.round(Number(e.durationMinutes.value)||0));
  const startedAt=isoFromDateTime(e.date.value,e.time.value),endedAt=new Date(new Date(startedAt).getTime()+duration*60000).toISOString();
  const title=String(e.title.value||ACTIVITY_TYPES[type]||"Atividade").trim();
  if(!title){
    $("registerStatus").textContent="Informe uma atividade antes de salvar.";
    e.title.focus();
    return
  }
  const payload={type,subtype:type==="study"?"study.manual":type==="hobby"?`hobby.${activitySubtypeSlug(title)}`:type,title,startedAt,endedAt,durationMinutes:duration,trackId:e.trackId.value||null,courseId:e.courseId.value||null,moduleId:e.moduleId.value||null,lessonId:e.lessonId.value||null,hobbyId:e.hobbyId.value||null,notes:e.notes.value,studyResult:e.studyResult.value};
  if(type==="study"||type==="youtube"){
    const session={id:crypto.randomUUID(),date:dayKey(validDate(startedAt)),timestamp:startedAt,minutes:duration,title,type:type==="youtube"?"video":"manual",sourceId:payload.lessonId||payload.moduleId||payload.courseId||payload.trackId||null,trackId:payload.trackId,courseId:payload.courseId,moduleId:payload.moduleId,lessonId:payload.lessonId,track:payload.trackId};
    state.sessions.push(session);
    upsertActivityLogEntry({...payload,source:"session",sourceRecordId:session.id,sourceId:session.sourceId});
    if(payload.trackId){state.weeklyProgress[payload.trackId]=(state.weeklyProgress[payload.trackId]||0)+duration}
    if(type==="study"){applyStudyRegistrationResult(payload)}
  }else{
    const sourceRecordId=crypto.randomUUID();
    upsertActivityLogEntry({...payload,source:"manual-register",sourceRecordId});
    if(type==="hobby"||type==="journaling"){
      const hobby=(state.hobbies||[]).find(item=>item.id===payload.hobbyId);
      if(hobby){
        hobby.sessions=[...(hobby.sessions||[]),{id:sourceRecordId,date:dayKey(validDate(startedAt)),minutes:duration,createdAt:endedAt}];
        hobby.lastDoneAt=endedAt
      }
    }
  }
  if(type==="study"||type==="youtube"){
    updateStreak()
  }
  await save(false,"manual-registration");
  $("registerDialog").close();
  renderAll();
  toast("Atividade registrada.","ok")
}
document.querySelectorAll(".nav-btn,.mobile-nav-btn").forEach(b=>b.onclick=()=>navigateTo(b.dataset.view));

function renderHome(){
  const now=new Date(),h=now.getHours(),sal=h<12?"Bom dia":h<18?"Boa tarde":"Boa noite";
  $("greeting").textContent=`${sal}. O que vamos invocar hoje?`;
  if($("sanctuaryDate")){
    const dateText=now.toLocaleDateString("pt-BR",{day:"2-digit",month:"long"}).toUpperCase();
    const weekday=now.toLocaleDateString("pt-BR",{weekday:"long"}).toUpperCase();
    $("sanctuaryDate").innerHTML=`<span>${dateText}</span><small>${weekday}</small>`
  }
  const level=Math.floor(state.xp/500)+1;$("levelNumber").textContent=level;
  const studied=activityMinutesForDate(dayKey()),targetMinutes=state.dailyPlan.minutes||60;
  $("todaySummary").textContent=`${studied} / ${targetMinutes} min hoje · ${state.streak} dias de sequência`;
  if($("freeTimeSummary")){
    const free=freeTimeSnapshot(now);
    const external=free.externalCommitments.length?` · ${free.externalCommitments.length} compromisso${free.externalCommitments.length===1?"":"s"} externo${free.externalCommitments.length===1?"":"s"}`:"";
    $("freeTimeSummary").textContent=`Hoje: ${free.windows.length} janela${free.windows.length===1?"":"s"} livre${free.windows.length===1?"":"s"} · ${fmtMin(free.available)} disponíveis${external}`
  }
  $("gameStats").innerHTML=[
    ["✦ XP",state.xp],["☽ Sequência",`${state.streak} dias`],["◇ Registros",(state.activityLog||[]).length],["Nível",level]
  ].map(([a,b])=>`<div class="stat"><span>${a}</span><strong>${b}</strong></div>`).join("");
  renderDailyPlan();renderHomeYoutube();renderHomeTracks();renderHomePriority();renderVaultHome()
}
function nextCurriculumFocus(course){
  if(course?.kind!=="course"||!Array.isArray(course.modules)){
    return null
  }
  const module=activeModuleForCourse(course);
  if(!module){
    return null
  }
  const lesson=activeLessonForModule(module);
  if(lesson){
    return {type:"lesson",id:lesson.id,title:lesson.title,detail:module.title,estimatedMinutes:lesson.estimatedMinutes||module.estimatedMinutes||course.estimatedMinutes||30}
  }
  return {type:"module",id:module.id,title:module.title,detail:course.title,estimatedMinutes:module.estimatedMinutes||course.estimatedMinutes||30}
}
function dailyPlanAction(p){
  if(p?.type==="review"){
    return "navigateTo('review')"
  }
  if(p?.type==="hobby"){
    return `startHobbySessionById(${jsArg(p?.id||"")},${Number(p?.minutes||0)})`
  }
  return `startPlanItemById(${jsArg(p?.id||"")},${jsArg(p?.type||"item")})`
}
function findDailyPlanItem(id,type){
  return (state.dailyPlan.items||[]).find(item=>item.id===id&&item.type===type)||null
}
function startPlanItemById(id,type){
  startPlanItem(findDailyPlanItem(id,type)||{id,type})
}
function startPlanItem(p){
  if(!p){
    missingTarget();
    return
  }
  if(p.type==="review"){
    navigateTo("review");
    return
  }
  if(p.type==="hobby"){
    startHobbySessionById(p.id,p.minutes||0);
    return
  }
  openFocus(p.id,p.type)
}
function nextRitualTarget(){
  const planItems=state.dailyPlan.date===dayKey()?state.dailyPlan.items||[]:[];
  const current=new Date().getHours()*60+new Date().getMinutes();
  const upcoming=planItems.find(item=>item.type!=="review"&&(!item.endMinute||item.endMinute>=current));
  const anyUpcoming=planItems.find(item=>!item.endMinute||item.endMinute>=current);
  const planned=upcoming||anyUpcoming||planItems.find(item=>item.type!=="review")||planItems[0];
  if(planned){
    return planned
  }
  const target=state.tracks.map(track=>getActiveLearningTarget(track)).filter(Boolean).sort((a,b)=>score(b.prioritySource)-score(a.prioritySource))[0];
  if(target){
    return {...target,minutes:Math.min(45,Math.max(15,Number(target.estimatedMinutes||30)))}
  }
  const video=todaysYoutube()[0];
  if(video){
    return {type:"youtube",id:video.id,title:video.title,minutes:video.estimatedMinutes||15,trackName:"YouTube"}
  }
  return null
}
function renderNextRitual(){
  if(!$("nextRitual")){
    return
  }
  const target=nextRitualTarget();
  if(!target){
    $("nextRitual").innerHTML=`<div class="ritual-ornament">✦ PRÓXIMO RITUAL ✦</div><h2>Sem ritual pendente</h2><p>Seu plano está limpo. Capture uma nova fonte ou crie uma trilha para continuar.</p><div class="next-ritual-actions"><button class="gold-btn" onclick="openCaptureDialog()">Capturar</button></div>`;
    return
  }
  const action=dailyPlanAction(target),label=target.type==="review"?"Revisão":target.trackName||target.detail||target.type||"Foco";
  const hierarchy=[target.courseTitle,target.moduleTitle,target.lessonTitle].filter(Boolean).map(esc).join(" · ");
  const time=target.startTime?` · ${esc(target.startTime)}`:"";
  $("nextRitual").innerHTML=`<div class="ritual-ornament">✦ PRÓXIMO RITUAL ✦</div><h2 class="next-ritual-title">${esc(target.title)}</h2><p>${esc(label)}${hierarchy?` · ${hierarchy}`:""}${target.minutes?` · ${target.minutes} min`:""}${time}</p><div class="next-ritual-actions"><button class="gold-btn" onclick="${action}">Continuar</button><button class="text-link" onclick="generatePlan()">trocar ritual</button></div>`
}
function renderTodayProgress(){
  if(!$("todayProgress")){
    return
  }
  const planned=(state.dailyPlan.items||[]).reduce((sum,item)=>sum+Number(item.minutes||0),0),studied=activityMinutesForDate(dayKey()),pct=planned?Math.min(100,Math.round(studied/planned*100)):0;
  $("todayProgress").innerHTML=`<div class="today-progress-line"><span>Hoje</span><strong>${studied} / ${planned||0} min</strong><span>${pct}%</span></div><div class="progress"><div style="width:${pct}%"></div></div>`
}
function renderTodayRows(){
  if(!$("todayRows")){
    return
  }
  const items=state.dailyPlan.items||[];
  $("todayRows").innerHTML=items.length?items.slice(0,4).map((p,n)=>{
    const action=dailyPlanAction(p),label=p.type==="review"?"Revisão":p.type==="youtube"?"YouTube":p.type==="hobby"?"Hobby":p.trackName||"Foco";
    const hierarchy=[p.courseTitle,p.moduleTitle,p.lessonTitle].filter(Boolean).map(esc).join(" · ");
    const time=p.startTime?`<span>${esc(p.startTime)}</span>`:"";
    return `<div class="today-row clickable-row ${n===0?"today-row-focus":""}" role="button" tabindex="0" onclick="${action}" onkeydown="activateRow(event,this)"><span class="num">${String(n+1).padStart(2,"0")}</span><div class="grow"><strong>${esc(p.title)}</strong><span>${esc(label)}${hierarchy?` · ${hierarchy}`:""}</span></div><div class="today-row-side">${time}<span>${p.minutes} min</span>${n===0?`<span class="tag">EM FOCO</span>`:""}</div></div>`
  }).join(""):`<div class="hint">Nenhum ritual planejado ainda.</div>`
}
function generatePlan(date=new Date()){
  const mins=Number($("todayMinutes")?.value||state.dailyPlan.minutes||60);
  const result=planActivitiesIntoWindows(date,{minutes:mins});
  state.dailyPlan={...state.dailyPlan,date:dayKey(date),minutes:mins,items:result.items,freeWindows:result.freeWindows,availableMinutes:result.availableMinutes,notices:result.notices,generatedAt:new Date().toISOString(),calendarConflictDismissedAt:null};
  save(false,"daily-plan");renderDailyPlan()
}
function intervalsOverlap(aStart,aEnd,bStart,bEnd){
  return aStart<bEnd&&aEnd>bStart
}
function planConflictsForDate(date=new Date()){
  if(state.dailyPlan.date!==dayKey(date)){
    return []
  }
  const busy=getBusyIntervals(date).external;
  return (state.dailyPlan.items||[]).filter(item=>Number.isFinite(Number(item.startMinute))&&Number.isFinite(Number(item.endMinute))&&busy.some(interval=>intervalsOverlap(Number(item.startMinute),Number(item.endMinute),interval.start,interval.end)))
}
async function dismissCalendarConflictNotice(){
  state.dailyPlan.calendarConflictDismissedAt=new Date().toISOString();
  await save(false,"calendar-conflict-dismissed");
  renderCalendarConflictNotice()
}
function renderCalendarConflictNotice(){
  const el=$("calendarConflictNotice");
  if(!el){
    return
  }
  const conflicts=planConflictsForDate(new Date());
  if(!conflicts.length||state.dailyPlan.calendarConflictDismissedAt){
    el.classList.add("hidden");
    el.innerHTML="";
    return
  }
  el.classList.remove("hidden");
  el.innerHTML=`<div><strong>Agenda externa conflita com o plano.</strong><span>${conflicts.length} ritual${conflicts.length===1?"":"ais"} cruza${conflicts.length===1?"":"m"} compromisso importado.</span></div><div class="item-actions"><button class="ghost-btn" type="button" onclick="generatePlan()">Recalcular</button><button class="mini-btn" type="button" onclick="dismissCalendarConflictNotice()">Manter</button></div>`
}
function renderDailyPlan(){
  if(!$("dailyPlan")){
    return
  }
  if(state.dailyPlan.date!==dayKey()){
    generatePlan();
    return
  }
  if($("todayMinutes")){
    $("todayMinutes").value=String(state.dailyPlan.minutes||60)
  }
  const notices=(state.dailyPlan.notices||[]).map(message=>`<div class="plan-notice">${esc(message)}</div>`).join("");
  $("dailyPlan").innerHTML=notices+(state.dailyPlan.items.length?state.dailyPlan.items.map((p,n)=>{
    const action=dailyPlanAction(p);
    const trackLabel=p.trackName?`${p.trackSigil?`${esc(p.trackSigil)} `:""}${esc(p.trackName)}`:p.type==="review"?"Revisão":p.type==="youtube"?"YouTube":p.type==="hobby"?"Hobby":"";
    const hierarchy=[p.courseTitle,p.moduleTitle,p.lessonTitle].filter(Boolean);
    const context=hierarchy.length?hierarchy.map(esc).join(" · "):p.detail?esc(p.detail):trackLabel;
    const time=p.startTime?`<span class="plan-time">${esc(p.startTime)}${p.endTime?` - ${esc(p.endTime)}`:""}</span>`:"";
    return `<div class="plan-item clickable-row" role="button" tabindex="0" onclick="${action}" onkeydown="activateRow(event,this)"><div class="num">${n+1}</div><div class="grow">${trackLabel?`<span class="kicker">${trackLabel}</span>`:""}<strong>${esc(p.title)}</strong><span>${context?`${context} · `:""}${p.minutes} min</span>${time}</div><button class="mini-btn" onclick="event.stopPropagation();${action}">${p.type==="review"?"Revisar":p.type==="hobby"?"Registrar":"Continuar"}</button></div>`
  }).join(""):`<div class="hint">Nada pendente para hoje.</div>`);
  renderNextRitual();renderTodayProgress();renderTodayRows();renderCalendarConflictNotice()
}
function renderHomeYoutube(){
  const v=todaysYoutube()[0];$("homeYoutube").innerHTML=v?videoRow(v,0,true):`<div class="hint">Sem vídeo liberado agora.</div>`
}
function renderHomeTracks(){
  ensureActiveTrack();
  if(!state.tracks.length){
    $("homeTracks").innerHTML=`<div class="hint">Crie sua primeira trilha para organizar cursos e estudos.</div>`;
    return
  }
  $("homeTracks").innerHTML=state.tracks.map(t=>{const courses=orderedCoursesForTrack(t.id),arr=courses.length?courses:state.items.filter(i=>i.track===t.id),avg=arr.length?Math.round(arr.reduce((a,b)=>a+itemProgress(b),0)/arr.length):0,target=getActiveLearningTarget(t);return `<div class="track-row clickable-row" role="button" tabindex="0" onclick="navigateTo('tracks',{trackId:${jsArg(t.id)}})" onkeydown="activateRow(event,this)"><div class="num">${esc(t.sigil||"☽")}</div><div class="grow"><strong title="${esc(t.name)}">${esc(t.name)}</strong><span>${target?`Agora: ${esc(target.title)}`:`${avg}% concluído`}</span><div class="progress"><div style="width:${avg}%"></div></div></div><button class="mini-btn primary-action" onclick="event.stopPropagation();continueTrack(${jsArg(t.id)})">Continuar</button></div>`}).join("")
}
function renderHomePriority(){
  const arr=state.items.filter(i=>itemProgress(i)<100).sort((a,b)=>score(b)-score(a)).slice(0,3);
  $("homePriority").innerHTML=arr.length?arr.map(i=>`<div class="plan-item clickable-row priority-preview-row" role="button" tabindex="0" onclick="continueResource(${jsArg(i.id)},'item')" onkeydown="activateRow(event,this)"><span class="tag priority-${priorityCode(i)}">${priorityLabel(i)}</span><div class="grow"><strong title="${esc(i.title)}">${esc(i.title)}</strong><span>${esc(trackById(i.track)?.name||"Sem trilha")}</span></div></div>`).join(""):`<div class="hint">Nada priorizado agora.</div>`
}

function renderTracks(){
  const t=ensureActiveTrack();
  $("trackTabs").innerHTML=state.tracks.map(t=>`<button class="track-tab ${t.id===state.activeTrack?"active":""}" onclick="setTrack('${t.id}')"><strong>${esc(t.sigil||"☽")} ${esc(t.name)}</strong><span>${esc(t.subtitle||"")}</span></button>`).join("");
  if(!t){
    $("trackHero").innerHTML=`<h2>Nova trilha</h2><div class="kicker">Nenhuma trilha ativa</div><p>Crie sua primeira trilha para começar a organizar cursos, fontes e sessões.</p>`;
    $("trackCourses").innerHTML=`<div class="hint">Nenhum curso ainda.</div>`;
    $("trackProfile").innerHTML=`<div class="profile-grid"><div class="profile-stat"><span>Cursos</span><strong>0</strong></div><div class="profile-stat"><span>Concluídos</span><strong>0</strong></div><div class="profile-stat"><span>Progresso</span><strong>0%</strong></div><div class="profile-stat"><span>Meta semanal</span><strong>0m</strong></div></div>`;
    return
  }
  $("trackHero").innerHTML=`<h2>${esc(t.sigil||"☽")} ${esc(t.name)}</h2><div class="kicker">${esc(t.subtitle||"")}</div><p>${esc(t.description||"")}</p><p class="hint">Progressão: sequencial. Arcana libera um curso, um módulo e uma aula ativa por vez; conteúdo futuro continua visível para consulta.</p>`;
  const courses=orderedCoursesForTrack(t.id);
  if(courses.length&&!courses.some(course=>course.id===expandedCourseId)){
    expandedCourseId=activeCourseForTrack(t.id)?.id||courses[0].id
  }
  $("trackCourses").innerHTML=courses.length?courses.map(i=>courseRow(i)).join(""):`<div class="hint">Nenhum curso ainda.</div>`;
  const avg=courses.length?Math.round(courses.reduce((a,b)=>a+itemProgress(b),0)/courses.length):0,done=courses.filter(i=>itemProgress(i)>=100).length;
  $("trackProfile").innerHTML=`<div class="profile-grid"><div class="profile-stat"><span>Cursos</span><strong>${courses.length}</strong></div><div class="profile-stat"><span>Concluídos</span><strong>${done}</strong></div><div class="profile-stat"><span>Progresso</span><strong>${avg}%</strong></div><div class="profile-stat"><span>Meta semanal</span><strong>${t.weeklyGoal||0}m</strong></div></div>`
}
function curriculumCounts(course){
  const modules=Array.isArray(course.modules)?course.modules.length:0;
  const lessons=Array.isArray(course.modules)?course.modules.reduce((sum,module)=>sum+(Array.isArray(module.lessons)?module.lessons.length:0),0):0;
  return {modules,lessons}
}
function toggleCourseCurriculum(event,id){
  if(event?.target?.closest("button,a,summary,details.row-menu")){
    return
  }
  expandedCourseId=expandedCourseId===id?null:id;
  renderTracks()
}
function journeyMarker(sequence){return sequence==="completed"?"✓":sequence==="locked"?"◇":"●"}
function continuationTarget(id,scope="item"){
  const resource=resourceByScope(id,scope);
  if(!resource){
    return null
  }
  if(scope==="track"){
    const target=getActiveLearningTarget(resource);
    return target?{id:target.id,scope:target.type}:null
  }
  if(scope==="item"&&resource.kind==="course"){
    const module=activeModuleForCourse(resource);
    if(module){
      const lesson=activeLessonForModule(module);
      return lesson?{id:lesson.id,scope:"lesson"}:{id:module.id,scope:"module"}
    }
  }
  if(scope==="module"){
    const lesson=activeLessonForModule(resource);
    if(lesson){
      return {id:lesson.id,scope:"lesson"}
    }
  }
  return {id:resource.id,scope}
}
function continueResource(id,scope="item"){
  const target=continuationTarget(id,scope);
  if(!target){
    missingTarget();
    return
  }
  openFocus(target.id,target.scope)
}
function continueTrack(id){continueResource(id,"track")}
function currentModuleLabel(course){
  const module=activeModuleForCourse(course);
  if(module){
    return `Módulo atual: ${esc(module.title)}`
  }
  return itemProgress(course)>=100?"Currículo concluído":"Pronto para começar"
}
function rowMenu(id,scope){
  const resource=resourceByScope(id,scope),undo=completionUndoEligible(resource,scope)?`<button class="mini-btn" role="menuitem" onclick="confirmUndoCompletion(${jsArg(id)},${jsArg(scope)})">${completionUndoLabel(scope)}</button>`:"";
  return `<details class="row-menu" onclick="event.stopPropagation()"><summary aria-label="Mais ações" aria-haspopup="menu">⋯</summary><div role="menu"><button class="mini-btn" role="menuitem" onclick="openFichamentoForSource(${jsArg(id)},${jsArg(scope)})">Fichamento</button><button class="mini-btn" role="menuitem" onclick="openNotes(${jsArg(id)},${jsArg(scope)})">Notas</button>${undo}${scope==="item"?`<button class="mini-btn" role="menuitem" onclick="editItem(${jsArg(id)})">Editar</button>`:""}</div></details>`
}
function lessonRow(course,module,lesson){
  const progress=lessonProgress(lesson),sequence=lessonSequenceState(course,module,lesson),done=sequence==="completed",locked=sequence==="locked";
  return `<div class="lesson-row journey-row journey-${sequence} ${done?"done":""} ${locked?"locked":""}"><span class="journey-dot journey-${sequence}">${journeyMarker(sequence)}</span><div class="grow"><strong class="lesson-title" title="${esc(lesson.title)}">${esc(lesson.title)}</strong><span>${progress}% · ${sequenceStatusLabel(sequence)}${lesson.estimatedMinutes?` · ${fmtMin(lesson.estimatedMinutes)}`:""}</span></div><button class="mini-btn primary-action" onclick="event.stopPropagation();openFocus(${jsArg(lesson.id)},'lesson')" title="${locked?"Pedir confirmação para estudar fora da ordem":"Abrir Focus Circle"}">${done?"Rever":locked?"Estudar mesmo assim":"Continuar"}</button>${rowMenu(lesson.id,"lesson")}</div>`
}
function moduleRow(course,module){
  const progress=moduleProgress(module),sequence=moduleSequenceState(course,module),done=sequence==="completed",locked=sequence==="locked",lessons=orderedLessons(module);
  const lessonLabel=lessons.length?` · ${lessons.length} aula${lessons.length>1?"s":""}`:"";
  const active=sequence==="active";
  const action=active?`<button class="mini-btn primary-action" onclick="event.stopPropagation();continueResource(${jsArg(module.id)},'module')" title="Abrir Focus Circle">${done?"Rever":"Continuar"}</button>${rowMenu(module.id,"module")}`:"";
  return `<details class="module journey-module journey-${sequence} ${done?"done":""} ${locked?"locked":""}" id="${esc(module.id||"")}" ${active?"open":""}><summary class="module-main"><span class="journey-dot journey-${sequence}">${journeyMarker(sequence)}</span><div class="grow"><strong class="module-title" title="${esc(module.title)}">${esc(module.title)}</strong><span>${progress}% · ${sequenceStatusLabel(sequence)}${module.estimatedMinutes?` · ${fmtMin(module.estimatedMinutes)}`:""}${lessonLabel}</span><div class="progress"><div style="width:${progress}%"></div></div></div>${action}</summary>${active&&lessons.length?`<div class="lesson-list">${lessons.map(lesson=>lessonRow(course,module,lesson)).join("")}</div>`:""}</details>`
}
function childCourseRow(child){
  const progress=childCourseProgress(child);
  return `<div class="module child-course"><div class="module-main"><div class="grow"><strong class="module-title" title="${esc(child.title)}">${esc(child.title)}</strong><span>${progress}%${child.estimatedMinutes?` · ${fmtMin(child.estimatedMinutes)}`:""}</span><div class="progress"><div style="width:${progress}%"></div></div></div></div></div>`
}
function courseRow(i){
  const p=itemProgress(i),nc=noteCount(i.id),counts=curriculumCounts(i),expanded=expandedCourseId===i.id,sequence=courseSequenceState(i),locked=sequence==="locked";
  const lessonMeta=counts.lessons?` · ${counts.lessons} aula${counts.lessons>1?"s":""}`:"";
  const curriculumMeta=counts.modules?`${counts.modules} módulo${counts.modules>1?"s":""}${lessonMeta}`:"currículo oficial";
  const children=Array.isArray(i.childCourses)?i.childCourses:[];
  return `<div class="course-row clickable-row journey-row journey-${sequence} ${expanded?"expanded":""} ${locked?"locked":""}" role="button" tabindex="0" onclick="toggleCourseCurriculum(event,${jsArg(i.id)})" onkeydown="activateRow(event,this)"><span class="journey-dot journey-${sequence}">${journeyMarker(sequence)}</span><div class="grow"><strong class="course-title" title="${esc(i.title)}">${esc(i.title)}</strong><span>${p}% · ${sequenceStatusLabel(sequence)} · ${priorityLabel(i)} · ${nc} notas · ${curriculumMeta}</span><span class="course-current">${currentModuleLabel(i)}</span><div class="progress"><div style="width:${p}%"></div></div>${expanded?`<div class="module-list">${children.length?children.map(childCourseRow).join(""):""}${i.modules?.length?orderedModules(i).map(module=>moduleRow(i,module)).join(""):`<div class="hint">Currículo oficial sem aulas detalhadas.</div>`}</div>`:""}</div><button class="mini-btn primary-action" onclick="event.stopPropagation();continueResource(${jsArg(i.id)},'item')" title="${locked?"Pedir confirmação para estudar fora da ordem":"Abrir Focus Circle"}">${p>=100?"Rever":locked?"Estudar mesmo assim":"Continuar"}</button>${rowMenu(i.id,"item")}</div>`
}
function setTrack(id){if(!trackById(id)){missingTarget();return}state.activeTrack=id;save();renderTracks()}
function setTrackFormError(message=""){const el=$("trackFormError");if(!el){return}el.textContent=message;el.classList.toggle("hidden",!message)}
function setTrackSaving(saving){const btn=$("trackSaveBtn");if(!btn){return}btn.disabled=saving;btn.textContent=saving?"Salvando...":"Salvar"}
function makeTrackId(name,tracks=state.tracks){let base=name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"trilha",nid=base,n=2;while(tracks.some(t=>t.id===nid)){nid=`${base}-${n++}`}return nid}
function openTrackDialog(id=null){const f=$("trackForm"),fields=f.elements;f.reset();setTrackFormError();setTrackSaving(false);fields.id.value="";if(id){const t=trackById(id);if(!t){openTrackDialog();return}$("trackDialogTitle").textContent="Editar trilha";Object.keys(t).forEach(k=>{if(fields[k]){fields[k].value=t[k]??""}});$("deleteTrackBtn").classList.toggle("hidden",state.tracks.length<=1)}else{$("trackDialogTitle").textContent="Nova trilha";fields.sigil.value="☽";fields.weeklyGoal.value=120;$("deleteTrackBtn").classList.add("hidden")}$("trackDialog").showModal()}
async function saveTrack(e){e.preventDefault();const f=e.currentTarget,fields=f.elements,id=fields.id.value,name=fields.name.value.trim(),weeklyGoal=Number(fields.weeklyGoal.value)||0;setTrackFormError();if(!name){setTrackFormError("Informe um nome para salvar a trilha.");fields.name.focus();return}if(weeklyGoal<0){setTrackFormError("A meta semanal não pode ser negativa.");fields.weeklyGoal.focus();return}const previous=structuredClone(state),next=structuredClone(state),payload={name,sigil:fields.sigil.value.trim()||"☽",subtitle:fields.subtitle.value.trim(),description:fields.description.value.trim(),weeklyGoal,progression:"sequential"};if(id){const existing=next.tracks.find(t=>t.id===id);if(!existing){setTrackFormError("Esta trilha não existe mais. Atualize a página e tente novamente.");return}Object.assign(existing,payload)}else{const nid=makeTrackId(name,next.tracks);next.tracks.push({id:nid,...payload});next.activeTrack=nid;next.weeklyProgress=next.weeklyProgress||{};if(!Object.prototype.hasOwnProperty.call(next.weeklyProgress,nid)){next.weeklyProgress[nid]=0}}state=next;setTrackSaving(true);try{await save(false,"track");$("trackDialog").close();renderAll()}catch(err){state=previous;setTrackFormError(`Não consegui salvar a trilha: ${err.message||"erro de armazenamento"}.`)}finally{setTrackSaving(false)}}
function deleteTrack(){const id=$("trackForm").elements.id.value;if(!id||state.tracks.length<=1){return}if(!confirm("Excluir esta trilha e seus itens?")){return}state.tracks=state.tracks.filter(t=>t.id!==id);state.items=state.items.filter(i=>i.track!==id);state.activeTrack=state.tracks[0].id;save();$("trackDialog").close()}

function renderYoutube(){
  $("playlistTabs").innerHTML=state.playlists.map(p=>{
    return `<button class="playlist-tab ${p.id===state.activePlaylist?"active":""}" onclick="setPlaylist('${p.id}')"><strong>${esc(p.name)}</strong><span>${playlistPendingCount(p)} pendentes</span><div class="playlist-status-line">${playlistStatusChip(p)}</div></button>`
  }).join("");
  const p=activePlaylist();$("activePlaylistName").textContent=p?.name||"Sem playlist";
  const status=playlistStatusSummary(p);
  $("playlistSyncStatus").className=`sync-status ${syncing?"pending":status.tone}`;$("playlistSyncStatus").textContent=syncing?"Sincronizando":status.message;
  const syncBtn=$("syncPlaylistBtn");
  if(syncBtn){
    syncBtn.disabled=syncing;
    syncBtn.textContent=syncPlaylistButtonLabel(p)
  }
  updatePlaylistCatalogActions(p,status);
  const archivedCount=playlistArchivedCount(p);
  const panelLines=[];
  if(p?.url){
    panelLines.push(`<div class="hint">${esc(p.url)}</div>`)
  }
  if(p){
    panelLines.push(`<div class="hint">${playlistPendingCount(p)} vídeos ativos na fila${archivedCount?` · ${archivedCount} preservados no histórico local`:""}</div>`)
  }
  if(status.detail){
    panelLines.push(`<div class="hint">${esc(status.detail)}</div>`)
  }
  const catalogNote=catalogSyncNote(p);
  if(catalogNote){
    panelLines.push(`<div class="hint">${esc(catalogNote)}</div>`)
  }else if(youtubeCatalogMeta.error&&!isLocalBackend()){
    panelLines.push(`<div class="hint">Catálogo público indisponível agora: ${esc(youtubeCatalogMeta.error)}</div>`)
  }
  $("activePlaylistPanel").innerHTML=p?panelLines.join(""):"";
  const d=getDailyYT(),s=state.youtubeSettings;$("youtubeBudget").innerHTML=`<div class="budget-big">${budgetText()}</div><p class="hint">${limitReached()?"Limite atingido por hoje.":"Você ainda pode assistir dentro da cota."}</p>`;
  const today=todaysYoutube();$("dailyVideos").innerHTML=limitReached()&&s.hideAfterLimit?`<div class="hint">✦ Cota concluída por hoje.</div>`:today.length?today.map((v,n)=>videoRow(v,n,true)).join(""):`<div class="hint">${p?.lastSyncError?esc(p.lastSyncError):"Nenhum vídeo liberado agora."}</div>`;
  const queue=playlistQueue();$("youtubeQueue").innerHTML=queue.length?queue.slice(0,50).map((v,n)=>videoRow(v,n,false)).join(""):`<div class="hint">Fila vazia.</div>`
  scheduleYoutubeCatalogPolling()
}
function playlistQueue(){const p=activePlaylist();return state.youtubeQueue.filter(v=>v.playlistId===p?.id&&v.activeInCatalog!==false&&itemProgress(v)<100).sort((a,b)=>(a.position||0)-(b.position||0))}
function limitReached(){const d=getDailyYT(),s=state.youtubeSettings;if(s.mode==="none")return false;if(s.mode==="minutes")return d.minutes>=s.minutes;if(s.mode==="count")return d.count>=s.count;return d.minutes>=s.minutes||d.count>=s.count}
function budgetText(){const d=getDailyYT(),s=state.youtubeSettings;if(s.mode==="none")return `${d.count} vídeos · ${fmtMin(d.minutes)}`;if(s.mode==="minutes")return `${d.minutes}/${s.minutes} min`;if(s.mode==="count")return `${d.count}/${s.count} vídeos`;return `${d.minutes}/${s.minutes} min · ${d.count}/${s.count} vídeos`}
function todaysYoutube(){
  const q=playlistQueue(),d=getDailyYT(),s=state.youtubeSettings;
  if(s.hideAfterLimit&&limitReached()){
    return[]
  }
  if(s.mode==="none"){
    return q.slice(0,5)
  }
  const countLeft=Math.max(0,s.count-d.count),minLeft=Math.max(0,s.minutes-d.minutes);let out=[],used=0;
  // Videos without duration are allowed as the next pick, then stop the time-based queue so they are not treated as zero minutes.
  for(const v of q){
    const dur=Number(v.estimatedMinutes||0),hasDur=dur>0;
    if((s.mode==="count"||s.mode==="either")&&out.length>=countLeft){
      break
    }
    if((s.mode==="minutes"||s.mode==="either")&&out.length&&(!hasDur||used+dur>minLeft)){
      break
    }
    out.push(v);used+=hasDur?dur:minLeft
  }
  return out
}
function videoRow(v,n,today){
  const dur=Number(v.estimatedMinutes||0)>0?fmtMin(v.estimatedMinutes):"duração desconhecida";
  return `<div class="video-row clickable-row" role="button" tabindex="0" onclick="openFocus(${jsArg(v.id)},'youtube')" onkeydown="activateRow(event,this)">${v.thumbnail?`<img class="video-thumb" src="${esc(v.thumbnail)}">`:"<div class='num'>▶</div>"}<div class="grow"><strong>${esc(v.title)}</strong><span>${esc(v.channel||"YouTube")} · ${dur} ${today?`· vídeo ${n+1} de hoje`:""} · ${noteCount(v.id)} notas</span></div><button class="mini-btn" onclick="event.stopPropagation();openFocus(${jsArg(v.id)},'youtube')">Assistir</button><button class="mini-btn" onclick="event.stopPropagation();openFichamentoForSource(${jsArg(v.id)},'youtube')">Fichamento</button><button class="mini-btn" onclick="event.stopPropagation();openNotes(${jsArg(v.id)},'youtube')">Notas</button>${rowMenu(v.id,"youtube")}</div>`
}
function setPlaylist(id){if(!state.playlists.some(p=>p.id===id)){missingTarget();return}state.activePlaylist=id;save();renderYoutube()}
function setPlaylistFormError(message=""){const el=$("playlistFormError");if(!el){return}el.textContent=message;el.classList.toggle("hidden",!message)}
function setPlaylistSaving(saving){const btn=$("playlistSaveBtn");if(!btn){return}btn.disabled=saving;btn.textContent=saving?"Salvando...":"Salvar"}
function openPlaylistDialog(id=null){
  const f=$("playlistForm"),fields=f.elements;
  f.reset();
  setPlaylistFormError();
  setPlaylistSaving(false);
  fields.id.value="";
  fields.enabled.checked=true;
  if(id){
    const p=state.playlists.find(x=>x.id===id);
    $("playlistDialogTitle").textContent="Editar playlist";
    fields.id.value=p.id;
    fields.name.value=p.name;
    fields.url.value=p.url;
    fields.enabled.checked=p.enabled!==false;
    $("deletePlaylistBtn").classList.toggle("hidden",state.playlists.length<=1)
  }else{
    $("playlistDialogTitle").textContent="Nova playlist";
    $("deletePlaylistBtn").classList.add("hidden")
  }
  $("playlistDialog").showModal()
}
async function savePlaylist(e){
  e.preventDefault();
  const f=e.currentTarget,fields=f.elements,id=fields.id.value,name=fields.name.value.trim(),rawUrl=fields.url.value.trim(),enabled=fields.enabled.checked;
  setPlaylistFormError();
  if(!name){
    setPlaylistFormError("Informe um nome para salvar a playlist.");
    fields.name.focus();
    return
  }
  let normalizedUrl;
  try{
    normalizedUrl=normalizeYoutubePlaylistInput(rawUrl)
  }catch(err){
    setPlaylistFormError(err.message||"Não consegui entender a URL da playlist.");
    fields.url.focus();
    return
  }
  const previous=structuredClone(state);
  const next=structuredClone(state);
  const now=new Date().toISOString();
  const payload={name,url:normalizedUrl.url,youtubePlaylistId:normalizedUrl.youtubePlaylistId,enabled,updatedAt:now,lastSyncError:null};
  if(id){
    const playlist=next.playlists.find(p=>p.id===id);
    if(!playlist){
      setPlaylistFormError("Esta playlist não existe mais. Atualize a página e tente novamente.");
      return
    }
    Object.assign(playlist,payload)
  }else{
    const nid=crypto.randomUUID();
    next.playlists.push({id:nid,createdAt:now,catalogGeneratedAt:null,catalogTitle:null,lastSyncAt:null,...payload});
    next.activePlaylist=nid
  }
  state=normalize(next);
  setPlaylistSaving(true);
  try{
    await save(false,"playlist");
    $("playlistDialog").close();
    renderAll();
    await syncPlaylist()
  }catch(err){
    state=previous;
    setPlaylistFormError(`Não consegui salvar a playlist: ${err.message||"erro de armazenamento"}.`);
  }finally{
    setPlaylistSaving(false)
  }
}
function deletePlaylist(){const id=$("playlistForm").elements.id.value;if(state.playlists.length<=1){return alert("Mantenha pelo menos uma playlist.")}if(!confirm("Excluir esta playlist e sua fila local?")){return}state.playlists=state.playlists.filter(p=>p.id!==id);state.youtubeQueue=state.youtubeQueue.filter(v=>v.playlistId!==id);state.activePlaylist=state.playlists[0].id;save();$("playlistDialog").close()}
function mergePlaylistData(data,p){
  if(!Array.isArray(data.items)){
    throw new Error("Resposta sem lista de vídeos.")
  }
  const existing=state.youtubeQueue.filter(v=>v.playlistId===p.id);
  const old=new Map(existing.map(v=>[v.videoId||v.url,v]));
  const fresh=data.items.filter(v=>v&&v.title&&(v.videoId||v.url)).map((v,pos)=>{
    const videoId=v.videoId||youtubeVideoId(v.url)||v.id||v.url;
    const o=old.get(videoId)||old.get(v.url);
    const mins=v.durationSeconds?Math.max(1,Math.round(v.durationSeconds/60)):v.estimatedMinutes||o?.estimatedMinutes;
    const position=Math.max(0,(Number(v.position)||pos+1)-1);
    return {
      ...(o||{}),
      id:o?.id||crypto.randomUUID(),
      videoId,
      playlistId:p.id,
      youtubePlaylistId:data.playlistId||o?.youtubePlaylistId||playlistCatalogId(p)||"",
      kind:"youtube",
      title:v.title,
      url:v.url||o?.url||`https://www.youtube.com/watch?v=${videoId}`,
      channel:v.channel||o?.channel||"YouTube",
      thumbnail:v.thumbnail||o?.thumbnail||"",
      estimatedMinutes:mins,
      progress:o?.progress??0,
      status:o?.status||statusFromProgress(o?.progress||0),
      notes:o?.notes||"",
      important:o?.important??true,
      urgent:o?.urgent??false,
      track:o?.track||null,
      createdAt:o?.createdAt||new Date().toISOString(),
      position,
      catalogManaged:true,
      activeInCatalog:true,
      archivedAt:null
    }
  });
  const activeIds=new Set(fresh.map(v=>v.videoId||v.url));
  let carryPosition=fresh.length;
  const retained=existing.filter(v=>!activeIds.has(v.videoId||v.url)).map(v=>{
    if(v.catalogManaged===false){
      return {...v,activeInCatalog:v.activeInCatalog!==false,position:Number(v.position)>=0?Number(v.position):carryPosition++}
    }
    return {...v,activeInCatalog:false,archivedAt:v.archivedAt||new Date().toISOString(),position:Number(v.position)>=0?Number(v.position):carryPosition++}
  });
  state.youtubeQueue=state.youtubeQueue.filter(v=>v.playlistId!==p.id).concat(fresh,retained);
  if(!p.name){
    p.name=data.title||p.name
  }
  p.catalogTitle=data.title||p.catalogTitle||null;
  const canonicalPlaylist=normalizeYoutubePlaylistReference(data.playlistId||p.youtubePlaylistId||p.url||playlistCatalogId(p)||"");
  p.url=canonicalPlaylist.url;
  p.youtubePlaylistId=canonicalPlaylist.youtubePlaylistId;
  p.catalogGeneratedAt=data.generatedAt||p.catalogGeneratedAt||youtubeCatalogMeta.generatedAt||null;
  p.updatedAt=new Date().toISOString();
  p.lastSyncAt=new Date().toISOString();
  p.lastSyncError=null
}
function youtubeVideoId(url){
  try{
    const u=new URL(url);
    if(u.hostname.includes("youtu.be")){return u.pathname.slice(1)}
    return u.searchParams.get("v")||""
  }catch{return ""}
}
function addYoutubeUrlToQueue(url,title="YouTube"){
  const p=activePlaylist(),videoId=youtubeVideoId(url)||url;
  if(!p){return}
  if(state.youtubeQueue.some(v=>v.playlistId===p.id&&(v.videoId===videoId||v.url===url))){return}
  state.youtubeQueue.push({id:crypto.randomUUID(),videoId,playlistId:p.id,youtubePlaylistId:p.youtubePlaylistId||"",kind:"youtube",title,url,channel:"YouTube",thumbnail:"",estimatedMinutes:0,progress:0,status:"nao_iniciado",notes:"",important:true,urgent:false,track:null,createdAt:new Date().toISOString(),position:state.youtubeQueue.filter(v=>v.playlistId===p.id).length,catalogManaged:false,activeInCatalog:true,archivedAt:null})
}
function exportPlaylistFile(){
  const p=activePlaylist();
  if(!p){return}
  const items=state.youtubeQueue.filter(v=>v.playlistId===p.id).sort((a,b)=>(a.position||0)-(b.position||0)).map(v=>({videoId:v.videoId||youtubeVideoId(v.url),title:v.title,url:v.url,channel:v.channel,thumbnail:v.thumbnail,durationSeconds:v.estimatedMinutes?Number(v.estimatedMinutes)*60:null,estimatedMinutes:v.estimatedMinutes}));
  const data={title:p.name,playlistId:p.youtubePlaylistId||"",sourceUrl:p.url||"",exportedAt:new Date().toISOString(),items};
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
  a.download=`arcana-playlist-${(p.name||"playlist").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||"playlist"}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
async function syncPlaylist(){
  const p=activePlaylist();
  if(syncing){
    return
  }
  if(!p?.url){
    p.lastSyncError="Defina a URL.";
    save(false);
    renderAll();
    return
  }
  syncing=true;renderYoutube();
  try{
    if(isLocalBackend()){
      const r=await fetch(`/api/playlist?url=${encodeURIComponent(p.url)}`),text=await r.text();let data={};try{data=text?JSON.parse(text):{}}catch{throw new Error(`Resposta inválida do servidor (${r.status}).`)}if(!r.ok){throw new Error(data.error||`Falha (${r.status})`)}
      mergePlaylistData(data,p);
      await save(false,"youtube-local-sync")
    }else{
      const catalog=await fetchPublishedCatalog(true);
      const merged=applyPublishedCatalog(catalog,{targetPlaylist:p});
      if(!merged){
        p.lastSyncError=null;
        p.updatedAt=new Date().toISOString();
        await save(false,"youtube-awaiting-catalog")
      }else{
        await save(false,"youtube-catalog-sync")
      }
    }
  }catch(e){p.lastSyncError=e.message||String(e);await save(false,"youtube-sync-error")}finally{syncing=false;renderAll()}
}

function renderLibrary(){
  const q=$("searchInput").value.toLowerCase().trim(),tf=$("libraryTypeFilter").value,pf=$("priorityFilter").value;
  const list=state.items.filter(i=>(tf==="all"||i.kind===tf)&&(pf==="all"||priorityCode(i)===pf)&&(!q||[i.title,i.source,i.notes].join(" ").toLowerCase().includes(q)));
  $("libraryGrid").innerHTML=list.length?list.map(i=>libraryCard(i)).join(""):`<div class="hint">Nada encontrado.</div>`
}
function libraryCard(i){const p=itemProgress(i),tr=trackById(i.track);return `<article class="library-item clickable-row" role="button" tabindex="0" onclick="openFocus(${jsArg(i.id)},'item')" onkeydown="activateRow(event,this)"><span class="tag priority-${priorityCode(i)}">${priorityLabel(i)}</span><h3>${esc(i.title)}</h3><div class="meta"><span>${esc(tr?.name||"Sem trilha")}</span><span>${esc(i.source||i.kind)}</span><span>${p}%</span><span>${noteCount(i.id)} notas</span></div><div class="progress"><div style="width:${p}%"></div></div>${i.notes?`<p class="hint">${esc(i.notes).slice(0,180)}</p>`:""}<div class="item-actions"><button class="mini-btn" onclick="event.stopPropagation();openFocus(${jsArg(i.id)},'item')">Focar</button><button class="mini-btn" onclick="event.stopPropagation();editItem(${jsArg(i.id)})">Editar</button><button class="mini-btn" onclick="event.stopPropagation();openFichamentoForSource(${jsArg(i.id)},'item')">Fichamento</button><button class="mini-btn" onclick="event.stopPropagation();openNotes(${jsArg(i.id)},'item')">Notas</button></div></article>`}
function openItemDialog(kind="course",id=null){
  const active=ensureActiveTrack();
  const f=$("itemForm"),fields=f.elements;f.reset();fields.id.value=id||"";fields.track.innerHTML=state.tracks.length?state.tracks.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join(""):`<option value="">Sem trilha</option>`;fields.track.value=active?.id||"";fields.kind.value=kind;renderModuleEditor();
  if(id){const i=state.items.find(x=>x.id===id);if(!i){missingTarget();return}["kind","track","title","url","source","estimatedMinutes","progress","notes"].forEach(k=>{if(fields[k]){fields[k].value=i[k]??""}});fields.important.value=String(i.important!==false);fields.urgent.value=String(!!i.urgent);renderModuleEditor(i.modules||[])}
  $("itemDialog").showModal()
}
function editItem(id){openItemDialog("course",id)}
function renderModuleEditor(modules=[]){const f=$("itemForm"),show=f.elements.kind.value==="course";$("moduleEditor").classList.toggle("hidden",!show);if(show){$("moduleRows").innerHTML=modules.map((m,n)=>moduleInput(m,n)).join("")}}
function moduleInput(m={},n=Date.now()){return `<div class="module-input-row"><input data-module-title value="${esc(m.title||"")}" placeholder="Nome do módulo/aula"><input data-module-minutes type="number" min="0" value="${m.minutes||0}" placeholder="min"><button type="button" class="x" onclick="this.parentElement.remove()">×</button></div>`}
function saveItem(e){e.preventDefault();const f=e.currentTarget,fields=f.elements,id=fields.id.value;let i=id?state.items.find(x=>x.id===id):{id:crypto.randomUUID(),createdAt:new Date().toISOString()};Object.assign(i,{kind:fields.kind.value,track:fields.track.value,title:fields.title.value.trim(),url:fields.url.value.trim(),source:fields.source.value.trim(),important:fields.important.value==="true",urgent:fields.urgent.value==="true",estimatedMinutes:Number(fields.estimatedMinutes.value)||0,progress:Number(fields.progress.value)||0,notes:fields.notes.value});i.status=statusFromProgress(i.progress);if(i.kind==="course"){assignCourseOrder(i);const oldModules=Array.isArray(i.modules)?i.modules:[];i.modules=[...document.querySelectorAll("#moduleRows .module-input-row")].map((r,index)=>{const title=r.querySelector("[data-module-title]").value.trim(),existing=oldModules[index]||{};return {id:existing.id||crypto.randomUUID(),title,minutes:Number(r.querySelector("[data-module-minutes]").value)||0,estimatedMinutes:Number(r.querySelector("[data-module-minutes]").value)||0,progress:Number(existing.progress)||0,status:existing.status||"nao_iniciado",done:!!existing.done,order:Number(existing.order)||index+1,lessons:Array.isArray(existing.lessons)?existing.lessons:[]}}).filter(m=>m.title)}if(!id){state.items.push(i)}save();$("itemDialog").close()}

function detectInbox(text){
  const t=text.trim(),low=t.toLowerCase();let type="manual";
  if(/youtube\.com|youtu\.be/.test(low))type="youtube";else if(/coursera\.org|udemy\.com|edx\.org/.test(low))type="course";else if(/github\.com/.test(low))type="repo";else if(/substack\.com|newsletter/.test(low))type="newsletter";else if(/spotify\.com.*episode|podcast/.test(low))type="podcast";else if(/\.pdf($|\?)/.test(low))type="reading";else if(/^https?:\/\//.test(low))type="article";
  return {id:crypto.randomUUID(),raw:t,url:/^https?:\/\//.test(t)?t:"",title:/^https?:\/\//.test(t)?t.replace(/^https?:\/\//,"").slice(0,80):t,type,createdAt:new Date().toISOString()}
}
function renderInbox(){$("inboxList").innerHTML=state.inbox.length?state.inbox.map(x=>`<div class="inbox-row"><span class="inbox-type">${esc(x.type)}</span><div class="grow"><strong>${esc(x.title)}</strong><span>${esc(x.url||"")}</span></div><button class="mini-btn" onclick="promoteInbox(${jsArg(x.id)})">Organizar</button><button class="mini-btn danger" onclick="removeInbox(${jsArg(x.id)})">×</button></div>`).join(""):`<div class="hint">Inbox vazia.</div>`}
function captureInbox(){const v=$("inboxInput").value.trim();if(!v){return}state.inbox.unshift(detectInbox(v));$("inboxInput").value="";save();notice("Captura guardada na inbox.")}
function removeInbox(id){state.inbox=state.inbox.filter(x=>x.id!==id);save()}
function promoteInbox(id){const x=state.inbox.find(a=>a.id===id);if(!x){return}if(x.type==="youtube"){addYoutubeUrlToQueue(x.url,x.title);navigateTo("youtube")}else{openItemDialog(x.type);const fields=$("itemForm").elements;fields.title.value=x.title;fields.url.value=x.url}state.inbox=state.inbox.filter(a=>a.id!==id);save(false);notice("Captura organizada.")}

async function openNotes(id,scope){
  notesRef={id,scope};const i=resourceByScope(id,scope);if(!i){missingTarget();return}
  $("notesTitle").textContent=i.title||"Notas";
  if(i.vaultNoteId){
    try{const data=await api(`/api/notes/${encodeURIComponent(i.vaultNoteId)}`);$("notesText").value=data.note.content||"";notesRef.noteId=i.vaultNoteId}catch{$("notesText").value=i.notes||noteTemplate("quick",`Notas - ${i.title}`)}
  }else{
    $("notesText").value=i.notes?.startsWith("#")?i.notes:noteTemplate("quick",`Notas - ${i.title}`)
  }
  $("notesDialog").showModal()
}
function sourceTypeForResource(resource,scope){
  if(scope==="youtube"){
    return "video"
  }
  return resource?.sourceType||resource?.kind||scope||"resource"
}
function findCourseForModule(moduleId){
  if(!moduleId){
    return null
  }
  return state.items.find(item=>Array.isArray(item.modules)&&item.modules.some(module=>module.id===moduleId))||null
}
function findCourseAndModuleForLesson(lessonId){
  if(!lessonId){
    return {course:null,module:null}
  }
  for(const course of state.items){
    for(const module of course.modules||[]){
      if((module.lessons||[]).some(lesson=>lesson.id===lessonId)){
        return {course,module}
      }
    }
  }
  return {course:null,module:null}
}
function studyContextForResource(resource,scope){
  const found=scope==="lesson"?findCourseAndModuleForLesson(resource?.id):{course:null,module:null};
  let course=found.course||null,module=found.module||null,lesson=null;
  if(scope==="lesson"){
    lesson=resource||null
  }
  if(scope==="module"){
    module=resource||null;
    course=state.items.find(item=>item.id===resource?.courseId)||findCourseForModule(resource?.id)
  }
  if(scope==="item"&&resource?.kind==="course"){
    course=resource
  }
  if(!course&&resource?.courseId){
    course=state.items.find(item=>item.id===resource.courseId)||null
  }
  if(!module&&resource?.moduleId){
    module=(course?.modules||[]).find(item=>item.id===resource.moduleId)||state.items.flatMap(item=>item.modules||[]).find(item=>item.id===resource.moduleId)||null
  }
  const trackId=resource?.track||resource?.trackId||course?.track||course?.trackId||null;
  return {track:trackById(trackId)||null,course,module,lesson,trackId,courseId:course?.id||resource?.courseId||(scope==="item"&&resource?.kind==="course"?resource.id:null)||null,moduleId:module?.id||resource?.moduleId||null,lessonId:lesson?.id||resource?.lessonId||null}
}
function sourcePayloadForResource(resource,scope,extra={}){
  const context=studyContextForResource(resource,scope);
  return {id:resource?.id||"",title:resource?.title||"",sourceTitle:resource?.title||"",url:resource?.url||"",kind:resource?.kind||scope,trackId:context.trackId,courseId:context.courseId,moduleId:context.moduleId,lessonId:context.lessonId,timestamp:extra.timestamp||"",minutes:extra.minutes||0}
}
async function saveNotes(){
  if(!notesRef)return;const i=resourceByScope(notesRef.id,notesRef.scope);if(!i)return;
  const source=sourcePayloadForResource(i,notesRef.scope);
  const payload={title:`Notas - ${i.title}`,type:"quick",content:$("notesText").value,trackId:i.track||null,sourceType:sourceTypeForResource(i,notesRef.scope),sourceId:i.id,courseId:source.courseId,moduleId:source.moduleId,lessonId:source.lessonId,tags:["nota"],source};
  try{
    const data=notesRef.noteId?await api(`/api/notes/${encodeURIComponent(notesRef.noteId)}`,{method:"PUT",body:JSON.stringify(payload)}):await api("/api/notes",{method:"POST",body:JSON.stringify(payload)});
    i.vaultNoteId=data.note.id;i.notes=(data.note.excerpt||"").slice(0,180);state.obsidian.syncStatus="saved";save(false);await loadVaultNotes();$("notesDialog").close()
  }catch(e){alert(e.message)}
}

function findFocus(id,scope){return resourceByScope(id,scope)}
function renderFocusContext(context){
  if(!$("focusContext")){
    return
  }
  const items=[
    context.track?{label:"Trilha",title:context.track.name,action:`navigateTo('tracks',{trackId:${jsArg(context.track.id)}})`}:null,
    context.course?{label:"Curso",title:context.course.title}:null,
    context.module?{label:"Módulo",title:context.module.title}:null,
    context.lesson?{label:"Aula",title:context.lesson.title}:null
  ].filter(Boolean);
  $("focusContext").innerHTML=items.length?`<nav class="breadcrumb" aria-label="Contexto">${items.map((item,index)=>`<button type="button" ${item.action?`onclick="${item.action}"`:"disabled"}><small>${esc(item.label)}</small><span>${esc(item.title)}</span></button>${index<items.length-1?`<span class="crumb-sep">›</span>`:""}`).join("")}</nav>`:`<nav class="breadcrumb"><span>Contexto de estudo avulso</span></nav>`
}
function firstMeaningfulLine(text=""){
  return String(text||"").split(/\r?\n/).map(line=>line.trim()).find(Boolean)||""
}
function canonicalFocusBlockType(type){
  return FOCUS_BLOCK_TYPE_ALIASES[type]||"free-note"
}
function normalizeKnowledgeTitle(text=""){
  return String(text||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()
}
function noteKnowledgeKeys(note){
  return [note?.title,...(Array.isArray(note?.aliases)?note.aliases:[])].map(normalizeKnowledgeTitle).filter(Boolean)
}
function findExistingKnowledgeMatch(candidate,targetType=null){
  const title=normalizeKnowledgeTitle(candidate?.title);
  if(!title){
    return null
  }
  return vaultNotes.find(note=>{
    if(note.status==="archived"){
      return false
    }
    if(targetType&&note.type!==targetType){
      return false
    }
    return noteKnowledgeKeys(note).includes(title)
  })||null
}
function extractionSourceReference(sessionNote={},candidate={}){
  return {
    sourceSessionId:sessionNote.sessionId||sessionNote.id||null,
    sourceNoteId:sessionNote.id||null,
    sourceResourceId:sessionNote.resourceId||sessionNote.sourceId||sessionNote.source?.id||null,
    sourceId:sessionNote.sourceId||sessionNote.resourceId||sessionNote.source?.id||null,
    sourceTitle:sessionNote.sourceTitle||sessionNote.source?.title||sessionNote.title||"",
    sourceType:sessionNote.sourceType||sessionNote.source?.kind||"",
    sourceBlockId:candidate.sourceBlockId||null,
    sourceTimestamp:candidate.sourceTimestamp||candidate.timestamp||"",
    sourcePage:candidate.sourcePage||candidate.page||"",
    sourceExcerpt:candidate.sourceExcerpt||candidate.content||"",
    trackId:sessionNote.trackId||null,
    courseId:sessionNote.courseId||null,
    moduleId:sessionNote.moduleId||null,
    lessonId:sessionNote.lessonId||null,
    createdAt:new Date().toISOString()
  }
}
function sourceReferenceKey(ref={}){
  return [ref.sourceNoteId,ref.sourceBlockId,ref.sourceTimestamp,ref.sourcePage,normalizeKnowledgeTitle(ref.sourceExcerpt).slice(0,80)].join("|")
}
function mergeUniqueSourceReferences(existing=[],incoming=[]){
  const map=new Map();
  for(const ref of [...(Array.isArray(existing)?existing:[]),...(Array.isArray(incoming)?incoming:[])]){
    const key=sourceReferenceKey(ref);
    if(key.replace(/\|/g,"")){
      map.set(key,{...ref})
    }
  }
  return [...map.values()]
}
function extractionCandidateFromBlock(block,sessionNote){
  const type=canonicalFocusBlockType(block.type);
  const candidateType=type==="insight"?"permanent-note":type;
  if(!KNOWLEDGE_CANDIDATE_TYPES[candidateType]||candidateType==="free-note"){
    return null
  }
  const title=focusBlockTitle({...block,type}).slice(0,110);
  const content=String(block.content||block.title||"").trim();
  const match=findExistingKnowledgeMatch({title},KNOWLEDGE_CANDIDATE_TYPES[candidateType]?.targetNoteType);
  return {id:crypto.randomUUID(),type:candidateType,title,content,selected:true,linkMode:match?"existing":"new",targetId:match?.id||"",route:candidateType==="next-action"?"inbox":"knowledge",reviewIntervalDays:7,relatedKnowledgeIds:[],sourceBlockId:block.id||null,sourceTimestamp:block.timestamp||"",sourcePage:block.page||"",sourceExcerpt:content||title,origin:"semantic",createdAt:new Date().toISOString(),sessionNoteId:sessionNote?.id||null}
}
function extractionCandidateFromMarker(line,sessionNote,index){
  const match=String(line||"").match(/^\s*(Conceito|Pergunta|Insight|Citacao|Citação|Exemplo|Formula|Fórmula|Comando|Proximo passo|Próximo passo|Acao|Ação|Nota permanente)\s*:\s*(.+?)\s*$/i);
  if(!match){
    return null
  }
  const labels={conceito:"concept",pergunta:"question",insight:"permanent-note",citacao:"quote","citação":"quote",exemplo:"example",formula:"formula-command","fórmula":"formula-command",comando:"formula-command","proximo passo":"next-action","próximo passo":"next-action",acao:"next-action","ação":"next-action","nota permanente":"permanent-note"};
  const type=labels[normalizeKnowledgeTitle(match[1])];
  const text=match[2].trim();
  const title=firstMeaningfulLine(text).replace(/^[-*]\s*/,"").slice(0,110)||KNOWLEDGE_CANDIDATE_TYPES[type]?.label||"Nota";
  const targetType=KNOWLEDGE_CANDIDATE_TYPES[type]?.targetNoteType;
  const existing=findExistingKnowledgeMatch({title},targetType);
  return {id:crypto.randomUUID(),type,title,content:text,selected:true,linkMode:existing?"existing":"new",targetId:existing?.id||"",route:type==="next-action"?"inbox":"knowledge",reviewIntervalDays:7,relatedKnowledgeIds:[],sourceBlockId:`raw-line-${index+1}`,sourceTimestamp:"",sourcePage:"",sourceExcerpt:text,origin:"semantic",createdAt:new Date().toISOString(),sessionNoteId:sessionNote?.id||null}
}
class KnowledgeExtractionProvider{
  constructor(config){
    this.id=config.id;
    this.label=config.label;
    if(config.extract){
      this.extract=config.extract
    }
  }
  async extract(){
    throw new Error("Provider de extração não implementado.")
  }
}
const KNOWLEDGE_EXTRACTION_PROMPT=[
  "Organize notas brutas de estudo em sugestões estruturadas para revisão humana.",
  "Extraia apenas conhecimento explicitamente apoiado pelas notas enviadas; não use fatos externos, correções ou expansões.",
  "A nota original é a fonte de verdade. Gere unidades reutilizáveis e úteis, não uma sugestão para cada frase.",
  "Respeite marcações semânticas explícitas quando existirem e preserve trechos de origem curtos.",
  "Pessoas não devem virar conceitos por padrão. Retorne JSON no schema solicitado."
].join(" ");
const LOCAL_KNOWLEDGE_EXTRACTION_PROVIDER=new KnowledgeExtractionProvider({id:"local-semantic-blocks",label:"Local semantic blocks",async extract(input){
  const candidates=[];
  for(const block of normalizeFocusBlocks(input.blocks||[])){
    const candidate=extractionCandidateFromBlock(block,input.sessionNote);
    if(candidate){
      candidates.push(candidate)
    }
  }
  String(input.rawNotes||"").split(/\r?\n/).forEach((line,index)=>{
    const candidate=extractionCandidateFromMarker(line,input.sessionNote,index);
    if(candidate){
      candidates.push(candidate)
    }
  });
  return {providerId:this.id,providerLabel:"Marcações manuais",rawNoteSource:"session-note",candidates,connections:[],people:[],createdAt:new Date().toISOString(),extractionSchemaVersion:KNOWLEDGE_EXTRACTION_SCHEMA_VERSION}
}});
const KNOWLEDGE_EXTRACTION_SESSION_SECRET_KEY="arcana-knowledge-extraction-session-secret";
function knowledgeExtractionSettings(){
  return normalizeKnowledgeExtractionSettings(state.knowledgeExtraction||{})
}
function knowledgeExtractionSessionSecret(){
  try{
    return sessionStorage.getItem(KNOWLEDGE_EXTRACTION_SESSION_SECRET_KEY)||""
  }catch(err){
    return ""
  }
}
function setKnowledgeExtractionSessionSecret(value){
  try{
    if(value){
      sessionStorage.setItem(KNOWLEDGE_EXTRACTION_SESSION_SECRET_KEY,value)
    }else{
      sessionStorage.removeItem(KNOWLEDGE_EXTRACTION_SESSION_SECRET_KEY)
    }
  }catch(err){
    console.warn("[Arcana] session credential unavailable",err)
  }
}
function sameOriginEndpoint(endpoint){
  try{
    return new URL(endpoint,location.href).origin===location.origin
  }catch(err){
    return false
  }
}
function runtimeAllowsBrowserExtraction(settings){
  const env=runtimeEnvironment();
  if(!settings.ai.endpoint){
    return false
  }
  if(sameOriginEndpoint(settings.ai.endpoint)){
    return true
  }
  return !env.production&&settings.ai.allowBrowserDevSecret&&!!knowledgeExtractionSessionSecret()
}
function knowledgeExtractionAiStatus(settings=knowledgeExtractionSettings()){
  if(settings.provider!=="ai"){
    return {configured:false,label:"Não configurado"}
  }
  return runtimeAllowsBrowserExtraction(settings)?{configured:true,label:"Configurado"}:{configured:false,label:"Não configurado"}
}
function resourceContextForExtraction(sessionNote={},source={}){
  const item=itemById(sessionNote.courseId||source.courseId||source.id);
  const track=trackById(sessionNote.trackId||source.trackId||item?.track);
  const module=(item?.modules||[]).find(module=>module.id===(sessionNote.moduleId||source.moduleId));
  const lesson=(module?.lessons||[]).find(lesson=>lesson.id===(sessionNote.lessonId||source.lessonId));
  return {
    track:track?{id:track.id,title:track.name}:null,
    course:item?{id:item.id,title:item.title,type:item.kind||"course"}:null,
    module:module?{id:module.id,title:module.title}:null,
    lesson:lesson?{id:lesson.id,title:lesson.title}:null
  }
}
function sanitizeKnowledgeExtractionPayload(input={}){
  const sessionNote=input.sessionNote||{};
  const session=input.session||{};
  const source=input.source||{};
  const blocks=normalizeFocusBlocks(input.blocks||sessionNote.blocks||[]).map(block=>({
    id:block.id,
    type:block.type,
    title:block.title,
    content:block.content,
    timestamp:block.timestamp,
    page:block.page
  }));
  return {
    schemaVersion:KNOWLEDGE_EXTRACTION_SCHEMA_VERSION,
    session:{id:session.id||sessionNote.sessionId||sessionNote.id||null,title:session.title||sessionNote.title||"",durationMinutes:Number(session.minutes||session.durationMinutes||sessionNote.durationMinutes||0)||0},
    resource:{id:sessionNote.resourceId||sessionNote.sourceId||source.id||null,title:sessionNote.sourceTitle||source.title||"",type:sessionNote.sourceType||source.kind||source.type||"",url:source.url||sessionNote.source?.url||"",courseContext:resourceContextForExtraction(sessionNote,source)},
    rawNotes:String(input.rawNotes||sessionNote.content||""),
    semanticBlocks:blocks
  }
}
function assertAiExtractionObject(raw){
  if(!raw||typeof raw!=="object"||Array.isArray(raw)){
    throw new Error("Resposta da IA não tem o formato esperado.")
  }
  for(const key of ["concepts","permanentNotes","questions","nextActions","quotes","examples","formulasCommands","people","connections"]){
    if(raw[key]!==undefined&&!Array.isArray(raw[key])){
      throw new Error(`Campo inválido na extração: ${key}.`)
    }
  }
}
function aiCandidate(input,type,title,content,extra={}){
  const targetType=KNOWLEDGE_CANDIDATE_TYPES[type]?.targetNoteType;
  const match=findExistingKnowledgeMatch({title},targetType);
  return {id:crypto.randomUUID(),type,title:String(title||"").slice(0,110)||KNOWLEDGE_CANDIDATE_TYPES[type]?.label||"Sugestão",content:String(content||title||"").trim(),selected:true,linkMode:match?"existing":"new",targetId:match?.id||"",route:type==="next-action"?(extra.suggestedDestination||"inbox"):"knowledge",reviewIntervalDays:7,relatedKnowledgeIds:[],sourceBlockId:extra.sourceBlockId||"ai-extraction",sourceTimestamp:extra.sourceTimestamp||"",sourcePage:extra.sourcePage||"",sourceExcerpt:String(extra.sourceExcerpt||content||title||"").trim(),origin:"ai",createdAt:new Date().toISOString(),sessionNoteId:input.sessionNote?.id||null}
}
function normalizeAIKnowledgeExtractionResult(raw,input={}){
  const extraction=raw?.extraction&&typeof raw.extraction==="object"?raw.extraction:raw;
  assertAiExtractionObject(extraction);
  const candidates=[];
  for(const item of extraction.concepts||[]){
    candidates.push(aiCandidate(input,"concept",item.title,item.description,{sourceExcerpt:item.sourceExcerpt,sourceTimestamp:item.sourceTimestamp}))
  }
  for(const item of extraction.permanentNotes||[]){
    candidates.push(aiCandidate(input,"permanent-note",item.title,item.content,{sourceExcerpt:item.sourceExcerpt}))
  }
  for(const item of extraction.questions||[]){
    candidates.push(aiCandidate(input,"question",item.question,item.context||item.question,{sourceExcerpt:item.sourceExcerpt}))
  }
  for(const item of extraction.nextActions||[]){
    candidates.push(aiCandidate(input,"next-action",item.title,item.context||item.title,{sourceExcerpt:item.sourceExcerpt,suggestedDestination:item.suggestedDestination||"inbox"}))
  }
  for(const item of extraction.quotes||[]){
    candidates.push(aiCandidate(input,"quote",item.title||firstMeaningfulLine(item.content||item.quote),item.content||item.quote,{sourceExcerpt:item.sourceExcerpt||item.content||item.quote}))
  }
  for(const item of extraction.examples||[]){
    candidates.push(aiCandidate(input,"example",item.title,item.content||item.example,{sourceExcerpt:item.sourceExcerpt}))
  }
  for(const item of extraction.formulasCommands||[]){
    candidates.push(aiCandidate(input,"formula-command",item.title,item.content||item.command||item.formula,{sourceExcerpt:item.sourceExcerpt}))
  }
  return {candidates:candidates.filter(candidate=>candidate.title&&candidate.content),people:Array.isArray(extraction.people)?extraction.people:[],connections:Array.isArray(extraction.connections)?extraction.connections:[]}
}
class AIKnowledgeExtractionProvider extends KnowledgeExtractionProvider{
  constructor(config={}){
    super({id:"ai-structured",label:"AI"});
    this.responder=config.responder||null
  }
  async extract(input){
    const settings=knowledgeExtractionSettings();
    if(settings.provider!=="ai"||!runtimeAllowsBrowserExtraction(settings)){
      throw new Error("Extração por IA não configurada.")
    }
    const payload={instruction:KNOWLEDGE_EXTRACTION_PROMPT,input:sanitizeKnowledgeExtractionPayload(input)};
    const response=this.responder?await this.responder(payload):await fetch(settings.ai.endpoint,{method:"POST",headers:{"Content-Type":"application/json",...(knowledgeExtractionSessionSecret()?{"Authorization":`Bearer ${knowledgeExtractionSessionSecret()}`}:{})},body:JSON.stringify(payload)});
    const json=this.responder?response:await response.json();
    if(!this.responder&&!response.ok){
      throw new Error(json?.error||"Não foi possível gerar sugestões automáticas.")
    }
    const normalized=normalizeAIKnowledgeExtractionResult(json,input);
    return {providerId:this.id,providerLabel:"Extração por IA",providerKind:"ai",model:settings.ai.model||"",rawNoteSource:"session-note",createdAt:new Date().toISOString(),extractionSchemaVersion:KNOWLEDGE_EXTRACTION_SCHEMA_VERSION,...normalized}
  }
}
class MockAIKnowledgeExtractionProvider extends AIKnowledgeExtractionProvider{
  constructor(result){
    super({responder:async()=>result});
    this.id="mock-ai-structured";
    this.label="Mock AI"
  }
}
const AI_KNOWLEDGE_EXTRACTION_PROVIDER=new AIKnowledgeExtractionProvider();
const KnowledgeExtractionProviders={local:LOCAL_KNOWLEDGE_EXTRACTION_PROVIDER,ai:AI_KNOWLEDGE_EXTRACTION_PROVIDER};
function selectedKnowledgeExtractionProvider(){
  return knowledgeExtractionSettings().provider==="ai"?KnowledgeExtractionProviders.ai:KnowledgeExtractionProviders.local
}
function extractionCandidateKey(candidate){
  return [candidate.type,normalizeKnowledgeTitle(candidate.title),normalizeKnowledgeTitle(candidate.sourceExcerpt||candidate.content).slice(0,90)].join("|")
}
function dedupeExtractionCandidates(candidates=[]){
  const map=new Map();
  for(const candidate of candidates){
    const key=extractionCandidateKey(candidate);
    if(!key.replace(/\|/g,"")){
      continue
    }
    if(!map.has(key)||map.get(key).origin==="ai"&&candidate.origin==="semantic"){
      map.set(key,candidate)
    }
  }
  return [...map.values()]
}
async function extractKnowledge(input,provider=selectedKnowledgeExtractionProvider()){
  return provider.extract(input)
}
async function runKnowledgeExtraction(input,provider=selectedKnowledgeExtractionProvider()){
  const semantic=await KnowledgeExtractionProviders.local.extract(input);
  if(provider.id===KnowledgeExtractionProviders.local.id){
    return {...semantic,candidates:dedupeExtractionCandidates(semantic.candidates)}
  }
  try{
    const ai=await provider.extract(input);
    const candidates=dedupeExtractionCandidates([...(semantic.candidates||[]),...(ai.candidates||[])]);
    return {...ai,candidates,semanticCount:(semantic.candidates||[]).length,automaticCount:(ai.candidates||[]).length}
  }catch(error){
    return {...semantic,status:"failed",error:error.message||"Não foi possível gerar sugestões automáticas.",providerId:provider.id,providerLabel:"Extração por IA",semanticCount:(semantic.candidates||[]).length,automaticCount:0,candidates:dedupeExtractionCandidates(semantic.candidates||[])}
  }
}
function focusBlockTitle(block){
  const type=canonicalFocusBlockType(block?.type);
  return String(block?.title||firstMeaningfulLine(block?.content)||FOCUS_BLOCK_TYPES[type]?.label||"Bloco").trim()
}
function normalizeFocusBlocks(blocks){
  if(!Array.isArray(blocks)){
    return []
  }
  return blocks.map(block=>({id:block.id||crypto.randomUUID(),type:canonicalFocusBlockType(block.type),title:block.title||"",content:block.content||"",timestamp:block.timestamp||"",page:block.page||"",sessionId:block.sessionId||focusNoteId||null,resourceId:block.resourceId||focusRef?.id||null,sourceId:block.sourceId||block.resourceId||focusRef?.id||null,noteId:block.noteId||null,promotedAs:block.promotedAs||null,createdAt:block.createdAt||new Date().toISOString(),updatedAt:block.updatedAt||block.createdAt||new Date().toISOString()}))
}
function updateFocusBlock(id,patch){
  focusBlocks=focusBlocks.map(block=>block.id===id?{...block,...patch,updatedAt:new Date().toISOString()}:block);
  queueFocusSave()
}
function focusBlockPromoteButtons(block){
  const type=canonicalFocusBlockType(block.type);
  if(type==="concept"){
    return `<button class="mini-btn" onclick="promoteFocusBlock(${jsArg(block.id)},'concept')">Transformar em conceito</button><button class="mini-btn" onclick="promoteFocusBlock(${jsArg(block.id)},'permanent')">Nota permanente</button>`
  }
  if(type==="insight"){
    return `<button class="mini-btn" onclick="promoteFocusBlock(${jsArg(block.id)},'permanent')">Nota permanente</button><button class="mini-btn" onclick="promoteFocusBlock(${jsArg(block.id)},'concept')">Conceito</button>`
  }
  if(type==="question"){
    return `<button class="mini-btn" onclick="promoteFocusBlock(${jsArg(block.id)},'question')">Transformar em pergunta</button>`
  }
  return ""
}
function renderFocusBlocks(){
  if(!$("focusBlockList")){
    return
  }
  $("focusBlockList").innerHTML=focusBlocks.length?focusBlocks.map(block=>{
    const meta=FOCUS_BLOCK_TYPES[canonicalFocusBlockType(block.type)]||FOCUS_BLOCK_TYPES["free-note"];
    return `<article class="focus-block"><div class="focus-block-head"><span class="tag">${esc(meta.label)}</span>${block.noteId?`<span class="hint">Promovido: ${esc(block.promotedAs||"nota")}</span>`:""}</div><input data-focus-block-title="${esc(block.id)}" value="${esc(block.title)}" placeholder="Título opcional"><textarea data-focus-block-content="${esc(block.id)}" rows="3" placeholder="Conteúdo do bloco...">${esc(block.content)}</textarea><div class="focus-block-actions">${focusBlockPromoteButtons(block)}<button class="mini-btn danger" onclick="removeFocusBlock(${jsArg(block.id)})">Remover</button></div></article>`
  }).join(""):`<div class="hint">Use os atalhos para registrar conceitos, perguntas, insights, citações, exemplos, comandos, ações ou notas livres.</div>`;
  document.querySelectorAll("[data-focus-block-title]").forEach(input=>input.oninput=e=>updateFocusBlock(e.currentTarget.dataset.focusBlockTitle,{title:e.currentTarget.value}));
  document.querySelectorAll("[data-focus-block-content]").forEach(input=>input.oninput=e=>updateFocusBlock(e.currentTarget.dataset.focusBlockContent,{content:e.currentTarget.value}))
}
function removeFocusBlock(id){
  focusBlocks=focusBlocks.filter(block=>block.id!==id);
  renderFocusBlocks();
  queueFocusSave()
}
function promotedBlockContent(block,targetType,title,sourceTitle){
  const sourceLine=sourceTitle?`- [[${sourceTitle.replace(/[\[\]]/g,"")}]]`:"";
  if(targetType==="question"){
    return `# ${title}\n\n## Contexto\n\n${block.content||""}\n\n## Resposta\n\n\n## Fontes\n\n${sourceLine}`.trim()
  }
  if(targetType==="concept"){
    return `# ${title}\n\n## Conceito\n\n${block.content||""}\n\n## Exemplo\n\n\n## Relações\n\n\n## Fontes\n\n${sourceLine}`.trim()
  }
  return `# ${title}\n\n## Ideia\n\n${block.content||""}\n\n## Em minhas palavras\n\n\n## Por que isso importa\n\n\n## Exemplo\n\n\n## Relações\n\n\n## Fontes\n\n${sourceLine}`.trim()
}
async function promoteFocusBlock(id,targetType="permanent"){
  const block=focusBlocks.find(item=>item.id===id),i=focusRef?findFocus(focusRef.id,focusRef.scope):null;
  if(!block||!i){
    return
  }
  const title=focusBlockTitle(block).slice(0,90),source=sourcePayloadForResource(i,focusRef.scope,{timestamp:block.timestamp||$("focusTimestamp").value||"",minutes:Math.round(timer/60)||0});
  const duplicate=vaultNotes.find(note=>note.type===targetType&&String(note.title||"").trim().toLowerCase()===title.toLowerCase());
  if(duplicate&&!confirm(`Já existe uma nota chamada ${title}.\n\nOK: criar nova mesmo assim.\nCancelar: abrir existente.`)){
    showView("notes");
    await loadFullNote(duplicate.id);
    renderVaultEditor("vaultEditorPane");
    return
  }
  const payload={title,type:targetType,content:promotedBlockContent(block,targetType,title,source.sourceTitle),trackId:source.trackId,sourceType:sourceTypeForResource(i,focusRef.scope),sourceId:i.id,resourceId:i.id,courseId:source.courseId,moduleId:source.moduleId,lessonId:source.lessonId,sourceTitle:source.sourceTitle,sessionId:focusNoteId||null,relatedNoteIds:focusNoteId?[focusNoteId]:[],sourceReferences:[extractionSourceReference({id:focusNoteId,sessionId:focusNoteId,sourceId:i.id,resourceId:i.id,sourceTitle:source.sourceTitle,sourceType:sourceTypeForResource(i,focusRef.scope),trackId:source.trackId,courseId:source.courseId,moduleId:source.moduleId,lessonId:source.lessonId},block)],tags:["focus",canonicalFocusBlockType(block.type)],source,questionStatus:targetType==="question"?"open":null,createdFrom:"focus-block"};
  const data=await api("/api/notes",{method:"POST",body:JSON.stringify(payload)});
  block.noteId=data.note.id;block.promotedAs=targetType;block.updatedAt=new Date().toISOString();
  await loadVaultNotes();
  renderFocusBlocks();
  await saveFocusDraft(false)
}
async function openFocus(id,scope){
  const i=findFocus(id,scope);if(!i){missingTarget();return}const lockState=focusLockState(id,scope);if(lockState==="locked"&&!confirm(lockedFocusMessage(id,scope))){return}const context=studyContextForResource(i,scope);focusRef={id,scope,context};focusNoteId=i.focusDraftNoteId||null;focusBlocks=[];timer=0;updateTimer();$("focusTitle").textContent=i.title;renderFocusContext(context);$("focusOpenLink").href=i.url||"#";let vid=null;try{const u=new URL(i.url);vid=u.hostname.includes("youtu.be")?u.pathname.slice(1):u.searchParams.get("v")}catch{};$("playerWrap").innerHTML=scope==="youtube"&&vid?`<iframe src="https://www.youtube-nocookie.com/embed/${vid}?rel=0" allowfullscreen></iframe>`:`<div class="player-placeholder">Abra o recurso e use o cronômetro para registrar a sessão.</div>`;
  $("focusTimestamp").value="";$("focusSaveState").textContent="Rascunho ainda não salvo.";
  if(focusNoteId){try{const data=await api(`/api/notes/${encodeURIComponent(focusNoteId)}`);$("focusNotesText").value=data.note.content||"";focusBlocks=normalizeFocusBlocks(data.note.blocks);$("focusSaveState").textContent="Rascunho recuperado do vault."}catch{$("focusNotesText").value="";focusBlocks=[]}}
  else{$("focusNotesText").value="";focusBlocks=[]}
  updateFocusUndoButton(i,scope);
  renderFocusBlocks();
  $("focusDialog").showModal()
}
function startTimer(){if(timerHandle){return}timerHandle=setInterval(()=>{timer++;updateTimer()},1000);updateTimer()}
function pauseTimer(){if(timerHandle){clearInterval(timerHandle);timerHandle=null;updateTimer()}}
function resetTimer(){pauseTimer();timer=0;updateTimer()}
function updateTimer(){
  const h=String(Math.floor(timer/3600)).padStart(2,"0"),m=String(Math.floor(timer%3600/60)).padStart(2,"0"),s=String(timer%60).padStart(2,"0"),label=`${h}:${m}:${s}`;
  $("timerDisplay").textContent=label;
  if($("timerPauseBtn")){
    $("timerPauseBtn").disabled=!timerHandle;
    $("timerPauseBtn").textContent=timerHandle?"Pausar":"Pausado"
  }
  if($("timerStartBtn")){
    $("timerStartBtn").textContent=timerHandle?"Rodando":"Iniciar"
  }
  if($("focusSessionStatus")){
    $("focusSessionStatus").textContent=timerHandle?`Sessão em andamento · ${label}`:timer?`Sessão pausada · ${label}`:"Sessão pronta para iniciar."
  }
}
async function closeFocus(saveDraft=true){clearTimeout(focusSaveTimer);if(saveDraft){await saveFocusDraft(false)}pauseTimer();$("focusDialog").close()}
async function completeFocus(){
  if(!focusRef){
    return
  }
  const i=findFocus(focusRef.id,focusRef.scope);
  if(!i){
    return
  }
  const mins=Math.max(1,Math.round(timer/60));
  const source=sourcePayloadForResource(i,focusRef.scope,{minutes:mins});
  const session={id:crypto.randomUUID(),date:dayKey(),timestamp:new Date().toISOString(),minutes:mins,title:i.title,type:sourceTypeForResource(i,focusRef.scope),sourceId:i.id,trackId:source.trackId,courseId:source.courseId,moduleId:source.moduleId,lessonId:source.lessonId,track:source.trackId};
  state.sessions.push(session);
  clearTimeout(focusSaveTimer);
  let savedSessionNote=null;
  try{
    savedSessionNote=await saveFocusDraft(true,session.id,mins,{throwOnError:true,skipStateSave:true})
  }catch(e){
    state.sessions=state.sessions.filter(item=>item.id!==session.id);
    alert(`Não consegui salvar a sessão no vault: ${e.message||String(e)}`);
    return
  }
  upsertActivityLogEntry(activityFromFocusSession(session,i,focusRef.scope,source));
  i.focusDraftNoteId=null;focusNoteId=null;
  state.xp+=Math.max(10,mins*2);updateStreak();
  if(focusRef.scope==="youtube"){
    const d=getDailyYT();d.count++;d.minutes+=i.estimatedMinutes||mins;i.progress=100;i.status="concluido"
  }else if(focusRef.scope==="lesson"){
    i.progress=100;i.done=true;i.status="concluido";
    const module=resourceByScope(i.moduleId,"module"),course=state.items.find(item=>item.id===i.courseId);
    if(module){
      module.progress=moduleProgress(module);module.done=moduleDone(module);module.status=statusFromProgress(module.progress)
    }
    if(course){
      course.progress=itemProgress(course);course.status=statusFromProgress(course.progress)
    }
    if(i.track){state.weeklyProgress[i.track]=(state.weeklyProgress[i.track]||0)+mins}
  }else if(focusRef.scope==="module"){
    if(Array.isArray(i.lessons)&&i.lessons.length){
      for(const lesson of i.lessons){
        lesson.progress=100;lesson.done=true;lesson.status="concluido"
      }
    }
    i.progress=100;i.done=true;i.status="concluido";
    const course=state.items.find(item=>item.id===i.courseId);
    if(course){
      course.progress=itemProgress(course);course.status=statusFromProgress(course.progress)
    }
    if(i.track){state.weeklyProgress[i.track]=(state.weeklyProgress[i.track]||0)+mins}
  }else{
    i.progress=Math.min(100,Number(i.progress||0)+Math.max(5,Math.round(mins/Math.max(1,Number(i.estimatedMinutes||60))*100)));i.status=statusFromProgress(i.progress);if(i.track){state.weeklyProgress[i.track]=(state.weeklyProgress[i.track]||0)+mins}
  }
  await save();await closeFocus(false);markObsidianPending("after_session");queueObsidianAutoSync("after_session");
  if(savedSessionNote){
    await openKnowledgeExtractionReview(savedSessionNote,session,source).catch(e=>notice(`Sessão salva. Revisão de conhecimento indisponível: ${e.message||String(e)}`))
  }
}
function updateStreak(){const today=dayKey(),y=new Date();y.setDate(y.getDate()-1);const yd=dayKey(y);if(state.lastStudyDate===today)return;if(state.lastStudyDate===yd)state.streak++;else state.streak=1;state.lastStudyDate=today}

async function saveFocusDraft(done=false,sessionId=null,minutes=0,options={}){
  if(!focusRef||!$("focusNotesText")){
    return
  }
  const i=findFocus(focusRef.id,focusRef.scope);
  if(!i){
    return
  }
  const source=sourcePayloadForResource(i,focusRef.scope,{timestamp:$("focusTimestamp").value||"",minutes});
  focusBlocks=normalizeFocusBlocks(focusBlocks).map(block=>({...block,sessionId:sessionId||block.sessionId||focusNoteId||null,resourceId:i.id,sourceId:i.id}));
  const payload={title:`Sessão - ${i.title}`,type:"session",content:$("focusNotesText").value,blocks:focusBlocks,trackId:source.trackId,sourceType:sourceTypeForResource(i,focusRef.scope),sourceId:i.id,resourceId:i.id,sourceTitle:source.sourceTitle,sessionId:sessionId||null,courseId:source.courseId,moduleId:source.moduleId,lessonId:source.lessonId,durationMinutes:minutes||Math.round(timer/60)||0,tags:done?["sessao","concluida"]:["sessao","rascunho"],source,sessionKind:"study-session",knowledgeExtractionStatus:done?"pending":"draft"};
  try{
    const data=focusNoteId?await api(`/api/notes/${encodeURIComponent(focusNoteId)}`,{method:"PUT",body:JSON.stringify(payload)}):await api("/api/notes",{method:"POST",body:JSON.stringify(payload)});
    focusNoteId=data.note.id;
    i.focusDraftNoteId=focusNoteId;
    $("focusSaveState").textContent=done?"Sessão salva no vault.":"Salvo ✓";
    if(!options.skipStateSave){
      save(false)
    }
    loadVaultNotes();
    return data.note
  }catch(e){
    $("focusSaveState").textContent=`Erro ao salvar: ${e.message}`;
    if(options.throwOnError){
      throw e
    }
  }
}
function queueFocusSave(){
  clearTimeout(focusSaveTimer);
  if($("focusSaveState")){
    $("focusSaveState").textContent="Salvando..."
  }
  focusSaveTimer=setTimeout(()=>saveFocusDraft(false),900)
}
function insertFocusBlock(kind){
  const type=canonicalFocusBlockType(kind);
  focusBlocks.push({id:crypto.randomUUID(),type,title:"",content:"",timestamp:$("focusTimestamp").value||"",page:$("focusTimestamp").value||"",sessionId:focusNoteId||null,resourceId:focusRef?.id||null,sourceId:focusRef?.id||null,noteId:null,promotedAs:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  renderFocusBlocks();
  queueFocusSave()
}

function selectedExtractionText(){
  const input=$("extractionRawNotes");
  if(!input){
    return ""
  }
  return input.value.slice(input.selectionStart||0,input.selectionEnd||0).trim()
}
function buildKnowledgeExtractionInput(sessionNote,session={},source={}){
  const rawNotes=sessionNote.content||"";
  return {sessionNote,session,source,rawNotes,blocks:normalizeFocusBlocks(sessionNote.blocks||[]),payload:sanitizeKnowledgeExtractionPayload({sessionNote,session,source,rawNotes,blocks:sessionNote.blocks||[]})}
}
async function openKnowledgeExtractionReview(sessionNote,session={},source={}){
  await loadVaultNotes();
  const input=buildKnowledgeExtractionInput(sessionNote,session,source);
  const sourceNotesUpdatedAt=sessionNote.updatedAt||sessionNote.createdAt||new Date().toISOString();
  if(sessionNote.extractionDraft?.candidates){
    const extraction=sessionNote.extractionDraft;
    knowledgeExtractionDraft={sessionNote,session,source,rawNotes:input.rawNotes,providerId:extraction.providerId||extraction.extractionProvider||KnowledgeExtractionProviders.local.id,providerLabel:extraction.providerLabel||"",extractionProvider:extraction.extractionProvider||extraction.providerId||KnowledgeExtractionProviders.local.id,extractionModel:extraction.extractionModel||"",extractionSchemaVersion:extraction.extractionSchemaVersion||1,sourceNotesUpdatedAt:extraction.sourceNotesUpdatedAt||sourceNotesUpdatedAt,sourceChangedAfterExtraction:(extraction.sourceNotesUpdatedAt||sourceNotesUpdatedAt)!==sourceNotesUpdatedAt,candidates:Array.isArray(extraction.candidates)?extraction.candidates:[],connections:Array.isArray(extraction.connections)?extraction.connections:[],people:Array.isArray(extraction.people)?extraction.people:[],status:"reviewing",activeSection:"concepts",createdAt:extraction.createdAt||extraction.extractionCreatedAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
    renderKnowledgeExtractionDialog();
    $("knowledgeExtractionDialog")?.showModal?.();
    return
  }
  knowledgeExtractionDraft={sessionNote,session,source,rawNotes:input.rawNotes,providerId:selectedKnowledgeExtractionProvider().id,providerLabel:selectedKnowledgeExtractionProvider().label,extractionProvider:selectedKnowledgeExtractionProvider().id,extractionModel:knowledgeExtractionSettings().ai.model||"",extractionSchemaVersion:KNOWLEDGE_EXTRACTION_SCHEMA_VERSION,sourceNotesUpdatedAt,candidates:[],connections:[],people:[],status:"loading",activeSection:"concepts",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  renderKnowledgeExtractionDialog();
  $("knowledgeExtractionDialog")?.showModal?.();
  await generateKnowledgeSuggestions(false)
}
async function generateKnowledgeSuggestions(force=false){
  if(!knowledgeExtractionDraft?.sessionNote){
    return
  }
  const manual=force?knowledgeExtractionDraft.candidates.filter(candidate=>candidate.origin==="manual"):[];
  knowledgeExtractionDraft.status="loading";
  knowledgeExtractionDraft.error="";
  knowledgeExtractionDraft.updatedAt=new Date().toISOString();
  renderKnowledgeExtractionDialog();
  const input=buildKnowledgeExtractionInput(knowledgeExtractionDraft.sessionNote,knowledgeExtractionDraft.session,knowledgeExtractionDraft.source);
  const extraction=await runKnowledgeExtraction(input);
  const acceptedIds=new Set(knowledgeExtractionDraft.sessionNote.promotedNoteIds||[]);
  const candidates=dedupeExtractionCandidates([...(force?manual:[]),...(Array.isArray(extraction.candidates)?extraction.candidates:[])]).filter(candidate=>!candidate.targetId||!acceptedIds.has(candidate.targetId));
  knowledgeExtractionDraft={...knowledgeExtractionDraft,providerId:extraction.providerId||selectedKnowledgeExtractionProvider().id,providerLabel:extraction.providerLabel||selectedKnowledgeExtractionProvider().label,extractionProvider:extraction.providerId||selectedKnowledgeExtractionProvider().id,extractionModel:extraction.model||knowledgeExtractionSettings().ai.model||"",extractionSchemaVersion:extraction.extractionSchemaVersion||KNOWLEDGE_EXTRACTION_SCHEMA_VERSION,sourceNotesUpdatedAt:knowledgeExtractionDraft.sessionNote.updatedAt||knowledgeExtractionDraft.sessionNote.createdAt||new Date().toISOString(),candidates,connections:Array.isArray(extraction.connections)?extraction.connections:[],people:Array.isArray(extraction.people)?extraction.people:[],semanticCount:Number(extraction.semanticCount||candidates.filter(candidate=>candidate.origin==="semantic").length)||0,automaticCount:Number(extraction.automaticCount||candidates.filter(candidate=>candidate.origin==="ai").length)||0,status:extraction.status==="failed"?"failed":"reviewing",error:extraction.error||"",createdAt:extraction.createdAt||knowledgeExtractionDraft.createdAt,updatedAt:new Date().toISOString()};
  renderKnowledgeExtractionDialog()
}
function extractionTypeOptions(value){
  return Object.entries(KNOWLEDGE_CANDIDATE_TYPES).map(([key,meta])=>`<option value="${esc(key)}" ${key===value?"selected":""}>${esc(meta.label)}</option>`).join("")
}
function existingKnowledgeOptions(candidate){
  const meta=KNOWLEDGE_CANDIDATE_TYPES[candidate.type]||{};
  const notes=vaultNotes.filter(note=>note.status!=="archived"&&(!meta.targetNoteType||note.type===meta.targetNoteType));
  return `<option value="">Criar nova</option>${notes.map(note=>`<option value="${esc(note.id)}" ${candidate.targetId===note.id?"selected":""}>${esc(note.title)}</option>`).join("")}`
}
function extractionCandidateCard(candidate){
  const meta=KNOWLEDGE_CANDIDATE_TYPES[candidate.type]||KNOWLEDGE_CANDIDATE_TYPES["permanent-note"];
  const existing=candidate.targetId?vaultNotes.find(note=>note.id===candidate.targetId):null;
  const origin=candidate.origin==="ai"?"automática":candidate.origin==="manual"?"manual":"marcação manual";
  return `<article class="extraction-candidate" data-extraction-id="${esc(candidate.id)}"><div class="extraction-candidate-head"><label class="check"><input type="checkbox" data-field="selected" ${candidate.selected?"checked":""}> Usar</label><span class="tag">${esc(meta.label)}</span><span class="tag soft">${esc(origin)}</span>${existing?`<span class="hint">já existe: ${esc(existing.title)}</span>`:""}<button type="button" class="mini-btn ghost-mini" data-extraction-action="discard">Descartar</button></div><div class="two-fields"><label>Tipo<select data-field="type">${extractionTypeOptions(candidate.type)}</select></label><label>Destino<select data-field="targetId">${existingKnowledgeOptions(candidate)}</select></label></div><label>Título<input data-field="title" value="${esc(candidate.title||"")}"></label><label>Conteúdo<textarea data-field="content" rows="4">${esc(candidate.content||"")}</textarea></label><div class="two-fields"><label>Rota<select data-field="route"><option value="knowledge" ${candidate.route==="knowledge"?"selected":""}>Conhecimento</option><option value="inbox" ${candidate.route==="inbox"?"selected":""}>Inbox</option><option value="review" ${candidate.route==="review"?"selected":""}>Revisão</option><option value="next-session" ${candidate.route==="next-session"?"selected":""}>Próxima sessão</option><option value="ignore" ${candidate.route==="ignore"?"selected":""}>Ignorar</option></select></label><label>Revisar em dias<input data-field="reviewIntervalDays" type="number" min="1" value="${Number(candidate.reviewIntervalDays||7)}"></label></div>${candidate.sourceExcerpt?`<blockquote class="source-excerpt">${esc(candidate.sourceExcerpt)}</blockquote>`:""}<div class="hint">${esc([candidate.sourceTimestamp,candidate.sourcePage].filter(Boolean).join(" · ")||candidate.sourceBlockId||"notas da sessão")}</div></article>`
}
function renderKnowledgeExtractionDialog(){
  if(!knowledgeExtractionDraft||!$("extractionCandidateList")){
    return
  }
  const sessionNote=knowledgeExtractionDraft.sessionNote||{};
  const candidates=knowledgeExtractionDraft.candidates||[];
  const semanticCount=candidates.filter(candidate=>candidate.origin==="semantic").length;
  const automaticCount=candidates.filter(candidate=>candidate.origin==="ai").length;
  const providerLabel=knowledgeExtractionDraft.status==="failed"?"Não foi possível gerar sugestões automáticas.":automaticCount?`Extração por IA ${automaticCount} sugestões`:semanticCount?`${semanticCount} marcaç${semanticCount===1?"ão":"ões"} manua${semanticCount===1?"l":"is"}`:"Extração local";
  if($("extractionSessionMeta")){
    $("extractionSessionMeta").textContent=`${sessionNote.title||"Sessão"} · ${providerLabel} · ${candidates.length} sugestão${candidates.length===1?"":"ões"}`
  }
  if($("extractionStatusBanner")){
    const changed=knowledgeExtractionDraft.sourceChangedAfterExtraction?`<p class="hint warn">Notas alteradas após a última extração.</p>`:"";
    const failed=knowledgeExtractionDraft.status==="failed"?`<p class="hint warn">Não foi possível gerar sugestões automáticas. As marcações manuais continuam disponíveis.</p>`:"";
    const empty=knowledgeExtractionDraft.status==="reviewing"&&!candidates.length?`<p class="hint">Nenhuma sugestão automática encontrada. Você ainda pode organizar manualmente.</p>`:"";
    const loading=knowledgeExtractionDraft.status==="loading"?`<p class="hint">Organizando suas notas...</p>`:"";
    $("extractionStatusBanner").innerHTML=[loading,failed,empty,changed].filter(Boolean).join("")
  }
  if($("extractionRawNotes")){
    $("extractionRawNotes").value=knowledgeExtractionDraft.rawNotes||""
  }
  if($("extractionCategoryTabs")){
    $("extractionCategoryTabs").innerHTML=KNOWLEDGE_EXTRACTION_SECTIONS.map(([section,label])=>{
      const count=candidates.filter(candidate=>KNOWLEDGE_CANDIDATE_TYPES[candidate.type]?.section===section).length;
      const active=(knowledgeExtractionDraft.activeSection||"concepts")===section;
      return `<button type="button" class="chip-btn ${active?"active":""}" data-extraction-section="${esc(section)}">${esc(label)} <span>${count}</span></button>`
    }).join("")
  }
  const activeSection=knowledgeExtractionDraft.activeSection||"concepts";
  const entries=candidates.filter(candidate=>KNOWLEDGE_CANDIDATE_TYPES[candidate.type]?.section===activeSection);
  $("extractionCandidateList").innerHTML=knowledgeExtractionDraft.status==="loading"?`<div class="extraction-section"><div class="hint">Organizando suas notas...</div></div>`:entries.length?entries.map(extractionCandidateCard).join(""):`<div class="extraction-section"><div class="hint">Sem sugestões nesta categoria.</div></div>`;
  if($("extractionMergeBtn")){
    $("extractionMergeBtn").disabled=!mergeSelectionAllowed()
  }
  if($("extractionSaveKnowledgeBtn")){
    $("extractionSaveKnowledgeBtn").disabled=knowledgeExtractionDraft.status==="loading"
  }
}
function updateExtractionCandidate(id,patch){
  if(!knowledgeExtractionDraft){
    return
  }
  knowledgeExtractionDraft.candidates=knowledgeExtractionDraft.candidates.map(candidate=>candidate.id===id?{...candidate,...patch,updatedAt:new Date().toISOString()}:candidate);
  knowledgeExtractionDraft.updatedAt=new Date().toISOString()
}
function handleExtractionCandidateEvent(e){
  const card=e.target.closest("[data-extraction-id]");
  if(!card||!knowledgeExtractionDraft){
    return
  }
  const field=e.target.dataset.field;
  if(!field){
    return
  }
  const value=e.target.type==="checkbox"?e.target.checked:e.target.type==="number"?Number(e.target.value)||0:e.target.value;
  const patch={[field]:value};
  if(field==="type"){
    const targetType=KNOWLEDGE_CANDIDATE_TYPES[value]?.targetNoteType;
    const match=findExistingKnowledgeMatch({title:knowledgeExtractionDraft.candidates.find(candidate=>candidate.id===card.dataset.extractionId)?.title||""},targetType);
    patch.targetId=match?.id||"";
    patch.linkMode=match?"existing":"new";
    patch.route=value==="next-action"?"inbox":"knowledge"
  }
  if(field==="targetId"){
    patch.linkMode=value?"existing":"new"
  }
  updateExtractionCandidate(card.dataset.extractionId,patch);
  if(field==="type"){
    renderKnowledgeExtractionDialog()
  }
}
function handleExtractionCandidateClick(e){
  const section=e.target.closest("[data-extraction-section]");
  if(section&&knowledgeExtractionDraft){
    knowledgeExtractionDraft.activeSection=section.dataset.extractionSection;
    renderKnowledgeExtractionDialog();
    return
  }
  const action=e.target.dataset.extractionAction;
  if(action==="discard"){
    const card=e.target.closest("[data-extraction-id]");
    if(card&&knowledgeExtractionDraft){
      knowledgeExtractionDraft.candidates=knowledgeExtractionDraft.candidates.filter(candidate=>candidate.id!==card.dataset.extractionId);
      renderKnowledgeExtractionDialog()
    }
  }
}
function addExtractionCandidate(type="permanent-note"){
  if(!knowledgeExtractionDraft){
    return
  }
  const raw=selectedExtractionText();
  const title=firstMeaningfulLine(raw).slice(0,110)||KNOWLEDGE_CANDIDATE_TYPES[type]?.label||"Nota";
  const targetType=KNOWLEDGE_CANDIDATE_TYPES[type]?.targetNoteType;
  const match=findExistingKnowledgeMatch({title},targetType);
  knowledgeExtractionDraft.candidates.push({id:crypto.randomUUID(),type,title,content:raw,selected:true,linkMode:match?"existing":"new",targetId:match?.id||"",route:type==="next-action"?"inbox":"knowledge",reviewIntervalDays:7,relatedKnowledgeIds:[],sourceBlockId:"manual-selection",sourceTimestamp:"",sourcePage:"",sourceExcerpt:raw||title,origin:"manual",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),sessionNoteId:knowledgeExtractionDraft.sessionNote?.id||null});
  knowledgeExtractionDraft.activeSection=KNOWLEDGE_CANDIDATE_TYPES[type]?.section||"ideas";
  renderKnowledgeExtractionDialog()
}
function mergeSelectionAllowed(){
  if(!knowledgeExtractionDraft){
    return false
  }
  const selected=knowledgeExtractionDraft.candidates.filter(candidate=>candidate.selected);
  if(selected.length<2){
    return false
  }
  const type=selected[0].type;
  return selected.every(candidate=>candidate.type===type)&&type!=="next-action"
}
function mergeSelectedExtractionCandidates(){
  if(!knowledgeExtractionDraft){
    return
  }
  const selected=knowledgeExtractionDraft.candidates.filter(candidate=>candidate.selected);
  if(!mergeSelectionAllowed()){
    notice("Selecione sugestões do mesmo tipo para unir.");
    return
  }
  const [first,...rest]=selected;
  first.title=first.title||rest.find(candidate=>candidate.title)?.title||"Nota";
  first.content=[first.content,...rest.map(candidate=>candidate.content)].filter(Boolean).join("\n\n");
  first.sourceExcerpt=[first.sourceExcerpt,...rest.map(candidate=>candidate.sourceExcerpt)].filter(Boolean).join("\n\n");
  first.updatedAt=new Date().toISOString();
  const removeIds=new Set(rest.map(candidate=>candidate.id));
  knowledgeExtractionDraft.candidates=knowledgeExtractionDraft.candidates.filter(candidate=>!removeIds.has(candidate.id));
  renderKnowledgeExtractionDialog()
}
function sourceRefsForCandidate(candidate,sessionNote){
  return [extractionSourceReference(sessionNote,candidate)]
}
function candidateMarkdown(candidate,sessionNote){
  const sourceTitle=sessionNote.sourceTitle||sessionNote.source?.title||sessionNote.title||"Sessão";
  const body=String(candidate.content||candidate.title||"").trim();
  const link=sourceTitle?`[[${sourceTitle.replace(/[\[\]]/g,"")}]]`:"";
  if(candidate.type==="concept"){
    return `# ${candidate.title}\n\n## Conceito\n\n${body}\n\n## Definição em uma frase\n\n\n## Exemplos\n\n\n## Fontes\n\n- ${link}`.trim()
  }
  if(candidate.type==="question"){
    return `# ${candidate.title}\n\n## Pergunta\n\n${body}\n\n## Evidências\n\n\n## Próxima investigação\n\n- [ ] \n\n## Fontes\n\n- ${link}`.trim()
  }
  return `# ${candidate.title}\n\n## Ideia atômica\n\n${body}\n\n## Por que importa\n\n\n## Conexões\n\n\n## Fontes\n\n- ${link}`.trim()
}
function upsertManagedSection(content,id,title,body){
  const start=`<!-- ARCANA:START ${id} -->`,end=`<!-- ARCANA:END ${id} -->`;
  const section=`${start}\n## ${title}\n\n${String(body||"").trim()}\n${end}`;
  const pattern=new RegExp(`\\n?<!-- ARCANA:START ${id} -->[\\s\\S]*?<!-- ARCANA:END ${id} -->`);
  const current=String(content||"").trimEnd();
  if(pattern.test(current)){
    return current.replace(pattern,`\n\n${section}`)
  }
  return `${current}\n\n${section}`.trim()
}
async function persistKnowledgeCandidate(candidate,sessionNote){
  const meta=KNOWLEDGE_CANDIDATE_TYPES[candidate.type]||{};
  const targetType=meta.targetNoteType||"permanent";
  const refs=sourceRefsForCandidate(candidate,sessionNote);
  const existingId=candidate.targetId||findExistingKnowledgeMatch(candidate,targetType)?.id||"";
  if(existingId){
    const data=await api(`/api/notes/${encodeURIComponent(existingId)}`);
    const existing=data.note;
    const related=[...(existing.relatedNoteIds||[]),sessionNote.id].filter(Boolean);
    const sourceReferences=mergeUniqueSourceReferences(existing.sourceReferences,refs);
    const content=upsertManagedSection(existing.content||"",`arcana-sources-${sessionNote.id}`,"Fontes Arcana",refs.map(ref=>`- ${ref.sourceTitle||"Fonte"}${ref.sourceTimestamp?` @ ${ref.sourceTimestamp}`:""}${ref.sourceExcerpt?` - ${ref.sourceExcerpt}`:""}`).join("\n"));
    const saved=await api(`/api/notes/${encodeURIComponent(existingId)}`,{method:"PUT",body:JSON.stringify({...existing,content,relatedNoteIds:[...new Set(related)],sourceReferences,tags:[...new Set([...(existing.tags||[]),"extraido"])]})});
    return saved.note
  }
  const reviewAt=candidate.route==="review"?isoDate(candidate.reviewIntervalDays||7):null;
  const payload={title:candidate.title||"Nota extraída",type:targetType,content:candidateMarkdown(candidate,sessionNote),trackId:sessionNote.trackId||state.activeTrack,sourceType:sessionNote.sourceType||null,sourceId:sessionNote.sourceId||null,resourceId:sessionNote.resourceId||sessionNote.sourceId||null,sourceTitle:sessionNote.sourceTitle||"",sessionId:sessionNote.sessionId||sessionNote.id||null,courseId:sessionNote.courseId||null,moduleId:sessionNote.moduleId||null,lessonId:sessionNote.lessonId||null,relatedNoteIds:[sessionNote.id].filter(Boolean),sourceReferences:refs,tags:["extraido",candidate.type],questionStatus:targetType==="question"?"open":null,reviewAt,createdFrom:"knowledge-extraction"};
  const saved=await api("/api/notes",{method:"POST",body:JSON.stringify(payload)});
  return saved.note
}
async function persistNextActionCandidate(candidate,sessionNote){
  const route=candidate.route||"inbox";
  if(route==="ignore"){
    return null
  }
  if(route==="inbox"||route==="next-session"){
    state.inbox.unshift({id:crypto.randomUUID(),raw:candidate.content||candidate.title,title:candidate.title||"Próximo passo",type:route==="next-session"?"study-action":"action",createdAt:new Date().toISOString(),sourceNoteId:sessionNote.id,sourceId:sessionNote.sourceId||sessionNote.resourceId||null});
    return null
  }
  return persistKnowledgeCandidate({...candidate,type:"next-action"},sessionNote)
}
function fichamentoExtractionBody(sessionNote,savedNotes,candidates){
  const links=savedNotes.filter(Boolean).map(note=>`- [[${note.title}]]`).join("\n");
  const next=candidates.filter(candidate=>candidate.type==="next-action"&&candidate.selected).map(candidate=>`- [ ] ${candidate.title}`).join("\n");
  return [`- Sessão: [[${sessionNote.title}]]`,links?`\n### Conhecimento extraído\n${links}`:"",next?`\n### Próximas ações\n${next}`:""].filter(Boolean).join("\n")
}
async function upsertFichamentoFromExtraction(sessionNote,savedNotes,candidates){
  const sourceId=sessionNote.sourceId||sessionNote.resourceId||sessionNote.source?.id;
  if(!sourceId){
    return null
  }
  const existing=vaultNotes.find(note=>note.type==="literature"&&note.status!=="archived"&&(note.sourceId===sourceId||note.resourceId===sourceId));
  const body=fichamentoExtractionBody(sessionNote,savedNotes,candidates);
  if(existing){
    const data=await api(`/api/notes/${encodeURIComponent(existing.id)}`);
    const note=data.note;
    return (await api(`/api/notes/${encodeURIComponent(existing.id)}`,{method:"PUT",body:JSON.stringify({...note,content:upsertManagedSection(note.content||"",`arcana-extraction-${sessionNote.id}`,"Sessão extraída",body),relatedNoteIds:[...new Set([...(note.relatedNoteIds||[]),sessionNote.id,...savedNotes.map(item=>item?.id).filter(Boolean)])]})})).note
  }
  return (await api("/api/notes",{method:"POST",body:JSON.stringify({title:`Fichamento - ${sessionNote.sourceTitle||sessionNote.title||"Fonte"}`,type:"literature",content:upsertManagedSection(literatureTemplate(sessionNote.sourceTitle||sessionNote.title||"Fonte",sessionNote.sourceType||"other"),`arcana-extraction-${sessionNote.id}`,"Sessão extraída",body),trackId:sessionNote.trackId||state.activeTrack,sourceType:sessionNote.sourceType||"other",sourceId,resourceId:sourceId,sourceTitle:sessionNote.sourceTitle||"",courseId:sessionNote.courseId||null,moduleId:sessionNote.moduleId||null,lessonId:sessionNote.lessonId||null,relatedNoteIds:[sessionNote.id,...savedNotes.map(item=>item?.id).filter(Boolean)],tags:["fichamento","extraido"],createdFrom:"knowledge-extraction"})})).note
}
async function saveKnowledgeExtractionDraft(status="draft"){
  if(!knowledgeExtractionDraft?.sessionNote?.id){
    return
  }
  knowledgeExtractionDraft.status=status;
  knowledgeExtractionDraft.updatedAt=new Date().toISOString();
  const sessionNote=knowledgeExtractionDraft.sessionNote;
  const extractionDraft={providerId:knowledgeExtractionDraft.providerId,providerLabel:knowledgeExtractionDraft.providerLabel||"",extractionProvider:knowledgeExtractionDraft.extractionProvider||knowledgeExtractionDraft.providerId,extractionModel:knowledgeExtractionDraft.extractionModel||"",extractionCreatedAt:knowledgeExtractionDraft.createdAt,sourceNotesUpdatedAt:knowledgeExtractionDraft.sourceNotesUpdatedAt||sessionNote.updatedAt||sessionNote.createdAt||null,extractionSchemaVersion:knowledgeExtractionDraft.extractionSchemaVersion||KNOWLEDGE_EXTRACTION_SCHEMA_VERSION,status,candidates:knowledgeExtractionDraft.candidates,connections:knowledgeExtractionDraft.connections,people:knowledgeExtractionDraft.people||[],createdAt:knowledgeExtractionDraft.createdAt,updatedAt:knowledgeExtractionDraft.updatedAt};
  await api(`/api/notes/${encodeURIComponent(sessionNote.id)}`,{method:"PUT",body:JSON.stringify({...sessionNote,knowledgeExtractionStatus:status,extractionProvider:extractionDraft.extractionProvider,extractionModel:extractionDraft.extractionModel,extractionCreatedAt:extractionDraft.extractionCreatedAt,sourceNotesUpdatedAt:extractionDraft.sourceNotesUpdatedAt,extractionSchemaVersion:extractionDraft.extractionSchemaVersion,extractionDraft})});
  await loadVaultNotes()
}
async function confirmKnowledgeExtraction(){
  if(!knowledgeExtractionDraft){
    return
  }
  const sessionNote=knowledgeExtractionDraft.sessionNote;
  const selected=knowledgeExtractionDraft.candidates.filter(candidate=>candidate.selected&&candidate.route!=="ignore");
  const savedNotes=[];
  for(const candidate of selected){
    if(candidate.type==="next-action"){
      const saved=await persistNextActionCandidate(candidate,sessionNote);
      if(saved){
        savedNotes.push(saved)
      }
    }else{
      savedNotes.push(await persistKnowledgeCandidate(candidate,sessionNote))
    }
  }
  await upsertFichamentoFromExtraction(sessionNote,savedNotes,selected);
  const completedAt=new Date().toISOString();
  const extractionDraft={providerId:knowledgeExtractionDraft.providerId,providerLabel:knowledgeExtractionDraft.providerLabel||"",extractionProvider:knowledgeExtractionDraft.extractionProvider||knowledgeExtractionDraft.providerId,extractionModel:knowledgeExtractionDraft.extractionModel||"",extractionCreatedAt:knowledgeExtractionDraft.createdAt,sourceNotesUpdatedAt:knowledgeExtractionDraft.sourceNotesUpdatedAt||sessionNote.updatedAt||sessionNote.createdAt||null,extractionSchemaVersion:knowledgeExtractionDraft.extractionSchemaVersion||KNOWLEDGE_EXTRACTION_SCHEMA_VERSION,status:"completed",candidates:knowledgeExtractionDraft.candidates,connections:knowledgeExtractionDraft.connections,people:knowledgeExtractionDraft.people||[],createdAt:knowledgeExtractionDraft.createdAt,updatedAt:completedAt};
  await api(`/api/notes/${encodeURIComponent(sessionNote.id)}`,{method:"PUT",body:JSON.stringify({...sessionNote,knowledgeExtractionStatus:"completed",extractionProvider:extractionDraft.extractionProvider,extractionModel:extractionDraft.extractionModel,extractionCreatedAt:extractionDraft.extractionCreatedAt,sourceNotesUpdatedAt:extractionDraft.sourceNotesUpdatedAt,extractionSchemaVersion:extractionDraft.extractionSchemaVersion,promotedNoteIds:[...new Set([...(sessionNote.promotedNoteIds||[]),...savedNotes.map(note=>note?.id).filter(Boolean)])],extractionDraft})});
  if(selected.some(candidate=>candidate.type==="next-action"&&(candidate.route==="inbox"||candidate.route==="next-session"))){
    await save(false,"knowledge-extraction")
  }
  knowledgeExtractionDraft=null;
  $("knowledgeExtractionDialog")?.close?.();
  await loadVaultNotes();
  markObsidianPending("knowledge_extraction");
  queueObsidianAutoSync("after_session");
  renderAll();
  notice("Conhecimento organizado.")
}
async function closeKnowledgeExtractionReview(status="draft"){
  if(knowledgeExtractionDraft){
    await saveKnowledgeExtractionDraft(status)
  }
  knowledgeExtractionDraft=null;
  $("knowledgeExtractionDialog")?.close?.()
}

function renderVaultHome(){
  if(!$("homeReviews"))return;
  const due=vaultNotes.filter(n=>n.reviewAt&&n.reviewAt<=dayKey()&&n.status!=="archived");
  $("homeReviews").innerHTML=due.length?due.slice(0,4).map(n=>noteRow(n,"homeReview")).join(""):`<div class="hint">Nada vencido para revisar.</div>`;
  $("homeKnowledge").innerHTML=vaultNotes.length?vaultNotes.filter(n=>n.status!=="archived").slice(0,5).map(n=>noteRow(n,"home")).join(""):`<div class="hint">Crie notas, fichamentos ou sessões de foco para alimentar o vault.</div>`
}
function noteIsFichamento(n){return n.type==="literature"||n.type==="fichamento"}
function noteUpdatedLabel(n){
  const stamp=n.updatedAt||n.createdAt;
  if(!stamp){return ""}
  try{return new Date(stamp).toLocaleString("pt-BR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}catch{return ""}
}
function noteMeta(n){
  const parts=[NOTE_TYPE_LABELS[n.type]||n.type||"Nota"];
  const tr=trackById(n.trackId);
  const updated=noteUpdatedLabel(n);
  if(tr){parts.push(tr.name)}
  if(updated){parts.push(updated)}
  if(n.reviewAt){parts.push(`revisar ${n.reviewAt.slice(0,10)}`)}
  if(n.links?.length){parts.push(`${n.links.length} link${n.links.length>1?"s":""}`)}
  return parts.join(" · ")
}
function noteRowAction(n,mode="notes"){
  if(mode==="homeReview"){return `navigateTo('review',{noteId:${jsArg(n.id)}})`}
  if(mode==="home"){return `openKnowledgeObject(${jsArg(n.id)})`}
  if(mode==="fichamentos"){return `selectFichamento(${jsArg(n.id)})`}
  if(mode==="review"){return `openReviewNote(${jsArg(n.id)})`}
  return `selectVaultNote(${jsArg(n.id)})`
}
function noteRow(n,mode="notes"){const action=noteRowAction(n,mode);return `<div class="vault-row clickable-row ${activeVaultNote?.id===n.id?"active":""}" role="button" tabindex="0" onclick="${action}" onkeydown="activateRow(event,this)"><div class="grow"><strong>${esc(n.title)}</strong><span>${esc(noteMeta(n))}</span></div>${n.favorite?"<span class='tag'>★</span>":""}</div>`}
function knowledgeType(n){
  if(noteIsFichamento(n)){
    return "fichamentos"
  }
  if(n.type==="question"){
    return "questions"
  }
  if(n.type==="concept"){
    return "concepts"
  }
  if(n.type==="permanent"){
    return "permanent"
  }
  if(n.type==="session"){
    return "sessions"
  }
  return "notes"
}
function knowledgeMatchesTab(n,tab){
  if(n.status==="archived"){
    return false
  }
  if(tab==="all"){
    return true
  }
  if(tab==="reviews"){
    return !!(n.reviewAt&&n.reviewAt<=dayKey())
  }
  return knowledgeType(n)===tab
}
function knowledgeTabLabel(tab){
  return {all:"Tudo",fichamentos:"Fichamento",notes:"Nota",concepts:"Conceito",permanent:"Permanente",questions:"Pergunta",reviews:"Revisão",sessions:"Sessão"}[tab]||"Nota"
}
function knowledgeTabName(tab){
  return {all:"Tudo",fichamentos:"Fichamentos",notes:"Notas",concepts:"Conceitos",permanent:"Permanentes",questions:"Perguntas",reviews:"Revisões",sessions:"Sessões"}[tab]||knowledgeTabLabel(tab)
}
async function openKnowledgeObject(id){
  const note=vaultNotes.find(n=>n.id===id);
  if(!note){
    missingTarget();
    return
  }
  if(note.reviewAt&&note.reviewAt<=dayKey()){
    await navigateTo("review",{noteId:id});
    return
  }
  if(noteIsFichamento(note)){
    await navigateTo("fichamentos",{fichamentoId:id});
    return
  }
  await navigateTo("notes",{noteId:id})
}
function renderKnowledgeTabs(){
  document.querySelectorAll("[data-knowledge-tab]").forEach(button=>{
    const tab=button.dataset.knowledgeTab;
    const count=vaultNotes.filter(note=>knowledgeMatchesTab(note,tab)).length;
    button.classList.toggle("active",tab===activeKnowledgeTab);
    button.innerHTML=`${esc(knowledgeTabName(tab))}<span>${count}</span>`
  })
}
function knowledgeCard(n){
  const type=knowledgeType(n),source=[n.sourceTitle,n.source?.sourceTitle,n.source?.title].find(Boolean)||"",tags=(n.tags||[]).slice(0,3).map(tag=>`<span class="tag">#${esc(tag)}</span>`).join("");
  return `<article class="knowledge-card clickable-row" data-knowledge-id="${esc(n.id)}" role="button" tabindex="0" onclick="openKnowledgeObject(${jsArg(n.id)})" onkeydown="activateRow(event,this)"><div><span class="tag knowledge-type-${type}">${knowledgeTabLabel(type)}</span>${n.favorite?"<span class='tag'>★</span>":""}</div><h3>${esc(n.title)}</h3><p>${esc(n.excerpt||firstMeaningfulLine(n.content)||"Sem resumo ainda.").slice(0,180)}</p><div class="knowledge-meta"><span>${esc(noteMeta(n))}</span>${source?`<span>${esc(source)}</span>`:""}</div>${tags?`<div class="knowledge-tags">${tags}</div>`:""}</article>`
}
function renderKnowledge(){
  if(!$("knowledgeList")){
    return
  }
  renderKnowledgeTabs();
  const query=($("knowledgeSearch")?.value||"").toLowerCase().trim();
  const list=vaultNotes.filter(n=>knowledgeMatchesTab(n,activeKnowledgeTab)).filter(n=>!query||[n.title,n.excerpt,n.content,(n.tags||[]).join(" "),n.sourceTitle,n.source?.sourceTitle,n.source?.title].join(" ").toLowerCase().includes(query)).sort((a,b)=>(b.updatedAt||b.createdAt||"").localeCompare(a.updatedAt||a.createdAt||""));
  $("knowledgeList").innerHTML=list.length?list.map(knowledgeCard).join(""):`<div class="hint">Nada encontrado neste recorte.</div>`
}
function searchTextMatches(query,...parts){
  return !query||parts.join(" ").toLowerCase().includes(query)
}
function buildSearchResults(query=""){
  const q=String(query||"").toLowerCase().trim(),results=[];
  state.tracks.forEach(track=>{if(searchTextMatches(q,track.name,track.subtitle,track.description)){results.push({kind:"track",id:track.id,title:track.name,meta:"Trilha",icon:track.sigil||"☽"})}});
  state.items.forEach(item=>{
    if(searchTextMatches(q,item.title,item.source,item.notes,trackById(item.track)?.name)){results.push({kind:"item",scope:"item",id:item.id,title:item.title,meta:`Curso/Fonte · ${trackById(item.track)?.name||"Sem trilha"}`,icon:"☿"})}
    ;(item.modules||[]).forEach(module=>{
      if(searchTextMatches(q,module.title,item.title)){results.push({kind:"focus",scope:"module",id:module.id,title:module.title,meta:`Módulo · ${item.title}`,icon:"◐"})}
      ;(module.lessons||[]).forEach(lesson=>{
        if(searchTextMatches(q,lesson.title,module.title,item.title)){results.push({kind:"focus",scope:"lesson",id:lesson.id,title:lesson.title,meta:`Aula · ${module.title}`,icon:"•"})}
      })
    })
  });
  state.youtubeQueue.forEach(video=>{if(searchTextMatches(q,video.title,video.channel,video.url)){results.push({kind:"focus",scope:"youtube",id:video.id,title:video.title,meta:`YouTube · ${video.channel||activePlaylist()?.name||""}`,icon:"▶"})}});
  vaultNotes.filter(note=>note.status!=="archived").forEach(note=>{if(searchTextMatches(q,note.title,note.excerpt,note.content,(note.tags||[]).join(" "))){results.push({kind:"note",id:note.id,title:note.title,meta:noteMeta(note),icon:"🜁"})}});
  (state.routineBlocks||[]).forEach(block=>{if(searchTextMatches(q,block.title,block.category,block.location,block.address,block.notes)){results.push({kind:"routine",id:block.id,title:block.title,meta:`Rotina · ${routineDaysLabel(block)} · ${clockRangeLabel(parseClock(block.startTime),parseClock(block.endTime))}`,icon:"◷"})}});
  (state.hobbies||[]).forEach(hobby=>{if(searchTextMatches(q,hobby.name,hobby.description,hobby.location,hobby.notes,(hobby.tags||[]).join(" "))){results.push({kind:"hobby",id:hobby.id,title:hobby.name,meta:`Hobby · ${fmtMin(hobby.preferredMinutes)} · ${hobby.frequencyPerWeek}/semana`,icon:hobby.icon||"✧"})}});
  return results.slice(0,24)
}
async function openSearchResult(kind,id,scope=""){
  if($("globalSearchDialog")){
    $("globalSearchDialog").close()
  }
  if(kind==="track"){
    await navigateTo("tracks",{trackId:id});
    return
  }
  if(kind==="note"){
    await openKnowledgeObject(id);
    return
  }
  if(kind==="item"){
    continueResource(id,"item");
    return
  }
  if(kind==="focus"){
    openFocus(id,scope);
    return
  }
  if(kind==="routine"){
    await navigateTo("routine");
    setTimeout(()=>openRoutineDialog(id),0);
    return
  }
  if(kind==="hobby"){
    await navigateTo("hobbies");
    setTimeout(()=>openHobbyDialog(id),0);
    return
  }
  missingTarget()
}
function renderGlobalSearchResults(){
  if(!$("globalSearchResults")){
    return
  }
  const results=buildSearchResults(globalSearchQuery);
  $("globalSearchResults").innerHTML=results.length?results.map(result=>`<button type="button" class="search-result" data-search-id="${esc(result.id)}" data-search-kind="${esc(result.kind)}" onclick="openSearchResult(${jsArg(result.kind)},${jsArg(result.id)},${jsArg(result.scope||"")})"><span>${esc(result.icon||"⌕")}</span><div class="grow"><strong>${esc(result.title)}</strong><small>${esc(result.meta||"")}</small></div></button>`).join(""):`<div class="hint">Digite para procurar trilhas, aulas, vídeos e notas.</div>`
}
function openGlobalSearch(){
  globalSearchQuery="";
  if($("globalSearchInput")){
    $("globalSearchInput").value="";
  }
  renderGlobalSearchResults();
  $("globalSearchDialog").showModal();
  setTimeout(()=>$("globalSearchInput")?.focus?.(),40)
}
function openCaptureDialog(){
  if($("captureQuickInput")){
    $("captureQuickInput").value="";
  }
  if($("captureStatus")){
    $("captureStatus").textContent=""
  }
  $("captureDialog").showModal();
  setTimeout(()=>$("captureQuickInput")?.focus?.(),40)
}
function captureNotePayload(kind,text){
  const type=kind==="concept"?"concept":kind==="question"?"question":kind==="insight"?"insight":"quick",title=firstMeaningfulLine(text).slice(0,90)||"Captura rápida";
  return {title,type,content:noteTemplate(type,title)+(text?`\n\n${text}\n`:""),tags:["captura"],trackId:state.activeTrack}
}
async function captureUniversal(kind="quick"){
  const raw=($("captureQuickInput")?.value||"").trim();
  if(["quick","question","insight","concept"].includes(kind)){
    const payload=captureNotePayload(kind,raw);
    const data=await api("/api/notes",{method:"POST",body:JSON.stringify(payload)});
    if($("captureDialog")){$("captureDialog").close()}
    activeKnowledgeTab=knowledgeType(data.note);
    await loadVaultNotes();
    await openKnowledgeObject(data.note.id);
    notice("Captura salva no conhecimento.");
    return
  }
  if(kind==="youtube"&&raw){
    addYoutubeUrlToQueue(raw,raw);
    if($("captureDialog")){$("captureDialog").close()}
    navigateTo("youtube");
    notice("Vídeo enviado para a fila.");
    return
  }
  if(kind==="course"&&!raw){
    if($("captureDialog")){$("captureDialog").close()}
    openItemDialog("course");
    return
  }
  const item=detectInbox(raw||kind);
  item.type=kind==="link"?item.type:kind;
  state.inbox.unshift(item);
  await save(false,"capture");
  if($("captureDialog")){$("captureDialog").close()}
  renderInbox();
  notice("Captura guardada na inbox.")
}
function renderNotes(){
  if(!$("vaultList"))return;
  let list=[...vaultNotes],q=($("vaultSearchInput")?.value||"").toLowerCase().trim(),type=$("vaultTypeFilter")?.value||"all",track=$("vaultTrackFilter")?.value||"all",tag=($("vaultTagFilter")?.value||"").replace(/^#/,""),fav=$("vaultFavoriteFilter")?.value||"all",review=$("vaultReviewFilter")?.value||"all",sort=$("vaultSortFilter")?.value||"updated";
  list=list.filter(n=>(review==="archived"?n.status==="archived":n.status!=="archived")&&(type==="all"||n.type===type)&&(track==="all"||n.trackId===track)&&(!tag||(n.tags||[]).includes(tag))&&(fav==="all"||!!n.favorite)&&(!q||[n.title,n.excerpt,(n.tags||[]).join(" ")].join(" ").toLowerCase().includes(q))&&(review!=="due"||n.reviewAt&&n.reviewAt<=dayKey()));
  if(sort==="alphabetical")list.sort((a,b)=>a.title.localeCompare(b.title));else if(sort==="review")list.sort((a,b)=>(a.reviewAt||"9999").localeCompare(b.reviewAt||"9999"));else if(sort==="created")list.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""));else list.sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""));
  $("vaultList").innerHTML=list.length?list.map(n=>noteRow(n,"notes")).join(""):`<div class="hint">Nenhuma nota encontrada.</div>`;
  if(!activeVaultNote){$("vaultEditorPane").innerHTML=`<div class="hint">Selecione uma nota ou crie uma nova.</div>`}
}
function renderFichamentos(){
  if(!$("fichamentoList"))return;
  const q=($("fichamentoSearch")?.value||"").toLowerCase().trim(),st=$("fichamentoSourceType")?.value||"all";
  const list=vaultNotes.filter(n=>n.type==="literature"&&n.status!=="archived"&&(st==="all"||n.sourceType===st)&&(!q||[n.title,n.excerpt,n.sourceType].join(" ").toLowerCase().includes(q)));
  $("fichamentoList").innerHTML=list.length?list.map(n=>noteRow(n,"fichamentos")).join(""):`<div class="hint">Nenhum fichamento ainda.</div>`;
  if(!activeVaultNote&&$("fichamentoEditor")){$("fichamentoEditor").innerHTML=`<div class="hint">Crie ou selecione um fichamento.</div>`}
}
function renderReviews(){
  if(!$("reviewQueue"))return;
  const due=vaultNotes.filter(n=>n.reviewAt&&n.reviewAt<=dayKey()&&n.status!=="archived").sort((a,b)=>(a.reviewAt||"").localeCompare(b.reviewAt||""));
  $("reviewQueue").innerHTML=due.length?due.map(n=>noteRow(n,"review")).join(""):`<div class="hint">Fila limpa. Agende revisões a partir de uma nota.</div>`;
  if(!currentReviewNote){$("reviewActive").innerHTML=`<div class="hint">Selecione uma nota vencida para revisar.</div>`}
}
async function selectVaultNote(id){try{activeVaultMode="notes";if($("fichamentoEditor")){$("fichamentoEditor").innerHTML=`<div class="hint">Selecione um fichamento.</div>`}await loadFullNote(id);renderVaultEditor("vaultEditorPane")}catch(e){missingTarget()}}
async function selectFichamento(id){try{activeVaultMode="fichamentos";if($("vaultEditorPane")){$("vaultEditorPane").innerHTML=`<div class="hint">Selecione uma nota.</div>`}await loadFullNote(id);renderVaultEditor("fichamentoEditor")}catch(e){missingTarget()}}
async function loadFullNote(id){const data=await api(`/api/notes/${encodeURIComponent(id)}`);activeVaultNote=data.note;currentReviewNote=activeVaultMode==="review"?data.note:currentReviewNote}
function renderVaultEditor(targetId){
  const n=activeVaultNote;if(!n)return;
  $(targetId).innerHTML=`<div class="editor-head"><input id="vaultTitle" value="${esc(n.title)}"><select id="vaultType">${Object.entries(NOTE_TYPE_LABELS).map(([k,v])=>`<option value="${k}" ${n.type===k?"selected":""}>${v}</option>`).join("")}</select></div><div class="editor-meta"><select id="vaultTrack">${trackOptions(n.trackId||"all")}</select><input id="vaultTags" value="${esc((n.tags||[]).map(t=>"#"+t).join(" "))}" placeholder="#tags"><input id="vaultReviewAt" type="date" value="${esc((n.reviewAt||"").slice(0,10))}"><label class="check"><input id="vaultFavorite" type="checkbox" ${n.favorite?"checked":""}> Favorita</label></div><textarea id="vaultContent" rows="18">${esc(n.content||"")}</textarea><div class="editor-actions"><button class="mini-btn" onclick="saveActiveVaultNote()">Salvar</button><button class="mini-btn" onclick="previewActiveVaultNote()">Preview</button><button class="mini-btn" onclick="promoteActiveSelection()">Promover ideia</button><button class="mini-btn" onclick="createFlashcardFromActive()">Flashcard</button><button class="mini-btn" onclick="scheduleActiveReview(1)">Amanhã</button><button class="mini-btn" onclick="scheduleActiveReview(7)">7 dias</button><button class="mini-btn danger" onclick="archiveActiveNote()">Arquivar</button></div><div id="vaultWarnings">${n.backlinks?.length?`<div class="hint">Backlinks: ${n.backlinks.map(b=>`[[${esc(b.title)}]]`).join(" ")}</div>`:""}</div><div id="vaultPreview" class="markdown-preview hidden"></div>`;
  ["vaultTitle","vaultType","vaultTrack","vaultTags","vaultReviewAt","vaultFavorite","vaultContent"].forEach(id=>$(id).oninput=()=>{clearTimeout(vaultSaveTimer);vaultSaveTimer=setTimeout(saveActiveVaultNote,900)})
}
function activePayload(){
  const type=$("vaultType").value;
  return {title:$("vaultTitle").value.trim()||"Untitled Note",type,content:$("vaultContent").value,trackId:$("vaultTrack").value==="all"?null:$("vaultTrack").value,tags:splitTags($("vaultTags").value),favorite:$("vaultFavorite").checked,reviewAt:$("vaultReviewAt").value||null,sourceType:activeVaultNote?.sourceType||null,sourceId:activeVaultNote?.sourceId||null,sessionId:activeVaultNote?.sessionId||null,courseId:activeVaultNote?.courseId||null,moduleId:activeVaultNote?.moduleId||null,lessonId:activeVaultNote?.lessonId||null,relatedNoteIds:activeVaultNote?.relatedNoteIds||[],source:activeVaultNote?.source||{}}
}
async function saveActiveVaultNote(){
  if(!activeVaultNote)return;
  try{const data=await api(`/api/notes/${encodeURIComponent(activeVaultNote.id)}`,{method:"PUT",body:JSON.stringify(activePayload())});activeVaultNote=data.note;markObsidianPending("knowledge_edit");if(data.duplicateCandidates?.length){$("vaultWarnings").innerHTML=`<div class="hint">Possível duplicata: ${data.duplicateCandidates.map(d=>esc(d.title)).join(", ")}</div>`}await loadVaultNotes()}catch(e){alert(e.message)}
}
function previewActiveVaultNote(){const p=$("vaultPreview");p.classList.toggle("hidden");p.innerHTML=mdToHtml($("vaultContent").value)}
async function newVaultNote(type="permanent"){
  const data=await api("/api/notes",{method:"POST",body:JSON.stringify({title:"Nova nota",type,content:noteTemplate(type,"Nova nota"),tags:[],trackId:state.activeTrack})});
  activeVaultNote=data.note;if($("fichamentoEditor")){$("fichamentoEditor").innerHTML=`<div class="hint">Selecione um fichamento.</div>`}showView("notes");renderVaultEditor("vaultEditorPane");await loadVaultNotes()
}
async function newFichamento(source=null){
  const title=source?.title||"Novo fichamento",sourceType=source?.sourceType||"book";
  const data=await api("/api/notes",{method:"POST",body:JSON.stringify({title,type:"literature",content:literatureTemplate(title,sourceType),trackId:source?.trackId||source?.track||state.activeTrack,sourceType,sourceId:source?.id||null,courseId:source?.courseId||null,moduleId:source?.moduleId||null,lessonId:source?.lessonId||null,tags:["fichamento"],source:source||{}})});
  activeVaultNote=data.note;if($("vaultEditorPane")){$("vaultEditorPane").innerHTML=`<div class="hint">Selecione uma nota.</div>`}showView("fichamentos");renderVaultEditor("fichamentoEditor");await loadVaultNotes()
}
function openFichamentoForSource(id,scope){const i=resourceByScope(id,scope);if(!i){missingTarget();return}const source=sourcePayloadForResource(i,scope);newFichamento({id:i.id,title:i.title,url:i.url||"",trackId:source.trackId,track:source.trackId,sourceType:sourceTypeForResource(i,scope),channel:i.channel||"",source:i.source||"",courseId:source.courseId,moduleId:source.moduleId,lessonId:source.lessonId})}
async function promoteActiveSelection(){
  const ta=document.querySelector(".view.active #vaultContent")||$("notesText");const selected=ta.value.slice(ta.selectionStart,ta.selectionEnd).trim();const title=(selected.split("\n")[0]||prompt("Título da nota permanente")||"Ideia permanente").slice(0,90);
  const data=await api("/api/notes",{method:"POST",body:JSON.stringify({title,type:"permanent",content:noteTemplate("permanent",title)+(selected?`\n\n> ${selected}\n`:""),trackId:activeVaultNote?.trackId||state.activeTrack,relatedNoteIds:activeVaultNote?[activeVaultNote.id]:[],tags:["ideia"]})});
  if(activeVaultNote&&document.querySelector(".view.active #vaultContent")){ta.value+=`\n\nRelacionado: [[${data.note.title}]]\n`;await saveActiveVaultNote()}
  await loadVaultNotes();alert("Ideia promovida para nota permanente.")
}
function promoteDialogNote(){promoteActiveSelection()}
async function createFlashcardFromActive(){
  if(!activeVaultNote)return;const front=prompt("Frente do flashcard",activeVaultNote.title);if(!front)return;const back=prompt("Verso do flashcard","");if(back===null)return;
  await api("/api/flashcards",{method:"POST",body:JSON.stringify({front,back,sourceNoteId:activeVaultNote.id,tags:activeVaultNote.tags||[],reviewAt:isoDate(1)})});alert("Flashcard salvo.")
}
async function scheduleActiveReview(days){if(!$("vaultReviewAt"))return;$("vaultReviewAt").value=isoDate(days);await saveActiveVaultNote()}
async function archiveActiveNote(){if(!activeVaultNote||!confirm("Arquivar esta nota?"))return;const targetId=activeVaultMode==="fichamentos"?"fichamentoEditor":"vaultEditorPane";await api(`/api/notes/${encodeURIComponent(activeVaultNote.id)}`,{method:"DELETE"});activeVaultNote=null;await loadVaultNotes();if($(targetId)){$(targetId).innerHTML=`<div class="hint">Nota arquivada.</div>`}}
async function openReviewNote(id){try{activeVaultMode="review";await loadFullNote(id);currentReviewNote=activeVaultNote;$("reviewActive").innerHTML=`<h2>${esc(currentReviewNote.title)}</h2><div class="markdown-preview">${mdToHtml(currentReviewNote.content||"")}</div><div class="editor-actions"><button class="mini-btn" onclick="reviewAction(1)">Difícil</button><button class="mini-btn" onclick="reviewAction(7)">Bom</button><button class="mini-btn" onclick="reviewAction(30)">Fácil</button><button class="mini-btn danger" onclick="reviewAction(null)">Arquivar</button></div>`}catch(e){missingTarget()}}
async function reviewAction(days){
  if(!currentReviewNote){
    return
  }
  if(days===null){
    await api(`/api/notes/${encodeURIComponent(currentReviewNote.id)}`,{method:"DELETE"})
  }else{
    await api(`/api/notes/${encodeURIComponent(currentReviewNote.id)}`,{method:"PUT",body:JSON.stringify({...currentReviewNote,reviewAt:isoDate(days),tags:[...(currentReviewNote.tags||[]).filter(t=>t!=="due"),"reviewed"]})});
    const now=new Date().toISOString();
    upsertActivityLogEntry({type:"review",subtype:"review.note",title:currentReviewNote.title||"Revisão",startedAt:now,endedAt:now,durationMinutes:0,source:"review",sourceRecordId:`${currentReviewNote.id}:${dayKey()}`,noteId:currentReviewNote.id,metadata:{intervalDays:days}});
    state.xp+=5;
    await save(false,"review")
  }
  currentReviewNote=null;
  await loadVaultNotes()
}

function activityIcon(type){
  return {study:"☿",youtube:"▶",review:"◌",hobby:"✧",sport:"◇",journaling:"✎",appointment:"◎",routine:"▦",other:"•"}[type]||"•"
}
function activityTypeLabel(type){
  return ACTIVITY_TYPES[type]||ACTIVITY_TYPES.other
}
function activityContextLabel(entry){
  const parts=[],track=trackById(entry.trackId);
  if(track){
    parts.push(track.name)
  }
  const course=state.items.find(item=>item.id===entry.courseId);
  if(course){
    parts.push(course.title)
  }
  const hobby=(state.hobbies||[]).find(item=>item.id===entry.hobbyId);
  if(hobby){
    parts.push(hobby.name)
  }
  return parts.join(" · ")
}
function activityRow(entry){
  const started=validDate(entry.startedAt),context=activityContextLabel(entry);
  return `<div class="activity-row"><span class="activity-icon">${esc(activityIcon(entry.type))}</span><div class="grow"><strong>${esc(entry.title)}</strong><span>${esc(started.toLocaleString("pt-BR"))} · ${fmtMin(entry.durationMinutes)}${context?` · ${esc(context)}`:""}</span></div><span class="tag">${esc(activityTypeLabel(entry.type))}</span></div>`
}
function calendarDaySources(date){
  const key=dayKey(date),sources=[];
  if(calendarFilters.routine&&activeRoutineBlocksForDate(date).length){
    sources.push({type:"routine",label:"Rotina",count:activeRoutineBlocksForDate(date).length})
  }
  if(calendarFilters.external){
    const external=externalCommitmentsForDate(date);
    if(external.length){
      sources.push({type:"external",label:"Externo",count:external.length})
    }
  }
  if(calendarFilters.plan&&state.dailyPlan.date===key&&(state.dailyPlan.items||[]).length){
    sources.push({type:"plan",label:"Plano",count:state.dailyPlan.items.length})
  }
  if(calendarFilters.completed){
    const entries=activityLogForDate(key),mins=activityMinutesForDate(key);
    if(entries.length){
      sources.push({type:"completed",label:`${mins} min`,count:entries.length})
    }
  }
  return sources
}
function renderCalendarFilterControls(){
  document.querySelectorAll("[data-calendar-filter]").forEach(input=>{
    input.checked=!!calendarFilters[input.dataset.calendarFilter];
    input.onchange=()=>{calendarFilters[input.dataset.calendarFilter]=input.checked;renderCalendar()}
  });
  if($("calendarLegend")){
    $("calendarLegend").innerHTML=["routine:Rotina","external:Externo","plan:Plano","completed:Concluído"].map(item=>{const [type,label]=item.split(":");return `<span class="calendar-source source-${type}">${label}</span>`}).join("")
  }
}
function renderExternalCalendarPanel(){
  if(!$("externalCalendarEvents")){
    return
  }
  const config=externalCalendarConfig(),today=new Date(),range=localDayRange(today);
  const upcoming=(config.events||[]).filter(event=>selectedExternalCalendarIds(config).has(event.calendarId)&&safeDate(event.end)&&safeDate(event.end)>=range.start).slice(0,8);
  if($("externalCalendarSummary")){
    $("externalCalendarSummary").textContent=`${calendarSyncStatusText(config)} · ${externalCommitmentsForDate(today).length} compromisso${externalCommitmentsForDate(today).length===1?"":"s"} hoje.`
  }
  $("externalCalendarEvents").innerHTML=upcoming.length?upcoming.map(event=>{
    const start=safeDate(event.start),end=safeDate(event.end),time=event.allDay?"Dia inteiro":`${start.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})} · ${start.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}-${end.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;
    const providerLabel=event.provider==="google"?"Google Calendar":"Calendário externo";
    const mapLink=event.location?` · <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}" target="_blank" rel="noopener noreferrer">Abrir no mapa</a>`:"";
    return `<div class="external-event-row"><span class="calendar-source source-external">Externo</span><div class="grow"><strong>${esc(event.title||"Busy")}</strong><span>${esc(providerLabel)} · ${esc(time)}${event.location?` · ${esc(event.location)}`:""}${mapLink}</span></div></div>`
  }).join(""):`<div class="hint">${config.connected?"Nenhum compromisso externo futuro no cache.":"Conecte o Google Calendar nas configurações."}</div>`
}
function renderCalendar(){
  const y=calendarCursor.getFullYear(),m=calendarCursor.getMonth();$("calendarTitle").textContent=new Date(y,m,1).toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
  const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),heads=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  renderCalendarFilterControls();
  let html=heads.map(h=>`<div class="cal-head">${h}</div>`).join("");
  for(let i=0;i<first;i++){
    html+=`<div class="cal-day empty-day"></div>`
  }
  for(let d=1;d<=days;d++){
    const date=new Date(y,m,d),sources=calendarDaySources(date);
    html+=`<div class="cal-day"><strong>${d}</strong>${sources.length?`<div class="calendar-day-sources">${sources.map(source=>`<span class="calendar-source source-${esc(source.type)}">${esc(source.label)}${source.count>1?` · ${source.count}`:""}</span>`).join("")}</div>`:""}</div>`
  }
  $("calendarGrid").innerHTML=html;
  const recent=sortedActivityLog().slice(0,12);
  $("recentSessions").innerHTML=recent.length?recent.map(activityRow).join(""):`<div class="hint">Nenhuma atividade registrada.</div>`
  renderExternalCalendarPanel()
}
function renderJournal(){
  if(!$("journalTimeline")){
    return
  }
  const key=dayKey(journalCursor);
  if($("journalDate")){
    $("journalDate").value=key
  }
  const entries=activityLogForDate(key),minutes=entries.reduce((sum,entry)=>sum+Number(entry.durationMinutes||0),0);
  $("journalTimeline").innerHTML=entries.length?`<div class="hint">${fmtMin(minutes)} registrados em ${entries.length} atividade${entries.length===1?"":"s"}.</div>${entries.map(activityRow).join("")}`:`<div class="hint">Nenhuma atividade registrada neste dia.</div>`
}
function renderWeeklyAnalytics(){
  if(!$("weeklyAnalytics")){
    return
  }
  const week=activityLogForWeek(journalCursor),total=week.reduce((sum,entry)=>sum+Number(entry.durationMinutes||0),0);
  const byType=Object.entries(week.reduce((memo,entry)=>{memo[entry.type]=(memo[entry.type]||0)+Number(entry.durationMinutes||0);return memo},{})).sort((a,b)=>b[1]-a[1]);
  const goal=(state.dailyPlan.minutes||60)*5,pct=goal?Math.min(100,Math.round(total/goal*100)):0;
  $("weeklyAnalytics").innerHTML=`<div class="weekly-goal"><div class="weekly-bar-head"><strong>Semana</strong><span>${fmtMin(total)} / ${fmtMin(goal)}</span></div><div class="progress"><div style="width:${pct}%"></div></div></div><div class="weekly-bars">${byType.length?byType.map(([type,minutes])=>`<div class="weekly-bar"><div class="weekly-bar-head"><span>${esc(activityTypeLabel(type))}</span><strong>${fmtMin(minutes)}</strong></div><div class="progress"><div style="width:${total?Math.round(minutes/total*100):0}%"></div></div></div>`).join(""):`<div class="hint">Ainda sem registros nesta semana.</div>`}</div>`
}
function suggestActivityNow(minutes=30){
  const free=freeTimeSnapshot(new Date()),nowMinutes=new Date().getHours()*60+new Date().getMinutes();
  const activeWindow=free.windows.find(window=>window.start<=nowMinutes&&window.end>=nowMinutes);
  const plan=planActivitiesIntoWindows(new Date(),{minutes:Math.min(minutes,activeWindow?.minutes||minutes)});
  return plan.items[0]||nextRitualTarget()
}
function renderTimeNowSuggestion(minutes=30){
  const target=suggestActivityNow(minutes);
  if(!$("timeNowSuggestion")){
    return
  }
  if(!target){
    $("timeNowSuggestion").innerHTML=`<div class="hint">Nenhuma sugestão agora. Use Registrar para anotar uma atividade livre.</div>`;
    return
  }
  $("timeNowSuggestion").innerHTML=`<div class="time-now-card"><strong>${esc(target.title)}</strong><span>${esc(target.trackName||target.detail||target.type||"Atividade")} · ${fmtMin(target.minutes||minutes)}</span><div class="routine-actions"><button class="gold-btn" onclick="${dailyPlanAction(target)};document.getElementById('timeNowDialog').close()">Começar</button><button class="mini-btn" onclick="document.getElementById('timeNowDialog').close();openRegisterDialog()">Registrar outra</button></div></div>`
}
function openTimeNowDialog(){
  renderTimeNowSuggestion(30);
  $("timeNowDialog")?.showModal?.()
}

function routineCategoryLabel(key){
  return ROUTINE_CATEGORIES[key]?.label||ROUTINE_CATEGORIES.other.label
}
function routineWeekdayLabel(key){
  return ROUTINE_WEEKDAYS.find(day=>day.key===Number(key))?.label||"Dia"
}
function routineCategoryOptions(value="other"){
  return Object.entries(ROUTINE_CATEGORIES).map(([key,entry])=>`<option value="${esc(key)}" ${key===value?"selected":""}>${esc(entry.label)}</option>`).join("")
}
function routineWeekdayOptions(value=weekdayKeyForDate()){
  return ROUTINE_WEEKDAYS.map(day=>`<option value="${day.key}" ${day.key===Number(value)?"selected":""}>${esc(day.label)}</option>`).join("")
}
function routineChanged(message="Rotina atualizada. Recalcule o ritual de hoje."){
  state.dailyPlan.date=null;
  if($("routineChangeNotice")){
    $("routineChangeNotice").textContent=message;
    $("routineChangeNotice").classList.remove("hidden")
  }
  toast(message,"ok")
}
function routineDaysLabel(block,full=false){
  return routineBlockWeekdays(block).map(key=>{
    const day=ROUTINE_WEEKDAYS.find(item=>item.key===key);
    return full?day?.label:day?.short
  }).filter(Boolean).join(", ")||"Dia"
}
function normalizeExcelLookup(value){
  return String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[().]/g,"").replace(/\s+/g," ").trim()
}
function excelSheet(workbook,name){
  const wanted=normalizeExcelLookup(name);
  const entries=Object.entries(workbook?.sheets||{});
  return entries.find(([key])=>normalizeExcelLookup(key)===wanted)?.[1]||null
}
function excelTable(sheet){
  const rows=(sheet?.rows||[]).filter(row=>Array.isArray(row)&&row.some(cell=>String(cell??"").trim()!==""));
  if(!rows.length){
    return {headers:[],items:[]}
  }
  const headers=rows[0].map(cell=>String(cell??"").trim()),lookup=new Map(headers.map((header,index)=>[normalizeExcelLookup(header),index]));
  const items=rows.slice(1).map((row,rowIndex)=>({rowNumber:rowIndex+2,row,get(name){const index=lookup.get(normalizeExcelLookup(name));return index===undefined?"":row[index]}}));
  return {headers,lookup,items}
}
function hasExcelHeaders(table,headers){
  return headers.every(header=>table.lookup?.has(normalizeExcelLookup(header)))
}
function excelId(value,section,rowNumber,errors){
  const id=String(value??"").trim();
  if(!id){
    errors.push(`${section} linha ${rowNumber}: informe um ID estável.`);
  }
  return id
}
function parseExcelBoolean(value,fallback=true){
  const raw=normalizeExcelLookup(value);
  if(raw===""){
    return fallback
  }
  if(["sim","yes","true","1","ativo","ativa"].includes(raw)){
    return true
  }
  if(["nao","no","false","0","inativo","inativa"].includes(raw)){
    return false
  }
  return null
}
function parseExcelClock(value,label,errors){
  if(typeof value==="number"&&Number.isFinite(value)){
    const fraction=((value%1)+1)%1,minutes=Math.round(fraction*24*60);
    return formatClock(minutes)
  }
  const raw=String(value??"").trim();
  const match=raw.match(/^(\d{1,2}):(\d{2})$/);
  if(match){
    const h=Number(match[1]),m=Number(match[2]);
    if(Number.isInteger(h)&&Number.isInteger(m)&&h>=0&&h<=23&&m>=0&&m<=59){
      return formatClock(h*60+m)
    }
  }
  errors.push(`${label}: use HH:MM.`);
  return ""
}
function parseExcelMinutes(value,label,errors,fallback=0){
  if(value===undefined||value===null||String(value).trim()===""){
    return fallback
  }
  const minutes=Number(value);
  if(Number.isInteger(minutes)&&minutes>=0){
    return minutes
  }
  errors.push(`${label}: use um número inteiro maior ou igual a zero.`);
  return fallback
}
function dayAliasMap(){
  return new Map([
    ["1",1],["seg",1],["segunda",1],["segunda feira",1],
    ["2",2],["ter",2],["terca",2],["terça",2],["terca feira",2],["terça feira",2],
    ["3",3],["qua",3],["quarta",3],["quarta feira",3],
    ["4",4],["qui",4],["quinta",4],["quinta feira",4],
    ["5",5],["sex",5],["sexta",5],["sexta feira",5],
    ["6",6],["sab",6],["sabado",6],["sábado",6],
    ["7",7],["dom",7],["domingo",7]
  ])
}
function parseExcelDays(value,label,errors){
  const raw=String(value??"").trim();
  if(!raw){
    errors.push(`${label}: informe pelo menos um dia.`);
    return []
  }
  const aliases=dayAliasMap(),days=[];
  for(const part of raw.split(/[,;/|]+/)){
    const token=normalizeExcelLookup(part);
    if(!token){
      continue
    }
    const range=token.split(/\s*-\s*/);
    if(range.length===2&&aliases.has(range[0])&&aliases.has(range[1])){
      const start=aliases.get(range[0]),end=aliases.get(range[1]),step=start<=end?1:-1;
      for(let day=start;step>0?day<=end:day>=end;day+=step){
        days.push(day)
      }
      continue
    }
    if(!aliases.has(token)){
      errors.push(`${label}: dia inválido "${part.trim()}".`);
      continue
    }
    days.push(aliases.get(token))
  }
  return days.filter((day,index,arr)=>arr.indexOf(day)===index).sort((a,b)=>a-b)
}
function parseExcelCategory(value){
  const raw=normalizeExcelLookup(value);
  const labels=new Map(Object.entries(ROUTINE_CATEGORIES).flatMap(([key,entry])=>[[normalizeExcelLookup(key),key],[normalizeExcelLookup(entry.label),key]]));
  labels.set("sono","sleep");
  labels.set("refeicao","meal");
  labels.set("deslocamento","travel");
  return labels.get(raw)||"other"
}
function parseExcelPreferredTimes(value,label,errors){
  const raw=String(value??"").trim();
  if(!raw){
    return []
  }
  const acceptedWords=new Set(["manha","morning","tarde","afternoon","noite","evening"]);
  return raw.split(/[,;]+/).map(item=>item.trim()).filter(Boolean).map(item=>{
    const normalized=normalizeExcelLookup(item);
    if(acceptedWords.has(normalized)){
      return normalized==="manha"?"morning":normalized==="tarde"?"afternoon":normalized==="noite"?"evening":normalized
    }
    const parts=item.split(/\s*-\s*/);
    const localErrors=[];
    if(parts.length===2){
      const start=parseExcelClock(parts[0],label,localErrors),end=parseExcelClock(parts[1],label,localErrors);
      if(!localErrors.length&&parseClock(end)>parseClock(start)){
        return `${start}-${end}`
      }
    }
    errors.push(`${label}: intervalo inválido "${item}". Use HH:MM-HH:MM.`);
    return ""
  }).filter(Boolean)
}
function routineExcelManagedDiff(existing,next,fields){
  const changes=[];
  for(const [key,label] of fields){
    const before=JSON.stringify(existing?.[key]??null),after=JSON.stringify(next?.[key]??null);
    if(before!==after){
      changes.push(label)
    }
  }
  return changes
}
function routineExcelSection(){
  return {created:0,updated:0,unchanged:0,disabled:0,changes:[]}
}
function buildRoutineExcelWorkbookData(options={}){
  const source=options.sourceState||state,prefs=normalizePlanningPreferences(source.planningPreferences||{});
  const routineRows=[ROUTINE_EXCEL_HEADERS.routine,...(options.template?[]:(source.routineBlocks||[]).map(block=>[
    block.id,block.title,routineCategoryLabel(block.category),routineDaysLabel(block),block.startTime,block.endTime,block.location,block.address,block.travelBeforeMinutes||0,block.travelAfterMinutes||0,block.recurrence==="weekly"?"Semanal":block.recurrence,block.active===false?"Não":"Sim",block.notes
  ]))];
  const hobbyRows=[ROUTINE_EXCEL_HEADERS.hobbies,...(options.template?[]:(source.hobbies||[]).map(hobby=>[
    hobby.id,hobby.name,hobby.icon,hobby.preferredMinutes,hobby.minimumMinutes,hobby.frequencyPerWeek,(hobby.preferredDays||[]).map(day=>ROUTINE_WEEKDAYS.find(item=>item.key===Number(day))?.short).filter(Boolean).join(", "),(hobby.preferredTimes||[]).join(", "),hobby.active===false?"Não":"Sim",hobby.notes
  ]))];
  const configRows=[ROUTINE_EXCEL_HEADERS.config,...ROUTINE_EXCEL_CONFIG.map(item=>[item.label,item.type==="boolean"?(prefs[item.key]?"Sim":"Não"):prefs[item.key]])];
  const instructionRows=[
    ["Arcana Routine Format Version",ROUTINE_EXCEL_FORMAT_VERSION],
    ["Rotina","Edite blocos semanais. Cabeçalhos mínimos: ID, Atividade, Dias, Início, Fim."],
    ["Hobbies","Opcional. IDs atualizam hobbies; linhas ausentes não apagam dados."],
    ["Configuração","Opcional. Apenas preferências de planejamento existentes são importadas."],
    ["IDs","ID existente atualiza; ID novo cria; ID repetido bloqueia a importação."],
    ["Remoção","Linhas ausentes não removem nada. Use Ativo=Não para pausar."],
    ["Dias","Use Seg, Ter, Qua, Qui, Sex, Sáb, Dom ou nomes completos."],
    ["Horários","Use HH:MM. Excel pode armazenar horas como frações do dia."],
    ["Segurança","A planilha não inclui registros de atividade, notas, fichamentos, tokens, calendário, Obsidian ou conhecimento pessoal."]
  ];
  return {sheets:[
    {name:"Rotina",rows:routineRows},
    {name:"Hobbies",rows:hobbyRows},
    {name:"Configuração",rows:configRows},
    {name:"Instruções",rows:instructionRows}
  ]}
}
function routineExcelBlob(workbook){
  if(!window.ArcanaRoutineExcel?.createWorkbookBlob){
    throw new Error("Exportação Excel indisponível neste navegador.")
  }
  return window.ArcanaRoutineExcel.createWorkbookBlob(workbook)
}
function downloadRoutineExcel(blob,fileName){
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=fileName;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
function exportRoutineExcel(template=false){
  const workbook=buildRoutineExcelWorkbookData({template});
  const name=template?"Arcana-Rotina-Modelo.xlsx":`Arcana-Rotina-${dayKey(new Date())}.xlsx`;
  downloadRoutineExcel(routineExcelBlob(workbook),name);
  toast(template?"Modelo de rotina exportado.":"Arquivo de rotina exportado.","ok")
}
function applyRoutineRow(row,table,draft,summary,errors,seen){
  const rowLabel=`Rotina linha ${row.rowNumber}`,id=excelId(row.get("ID"),"Rotina",row.rowNumber,errors);
  if(!id){
    return
  }
  if(seen.has(id)){
    errors.push(`${rowLabel}: ID duplicado "${id}".`);
    return
  }
  seen.add(id);
  const title=String(row.get("Atividade")??"").trim();
  if(!title){
    errors.push(`${rowLabel}: Atividade é obrigatória.`);
  }
  const weekdays=parseExcelDays(row.get("Dias"),`${rowLabel} Dias`,errors),startTime=parseExcelClock(row.get("Início"),`${rowLabel} Início`,errors),endTime=parseExcelClock(row.get("Fim"),`${rowLabel} Fim`,errors);
  const active=parseExcelBoolean(row.get("Ativo"),true);
  if(active===null){
    errors.push(`${rowLabel}: Ativo deve ser Sim/Não, Yes/No, True/False ou 1/0.`);
  }
  const travelBeforeMinutes=parseExcelMinutes(row.get("Ida (min)"),`${rowLabel} Ida`,errors,0),travelAfterMinutes=parseExcelMinutes(row.get("Volta (min)"),`${rowLabel} Volta`,errors,0);
  if(startTime&&endTime&&parseClock(endTime)<=parseClock(startTime)){
    errors.push(`${rowLabel}: Fim deve ser depois de Início.`);
  }
  const recurrence=normalizeExcelLookup(row.get("Repetição")||"Semanal");
  if(recurrence&&recurrence!=="semanal"&&recurrence!=="weekly"){
    errors.push(`${rowLabel}: apenas repetição semanal é aceita.`);
  }
  const existing=(draft.routineBlocks||[]).find(block=>block.id===id),now=new Date().toISOString();
  const next=normalizeRoutineBlock({
    ...(existing||{}),id,title,category:parseExcelCategory(row.get("Categoria")),weekdays,startTime,endTime,location:row.get("Local"),address:row.get("Endereço"),travelBeforeMinutes,travelAfterMinutes,recurrence:"weekly",active:active!==false,notes:row.get("Observações"),createdAt:existing?.createdAt||now,colorKey:existing?.colorKey||parseExcelCategory(row.get("Categoria"))
  });
  if(!next){
    errors.push(`${rowLabel}: bloco inválido.`);
    return
  }
  if(active===false){
    summary.disabled+=1
  }
  const fields=[["title","Atividade"],["category","Categoria"],["weekdays","Dias"],["startTime","Início"],["endTime","Fim"],["location","Local"],["address","Endereço"],["travelBeforeMinutes","Ida"],["travelAfterMinutes","Volta"],["recurrence","Repetição"],["active","Ativo"],["notes","Observações"]];
  if(existing){
    const changes=routineExcelManagedDiff(existing,next,fields);
    if(changes.length){
      next.updatedAt=now;
      draft.routineBlocks=draft.routineBlocks.map(block=>block.id===id?next:block);
      summary.updated+=1;
      summary.changes.push({kind:"Atualizado",id,title:next.title,fields:changes})
    }else{
      summary.unchanged+=1
    }
  }else{
    draft.routineBlocks=[...(draft.routineBlocks||[]),next];
    summary.created+=1;
    summary.changes.push({kind:"Criado",id,title:next.title,fields:["novo bloco"]})
  }
}
function applyHobbyRow(row,draft,summary,errors,seen){
  const rowLabel=`Hobbies linha ${row.rowNumber}`,id=excelId(row.get("ID"),"Hobbies",row.rowNumber,errors);
  if(!id){
    return
  }
  if(seen.has(id)){
    errors.push(`${rowLabel}: ID duplicado "${id}".`);
    return
  }
  seen.add(id);
  const name=String(row.get("Hobby")??"").trim();
  if(!name){
    errors.push(`${rowLabel}: Hobby é obrigatório.`);
  }
  const active=parseExcelBoolean(row.get("Ativo"),true);
  if(active===null){
    errors.push(`${rowLabel}: Ativo deve ser Sim/Não, Yes/No, True/False ou 1/0.`);
  }
  const preferredDays=String(row.get("Dias preferidos")??"").trim()?parseExcelDays(row.get("Dias preferidos"),`${rowLabel} Dias preferidos`,errors):[];
  const preferredTimes=parseExcelPreferredTimes(row.get("Horários preferidos"),`${rowLabel} Horários preferidos`,errors);
  const existing=(draft.hobbies||[]).find(hobby=>hobby.id===id);
  const next=normalizeHobby({
    ...(existing||{}),id,name,icon:row.get("Ícone")||existing?.icon||"✧",preferredMinutes:parseExcelMinutes(row.get("Duração preferida (min)"),`${rowLabel} Duração preferida`,errors,existing?.preferredMinutes||30),minimumMinutes:parseExcelMinutes(row.get("Duração mínima (min)"),`${rowLabel} Duração mínima`,errors,existing?.minimumMinutes||10),frequencyPerWeek:parseExcelMinutes(row.get("Meta semanal"),`${rowLabel} Meta semanal`,errors,existing?.frequencyPerWeek||1),preferredDays,preferredTimes,active:active!==false,notes:row.get("Observações")
  });
  if(!next){
    errors.push(`${rowLabel}: hobby inválido.`);
    return
  }
  if(active===false){
    summary.disabled+=1
  }
  const fields=[["name","Hobby"],["icon","Ícone"],["preferredMinutes","Duração preferida"],["minimumMinutes","Duração mínima"],["frequencyPerWeek","Meta semanal"],["preferredDays","Dias preferidos"],["preferredTimes","Horários preferidos"],["active","Ativo"],["notes","Observações"]];
  if(existing){
    const changes=routineExcelManagedDiff(existing,next,fields);
    if(changes.length){
      draft.hobbies=draft.hobbies.map(hobby=>hobby.id===id?next:hobby);
      summary.updated+=1;
      summary.changes.push({kind:"Atualizado",id,title:next.name,fields:changes})
    }else{
      summary.unchanged+=1
    }
  }else{
    draft.hobbies=[...(draft.hobbies||[]),next];
    summary.created+=1;
    summary.changes.push({kind:"Criado",id,title:next.name,fields:["novo hobby"]})
  }
}
function applyConfigRows(table,draft,summary,errors){
  const prefs={...(draft.planningPreferences||DEFAULT_PLANNING_PREFERENCES)},byLabel=new Map(ROUTINE_EXCEL_CONFIG.map(item=>[normalizeExcelLookup(item.label),item]));
  for(const row of table.items){
    const item=byLabel.get(normalizeExcelLookup(row.get("Configuração")));
    if(!item){
      continue
    }
    const value=row.get("Valor"),before=prefs[item.key];
    if(item.type==="time"){
      prefs[item.key]=parseExcelClock(value,`Configuração linha ${row.rowNumber} Valor`,errors)
    }else if(item.type==="boolean"){
      const parsed=parseExcelBoolean(value,!!before);
      if(parsed===null){
        errors.push(`Configuração linha ${row.rowNumber}: valor booleano inválido.`);
      }else{
        prefs[item.key]=parsed
      }
    }else{
      prefs[item.key]=parseExcelMinutes(value,`Configuração linha ${row.rowNumber} Valor`,errors,before)
    }
  }
  const normalized=normalizePlanningPreferences(prefs),changes=routineExcelManagedDiff(draft.planningPreferences||{},normalized,ROUTINE_EXCEL_CONFIG.map(item=>[item.key,item.label]));
  draft.planningPreferences=normalized;
  if(changes.length){
    summary.updated+=1;
    summary.changes.push({kind:"Atualizado",id:"planningPreferences",title:"Preferências de planejamento",fields:changes})
  }else{
    summary.unchanged+=1
  }
}
function buildRoutineExcelImportPreview(workbook,currentState=state,fileName="rotina.xlsx"){
  const errors=[],sections={routine:routineExcelSection(),hobbies:routineExcelSection(),config:routineExcelSection()},draft=normalize(structuredClone(currentState));
  const routineSheet=excelSheet(workbook,"Rotina");
  if(!routineSheet){
    errors.push("A planilha Rotina é obrigatória.")
  }else{
    const table=excelTable(routineSheet);
    if(!hasExcelHeaders(table,ROUTINE_EXCEL_REQUIRED_HEADERS)){
      errors.push(`Rotina precisa dos cabeçalhos mínimos: ${ROUTINE_EXCEL_REQUIRED_HEADERS.join(", ")}.`)
    }else{
      const seen=new Set();
      table.items.forEach(row=>applyRoutineRow(row,table,draft,sections.routine,errors,seen))
    }
  }
  const hobbiesSheet=excelSheet(workbook,"Hobbies");
  if(hobbiesSheet){
    const table=excelTable(hobbiesSheet),seen=new Set();
    applyExcelOptionalHeaders(table,ROUTINE_EXCEL_HEADERS.hobbies,"Hobbies",errors)&&table.items.forEach(row=>applyHobbyRow(row,draft,sections.hobbies,errors,seen))
  }
  const configSheet=excelSheet(workbook,"Configuração");
  if(configSheet){
    const table=excelTable(configSheet);
    applyExcelOptionalHeaders(table,ROUTINE_EXCEL_HEADERS.config,"Configuração",errors)&&applyConfigRows(table,draft,sections.config,errors)
  }
  if(!errors.length){
    draft.dailyPlan={...(draft.dailyPlan||DEFAULT_STATE.dailyPlan),date:null}
  }
  return {fileName,errors,sections,nextState:errors.length?null:normalize(draft)}
}
function applyExcelOptionalHeaders(table,headers,section,errors){
  if(!table.headers.length){
    return false
  }
  if(!hasExcelHeaders(table,headers)){
    errors.push(`${section}: cabeçalhos esperados não encontrados.`);
    return false
  }
  return true
}
function routineImportTotal(preview,key){
  return Object.values(preview?.sections||{}).reduce((sum,section)=>sum+(section[key]||0),0)
}
function routineImportToast(preview){
  return `Rotina atualizada: ${routineImportTotal(preview,"created")} criadas, ${routineImportTotal(preview,"updated")} alteradas.`
}
function renderRoutineImportPreview(preview){
  if(!$("routineImportDialog")){
    return
  }
  $("routineImportFileName").textContent=preview.fileName||"";
  $("routineImportSummary").innerHTML=Object.entries(preview.sections).map(([key,section])=>`<article><strong>${key==="routine"?"Rotina":key==="hobbies"?"Hobbies":"Configuração"}</strong><span>${section.created} criadas · ${section.updated} alteradas</span><span>${section.unchanged} iguais · ${section.disabled} pausadas</span></article>`).join("");
  $("routineImportErrors").innerHTML=preview.errors.length?preview.errors.map(error=>`<div>${esc(error)}</div>`).join(""):"";
  const changes=Object.entries(preview.sections).flatMap(([key,section])=>section.changes.map(change=>({...change,section:key})));
  $("routineImportChanges").innerHTML=changes.length?changes.map(change=>`<details><summary>${esc(change.kind)} · ${esc(change.title)} <span>${esc(change.id)}</span></summary><span>${esc(change.fields.join(", "))}</span></details>`).join(""):`<div class="hint">Nenhuma alteração detectada.</div>`;
  $("applyRoutineImportBtn").disabled=!!preview.errors.length
}
async function handleRoutineExcelImportFile(file){
  try{
    if(!window.ArcanaRoutineExcel?.parseWorkbookFile){
      throw new Error("Importação Excel indisponível neste navegador.")
    }
    const workbook=await window.ArcanaRoutineExcel.parseWorkbookFile(file);
    routineImportPreview=buildRoutineExcelImportPreview(workbook,state,file.name);
    renderRoutineImportPreview(routineImportPreview);
    $("routineImportDialog")?.showModal?.();
    if(routineImportPreview.errors.length){
      toast("A importação contém erros de validação.","error")
    }
  }catch(err){
    alert(err.message||String(err))
  }
}
async function applyRoutineExcelImportPreview(preview=routineImportPreview,options={}){
  if(!preview||preview.errors?.length||!preview.nextState){
    throw new Error("Não há uma importação válida para aplicar.")
  }
  const original=state;
  try{
    if(!options.skipSnapshot&&window.ArcanaStorage?.snapshot){
      await ArcanaStorage.snapshot("before-routine-excel-import",original,{source:"routine-excel",fileName:preview.fileName,formatVersion:ROUTINE_EXCEL_FORMAT_VERSION})
    }
    state=normalize(structuredClone(preview.nextState));
    await save(false,"routine-excel-import");
    routineChanged("Seu tempo livre de hoje mudou.");
    renderAll();
    return state
  }catch(err){
    state=original;
    renderAll();
    throw err
  }
}
async function applyRoutineImportFromDialog(){
  try{
    const preview=routineImportPreview;
    await applyRoutineExcelImportPreview(preview);
    $("routineImportDialog")?.close?.();
    toast(routineImportToast(preview),"ok")
  }catch(err){
    alert(err.message||String(err))
  }
}
function bindRoutineExcelImportInput(input){
  if(!input){
    return
  }
  input.onchange=async e=>{
    const file=e.target.files?.[0];
    if(file){
      await handleRoutineExcelImportFile(file)
    }
    e.target.value=""
  }
}
function routineBlockCard(block,compact=false){
  const icon=ROUTINE_CATEGORIES[block.category]?.icon||"•";
  const start=parseClock(block.startTime),end=parseClock(block.endTime);
  const commute=[block.travelBeforeMinutes?`${fmtMin(block.travelBeforeMinutes)} antes`:"",block.travelAfterMinutes?`${fmtMin(block.travelAfterMinutes)} depois`:""].filter(Boolean).join(" · ");
  const place=[block.location,block.address].filter(Boolean).join(" · ");
  const actions=compact?"":`<div class="routine-actions"><button class="mini-btn" onclick="openRoutineDialog(${jsArg(block.id)})">Editar</button><button class="mini-btn" onclick="duplicateRoutineBlock(${jsArg(block.id)})">Copiar</button><button class="mini-btn" onclick="cancelRoutineBlockToday(${jsArg(block.id)})">Cancelar hoje</button><button class="mini-btn" onclick="toggleRoutineBlock(${jsArg(block.id)})">${block.active===false?"Ativar":"Pausar"}</button>${block.address?`<button class="mini-btn" onclick="openMapForRoutine(${jsArg(block.id)})">Mapa</button>`:""}</div>`;
  return `<article class="routine-block-card ${block.active===false?"is-paused":""}"><div class="routine-block-head"><span class="routine-icon">${esc(icon)}</span><div class="grow"><strong>${esc(block.title)}</strong><span>${esc(routineCategoryLabel(block.category))} · ${esc(routineDaysLabel(block))} · ${esc(clockRangeLabel(start,end))}</span></div><span class="tag">${block.fixed===false?"flexível":"fixo"}</span></div>${commute?`<div class="routine-meta">${esc(commute)}</div>`:""}${place?`<div class="routine-meta">${esc(place)}</div>`:""}${block.notes&&!compact?`<p>${esc(block.notes)}</p>`:""}${actions}</article>`
}
function renderRoutineTodayTimeline(){
  if(!$("routineTodayTimeline")){
    return
  }
  const blocks=activeRoutineBlocksForDate(new Date());
  const free=getFreeWindows(new Date());
  const rows=[
    ...blocks.map(block=>({kind:"routine",start:parseClock(block.startTime),html:routineBlockCard(block,true)})),
    ...free.map(window=>({kind:"free",start:window.start,html:`<div class="free-window"><strong>${esc(clockRangeLabel(window.start,window.end))}</strong><span>${fmtMin(window.minutes)} livres</span></div>`}))
  ].sort((a,b)=>a.start-b.start);
  $("routineTodayTimeline").innerHTML=rows.length?rows.map(row=>row.html).join(""):`<div class="hint">Nenhum bloco ativo hoje. As janelas livres seguem suas preferências de planejamento.</div>`
}
function renderRoutineWeek(){
  if(!$("routineWeek")){
    return
  }
  $("routineWeek").innerHTML=ROUTINE_WEEKDAYS.map(day=>{
    const blocks=(state.routineBlocks||[]).filter(block=>routineBlockWeekdays(block).includes(day.key)).sort((a,b)=>parseClock(a.startTime)-parseClock(b.startTime));
    return `<article class="routine-day-card"><div class="routine-day-head"><strong>${esc(day.label)}</strong><button class="mini-btn" onclick="openRoutineDialog('',{weekday:${day.key}})">＋</button></div>${blocks.length?blocks.map(block=>routineBlockCard(block,true)).join(""):`<div class="hint">Sem blocos.</div>`}</article>`
  }).join("")
}
function renderRoutineList(){
  if(!$("routineList")){
    return
  }
  const blocks=[...(state.routineBlocks||[])].sort((a,b)=>routineBlockWeekdays(a)[0]-routineBlockWeekdays(b)[0]||parseClock(a.startTime)-parseClock(b.startTime));
  $("routineList").innerHTML=`<div class="card-head"><div><div class="kicker">BLOCOS</div><h2>Rotina editável</h2></div></div>${blocks.length?blocks.map(block=>routineBlockCard(block)).join(""):`<div class="hint">Crie blocos para o Arcana inferir suas janelas livres.</div>`}`
}
function renderRoutine(){
  if(!$("routineWeek")){
    return
  }
  if($("routineViewMode")){
    $("routineViewMode").value=routineViewMode
  }
  renderRoutineTodayTimeline();
  renderRoutineWeek();
  renderRoutineList();
  $("routineWeek").classList.toggle("hidden",routineViewMode==="list");
  $("routineList").classList.toggle("hidden",routineViewMode==="week")
}
function setRoutineFormError(message=""){
  if($("routineFormError")){
    $("routineFormError").textContent=message;
    $("routineFormError").classList.toggle("hidden",!message)
  }
}
function openRoutineDialog(id="",defaults={}){
  const form=$("routineForm"),dialog=$("routineDialog");
  if(!form||!dialog){
    return
  }
  const existing=(state.routineBlocks||[]).find(block=>block.id===id)||null;
  const block=existing||normalizeRoutineBlock({...defaults,title:"Novo bloco",startTime:"09:00",endTime:"10:00",category:"other",active:true,fixed:true});
  const e=form.elements;
  e.id.value=existing?.id||"";
  e.title.value=existing?.title||block.title||"";
  e.category.value=block.category;
  e.weekday.value=routineBlockWeekdays(block)[0];
  e.startTime.value=block.startTime;
  e.endTime.value=block.endTime;
  e.travelBeforeMinutes.value=block.travelBeforeMinutes||0;
  e.travelAfterMinutes.value=block.travelAfterMinutes||0;
  e.location.value=block.location||"";
  e.address.value=block.address||"";
  e.recurrence.value=block.recurrence||"weekly";
  e.colorKey.value=block.colorKey||block.category;
  e.notes.value=block.notes||"";
  e.fixed.checked=block.fixed!==false;
  e.active.checked=block.active!==false;
  $("routineDialogTitle").textContent=existing?"Editar bloco":"Novo bloco";
  $("deleteRoutineBtn").classList.toggle("hidden",!existing);
  $("duplicateRoutineBtn").classList.toggle("hidden",!existing);
  setRoutineFormError("");
  dialog.showModal()
}
async function saveRoutineBlock(e){
  e.preventDefault();
  const form=e.currentTarget,field=form.elements,id=field.id.value;
  const block=normalizeRoutineBlock({id:id||crypto.randomUUID(),title:field.title.value,category:field.category.value,weekday:field.weekday.value,weekdays:[Number(field.weekday.value)],startTime:field.startTime.value,endTime:field.endTime.value,travelBeforeMinutes:field.travelBeforeMinutes.value,travelAfterMinutes:field.travelAfterMinutes.value,location:field.location.value,address:field.address.value,recurrence:field.recurrence.value,colorKey:field.colorKey.value,notes:field.notes.value,fixed:field.fixed.checked,active:field.active.checked,createdAt:(state.routineBlocks||[]).find(item=>item.id===id)?.createdAt});
  if(!block){
    setRoutineFormError("Informe título, dia e horários válidos.");
    return
  }
  block.updatedAt=new Date().toISOString();
  state.routineBlocks=id?state.routineBlocks.map(item=>item.id===id?block:item):[...state.routineBlocks,block];
  await save(false,"routine");
  $("routineDialog").close();
  routineChanged();
  renderAll()
}
async function deleteRoutineBlock(){
  const id=$("routineForm")?.elements.id.value;
  if(!id||!confirm("Excluir este bloco de rotina?")){
    return
  }
  state.routineBlocks=state.routineBlocks.filter(block=>block.id!==id);
  state.routineExceptions=state.routineExceptions.filter(ex=>ex.routineId!==id);
  await save(false,"routine-delete");
  $("routineDialog").close();
  routineChanged("Bloco removido. Recalcule o ritual de hoje.");
  renderAll()
}
function duplicateRoutineBlock(id){
  const block=(state.routineBlocks||[]).find(item=>item.id===id);
  if(block){
    openRoutineDialog("",{...block,title:`${block.title} (cópia)`})
  }
}
async function toggleRoutineBlock(id){
  const block=(state.routineBlocks||[]).find(item=>item.id===id);
  if(!block){
    return
  }
  block.active=block.active===false;
  block.updatedAt=new Date().toISOString();
  await save(false,"routine-toggle");
  routineChanged(block.active?"Bloco ativado.":"Bloco pausado.");
  renderAll()
}
async function cancelRoutineBlockToday(id){
  if(!id){
    return
  }
  const date=dayKey();
  state.routineExceptions=state.routineExceptions.filter(ex=>!(ex.routineId===id&&ex.date===date));
  state.routineExceptions.push({id:crypto.randomUUID(),routineId:id,date,type:"cancel",createdAt:new Date().toISOString()});
  await save(false,"routine-exception");
  routineChanged("Bloco cancelado para hoje.");
  renderAll()
}
function openMapForRoutine(id){
  const block=(state.routineBlocks||[]).find(item=>item.id===id);
  if(block?.address&&window.open){
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(block.address)}`,"_blank","noopener")
  }
}
function hobbyTotalMinutes(hobby){
  const logged=(state.activityLog||[]).filter(entry=>(entry.type==="hobby"||entry.type==="journaling")&&entry.hobbyId===hobby.id);
  if(logged.length){
    return logged.reduce((sum,entry)=>sum+Number(entry.durationMinutes||0),0)
  }
  return (hobby.sessions||[]).reduce((sum,session)=>sum+Number(session.minutes||0),0)
}
function hobbyCard(hobby){
  const sessions=hobbySessionsThisWeek(hobby);
  const total=hobbyTotalMinutes(hobby);
  const tags=(hobby.tags||[]).slice(0,3).map(tag=>`<span class="tag">#${esc(tag)}</span>`).join("");
  return `<article class="hobby-card ${hobby.active===false?"is-paused":""}"><div class="hobby-head"><span class="hobby-icon">${esc(hobby.icon||"✧")}</span><div class="grow"><strong>${esc(hobby.name)}</strong><span>${fmtMin(hobby.preferredMinutes)} preferidos · ${sessions}/${hobby.frequencyPerWeek} na semana</span></div></div>${hobby.description?`<p>${esc(hobby.description)}</p>`:""}<div class="routine-meta">${fmtMin(total)} registrados${hobby.location?` · ${esc(hobby.location)}`:""}</div>${tags?`<div class="knowledge-tags">${tags}</div>`:""}<div class="routine-actions"><button class="mini-btn" onclick="startHobbySessionById(${jsArg(hobby.id)})">Registrar</button><button class="mini-btn" onclick="openHobbyDialog(${jsArg(hobby.id)})">Editar</button></div></article>`
}
function renderHobbies(){
  if(!$("hobbyList")){
    return
  }
  const hobbies=state.hobbies||[];
  $("hobbyList").innerHTML=hobbies.length?hobbies.map(hobbyCard).join(""):`<div class="hint">Adicione hobbies para receber sugestões opcionais nas janelas livres.</div>`
}
function setHobbyFormError(message=""){
  if($("hobbyFormError")){
    $("hobbyFormError").textContent=message;
    $("hobbyFormError").classList.toggle("hidden",!message)
  }
}
function selectedWeekdays(select){
  if(select?.selectedOptions){
    return [...select.selectedOptions].map(option=>Number(option.value)).filter(Boolean)
  }
  return String(select?.value||"").split(",").map(value=>Number(value.trim())).filter(Boolean)
}
function openHobbyDialog(id=""){
  const form=$("hobbyForm"),dialog=$("hobbyDialog");
  if(!form||!dialog){
    return
  }
  const hobby=(state.hobbies||[]).find(item=>item.id===id)||null,e=form.elements;
  const value=hobby||normalizeHobby({name:"Novo hobby",icon:"✧"});
  e.id.value=hobby?.id||"";
  e.name.value=hobby?.name||"";
  e.icon.value=value.icon;
  e.description.value=value.description||"";
  e.preferredMinutes.value=value.preferredMinutes;
  e.minimumMinutes.value=value.minimumMinutes;
  e.frequencyPerWeek.value=value.frequencyPerWeek;
  e.preferredTimes.value=(value.preferredTimes||[]).join(", ");
  e.location.value=value.location||"";
  e.notes.value=value.notes||"";
  e.tags.value=(value.tags||[]).join(", ");
  e.active.checked=value.active!==false;
  Array.from(e.preferredDays.options||[]).forEach(option=>{option.selected=(value.preferredDays||[]).includes(Number(option.value))});
  $("hobbyDialogTitle").textContent=hobby?"Editar hobby":"Novo hobby";
  $("deleteHobbyBtn").classList.toggle("hidden",!hobby);
  setHobbyFormError("");
  dialog.showModal()
}
async function saveHobby(e){
  e.preventDefault();
  const form=e.currentTarget,field=form.elements,id=field.id.value,existing=(state.hobbies||[]).find(item=>item.id===id);
  const hobby=normalizeHobby({id:id||crypto.randomUUID(),name:field.name.value,icon:field.icon.value,description:field.description.value,preferredMinutes:field.preferredMinutes.value,minimumMinutes:field.minimumMinutes.value,frequencyPerWeek:field.frequencyPerWeek.value,preferredDays:selectedWeekdays(field.preferredDays),preferredTimes:String(field.preferredTimes.value||"").split(",").map(item=>item.trim()).filter(Boolean),location:field.location.value,notes:field.notes.value,tags:String(field.tags.value||"").split(",").map(item=>item.trim()).filter(Boolean),active:field.active.checked,sessions:existing?.sessions||[],lastDoneAt:existing?.lastDoneAt||null});
  if(!hobby){
    setHobbyFormError("Informe um nome para o hobby.");
    return
  }
  state.hobbies=id?state.hobbies.map(item=>item.id===id?hobby:item):[...state.hobbies,hobby];
  state.dailyPlan.date=null;
  await save(false,"hobby");
  $("hobbyDialog").close();
  renderAll();
  toast("Hobby salvo.","ok")
}
async function deleteHobby(){
  const id=$("hobbyForm")?.elements.id.value;
  if(!id||!confirm("Excluir este hobby?")){
    return
  }
  state.hobbies=state.hobbies.filter(hobby=>hobby.id!==id);
  state.dailyPlan.date=null;
  await save(false,"hobby-delete");
  $("hobbyDialog").close();
  renderAll();
  toast("Hobby removido.","ok")
}
async function startHobbySessionById(id,minutes=0){
  const hobby=(state.hobbies||[]).find(item=>item.id===id);
  if(!hobby){
    missingTarget();
    return
  }
  const duration=Math.max(1,Number(minutes)||Number(hobby.preferredMinutes)||30);
  const now=new Date().toISOString();
  const sessionId=crypto.randomUUID();
  hobby.sessions=[...(hobby.sessions||[]),{id:sessionId,date:dayKey(),minutes:duration,createdAt:now}];
  hobby.lastDoneAt=now;
  upsertActivityLogEntry({type:hobby.id==="hobby-journaling"?"journaling":"hobby",subtype:`hobby.${activitySubtypeSlug(hobby.name)}`,title:hobby.name,startedAt:new Date(new Date(now).getTime()-duration*60000).toISOString(),endedAt:now,durationMinutes:duration,source:"hobby-session",sourceRecordId:sessionId,hobbyId:hobby.id,metadata:{icon:hobby.icon||"✧"}});
  await save(false,"hobby-session");
  renderHobbies();
  renderDailyPlan();
  renderJournal();
  renderWeeklyAnalytics();
  toast(`${hobby.name}: ${fmtMin(duration)} registrados.`,"ok")
}
function renderPlanningSettings(){
  const form=$("planningSettingsForm");
  if(!form){
    return
  }
  const e=form.elements,p=state.planningPreferences;
  e.dayStart.value=p.dayStart;
  e.dayEnd.value=p.dayEnd;
  e.minimumSessionMinutes.value=p.minimumSessionMinutes;
  e.preferredSessionMinutes.value=p.preferredSessionMinutes;
  e.planningBufferMinutes.value=p.planningBufferMinutes;
  e.useOnlyStudyBlocks.checked=!!p.useOnlyStudyBlocks;
  e.allowHobbySuggestions.checked=!!p.allowHobbySuggestions;
  if($("planningStatus")){
    const free=freeTimeSnapshot(new Date());
    $("planningStatus").textContent=`Hoje: ${free.windows.length} janelas · ${fmtMin(free.available)} disponíveis · ${free.externalCommitments.length} compromissos externos.`
  }
}
async function savePlanningSettings(e){
  e.preventDefault();
  const field=e.currentTarget.elements;
  state.planningPreferences=normalizePlanningPreferences({dayStart:field.dayStart.value,dayEnd:field.dayEnd.value,minimumSessionMinutes:field.minimumSessionMinutes.value,preferredSessionMinutes:field.preferredSessionMinutes.value,planningBufferMinutes:field.planningBufferMinutes.value,useOnlyStudyBlocks:field.useOnlyStudyBlocks.checked,allowHobbySuggestions:field.allowHobbySuggestions.checked});
  state.dailyPlan.date=null;
  await save(false,"planning-settings");
  renderSettings();
  renderDailyPlan();
  toast("Preferências de planejamento salvas.","ok")
}
function renderKnowledgeExtractionSettings(){
  const form=$("knowledgeExtractionSettingsForm");
  if(!form){
    return
  }
  const settings=knowledgeExtractionSettings();
  const status=knowledgeExtractionAiStatus(settings);
  form.elements.provider.value=settings.provider;
  form.elements.endpoint.value=settings.ai.endpoint;
  form.elements.model.value=settings.ai.model;
  form.elements.allowBrowserDevSecret.checked=!!settings.ai.allowBrowserDevSecret;
  form.elements.allowBrowserDevSecret.disabled=runtimeEnvironment().production;
  if($("knowledgeExtractionAiStatus")){
    $("knowledgeExtractionAiStatus").innerHTML=`<span class="safety-pill ${status.configured?"ok":"warn"}">${status.label}</span><span>${settings.provider==="ai"?"Notas serão enviadas ao provedor de IA habilitado.":"Somente marcações locais."}</span><span>${knowledgeExtractionSessionSecret()?"Credencial temporária nesta aba":"Sem credencial temporária"}</span>`
  }
}
async function saveKnowledgeExtractionSettings(e){
  e.preventDefault();
  const fields=e.currentTarget.elements;
  state.knowledgeExtraction=normalizeKnowledgeExtractionSettings({provider:fields.provider.value,ai:{endpoint:fields.endpoint.value,model:fields.model.value,allowBrowserDevSecret:fields.allowBrowserDevSecret.checked,lastStatus:knowledgeExtractionAiStatus({provider:fields.provider.value,ai:{endpoint:fields.endpoint.value,model:fields.model.value,allowBrowserDevSecret:fields.allowBrowserDevSecret.checked}}).configured?"configured":"not_configured"}});
  await save(false,"knowledge-extraction-settings");
  renderSettings();
  toast("Configuração de extração salva.","ok")
}
function saveKnowledgeExtractionDevSecret(){
  const input=$("knowledgeExtractionDevSecret");
  setKnowledgeExtractionSessionSecret(input?.value||"");
  if(input){
    input.value=""
  }
  renderKnowledgeExtractionSettings()
}
function clearKnowledgeExtractionDevSecret(){
  setKnowledgeExtractionSessionSecret("");
  renderKnowledgeExtractionSettings()
}

function renderCatalogRequestDialog(){
  const dialogTitle=$("catalogRequestTitle"),help=$("catalogRequestHelp"),json=$("catalogRequestJson"),status=$("catalogRequestStatus");
  const playlist=activePlaylist();
  if(!playlist){
    return
  }
  const payload=catalogRequestPayload(playlist);
  if(dialogTitle){
    dialogTitle.textContent=playlist.name||"Mais opções de catálogo"
  }
  if(json){
    json.value=payload
  }
  if(status){
    status.textContent=""
  }
  if(help){
    if(payload){
      help.innerHTML=`<p class="hint">Fluxo principal: use <strong>Solicitar sincronização</strong> para abrir a issue pré-preenchida no GitHub.</p><p class="hint">Use o JSON abaixo apenas como fallback manual ou avançado.</p><p class="hint">Se precisar, copie a configuração para <code>data/youtube/playlists.json</code>, faça commit e rode o workflow <code>Sync YouTube Catalog</code>.</p>`
    }else{
      help.innerHTML=`<p class="hint">Salve primeiro uma URL canônica de playlist do YouTube para gerar a configuração manual.</p>`
    }
  }
}
function openCatalogRequestDialog(){
  renderCatalogRequestDialog();
  $("catalogRequestDialog").showModal()
}
async function copyCatalogRequestJson(){
  const field=$("catalogRequestJson"),status=$("catalogRequestStatus");
  if(!field||!field.value.trim()){
    if(status){
      status.textContent="Nada para copiar ainda."
    }
    return
  }
  try{
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(field.value)
    }else{
      field.focus();
      field.select?.()
    }
    if(status){
      status.textContent="JSON copiado."
    }
  }catch(err){
    if(status){
      status.textContent=err.message||"Não consegui copiar automaticamente."
    }
  }
}
function renderSettings(){
  const f=$("youtubeSettingsForm"),s=state.youtubeSettings;
  if(!f){return}
  const env=runtimeEnvironment(),local=env.local,connected=!!state.obsidian.connected;
  f.mode.value=s.mode;
  f.minutes.value=s.minutes;
  f.count.value=s.count;
  f.hideAfterLimit.checked=s.hideAfterLimit;
  if($("environmentStatus")){
    $("environmentStatus").textContent=`Ambiente: ${local?"Arcana Local disponível para yt-dlp":env.production?"GitHub Pages de produção":"preview estático"} · dados primários em IndexedDB do navegador.`
  }
  if($("dataSafetyStatus")){
    const meta=state.migrationMeta||{};
    const migrated=meta.lastMigrationAt?` · migração ${new Date(meta.lastMigrationAt).toLocaleString("pt-BR")}`:"";
    $("dataSafetyStatus").innerHTML=`<span class="safety-pill ${env.production?"warn":"ok"}">${esc(env.label)}</span><span>Schema ${DATA_SCHEMA_VERSION}</span><span>${window.ArcanaStorage?.ready?"IndexedDB ativo":"localStorage ativo"}</span><span>${esc(meta.lastMigrationStatus||"ok")}${esc(migrated)}</span>`
  }
  if($("youtubeCatalogStatus")){
    const generatedAt=formatCatalogStamp(youtubeCatalogMeta.generatedAt);
    const loadedAt=formatCatalogStamp(youtubeCatalogMeta.lastLoadedAt);
    $("youtubeCatalogStatus").innerHTML=`<p class="hint">${local?"No Arcana Local, as playlists sincronizam direto com yt-dlp.":"No Arcana Online, o catálogo público é a fonte de metadados publicada pelo GitHub Pages."}</p><p class="hint">${youtubeCatalogMeta.error?`Erro do catálogo: ${esc(youtubeCatalogMeta.error)}`:`Catálogo público: ${youtubeCatalogMeta.playlistCount||0} playlists · ${youtubeCatalogMeta.videoCount||0} vídeos${generatedAt?` · gerado em ${esc(generatedAt)}`:""}${loadedAt?` · carregado em ${esc(loadedAt)}`:""}.`}</p>`
  }
  if($("youtubePlaylistDiagnostics")){
    $("youtubePlaylistDiagnostics").innerHTML=state.playlists.map(playlist=>{
      const status=playlistStatusSummary(playlist);
      const catalogId=playlistCatalogId(playlist)||"sem list";
      return `<div class="diag-row"><div class="grow"><strong>${esc(playlist.name)}</strong><span>${esc(catalogId)} · ${esc(playlist.url||"sem URL")}</span></div>${playlistStatusChip(playlist)}<span class="diag-text">${esc(status.message)}</span></div>`
    }).join("")||`<div class="hint">Nenhuma playlist configurada.</div>`
  }
  if($("refreshCatalogBtn")){
    $("refreshCatalogBtn").disabled=local
  }
  $("backupStatus").innerHTML=`<p class="hint">${state.lastAutoBackup?`Último snapshot automático: ${new Date(state.lastAutoBackup).toLocaleString("pt-BR")}`:"Nenhum snapshot automático ainda."}</p>`;
  const bridgeReady=!!(state.obsidian.available&&state.obsidian.connected&&state.obsidian.bridgePaired);
  if($("obsidianEnvironmentStatus")){$("obsidianEnvironmentStatus").textContent=`Ambiente: ${obsidianEnvironmentLabel()}`;}
  if($("obsidianVaultStatus")){
    const vaultLine=connected?`Vault: ${esc(state.obsidian.vaultName||"sem nome")}${local&&state.obsidian.vaultPath?` · ${esc(state.obsidian.vaultPath)}`:""}`:"Nenhum vault conectado.";
    const directLine=bridgeReady?`Sincronização direta pronta.${state.obsidian.lastSyncAt?` Último envio: ${new Date(state.obsidian.lastSyncAt).toLocaleString("pt-BR")}`:""}`:"Sincronização direta indisponível. Inicie o Arcana Bridge neste computador ou exporte o Vault em ZIP.";
    const pairLine=state.obsidian.available&&!state.obsidian.bridgePaired?"Conecte o bridge local com o pairing code antes de escrever no vault.":"";
    $("obsidianVaultStatus").innerHTML=`<p class="hint">${vaultLine}</p><p class="hint">${directLine}</p>${pairLine?`<p class="hint">${pairLine}</p>`:""}${state.obsidian.pendingCount?`<p class="hint">Pendências locais para Obsidian: ${state.obsidian.pendingCount}</p>`:""}${state.obsidian.syncStatus?`<p class="hint">Status: ${esc(state.obsidian.syncStatus)}</p>`:""}${state.obsidian.error?`<p class="hint">Erro: ${esc(state.obsidian.error)}</p>`:""}`;
  }
  if($("obsidianStats")){$("obsidianStats").innerHTML=`<div class="profile-grid"><div class="profile-stat"><span>Notas</span><strong>${state.obsidian.noteCount||0}</strong></div><div class="profile-stat"><span>Fichamentos</span><strong>${state.obsidian.fichamentoCount||0}</strong></div><div class="profile-stat"><span>Anexos</span><strong>${state.obsidian.attachmentCount||0}</strong></div><div class="profile-stat"><span>Conflitos</span><strong>${state.obsidian.conflicts||0}</strong></div></div>`;}
  if($("obsidianAutoSync")){$("obsidianAutoSync").checked=state.obsidian.autoSync==="after_session";$("obsidianAutoSync").disabled=!bridgeReady;}
  if($("obsidianAutoSyncNote")){$("obsidianAutoSyncNote").textContent=bridgeReady?`Autosync atual: ${obsidianModeLabel(state.obsidian.autoSync)}. A sincronização reversa Obsidian -> Arcana não faz parte desta fase.`:"Autosync desativado enquanto o bridge local não estiver pareado com um vault.";}
  if($("obsidianConnectBtn")){$("obsidianConnectBtn").disabled=false;$("obsidianConnectBtn").textContent=local?"Conectar Vault":"Conectar bridge local";}
  if($("obsidianSyncBtn")){$("obsidianSyncBtn").disabled=!bridgeReady;}
  if($("obsidianSyncAllBtn")){$("obsidianSyncAllBtn").disabled=!bridgeReady;}
  if($("obsidianZipBtn")){$("obsidianZipBtn").disabled=false;}
  if($("obsidianBridgeRefreshBtn")){$("obsidianBridgeRefreshBtn").disabled=false;}
  if($("obsidianDisconnectBtn")){$("obsidianDisconnectBtn").disabled=local?!connected:!state.obsidian.bridgePaired;}
  if($("obsidianOpenBtn")){$("obsidianOpenBtn").disabled=!state.obsidian.openUrl;}
  renderPlanningSettings();
  renderKnowledgeExtractionSettings();
  renderExternalCalendarSettings();
  renderSnapshots()
}
async function renderSnapshots(){if(!$("snapshotList")||!window.ArcanaStorage?.ready){return}try{const snaps=await ArcanaStorage.listSnapshots();$("snapshotList").innerHTML=snaps.length?snaps.map(s=>`<option value="${esc(s.id)}">${new Date(s.createdAt).toLocaleString("pt-BR")} · ${esc(s.reason||"auto")}</option>`).join(""):`<option value="">Nenhum snapshot</option>`;if($("snapshotRecoveryInfo")){const protectedSnap=snaps.find(s=>s.protected||/^pre-/.test(String(s.reason||"")));$("snapshotRecoveryInfo").textContent=protectedSnap?`Snapshot protegido mais recente: ${new Date(protectedSnap.createdAt).toLocaleString("pt-BR")} · ${protectedSnap.reason||"pre-migration"}`:"Snapshots de pré-migração/importação serão preservados separadamente."}}catch(e){$("snapshotList").innerHTML=`<option value="">Snapshots indisponíveis</option>`;if($("snapshotRecoveryInfo")){$("snapshotRecoveryInfo").textContent=e.message||"Snapshots indisponíveis."}}}
async function autoBackup(reason="auto"){try{if(window.ArcanaStorage?.ready){await ArcanaStorage.snapshot(reason,state);state.lastAutoBackup=new Date().toISOString();await ArcanaStorage.saveState(state)}else{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}renderSettings()}catch(e){console.warn("[Arcana] snapshot failed",e)}}
let backupDebounce=null;function scheduleAutoBackup(reason="change"){clearTimeout(backupDebounce);backupDebounce=setTimeout(()=>autoBackup(reason),1800)}

if(typeof window!=="undefined"){
  window.ArcanaDebug={
    state:()=>structuredClone(state),
    tracks:()=>structuredClone(state.tracks),
    storageState:()=>window.ArcanaStorage?.loadState(DEFAULT_STATE),
    store:name=>window.ArcanaStorage?.list(name)
  }
}

function renderAll(){renderHome();renderTracks();renderYoutube();renderLibrary();renderKnowledge();renderInbox();renderCalendar();renderJournal();renderWeeklyAnalytics();renderRoutine();renderHobbies();renderSettings();renderGlobalSearchResults();renderCalendarConflictNotice();$("sideDate").textContent=new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"short"});$("streakSide").textContent=`${state.streak} dias de sequência`}

async function migrateLocalVaultFromBackend(){
  if(!window.ArcanaStorage?.ready||!isLocalBackend()||localStorage.getItem("arcana-local-vault-migrated-v1")){return}
  try{
    const list=await fetch("/api/notes?sort=updated");
    if(!list.ok){return}
    const data=await list.json();
    for(const summary of data.notes||[]){
      const res=await fetch(`/api/notes/${encodeURIComponent(summary.id)}`);
      if(!res.ok){continue}
      const full=await res.json();
      if(full.note){await ArcanaStorage.route(`/api/notes/${encodeURIComponent(full.note.id)}`,{method:"PUT",body:JSON.stringify(full.note)})}
    }
    localStorage.setItem("arcana-local-vault-migrated-v1","1")
  }catch(e){
    console.info("[Arcana] local Markdown vault bridge skipped",e.message||e)
  }
}

async function importFullBackupFile(file){
  const replace=confirm("OK substitui os dados locais. Cancelar mescla o backup com o vault atual.");
  const imported=await ArcanaStorage.importFullBackup(file,replace?"replace":"merge",{prepareState:raw=>preparePersistedState(raw,{source:"backup-import"})});
  state=preparePersistedState(imported,{source:"backup-result"}).state;
  await loadVaultNotes();
  renderAll();
  toast(replace?"Backup restaurado com snapshot de segurança.":"Backup mesclado.","ok")
}

async function importPlaylistFile(file){
  const data=JSON.parse(await file.text());
  const p=activePlaylist();
  mergePlaylistData(data,p);
  save();
}

function downloadLocalRawState(){
  const payload={version:1,createdAt:new Date().toISOString(),storageKey:STORAGE_KEY,raw:localStorage.getItem(STORAGE_KEY),legacyKeys:LEGACY_KEYS.map(key=>({key,raw:localStorage.getItem(key)})).filter(item=>item.raw)};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`arcana-raw-state-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
function showStartupRecovery(error){
  const main=document.querySelector("main");
  const status=error?.arcanaStatus||"LOAD_ERROR";
  const message=error?.message||"Arcana não conseguiu validar seus dados locais.";
  console.warn("[Arcana] startup recovery required",error);
  if(!main){
    alert(message);
    return
  }
  main.innerHTML=`<section class="recovery-view"><div class="kicker">DATA SAFETY</div><h1>Arcana pausou para proteger seus dados</h1><p class="hint">Status: ${esc(status)} · ${esc(message)}</p><p>O app não vai substituir seu IndexedDB por dados vazios depois de uma falha de leitura ou migração.</p><div class="recovery-actions"><button id="recoveryExportRawBtn" class="gold-btn">Exportar estado bruto</button><button id="recoveryRetryBtn" class="ghost-btn">Tentar novamente</button></div><div class="snapshot-tools"><label class="snapshot-label" for="recoverySnapshotList">Snapshot</label><select id="recoverySnapshotList"><option value="">Carregando snapshots...</option></select><button id="recoveryRestoreSnapshotBtn" class="ghost-btn">Restaurar snapshot</button></div><p id="recoveryStatus" class="hint"></p></section>`;
  $("recoveryExportRawBtn").onclick=()=>window.ArcanaStorage?.downloadRawState?ArcanaStorage.downloadRawState():downloadLocalRawState();
  $("recoveryRetryBtn").onclick=()=>location.reload();
  if(window.ArcanaStorage?.listSnapshots){
    ArcanaStorage.listSnapshots().then(snaps=>{
      $("recoverySnapshotList").innerHTML=snaps.length?snaps.map(s=>`<option value="${esc(s.id)}">${new Date(s.createdAt).toLocaleString("pt-BR")} · ${esc(s.reason||"snapshot")}</option>`).join(""):`<option value="">Nenhum snapshot disponível</option>`
    }).catch(err=>{
      $("recoverySnapshotList").innerHTML=`<option value="">Snapshots indisponíveis</option>`;
      $("recoveryStatus").textContent=err.message||String(err)
    })
  }
  $("recoveryRestoreSnapshotBtn").onclick=async()=>{
    const id=$("recoverySnapshotList").value;
    if(!id){
      return
    }
    if(!confirm("Restaurar este snapshot local? O estado atual será preservado em um snapshot pré-restauração.")){
      return
    }
    try{
      const restored=await ArcanaStorage.restoreSnapshot(id);
      state=preparePersistedState(restored,{source:"snapshot-restore"}).state;
      await ArcanaStorage.saveState(state);
      location.reload()
    }catch(err){
      $("recoveryStatus").textContent=err.message||String(err)
    }
  }
}

async function initApp(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(e=>console.info("[Arcana] service worker unavailable",e.message||e))
  }
  try{
    if(window.ArcanaStorage){
      state=await ArcanaStorage.init({storageKey:STORAGE_KEY,legacyKeys:LEGACY_KEYS,defaultState:DEFAULT_STATE,createDefaultState:createFreshDefaultState,normalize,migrate,prepareState:preparePersistedState});
      await migrateLocalVaultFromBackend()
    }else{
      const record=loadLocalStateRecord();
      if(record.status==="NO_DATA"){
        state=createFreshDefaultState();
        localStorage.setItem(STORAGE_KEY,JSON.stringify(state))
      }else if(record.status==="LOAD_ERROR"){
        throw record.error
      }else{
        const prepared=preparePersistedState(record.state,{source:record.source});
        state=prepared.state;
        if(prepared.migrated||record.legacy){
          localStorage.setItem(STORAGE_KEY,JSON.stringify(state))
        }
      }
    }
  }catch(e){
    showStartupRecovery(e);
    return
  }
  renderAll();
  await loadVaultNotes();
  await refreshObsidianStatus();
  if(!isLocalBackend()){
    try{
      await refreshPublishedCatalog(false);
    }catch(e){
      youtubeCatalogMeta={...youtubeCatalogMeta,error:e.message||String(e)};
    }
    renderAll()
  }
  setTimeout(()=>{
    if(activePlaylist()?.url&&!activePlaylist()?.lastSyncAt&&isLocalBackend()){syncPlaylist()}
    if(externalCalendarConfig().connected){syncExternalCalendars().catch(e=>console.info("[Arcana] calendar sync unavailable",e.message||e))}
    if(!state.lastAutoBackup){autoBackup("initial")}
  },700)
}

$("regenPlanBtn").onclick=generatePlan;$("todayMinutes").onchange=generatePlan;
$("newTrackBtn").onclick=()=>openTrackDialog();$("editTrackBtn").onclick=()=>openTrackDialog(state.activeTrack);$("trackForm").onsubmit=saveTrack;$("deleteTrackBtn").onclick=deleteTrack;$("addCourseBtn").onclick=()=>openItemDialog("course");
$("newPlaylistBtn").onclick=()=>openPlaylistDialog();$("editPlaylistBtn").onclick=()=>openPlaylistDialog(state.activePlaylist);$("playlistForm").onsubmit=savePlaylist;$("deletePlaylistBtn").onclick=deletePlaylist;$("syncPlaylistBtn").onclick=syncPlaylist;
$("exportPlaylistBtn").onclick=exportPlaylistFile;
$("catalogOptionsBtn").onclick=openCatalogRequestDialog;
$("copyCatalogRequestBtn").onclick=()=>copyCatalogRequestJson().catch(()=>{});
$("searchInput").oninput=renderLibrary;$("libraryTypeFilter").onchange=renderLibrary;$("priorityFilter").onchange=renderLibrary;
$("captureBtn").onclick=captureInbox;$("inboxInput").onkeydown=e=>{if(e.key==="Enter")captureInbox()};
document.querySelectorAll("[data-knowledge-tab]").forEach(button=>button.onclick=()=>{activeKnowledgeTab=button.dataset.knowledgeTab;renderKnowledge()});
if($("knowledgeSearch")){$("knowledgeSearch").oninput=renderKnowledge}
$("globalSearchBtn").onclick=openGlobalSearch;
$("globalSearchInput").oninput=e=>{globalSearchQuery=e.currentTarget.value;renderGlobalSearchResults()};
$("globalSearchInput").onkeydown=e=>{if(e.key==="Enter"){const first=buildSearchResults(globalSearchQuery)[0];if(first){openSearchResult(first.kind,first.id,first.scope||"")}}};
document.querySelectorAll("[data-capture-kind]").forEach(button=>button.onclick=()=>captureUniversal(button.dataset.captureKind).catch(err=>{if($("captureStatus")){$("captureStatus").textContent=err.message||String(err)}}));
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openGlobalSearch()}});
$("youtubeSettingsForm").onsubmit=e=>{e.preventDefault();const f=e.currentTarget;state.youtubeSettings={mode:f.mode.value,minutes:Number(f.minutes.value)||0,count:Number(f.count.value)||0,hideAfterLimit:f.hideAfterLimit.checked};save()};
if($("newRoutineBtn")){$("newRoutineBtn").onclick=()=>openRoutineDialog()}
if($("routineTemplateBtn")){$("routineTemplateBtn").onclick=()=>exportRoutineExcel(true)}
if($("routineExportBtn")){$("routineExportBtn").onclick=()=>exportRoutineExcel(false)}
bindRoutineExcelImportInput($("routineImportInput"));
if($("settingsRoutineTemplateBtn")){$("settingsRoutineTemplateBtn").onclick=()=>exportRoutineExcel(true)}
if($("settingsRoutineExportBtn")){$("settingsRoutineExportBtn").onclick=()=>exportRoutineExcel(false)}
bindRoutineExcelImportInput($("settingsRoutineImportInput"));
if($("applyRoutineImportBtn")){$("applyRoutineImportBtn").onclick=applyRoutineImportFromDialog}
if($("routineViewMode")){$("routineViewMode").onchange=e=>{routineViewMode=e.currentTarget.value;renderRoutine()}}
if($("routineForm")){$("routineForm").onsubmit=saveRoutineBlock}
if($("deleteRoutineBtn")){$("deleteRoutineBtn").onclick=deleteRoutineBlock}
if($("duplicateRoutineBtn")){$("duplicateRoutineBtn").onclick=()=>duplicateRoutineBlock($("routineForm").elements.id.value)}
if($("newHobbyBtn")){$("newHobbyBtn").onclick=()=>openHobbyDialog()}
if($("hobbyForm")){$("hobbyForm").onsubmit=saveHobby}
if($("deleteHobbyBtn")){$("deleteHobbyBtn").onclick=deleteHobby}
if($("planningSettingsForm")){$("planningSettingsForm").onsubmit=savePlanningSettings}
if($("knowledgeExtractionSettingsForm")){$("knowledgeExtractionSettingsForm").onsubmit=saveKnowledgeExtractionSettings}
if($("knowledgeExtractionSaveSecretBtn")){$("knowledgeExtractionSaveSecretBtn").onclick=saveKnowledgeExtractionDevSecret}
if($("knowledgeExtractionClearSecretBtn")){$("knowledgeExtractionClearSecretBtn").onclick=clearKnowledgeExtractionDevSecret}
if($("calendarIntegrationForm")){$("calendarIntegrationForm").onsubmit=saveCalendarSettings}
if($("googleCalendarConnectBtn")){$("googleCalendarConnectBtn").onclick=()=>connectGoogleCalendar().catch(err=>alert(err.message||String(err)))}
if($("googleCalendarSyncBtn")){$("googleCalendarSyncBtn").onclick=()=>syncExternalCalendars({force:true}).then(result=>{if(result?.error){toast(result.error,"error")}else if(!result?.throttled){toast("Calendário sincronizado.","ok")}}).catch(err=>alert(err.message||String(err)))}
if($("googleCalendarDisconnectBtn")){$("googleCalendarDisconnectBtn").onclick=()=>disconnectGoogleCalendar().catch(err=>alert(err.message||String(err)))}
if($("googleCalendarList")){$("googleCalendarList").onchange=e=>{if(e.target?.matches?.("input[data-calendar-id]")){saveCalendarSelection().catch(err=>alert(err.message||String(err)))}}}
if($("registerBtn")){$("registerBtn").onclick=openRegisterDialog}
if($("registerForm")){$("registerForm").onsubmit=saveManualRegistration}
if($("registerParseBtn")){$("registerParseBtn").onclick=()=>fillRegisterForm(parseQuickRegistration($("registerQuickInput").value))}
if($("registerQuickInput")){$("registerQuickInput").oninput=e=>renderRegisterPreview(parseQuickRegistration(e.currentTarget.value))}
if($("registerTypeSelect")){$("registerTypeSelect").onchange=()=>renderRegisterPreview()}
if($("registerTrackSelect")){$("registerTrackSelect").onchange=renderRegisterCurriculumOptions}
if($("registerCourseSelect")){$("registerCourseSelect").onchange=renderRegisterCurriculumOptions}
if($("registerModuleSelect")){$("registerModuleSelect").onchange=renderRegisterCurriculumOptions}
if($("timeNowBtn")){$("timeNowBtn").onclick=openTimeNowDialog}
document.querySelectorAll("[data-time-now-minutes]").forEach(button=>button.onclick=()=>renderTimeNowSuggestion(Number(button.dataset.timeNowMinutes)||30));
if($("journalDate")){$("journalDate").onchange=e=>{journalCursor=validDate(e.currentTarget.value);renderJournal();renderWeeklyAnalytics()}}
if($("journalPrevBtn")){$("journalPrevBtn").onclick=()=>{journalCursor.setDate(journalCursor.getDate()-1);renderJournal();renderWeeklyAnalytics()}}
if($("journalNextBtn")){$("journalNextBtn").onclick=()=>{journalCursor.setDate(journalCursor.getDate()+1);renderJournal();renderWeeklyAnalytics()}}
$("refreshCatalogBtn").onclick=async()=>{try{await refreshPublishedCatalog(true);renderAll()}catch(err){youtubeCatalogMeta={...youtubeCatalogMeta,error:err.message||String(err)};renderAll();alert(err.message||String(err))}};
$("backupNowBtn").onclick=()=>autoBackup("manual");
$("exportFullBackupBtn").onclick=()=>ArcanaStorage.downloadFullBackup(state);
$("fullBackupImportInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await importFullBackupFile(f)}catch(err){alert(err.message)}e.target.value=""};
$("exportVaultBtn").onclick=()=>ArcanaStorage.downloadObsidianVault(state);
$("vaultImportInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const summary=await ArcanaStorage.importVault(f);await loadVaultNotes();renderAll();if(summary){alert(`Importação concluída: ${summary.importedNotes||0} notas (${summary.arcanaManagedNotes||0} gerenciadas pelo Arcana, ${summary.externalNotes||0} externas) e ${summary.importedFlashcards||0} flashcards.`)}}catch(err){alert(err.message)}e.target.value=""};
$("reindexVaultBtn").onclick=async()=>{try{await api("/api/reindex",{method:"POST"});await loadVaultNotes();alert("Vault reindexado.")}catch(e){alert(e.message)}};
if($("exportRawStateBtn")){$("exportRawStateBtn").onclick=()=>{if(window.ArcanaStorage?.ready&&ArcanaStorage.downloadRawState){ArcanaStorage.downloadRawState()}else{downloadLocalRawState()}}}
$("restoreSnapshotBtn").onclick=async()=>{const id=$("snapshotList").value;if(!id)return;if(!confirm("Restaurar este snapshot? O estado atual será protegido em um snapshot antes da troca."))return;try{const restored=await ArcanaStorage.restoreSnapshot(id);state=preparePersistedState(restored,{source:"snapshot-restore"}).state;await ArcanaStorage.saveState(state);await loadVaultNotes();renderAll();toast("Snapshot restaurado.","ok")}catch(e){alert(e.message)}};
if($("syncCalendarBtn")){$("syncCalendarBtn").onclick=()=>syncExternalCalendars({force:true}).then(result=>{if(result?.error){toast(result.error,"error")}else if(!result?.throttled){toast("Agenda externa sincronizada.","ok")}}).catch(err=>alert(err.message||String(err)))}
$("obsidianConnectBtn").onclick=()=>connectObsidianVault().catch(e=>alert(e.message||String(e)));
$("obsidianSyncBtn").onclick=()=>runObsidianSync("push").catch(()=>{});
if($("obsidianSyncAllBtn")){$("obsidianSyncAllBtn").onclick=()=>runObsidianSync("push").catch(()=>{})}
if($("obsidianZipBtn")){$("obsidianZipBtn").onclick=()=>ArcanaStorage.downloadObsidianVault(state)}
if($("obsidianBridgeRefreshBtn")){$("obsidianBridgeRefreshBtn").onclick=()=>refreshObsidianStatus().catch(()=>{})}
if(document.addEventListener){
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){
      stopYoutubeCatalogPolling();
    }else{
      scheduleYoutubeCatalogPolling()
    }
  });
}
$("obsidianDisconnectBtn").onclick=()=>disconnectObsidianVault().catch(e=>alert(e.message||String(e)));
$("obsidianOpenBtn").onclick=openObsidianVault;
$("obsidianAutoSync").onchange=e=>updateObsidianAutoSync(e.currentTarget.checked?"after_session":"manual").catch(err=>alert(err.message||String(err)));
$("playlistImportInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await importPlaylistFile(f)}catch(err){alert(err.message)}e.target.value=""};
$("newNoteBtn").onclick=()=>newVaultNote("permanent");$("newFichamentoBtn").onclick=()=>newFichamento();
["vaultSearchInput","vaultTypeFilter","vaultTrackFilter","vaultTagFilter","vaultFavoriteFilter","vaultReviewFilter","vaultSortFilter"].forEach(id=>{if($(id))$(id).oninput=renderNotes;if($(id))$(id).onchange=renderNotes});
["fichamentoSearch","fichamentoSourceType"].forEach(id=>{if($(id))$(id).oninput=renderFichamentos;if($(id))$(id).onchange=renderFichamentos});
$("prevMonthBtn").onclick=()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()-1,1);renderCalendar()};$("nextMonthBtn").onclick=()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()+1,1);renderCalendar()};
$("addBtn").onclick=openCaptureDialog;$("itemForm").onsubmit=saveItem;$("itemForm").kind.onchange=()=>renderModuleEditor();$("addModuleBtn").onclick=()=>$("moduleRows").insertAdjacentHTML("beforeend",moduleInput());
$("saveNotesBtn").onclick=saveNotes;$("promoteDialogNoteBtn").onclick=promoteDialogNote;$("focusNotesText").oninput=queueFocusSave;document.querySelectorAll("[data-focus-block]").forEach(b=>b.onclick=()=>insertFocusBlock(b.dataset.focusBlock));$("timerStartBtn").onclick=startTimer;$("timerPauseBtn").onclick=pauseTimer;$("timerResetBtn").onclick=resetTimer;$("closeFocusBtn").onclick=closeFocus;$("focusDoneBtn").onclick=completeFocus;$("focusUndoBtn").onclick=undoFocusedCompletion;
if($("extractionCandidateList")){
  $("extractionCandidateList").oninput=handleExtractionCandidateEvent;
  $("extractionCandidateList").onchange=handleExtractionCandidateEvent;
  $("extractionCandidateList").onclick=handleExtractionCandidateClick
}
if($("extractionCategoryTabs")){
  $("extractionCategoryTabs").onclick=handleExtractionCandidateClick
}
document.querySelectorAll("[data-extraction-add]").forEach(button=>button.onclick=()=>addExtractionCandidate(button.dataset.extractionAdd));
if($("extractionRetryBtn")){
  $("extractionRetryBtn").onclick=()=>generateKnowledgeSuggestions(true).catch(err=>alert(err.message||String(err)))
}
if($("extractionManualBtn")){
  $("extractionManualBtn").onclick=()=>addExtractionCandidate("permanent-note")
}
if($("extractionMergeBtn")){
  $("extractionMergeBtn").onclick=mergeSelectedExtractionCandidates
}
if($("extractionSkipBtn")){
  $("extractionSkipBtn").onclick=()=>closeKnowledgeExtractionReview("skipped").catch(err=>alert(err.message||String(err)))
}
if($("extractionSaveDraftBtn")){
  $("extractionSaveDraftBtn").onclick=()=>saveKnowledgeExtractionDraft("draft").then(()=>notice("Rascunho de extração salvo.")).catch(err=>alert(err.message||String(err)))
}
if($("extractionSaveKnowledgeBtn")){
  $("extractionSaveKnowledgeBtn").onclick=()=>confirmKnowledgeExtraction().catch(err=>alert(err.message||String(err)))
}
if($("extractionCloseBtn")){
  $("extractionCloseBtn").onclick=()=>closeKnowledgeExtractionReview("draft").catch(err=>alert(err.message||String(err)))
}
if($("exportBtn")){$("exportBtn").onclick=()=>ArcanaStorage.downloadFullBackup(state)}
if($("importInput")){$("importInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await importFullBackupFile(f)}catch(err){alert(err.message||"Backup inválido")}e.target.value=""}}
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());

initApp();
