const ArcanaDataSafety=(()=>{
  const DATA_SCHEMA_VERSION=1;
  const STARTER_CONTENT_VERSION=2;
  const STATUSES={NO_DATA:"NO_DATA",LOAD_ERROR:"LOAD_ERROR",MIGRATION_ERROR:"MIGRATION_ERROR",VALID_DATA:"VALID_DATA"};
  const COLLECTIONS=[
    ["tracks",state=>Array.isArray(state.tracks)?state.tracks:[]],
    ["courses",state=>Array.isArray(state.items)?state.items:[]],
    ["sessions",state=>Array.isArray(state.sessions)?state.sessions:[]],
    ["playlists",state=>Array.isArray(state.playlists)?state.playlists:[]],
    ["videos",state=>Array.isArray(state.youtubeQueue)?state.youtubeQueue:[]],
    ["activityLog",state=>Array.isArray(state.activityLog)?state.activityLog:[]],
    ["routineBlocks",state=>Array.isArray(state.routineBlocks)?state.routineBlocks:[]],
    ["hobbies",state=>Array.isArray(state.hobbies)?state.hobbies:[]],
    ["calendarEvents",state=>Array.isArray(state.externalCalendars?.google?.events)?state.externalCalendars.google.events:[]],
    ["obsidianConflicts",state=>Array.isArray(state.obsidian?.conflicts)?state.obsidian.conflicts:[]]
  ];

  function clone(value){
    return typeof structuredClone==="function"?structuredClone(value):JSON.parse(JSON.stringify(value))
  }
  function isObject(value){
    return !!value&&typeof value==="object"&&!Array.isArray(value)
  }
  function dataSafetyError(status,message,cause){
    const error=new Error(message);
    error.arcanaStatus=status;
    if(cause){
      error.cause=cause
    }
    return error
  }
  function schemaVersion(state){
    return Math.max(0,Number(state?.dataSchemaVersion||state?.schemaVersion)||0)
  }
  function itemIds(items){
    return items.map(item=>item?.id).filter(Boolean)
  }
  function collectionCounts(state={},extras={}){
    const counts={};
    for(const [name,itemsFor] of COLLECTIONS){
      counts[name]=itemsFor(state).length
    }
    counts.notes=Math.max(Number(extras.notesCount)||0,Array.isArray(state.notes)?state.notes.length:0);
    counts.fichamentos=Math.max(Number(extras.fichamentosCount)||0,Array.isArray(state.fichamentos)?state.fichamentos.length:0);
    return counts
  }
  function validateStateShape(state){
    if(!isObject(state)){
      throw dataSafetyError(STATUSES.LOAD_ERROR,"Stored Arcana state is not an object.")
    }
    for(const key of ["tracks","items","playlists","youtubeQueue","sessions","activityLog","routineBlocks","hobbies"]){
      if(!Array.isArray(state[key])){
        throw dataSafetyError(STATUSES.MIGRATION_ERROR,`Arcana state is missing array: ${key}.`)
      }
    }
    for(const key of ["obsidian","externalCalendars","dailyPlan","planningPreferences"]){
      if(!isObject(state[key])){
        throw dataSafetyError(STATUSES.MIGRATION_ERROR,`Arcana state is missing object: ${key}.`)
      }
    }
    return true
  }
  function assertNoSuspiciousDataLoss(before={},after={},options={}){
    const beforeCounts=collectionCounts(before,options.beforeExtras||{});
    const afterCounts=collectionCounts(after,options.afterExtras||{});
    for(const [name,itemsFor] of COLLECTIONS){
      const beforeItems=itemsFor(before);
      const afterItems=itemsFor(after);
      if(afterCounts[name]>=beforeCounts[name]){
        continue
      }
      const beforeIds=itemIds(beforeItems);
      const afterIds=new Set(itemIds(afterItems));
      const missing=beforeIds.length?beforeIds.filter(id=>!afterIds.has(id)):[`${name}-without-stable-ids`];
      if(missing.length){
        throw dataSafetyError(STATUSES.MIGRATION_ERROR,`Suspicious ${name} loss during migration: ${beforeCounts[name]} -> ${afterCounts[name]}.`)
      }
    }
    for(const name of ["notes","fichamentos"]){
      if(afterCounts[name]<beforeCounts[name]){
        throw dataSafetyError(STATUSES.MIGRATION_ERROR,`Suspicious ${name} loss during migration: ${beforeCounts[name]} -> ${afterCounts[name]}.`)
      }
    }
    return {before:beforeCounts,after:afterCounts}
  }
  function prepareStateMigration(raw,options={}){
    if(!isObject(raw)){
      throw dataSafetyError(STATUSES.LOAD_ERROR,"Stored Arcana state is empty or unreadable.")
    }
    const original=clone(raw);
    const fromVersion=schemaVersion(original);
    const beforeStarter=Math.max(0,Number(original.starterContentVersion)||0);
    const beforeCurriculum=Math.max(0,Number(original.starterCurriculumVersion)||0);
    let next=clone(original);
    try{
      if(typeof options.normalize==="function"){
        next=options.normalize(next)
      }
      if(options.allowStarter!==false&&typeof options.applyStarterContent==="function"){
        next=options.applyStarterContent(next)
      }
      if(typeof options.normalize==="function"){
        next=options.normalize(next)
      }
      next.dataSchemaVersion=DATA_SCHEMA_VERSION;
      validateStateShape(next);
      const counts=assertNoSuspiciousDataLoss(original,next,options);
      const starterVersion=Math.max(0,Number(next.starterContentVersion)||0);
      const curriculumVersion=Math.max(0,Number(next.starterCurriculumVersion)||0);
      const targetCurriculum=Math.max(0,Number(options.starterCurriculumVersion)||0);
      const migrated=fromVersion<DATA_SCHEMA_VERSION||beforeStarter<STARTER_CONTENT_VERSION||beforeCurriculum<targetCurriculum||starterVersion!==beforeStarter||curriculumVersion!==beforeCurriculum;
      if(migrated){
        next.migrationMeta={...(isObject(next.migrationMeta)?next.migrationMeta:{}),previousSchemaVersion:fromVersion,currentSchemaVersion:DATA_SCHEMA_VERSION,lastMigrationAt:typeof options.now==="function"?options.now():new Date().toISOString(),lastMigrationStatus:"ok"}
      }
      return {status:STATUSES.VALID_DATA,state:next,original,fromVersion,toVersion:DATA_SCHEMA_VERSION,migrated,counts}
    }catch(error){
      if(error.arcanaStatus){
        throw error
      }
      throw dataSafetyError(STATUSES.MIGRATION_ERROR,error.message||"Arcana state migration failed.",error)
    }
  }
  function detectEnvironment(locationLike){
    const loc=locationLike||{};
    const hostname=String(loc.hostname||"");
    const origin=String(loc.origin||"");
    const pathname=String(loc.pathname||"");
    const production=origin==="https://nataliacarvalhinha.github.io"&&pathname.startsWith("/arcana");
    const local=["localhost","127.0.0.1",""].includes(hostname);
    return {production,local,label:production?"Production":local?"Local":"Preview",origin:origin||"local",path:pathname||"/"}
  }
  return {DATA_SCHEMA_VERSION,STARTER_CONTENT_VERSION,STATUSES,collectionCounts,validateStateShape,assertNoSuspiciousDataLoss,prepareStateMigration,detectEnvironment,dataSafetyError}
})();
if(typeof window!=="undefined"){
  window.ArcanaDataSafety=ArcanaDataSafety
}
if(typeof globalThis!=="undefined"){
  globalThis.ArcanaDataSafety=ArcanaDataSafety
}
