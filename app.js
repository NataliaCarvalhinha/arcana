
const STORAGE_KEY="arcana-v5";
const LEGACY_KEYS=["arcana-activity-hub-v4","arcana-activity-hub-v3","arcana-activity-hub-v2"];
const STARTER_CONTENT_VERSION=2;
const STARTER_CURRICULUM_VERSION=1;
const CURRICULUM_FETCHED_AT="2026-08-17T00:00:00.000Z";
const DEFAULT_OBSIDIAN_STATE={available:false,connected:false,vaultName:"",vaultPath:"",lastSyncAt:null,noteCount:0,fichamentoCount:0,attachmentCount:0,flashcardCount:0,conflicts:0,autoSync:"manual",syncStatus:"saved",lastPush:{},openUrl:"",error:null};
const ROUTINE_WEEKDAYS=[{key:1,label:"Segunda",short:"Seg"},{key:2,label:"Terça",short:"Ter"},{key:3,label:"Quarta",short:"Qua"},{key:4,label:"Quinta",short:"Qui"},{key:5,label:"Sexta",short:"Sex"},{key:6,label:"Sábado",short:"Sáb"},{key:7,label:"Domingo",short:"Dom"}];
const ROUTINE_CATEGORIES={work:{label:"Trabalho",icon:"▦"},class:{label:"Aula",icon:"◐"},study:{label:"Estudo",icon:"☿"},sport:{label:"Esporte",icon:"◇"},meal:{label:"Refeição",icon:"◒"},personal:{label:"Pessoal",icon:"☽"},appointment:{label:"Compromisso",icon:"◎"},hobby:{label:"Hobby",icon:"✧"},travel:{label:"Deslocamento",icon:"→"},sleep:{label:"Sono/descanso",icon:"☾"},other:{label:"Outro",icon:"•"}};
const DEFAULT_PLANNING_PREFERENCES={dayStart:"07:00",dayEnd:"23:00",minimumSessionMinutes:15,preferredSessionMinutes:30,planningBufferMinutes:5,useOnlyStudyBlocks:false,allowHobbySuggestions:false};
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
const DEFAULT_STATE={activeTrack:"default",tracks:[{id:"default",name:"Principal",sigil:"☽",subtitle:"Seu caminho inicial",description:"Uma trilha vazia para começar sem publicar dados pessoais.",weeklyGoal:120,progression:"sequential"}],items:[],playlists:[{id:"main-playlist",youtubePlaylistId:"",name:"Playlist de foco",url:"",enabled:true,createdAt:null,updatedAt:null,lastSyncAt:null,lastSyncError:null,catalogGeneratedAt:null,catalogTitle:null}],activePlaylist:"main-playlist",youtubeQueue:[],youtubeDaily:{},youtubeSettings:{mode:"either",minutes:45,count:3,hideAfterLimit:true},obsidian:structuredClone(DEFAULT_OBSIDIAN_STATE),externalCalendars:structuredClone(DEFAULT_EXTERNAL_CALENDAR_STATE),inbox:[],sessions:[],activityLog:[],activityLogVersion:ACTIVITY_LOG_VERSION,weeklyGoals:[],dailyCheckins:{},xp:0,streak:0,lastStudyDate:null,weeklyProgress:{default:0},shortcuts:[{label:"YouTube",url:"https://www.youtube.com/",glyph:"▶"},{label:"GitHub",url:"https://github.com/",glyph:"⌘"},{label:"ChatGPT",url:"https://chatgpt.com/",glyph:"✧"}],lastAutoBackup:null,dailyPlan:{date:null,minutes:60,items:[],freeWindows:[],availableMinutes:0,notices:[]},routineBlocks:[],routineExceptions:[],hobbies:structuredClone(STARTER_HOBBIES),planningPreferences:structuredClone(DEFAULT_PLANNING_PREFERENCES),starterContentVersion:0,starterCurriculumVersion:0};
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
let state=structuredClone(DEFAULT_STATE),currentView="home",focusRef=null,timer=0,timerHandle=null,notesRef=null,calendarCursor=new Date(),journalCursor=new Date(),syncing=false,expandedCourseId=null,activeKnowledgeTab="all",globalSearchQuery="",routineViewMode="week";
let vaultNotes=[],activeVaultNote=null,activeVaultMode="notes",vaultSaveTimer=null,focusNoteId=null,focusSaveTimer=null,focusBlocks=[],currentReviewNote=null;
let youtubeCatalogMeta={version:null,generatedAt:null,lastLoadedAt:null,playlistIds:[],playlistCount:0,videoCount:0,error:null};
let youtubeCatalogPollHandle=null;
let obsidianAutoSyncHandle=null,obsidianSyncInFlight=false;
let calendarFilters={routine:true,external:true,plan:true,completed:true};
let externalCalendarSyncing=false;
let calendarRuntime={googleAccessToken:null,googleTokenExpiresAt:0,tokenClient:null,identityScript:null};
const NOTE_TYPE_LABELS={literature:"Fichamento",permanent:"Permanente",concept:"Conceito",question:"Pergunta",insight:"Insight",quote:"Citação",reference:"Referência",next_action:"Ação",quick:"Rápida",session:"Sessão"};
const FOCUS_BLOCK_TYPES={concept:{label:"Conceito",target:"permanent"},question:{label:"Pergunta",target:"question"},insight:{label:"Insight",target:"permanent"},quote:{label:"Citação"},example:{label:"Exemplo"},formula:{label:"Fórmula / comando"},next_action:{label:"Próximo passo"},free:{label:"Nota livre"}};
const $=id=>document.getElementById(id);
const YOUTUBE_PLAYLIST_ID_RE=/^[A-Za-z0-9_-]{8,}$/;

function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);if(raw)return normalize(JSON.parse(raw));
    for(const key of LEGACY_KEYS){
      const old=localStorage.getItem(key);if(old){const s=migrate(JSON.parse(old));localStorage.setItem(STORAGE_KEY,JSON.stringify(s));return s}
    }
  }catch(e){}
  return structuredClone(DEFAULT_STATE)
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
  const weekday=clampNumber(block.weekday,1,7,weekdayKeyForDate());
  const category=ROUTINE_CATEGORIES[block.category]?block.category:"other";
  return {
    id:block.id||crypto.randomUUID(),
    title,
    category,
    weekday,
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
  const weekly=(state.routineBlocks||[]).filter(block=>block.active!==false&&block.weekday===weekday&&!routineExceptionFor(block,date));
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

function isLocalBackend(){return ["localhost","127.0.0.1",""].includes(location.hostname)}
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
  return isLocalBackend()?"Arcana Local com Obsidian Bridge direto":"Modo online: exportação ZIP e importação manual"
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
async function refreshObsidianStatus(){
  if(!isLocalBackend()){
    return applyObsidianStatus({available:false,connected:false})
  }
  try{
    const data=await api("/api/obsidian/status");
    return applyObsidianStatus({available:true,...(data.obsidian||{})})
  }catch(e){
    return applyObsidianStatus({available:false,error:e.message||String(e)})
  }
}
function ensureObsidianAutoSyncLoop(){
  clearInterval(obsidianAutoSyncHandle);
  obsidianAutoSyncHandle=null;
}
async function runObsidianSync(mode="push",silent=false){
  if(!isLocalBackend()||!state.obsidian.connected||obsidianSyncInFlight){
    return state.obsidian
  }
  obsidianSyncInFlight=true;
  applyObsidianStatus({syncStatus:"syncing"});
  try{
    const payload=await ArcanaStorage.obsidianPayload(state);
    const data=await api(`/api/obsidian/${mode==="sync"?"push":mode}`,{method:"POST",body:JSON.stringify({autoSync:state.obsidian.autoSync,payload})});
    applyObsidianStatus({available:true,syncStatus:"synced",...(data.obsidian||{}),lastPush:{ok:data.ok,created:data.created,updated:data.updated,unchanged:data.unchanged,errors:data.errors||[],warnings:data.warnings||[]}});
    return state.obsidian
  }catch(e){
    applyObsidianStatus({syncStatus:"saved",error:e.message||String(e)});
    if(!silent){
      alert(e.message||String(e))
    }
    throw e
  }finally{
    obsidianSyncInFlight=false
  }
}
function queueObsidianAutoSync(reason){
  if(!isLocalBackend()||!state.obsidian.connected){
    return
  }
  if(reason!=="after_session"||state.obsidian.autoSync!=="after_session"){
    return
  }
  Promise.resolve().then(()=>runObsidianSync("push",true)).catch(()=>{})
}
async function connectObsidianVault(){
  if(!isLocalBackend()){
    alert("No GitHub Pages o Arcana só pode exportar e importar um vault ZIP.")
    return
  }
  const suggestion=state.obsidian.vaultPath||"";
  const path=prompt("Caminho absoluto da pasta raiz do seu vault Obsidian",suggestion);
  if(path===null){
    return
  }
  const data=await api("/api/obsidian/connect",{method:"POST",body:JSON.stringify({vaultPath:path.trim(),autoSync:state.obsidian.autoSync||"manual"})});
  applyObsidianStatus({available:true,...(data.obsidian||{})})
}
async function disconnectObsidianVault(){
  if(!confirm("Desconectar o vault Obsidian do Arcana Local?")){
    return
  }
  const data=await api("/api/obsidian/disconnect",{method:"POST",body:JSON.stringify({})});
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
  if(isLocalBackend()&&state.obsidian.connected&&state.obsidian.vaultPath){
    const data=await api("/api/obsidian/connect",{method:"POST",body:JSON.stringify({vaultPath:state.obsidian.vaultPath,autoSync:value})});
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
function generatePlan(){
  const mins=Number($("todayMinutes")?.value||state.dailyPlan.minutes||60);
  const result=planActivitiesIntoWindows(new Date(),{minutes:mins});
  state.dailyPlan={...state.dailyPlan,date:dayKey(),minutes:mins,items:result.items,freeWindows:result.freeWindows,availableMinutes:result.availableMinutes,notices:result.notices,generatedAt:new Date().toISOString(),calendarConflictDismissedAt:null};
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
  return `<details class="row-menu" onclick="event.stopPropagation()"><summary aria-label="Mais ações" aria-haspopup="menu">⋯</summary><div role="menu"><button class="mini-btn" role="menuitem" onclick="openFichamentoForSource(${jsArg(id)},${jsArg(scope)})">Fichamento</button><button class="mini-btn" role="menuitem" onclick="openNotes(${jsArg(id)},${jsArg(scope)})">Notas</button>${scope==="item"?`<button class="mini-btn" role="menuitem" onclick="editItem(${jsArg(id)})">Editar</button>`:""}</div></details>`
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
  return `<div class="video-row clickable-row" role="button" tabindex="0" onclick="openFocus(${jsArg(v.id)},'youtube')" onkeydown="activateRow(event,this)">${v.thumbnail?`<img class="video-thumb" src="${esc(v.thumbnail)}">`:"<div class='num'>▶</div>"}<div class="grow"><strong>${esc(v.title)}</strong><span>${esc(v.channel||"YouTube")} · ${dur} ${today?`· vídeo ${n+1} de hoje`:""} · ${noteCount(v.id)} notas</span></div><button class="mini-btn" onclick="event.stopPropagation();openFocus(${jsArg(v.id)},'youtube')">Assistir</button><button class="mini-btn" onclick="event.stopPropagation();openFichamentoForSource(${jsArg(v.id)},'youtube')">Fichamento</button><button class="mini-btn" onclick="event.stopPropagation();openNotes(${jsArg(v.id)},'youtube')">Notas</button></div>`
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
function focusBlockTitle(block){
  return String(block?.title||firstMeaningfulLine(block?.content)||FOCUS_BLOCK_TYPES[block?.type]?.label||"Bloco").trim()
}
function normalizeFocusBlocks(blocks){
  if(!Array.isArray(blocks)){
    return []
  }
  return blocks.map(block=>({id:block.id||crypto.randomUUID(),type:FOCUS_BLOCK_TYPES[block.type]?block.type:"free",title:block.title||"",content:block.content||"",timestamp:block.timestamp||"",noteId:block.noteId||null,promotedAs:block.promotedAs||null,createdAt:block.createdAt||new Date().toISOString(),updatedAt:block.updatedAt||block.createdAt||new Date().toISOString()}))
}
function updateFocusBlock(id,patch){
  focusBlocks=focusBlocks.map(block=>block.id===id?{...block,...patch,updatedAt:new Date().toISOString()}:block);
  queueFocusSave()
}
function focusBlockPromoteButtons(block){
  if(block.type==="concept"){
    return `<button class="mini-btn" onclick="promoteFocusBlock(${jsArg(block.id)},'permanent')">Transformar em nota permanente</button>`
  }
  if(block.type==="insight"){
    return `<button class="mini-btn" onclick="promoteFocusBlock(${jsArg(block.id)},'permanent')">Nota permanente</button><button class="mini-btn" onclick="promoteFocusBlock(${jsArg(block.id)},'concept')">Conceito</button>`
  }
  if(block.type==="question"){
    return `<button class="mini-btn" onclick="promoteFocusBlock(${jsArg(block.id)},'question')">Transformar em pergunta</button>`
  }
  return ""
}
function renderFocusBlocks(){
  if(!$("focusBlockList")){
    return
  }
  $("focusBlockList").innerHTML=focusBlocks.length?focusBlocks.map(block=>{
    const meta=FOCUS_BLOCK_TYPES[block.type]||FOCUS_BLOCK_TYPES.free;
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
  const payload={title,type:targetType,content:promotedBlockContent(block,targetType,title,source.sourceTitle),trackId:source.trackId,sourceType:sourceTypeForResource(i,focusRef.scope),sourceId:i.id,courseId:source.courseId,moduleId:source.moduleId,lessonId:source.lessonId,sourceTitle:source.sourceTitle,sessionId:focusNoteId||null,relatedNoteIds:focusNoteId?[focusNoteId]:[],tags:["focus",block.type],source,questionStatus:targetType==="question"?"open":null};
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
  if(!focusRef)return;const i=findFocus(focusRef.id,focusRef.scope);if(!i)return;const mins=Math.max(1,Math.round(timer/60));
  const source=sourcePayloadForResource(i,focusRef.scope,{minutes:mins});
  const session={id:crypto.randomUUID(),date:dayKey(),timestamp:new Date().toISOString(),minutes:mins,title:i.title,type:sourceTypeForResource(i,focusRef.scope),sourceId:i.id,trackId:source.trackId,courseId:source.courseId,moduleId:source.moduleId,lessonId:source.lessonId,track:source.trackId};
  state.sessions.push(session);
  clearTimeout(focusSaveTimer);
  try{
    await saveFocusDraft(true,session.id,mins,{throwOnError:true,skipStateSave:true})
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
  await save();await closeFocus(false);queueObsidianAutoSync("after_session")
}
function updateStreak(){const today=dayKey(),y=new Date();y.setDate(y.getDate()-1);const yd=dayKey(y);if(state.lastStudyDate===today)return;if(state.lastStudyDate===yd)state.streak++;else state.streak=1;state.lastStudyDate=today}

async function saveFocusDraft(done=false,sessionId=null,minutes=0,options={}){
  if(!focusRef||!$("focusNotesText"))return;const i=findFocus(focusRef.id,focusRef.scope);if(!i)return;
  const source=sourcePayloadForResource(i,focusRef.scope,{timestamp:$("focusTimestamp").value||"",minutes});
  const payload={title:`Sessão - ${i.title}`,type:"session",content:$("focusNotesText").value,blocks:focusBlocks,trackId:source.trackId,sourceType:sourceTypeForResource(i,focusRef.scope),sourceId:i.id,sourceTitle:source.sourceTitle,sessionId:sessionId||null,courseId:source.courseId,moduleId:source.moduleId,lessonId:source.lessonId,durationMinutes:minutes||Math.round(timer/60)||0,tags:done?["sessao","concluida"]:["sessao","rascunho"],source};
  try{
    const data=focusNoteId?await api(`/api/notes/${encodeURIComponent(focusNoteId)}`,{method:"PUT",body:JSON.stringify(payload)}):await api("/api/notes",{method:"POST",body:JSON.stringify(payload)});
    focusNoteId=data.note.id;i.focusDraftNoteId=focusNoteId;$("focusSaveState").textContent=done?"Sessão salva no vault.":"Salvo ✓";if(!options.skipStateSave){save(false)}loadVaultNotes()
  }catch(e){$("focusSaveState").textContent=`Erro ao salvar: ${e.message}`;if(options.throwOnError){throw e}}
}
function queueFocusSave(){clearTimeout(focusSaveTimer);if($("focusSaveState")){$("focusSaveState").textContent="Salvando..."}focusSaveTimer=setTimeout(()=>saveFocusDraft(false),900)}
function insertFocusBlock(kind){
  const type=FOCUS_BLOCK_TYPES[kind]?kind:"free";
  focusBlocks.push({id:crypto.randomUUID(),type,title:"",content:"",timestamp:$("focusTimestamp").value||"",noteId:null,promotedAs:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  renderFocusBlocks();
  queueFocusSave()
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
  if(n.type==="concept"||n.type==="permanent"){
    return "concepts"
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
  return {all:"Tudo",fichamentos:"Fichamento",notes:"Nota",concepts:"Conceito",questions:"Pergunta",reviews:"Revisão",sessions:"Sessão"}[tab]||"Nota"
}
function knowledgeTabName(tab){
  return {all:"Tudo",fichamentos:"Fichamentos",notes:"Notas",concepts:"Conceitos",questions:"Perguntas",reviews:"Revisões",sessions:"Sessões"}[tab]||knowledgeTabLabel(tab)
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
  (state.routineBlocks||[]).forEach(block=>{if(searchTextMatches(q,block.title,block.category,block.location,block.address,block.notes)){results.push({kind:"routine",id:block.id,title:block.title,meta:`Rotina · ${routineWeekdayLabel(block.weekday)} · ${clockRangeLabel(parseClock(block.startTime),parseClock(block.endTime))}`,icon:"◷"})}});
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
  try{const data=await api(`/api/notes/${encodeURIComponent(activeVaultNote.id)}`,{method:"PUT",body:JSON.stringify(activePayload())});activeVaultNote=data.note;state.obsidian.syncStatus="saved";if(data.duplicateCandidates?.length){$("vaultWarnings").innerHTML=`<div class="hint">Possível duplicata: ${data.duplicateCandidates.map(d=>esc(d.title)).join(", ")}</div>`}await loadVaultNotes()}catch(e){alert(e.message)}
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
function routineBlockCard(block,compact=false){
  const icon=ROUTINE_CATEGORIES[block.category]?.icon||"•";
  const start=parseClock(block.startTime),end=parseClock(block.endTime);
  const commute=[block.travelBeforeMinutes?`${fmtMin(block.travelBeforeMinutes)} antes`:"",block.travelAfterMinutes?`${fmtMin(block.travelAfterMinutes)} depois`:""].filter(Boolean).join(" · ");
  const place=[block.location,block.address].filter(Boolean).join(" · ");
  const actions=compact?"":`<div class="routine-actions"><button class="mini-btn" onclick="openRoutineDialog(${jsArg(block.id)})">Editar</button><button class="mini-btn" onclick="duplicateRoutineBlock(${jsArg(block.id)})">Copiar</button><button class="mini-btn" onclick="cancelRoutineBlockToday(${jsArg(block.id)})">Cancelar hoje</button><button class="mini-btn" onclick="toggleRoutineBlock(${jsArg(block.id)})">${block.active===false?"Ativar":"Pausar"}</button>${block.address?`<button class="mini-btn" onclick="openMapForRoutine(${jsArg(block.id)})">Mapa</button>`:""}</div>`;
  return `<article class="routine-block-card ${block.active===false?"is-paused":""}"><div class="routine-block-head"><span class="routine-icon">${esc(icon)}</span><div class="grow"><strong>${esc(block.title)}</strong><span>${esc(routineCategoryLabel(block.category))} · ${esc(clockRangeLabel(start,end))}</span></div><span class="tag">${block.fixed===false?"flexível":"fixo"}</span></div>${commute?`<div class="routine-meta">${esc(commute)}</div>`:""}${place?`<div class="routine-meta">${esc(place)}</div>`:""}${block.notes&&!compact?`<p>${esc(block.notes)}</p>`:""}${actions}</article>`
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
    const blocks=(state.routineBlocks||[]).filter(block=>block.weekday===day.key).sort((a,b)=>parseClock(a.startTime)-parseClock(b.startTime));
    return `<article class="routine-day-card"><div class="routine-day-head"><strong>${esc(day.label)}</strong><button class="mini-btn" onclick="openRoutineDialog('',{weekday:${day.key}})">＋</button></div>${blocks.length?blocks.map(block=>routineBlockCard(block,true)).join(""):`<div class="hint">Sem blocos.</div>`}</article>`
  }).join("")
}
function renderRoutineList(){
  if(!$("routineList")){
    return
  }
  const blocks=[...(state.routineBlocks||[])].sort((a,b)=>a.weekday-b.weekday||parseClock(a.startTime)-parseClock(b.startTime));
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
  e.weekday.value=block.weekday;
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
  const block=normalizeRoutineBlock({id:id||crypto.randomUUID(),title:field.title.value,category:field.category.value,weekday:field.weekday.value,startTime:field.startTime.value,endTime:field.endTime.value,travelBeforeMinutes:field.travelBeforeMinutes.value,travelAfterMinutes:field.travelAfterMinutes.value,location:field.location.value,address:field.address.value,recurrence:field.recurrence.value,colorKey:field.colorKey.value,notes:field.notes.value,fixed:field.fixed.checked,active:field.active.checked,createdAt:(state.routineBlocks||[]).find(item=>item.id===id)?.createdAt});
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
  const local=isLocalBackend(),connected=!!state.obsidian.connected;
  f.mode.value=s.mode;
  f.minutes.value=s.minutes;
  f.count.value=s.count;
  f.hideAfterLimit.checked=s.hideAfterLimit;
  if($("environmentStatus")){
    $("environmentStatus").textContent=`Ambiente: ${local?"Arcana Local disponível para yt-dlp":"estático/GitHub Pages"} · dados primários em IndexedDB do navegador.`
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
  if($("obsidianEnvironmentStatus")){$("obsidianEnvironmentStatus").textContent=`Ambiente: ${obsidianEnvironmentLabel()}`;}
  if($("obsidianVaultStatus")){$("obsidianVaultStatus").innerHTML=`<p class="hint">${connected?`Vault: ${esc(state.obsidian.vaultName||"sem nome")} · ${esc(state.obsidian.vaultPath||"")}`:"Nenhum vault conectado."}</p><p class="hint">${connected&&state.obsidian.lastSyncAt?`Último envio: ${new Date(state.obsidian.lastSyncAt).toLocaleString("pt-BR")}`:local?"Conecte um vault para enviar Markdown direto ao Obsidian.":"Use Exportar Vault para Obsidian para baixar um ZIP compatível."}</p>${state.obsidian.syncStatus?`<p class="hint">Status: ${esc(state.obsidian.syncStatus)}</p>`:""}${state.obsidian.error?`<p class="hint">Erro: ${esc(state.obsidian.error)}</p>`:""}`;}
  if($("obsidianStats")){$("obsidianStats").innerHTML=`<div class="profile-grid"><div class="profile-stat"><span>Notas</span><strong>${state.obsidian.noteCount||0}</strong></div><div class="profile-stat"><span>Fichamentos</span><strong>${state.obsidian.fichamentoCount||0}</strong></div><div class="profile-stat"><span>Anexos</span><strong>${state.obsidian.attachmentCount||0}</strong></div><div class="profile-stat"><span>Conflitos</span><strong>${state.obsidian.conflicts||0}</strong></div></div>`;}
  if($("obsidianAutoSync")){$("obsidianAutoSync").checked=state.obsidian.autoSync==="after_session";$("obsidianAutoSync").disabled=!local;}
  if($("obsidianAutoSyncNote")){$("obsidianAutoSyncNote").textContent=`Autosync atual: ${obsidianModeLabel(state.obsidian.autoSync)}. A sincronização reversa Obsidian -> Arcana não faz parte da Phase 1.`;}
  if($("obsidianConnectBtn")){$("obsidianConnectBtn").disabled=!local;}
  if($("obsidianSyncBtn")){$("obsidianSyncBtn").disabled=!local||!connected;}
  if($("obsidianDisconnectBtn")){$("obsidianDisconnectBtn").disabled=!local||!connected;}
  if($("obsidianOpenBtn")){$("obsidianOpenBtn").disabled=!local||!state.obsidian.openUrl;}
  renderPlanningSettings();
  renderExternalCalendarSettings();
  renderSnapshots()
}
async function renderSnapshots(){if(!$("snapshotList")||!window.ArcanaStorage?.ready){return}try{const snaps=await ArcanaStorage.listSnapshots();$("snapshotList").innerHTML=snaps.length?snaps.map(s=>`<option value="${esc(s.id)}">${new Date(s.createdAt).toLocaleString("pt-BR")} · ${esc(s.reason||"auto")}</option>`).join(""):`<option value="">Nenhum snapshot</option>`}catch(e){$("snapshotList").innerHTML=`<option value="">Snapshots indisponíveis</option>`}}
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
  state=normalize(await ArcanaStorage.importFullBackup(file,replace?"replace":"merge"));
  await ArcanaStorage.saveState(state);
  await loadVaultNotes();
  renderAll()
}

async function importPlaylistFile(file){
  const data=JSON.parse(await file.text());
  const p=activePlaylist();
  mergePlaylistData(data,p);
  save();
}

async function initApp(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(e=>console.info("[Arcana] service worker unavailable",e.message||e))
  }
  try{
    if(window.ArcanaStorage){
      state=applyStarterContent(await ArcanaStorage.init({storageKey:STORAGE_KEY,legacyKeys:LEGACY_KEYS,defaultState:DEFAULT_STATE,normalize,migrate}));
      await ArcanaStorage.saveState(state);
      await migrateLocalVaultFromBackend()
    }else{
      state=applyStarterContent(loadState());
      localStorage.setItem(STORAGE_KEY,JSON.stringify(state))
    }
  }catch(e){
    console.warn("[Arcana] IndexedDB unavailable, falling back to localStorage",e);
    state=applyStarterContent(loadState());
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state))
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
if($("routineViewMode")){$("routineViewMode").onchange=e=>{routineViewMode=e.currentTarget.value;renderRoutine()}}
if($("routineForm")){$("routineForm").onsubmit=saveRoutineBlock}
if($("deleteRoutineBtn")){$("deleteRoutineBtn").onclick=deleteRoutineBlock}
if($("duplicateRoutineBtn")){$("duplicateRoutineBtn").onclick=()=>duplicateRoutineBlock($("routineForm").elements.id.value)}
if($("newHobbyBtn")){$("newHobbyBtn").onclick=()=>openHobbyDialog()}
if($("hobbyForm")){$("hobbyForm").onsubmit=saveHobby}
if($("deleteHobbyBtn")){$("deleteHobbyBtn").onclick=deleteHobby}
if($("planningSettingsForm")){$("planningSettingsForm").onsubmit=savePlanningSettings}
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
$("restoreSnapshotBtn").onclick=async()=>{const id=$("snapshotList").value;if(!id)return;try{state=normalize(await ArcanaStorage.restoreSnapshot(id));await loadVaultNotes();renderAll()}catch(e){alert(e.message)}};
if($("syncCalendarBtn")){$("syncCalendarBtn").onclick=()=>syncExternalCalendars({force:true}).then(result=>{if(result?.error){toast(result.error,"error")}else if(!result?.throttled){toast("Agenda externa sincronizada.","ok")}}).catch(err=>alert(err.message||String(err)))}
$("obsidianConnectBtn").onclick=()=>connectObsidianVault().catch(e=>alert(e.message||String(e)));
$("obsidianSyncBtn").onclick=()=>runObsidianSync("push").catch(()=>{});
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
$("saveNotesBtn").onclick=saveNotes;$("promoteDialogNoteBtn").onclick=promoteDialogNote;$("focusNotesText").oninput=queueFocusSave;document.querySelectorAll("[data-focus-block]").forEach(b=>b.onclick=()=>insertFocusBlock(b.dataset.focusBlock));$("timerStartBtn").onclick=startTimer;$("timerPauseBtn").onclick=pauseTimer;$("timerResetBtn").onclick=resetTimer;$("closeFocusBtn").onclick=closeFocus;$("focusDoneBtn").onclick=completeFocus;
if($("exportBtn")){$("exportBtn").onclick=()=>ArcanaStorage.downloadFullBackup(state)}
if($("importInput")){$("importInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await importFullBackupFile(f)}catch(err){alert(err.message||"Backup inválido")}e.target.value=""}}
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());

initApp();
