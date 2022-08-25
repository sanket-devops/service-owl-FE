import {ICore} from './Icore';

export interface Idashboard extends ICore {
  hostName: string,
  ipAddress: string,
  port: IPort[],
  linkTo: ILinked[],
  groupName: string,
  clusterName: string,
  envName: string,
  vmName: string,
  status?: string,
  note: string,
  hostCheck: boolean
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
