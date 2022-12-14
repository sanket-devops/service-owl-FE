import { Component, OnDestroy, OnInit } from '@angular/core';
import { Idashboard, IhostMetrics, IPort } from '../interface/Idashboard';
import { ConstantService } from '../service/constant.service';
import { DashboardService } from '../service/dashboard.service';
import { GridItem } from '@progress/kendo-angular-grid';
import { EStatus } from '../interface/enum/EStatus';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { ngModuleJitUrl } from '@angular/compiler';

declare let toastr: any;
declare let $: any;
declare let _: any;
declare let google: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  responseData: Idashboard[] = [];
  selectedService: Idashboard = <any>undefined;
  selectedHostMetrics: IhostMetrics = <any>undefined;
  hostId: any = undefined
  EStatus = EStatus;
  isChecked = true;
  loading: boolean = false;
  public state: State = { sort: [{ dir: 'desc', field: 'hostName' }] };
  audio = new Audio('../assets/sound/service_down.mp3');
  storageItemName = 'oldDashboard';
  intervalId = <any>undefined;
  reloadInterval = <any>undefined;
  intervalTime: number = 60;
  timer: number = this.intervalTime;
  login = { u: '', p: '', t: '' };

  constructor(
    public constantService: ConstantService,
    public dashboardService: DashboardService,
    public router: Router
  ) { }

  async ngOnInit() {
    try {
      this.login = JSON.parse(
        this.constantService.getDecryptedData(localStorage.getItem('token'))
      );
      let isValidUser = this.constantService.isValidUser(this.login);
      if (!isValidUser) return this.logout();
    } catch (e) {
      return this.logout();
    }

    // this.audio.play();
    await this.loadData();
    // await this.compareStatus();
    this.intervalId = setInterval(() => {
      if (this.isChecked) {
        this.timer--;
        $('.timer').text(this.timer);
        if (this.timer === 0) {
          this.loading = true;
          this.loadData();
          this.loading = false;
          toastr.success('Reload Data Successfully!');
          this.timer = this.intervalTime;
        }
      } else {
        toastr.warning('Auto Reload Data Off!');
      }
    }, 1000);
  }

  get isAdmin() {
    return this.login && this.login.t === 'admin';
  }

  get isUser() {
    return this.login && this.login.t === 'user';
  }

  async loadData() {
    this.responseData = [];
    let res: Idashboard[] = [];
    try {
      res = <any>await this.dashboardService.list();
    } catch (e) {
      <any>await this.audio.play();
      console.log(e);
    }
    for (let data of res) {
      if (data.status === EStatus.DOWN || data.status === EStatus.S_DOWN) {
        await this.compareStatus(res);
        // this.audio.play();
      }
    }
    this.responseData = res;
    this.responseData = _.orderBy(this.responseData, ['status'], ['asc']);
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
    if (
      window.confirm(
        `Do you want to delete : ${item.hostName + ' : ' + item.ipAddress} ?`
      )
    ) {
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

  async autoReload(event?: any) {
    this.isChecked != this.isChecked
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
        let isAnyChangeFound = oldItem
          ? this.comparePortsArrAndFindChange(oldItem.port, item.port)
          : false;
        if (isAnyChangeFound) {
          changeFound = true;
          break;
        }
      }
      if (changeFound) await this.audio.play();
      else console.log('No change found');
      localStorage.setItem(
        this.storageItemName,
        JSON.stringify(this.getDashboardToStore(res))
      );
    } else {
      localStorage.setItem(
        this.storageItemName,
        JSON.stringify(this.getDashboardToStore(res))
      );
    }
  }

  comparePortsArrAndFindChange(oldPorts: IPort[], newPorts: IPort[]) {
    let oldPortsMap = this.getRowsMap(oldPorts, 'port');
    for (let port of newPorts) {
      let oldPort: IPort = oldPortsMap[port.port];
      if (
        oldPort &&
        oldPort.status !== port.status &&
        (port.status === EStatus.DOWN || port.status === EStatus.S_DOWN)
      )
        return true;
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
      arr.push(<any>(<Partial<Idashboard>>{
        _id: row._id,
        port: row.port,
      }));
    }
    return arr;
  }

  async switchChange(newValue: boolean, dashboard: Idashboard) {
    await ConstantService.get_promise(
      this.dashboardService.update({
        _id: <any>dashboard._id,
        hostCheck: newValue,
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  async drawChart(_id: any) {
    this.loading = true;
    this.hostId = _id;
    // console.log(this.hostId)
    this.selectedHostMetrics = <any>undefined;
    setTimeout(
      async () => {
        // console.log(this.hostId);
        try {
          let res: any = undefined;
          res = <any>await this.dashboardService.hostMetricsData(this.hostId);
          // console.log(res)
          this.selectedHostMetrics = res;
          let diskStatus: any = google.visualization.arrayToDataTable(res.diskStatus);
          let memStatus: any = google.visualization.arrayToDataTable(res.memStatus);
          let cpuStatus: any = google.visualization.arrayToDataTable(res.cpuStatus);

          let diskStatusOptions = {
            title: `Disk Status => [ Total: ${res.DiskTotal}G, Use: ${res.DiskUsage}G, Free: ${res.DiskFree}G ]`,
            hAxis: { title: 'Timestemp' },
            vAxis: { title: 'Disk in GB', minValue: 0 },
            curveType: 'function',
            pointSize: 10,
            colors: ['blue', 'red', 'green'],
            // legend: { position: 'bottom' }
          };

          let memStatusOptions = {
            title: `Memory Status => [ Total: ${res.MemTotal}G, Use: ${res.MemUsage}G, Free: ${res.MemFree}G ]`,
            hAxis: { title: 'Timestemp' },
            vAxis: { title: 'Memory in GB', minValue: 0 },
            curveType: 'function',
            pointSize: 10,
            colors: ['blue', 'red', 'green'],
            // legend: { position: 'bottom' }
          };

          let cpuStatusOptions = {
            title: `CPU Status => [ Total: ${res.CpuTotal}%, Use: ${res.CpuUsage}%, Free: ${res.CpuFree}% ]`,
            hAxis: { title: 'Timestemp' },
            vAxis: { title: 'CPU Usage in %', minValue: 0 },
            curveType: 'function',
            pointSize: 10,
            colors: ['blue', 'red', 'green'],
            // legend: { position: 'bottom' }
          };
          let CPU: any = document.getElementById("CPU");
          let uptime: any = document.getElementById("uptime");
          CPU.innerHTML = `CPU Core: ${this.selectedHostMetrics.CPU} Core`;
          uptime.innerHTML = `Host Up Time: ${this.selectedHostMetrics.uptime}`;

          let diskStatusChart = await new google.visualization.LineChart(document.getElementById('diskStatus'));
          let memStatusChart = await new google.visualization.LineChart(document.getElementById('memStatus'));
          let cpuStatusChart = await new google.visualization.LineChart(document.getElementById('cpuStatus'));

          await diskStatusChart.draw(diskStatus, diskStatusOptions);
          await memStatusChart.draw(memStatus, memStatusOptions);
          await cpuStatusChart.draw(cpuStatus, cpuStatusOptions);
        } catch (e) {
          console.log(e);
        }
      }, 3000);
    this.loading = false;
  }
}
