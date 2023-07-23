import {ICore} from './Icore';

export interface Ispeedtest extends ICore {
  speedTest: Itestmetrics[],
  internetCheck: boolean
}

export interface Itestmetrics {
  speedTest: [];
}
