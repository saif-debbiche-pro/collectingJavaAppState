export interface Application {
    id:number,
    applicationName: string;
  applicationType: string;
  application_version: string;
  platformVersion: string;
    dependencies: Dependency[];
    ports:Port[];
    blockedDependencies:Dependency[];
    action:Action|null
}


export interface Metrics{
  cpu_usage:string;
  health_status:string;
  memory_usage:string;
  timestamp:string
}




export interface Action{
  actions:string
}


export interface Port {
  id: number;
  protocol: string;
  portNumber: string;
}


export interface Dependency {
    id: number;
    name: string;
    version: string;
    action:string;
}

export interface ApplicationHistory {
  id:number,
  changeReason:string,
  timestamp:number;
  changeType:string;
  applicationName: string;
applicationType: string;
application_version: string;
platformVersion: string;
  dependencies: Dependency[];
}
