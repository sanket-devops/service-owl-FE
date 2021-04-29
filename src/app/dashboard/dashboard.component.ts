import {Component, OnInit} from '@angular/core';
import {Idashboard, IPort} from '../interface/Idashboard';
import {ConstantService} from '../service/constant.service';
import {DashboardService} from '../service/dashboard.service';
import {GridItem} from '@progress/kendo-angular-grid';
import {EStatus} from '../interface/enum/EStatus';
import {State} from '@progress/kendo-data-query';
import {Router} from '@angular/router';

declare let toastr: any;

declare let $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  responseData: Idashboard[] = [];
  serviceData: any[] = [];
  linkedData: any[] = [];
  EStatus = EStatus;
  isChecked = true;
  loading: boolean = false;
  public state: State = {sort: [{dir: 'desc', field: 'hostName'}]};
  audio = new Audio('../assets/sound/service_down.mp3');
  storageItemName = 'oldDashboard';

  constructor(public constantservice: ConstantService,
              public dashboardservice: DashboardService,
              public router: Router) {
  }

  async ngOnInit() {
    // this.audio.play();
    await this.loadData();
    // await this.compareStatus();
    setInterval(() => {
      this.loading = true;
      this.loadData();
      this.loading = false;
      toastr.success('Reload Data Successfully!');
    }, 60000);
  }

  async loadData() {
    let res: Idashboard[] = await ConstantService.get_promise(this.dashboardservice.list());
    for (let data of res) {
      if (data.status === EStatus.DOWN || data.status === EStatus.S_DOWN) {
        console.log('DOWN');
        await this.compareStatus();
        // this.audio.play();
      }
    }
    this.responseData = res;
    // console.log(this.responseData);
  }

  modelOpen(value: any) {
    this.serviceData = value;
  }

  linkModel(value: any) {
    this.linkedData = value;
  }

  public trackBy(index: number, item: GridItem): any {
    return index;
  }

  AddHost() {
    this.router.navigate(['addhost']);
  }

  async latestPull(event?: any) {
    // let res = await ConstantService.get_promise(this.dashboardservice.latestPull());
    this.loading = true;
    await this.loadData();
    this.loading = false;
  }

  async compareStatus() {
    let res: Idashboard[] = await ConstantService.get_promise(this.dashboardservice.list());
    let oldDashboard = localStorage.getItem(this.storageItemName);
    if (oldDashboard) {
      let oldStorageObj: Idashboard[] = JSON.parse(oldDashboard);
      let oldStorageMap = this.getRowsMap(oldStorageObj, '_id');
      let changeFound = false;
      for (let item of res) {
        let oldItem: Idashboard = oldStorageMap[item._id];
        let isAnyChangeFound = oldItem ? this.comparePortsArrAndFindChange(oldItem.port, item.port) : false;
        if (isAnyChangeFound) {
          changeFound = true;
          console.log('Change found in ', item.hostName);
          break;
        }
      }
      if (changeFound) await this.audio.play();
      else console.log('No change found');
      localStorage.setItem(this.storageItemName, JSON.stringify(this.getDashboardToStore(res)));
    } else {
      localStorage.setItem(this.storageItemName, JSON.stringify(this.getDashboardToStore(res)));
    }
    console.log(res);
  }

  comparePortsArrAndFindChange(oldPorts: IPort[], newPorts: IPort[]) {
    let oldPortsMap = this.getRowsMap(oldPorts, 'port');
    for (let port of newPorts) {
      let oldPort: IPort = oldPortsMap[port.port];
      if (oldPort) {
        if (oldPort.status !== port.status && (port.status === EStatus.DOWN || port.status === EStatus.S_DOWN)) {
          console.log('Port status changed : ', oldPort.status);
          return true;
        }
      }
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

}
