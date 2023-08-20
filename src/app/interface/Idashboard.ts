import {ICore} from './Icore';

export interface Idashboard extends ICore {
  hostName: string,
  ipAddress: string,
  sshPort: number,
  userName: string,
  userPass: string,
  privateKey: string,
  port: IPort[],
  hostMetrics: IhostMetrics[],
  linkTo: ILinked[],
  groupName: string,
  clusterName: string,
  envName: string,
  vmName: string,
  status?: string,
  note: string,
  hostCheck: boolean,
  metricsCheck: boolean
}

export interface IPort {
  name: string;
  port: number;
  status: string;
  http: boolean;
  path: string;
  method: string;
  statuscode: number;

}


export interface ILinked {
  hostName: string;
  ipAddress: string;
  port: number;
}


export interface IhostMetrics {
  diskStatus: [diskStatus: []];
  memStatus: [memStatus: []];
  cpuStatus: [cpuStatus: []];
  networkStatus: [networkStatus: []];
  DiskTotal: number;
  DiskUsage: number;
  DiskFree: number;
  MemTotal: number;
  MemUsage: number;
  MemFree: number;
  CpuTotal: number;
  CpuUsage: number;
  CpuFree: number;
  CPU: number;
  uptime: string;
}
