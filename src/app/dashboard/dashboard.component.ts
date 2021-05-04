import {Component, OnDestroy, OnInit} from '@angular/core';
import {Idashboard, IPort} from '../interface/Idashboard';
import {ConstantService} from '../service/constant.service';
import {DashboardService} from '../service/dashboard.service';
import {GridItem} from '@progress/kendo-angular-grid';
import {EStatus} from '../interface/enum/EStatus';
import {State} from '@progress/kendo-data-query';
import {Router} from '@angular/router';

declare let toastr: any;
declare let $: any;
declare let _: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  responseData: Idashboard[] = [];
  selectedService: Idashboard = <any>undefined;
  EStatus = EStatus;
  isChecked = true;
  loading: boolean = false;
  public state: State = {sort: [{dir: 'desc', field: 'hostName'}]};
  audio = new Audio('../assets/sound/service_down.mp3');
  storageItemName = 'oldDashboard';
  intervalId = <any>undefined;
  login = {u: '', p: '', t: ''};

  constructor(public constantService: ConstantService,
              public dashboardService: DashboardService,
              public router: Router) {
  }

  async ngOnInit() {
    try {
      this.login = JSON.parse(this.constantService.getDecryptedData(localStorage.getItem('token')));
      let isValidUser = this.constantService.isValidUser(this.login);
      if (!isValidUser) return this.logout();
    } catch (e) {
      return this.logout();
    }


    // this.audio.play();
    await this.loadData();
    // await this.compareStatus();
    this.intervalId = setInterval(() => {
      this.loading = true;
      this.loadData();
      this.loading = false;
      toastr.success('Reload Data Successfully!');
    }, 60000);
  }

  get isAdmin() {
    return this.login && this.login.t === 'admin';
  }

  get isUser() {
    return this.login && this.login.t === 'user';
  }

  async loadData() {
    this.responseData = [];
    let res:Idashboard[] = [];
    try {
      res = <any>await this.dashboardService.list();
    } catch (e) {
      this.audio.play();
      console.log(e);
    }
    for (let data of res) {
      if (data.status === EStatus.DOWN || data.status === EStatus.S_DOWN) {
        await this.compareStatus(res);
        // this.audio.play();
      }
    }
    this.responseData = res;
    this.responseData = _.orderBy(this.responseData, ['status'], ['asc'])
  }

  cloneData(item: Idashboard) {
    let tempItem: Idashboard = JSON.parse(JSON.stringify(item));
    delete tempItem._id;
    this.dashboardService.cloneObj = tempItem;
    this.dashboardService.editObj = <any>undefined;
    this.router.navigate(['addhost']);
  }

  editData(item: Idashboard) {
    this.dashboardService.cloneObj = <any>undefined;
    this.dashboardService.editObj = item;
    this.router.navigate(['addhost']);
  }

  async deleteData(item: Idashboard) {
    if (window.confirm(`Do you want to delete : ${item.hostName + ' : ' + item.ipAddress} ?`)) {
      let resp = await this.dashboardService.delete(<any>item._id).toPromise();
      toastr.success('Item deleted successfully : ' + item.hostName);
      await this.loadData();
    }
  }

  public trackBy(index: number, item: GridItem): any {
    return index;
  }

  AddHost() {
    this.dashboardService.cloneObj = <any>undefined;
    this.dashboardService.editObj = <any>undefined;
    this.router.navigate(['addhost']);
  }

  async latestPull(event?: any) {
    // let res = await ConstantService.get_promise(this.dashboardservice.latestPull());
    this.loading = true;
    await this.loadData();
    this.loading = false;
  }

  async compareStatus(res: Idashboard[]) {
    let oldDashboard = localStorage.getItem(this.storageItemName);
    if (oldDashboard) {
      let oldStorageObj: Idashboard[] = JSON.parse(oldDashboard);
      let oldStorageMap = this.getRowsMap(oldStorageObj, '_id');
      let changeFound = false;
      for (let item of res) {
        let oldItem: Idashboard = oldStorageMap[<any>item._id];
        let isAnyChangeFound = oldItem ? this.comparePortsArrAndFindChange(oldItem.port, item.port) : false;
        if (isAnyChangeFound) {
          changeFound = true;
          break;
        }
      }
      if (changeFound) await this.audio.play();
      else console.log('No change found');
      localStorage.setItem(this.storageItemName, JSON.stringify(this.getDashboardToStore(res)));
    } else {
      localStorage.setItem(this.storageItemName, JSON.stringify(this.getDashboardToStore(res)));
    }
  }

  comparePortsArrAndFindChange(oldPorts: IPort[], newPorts: IPort[]) {
    let oldPortsMap = this.getRowsMap(oldPorts, 'port');
    for (let port of newPorts) {
      let oldPort: IPort = oldPortsMap[port.port];
      if (oldPort && oldPort.status !== port.status && (port.status === EStatus.DOWN || port.status === EStatus.S_DOWN)) return true;
    }
    return false;
  }

  getRowsMap(rows: any[], key: string) {
    let obj: any = {};
    for (let row of rows) obj[row[key]] = row;
    return obj;
  }

  getDashboardToStore(rows: Idashboard[]): Idashboard[] {
    let arr: Idashboard[] = [];
    for (let row of rows) {
      arr.push(<any><Partial<Idashboard>>{
        _id: row._id,
        port: row.port,
      });
    }
    return arr;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

}
