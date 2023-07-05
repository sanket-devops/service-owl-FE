import { Component, OnDestroy, OnInit } from '@angular/core';
import { Idashboard, IhostMetrics, IPort } from '../interface/Idashboard';
import { ConstantService } from '../service/constant.service';
import { DashboardService } from '../service/dashboard.service';
import { GridItem } from '@progress/kendo-angular-grid';
import { EStatus } from '../interface/enum/EStatus';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
// import { ngModuleJitUrl } from '@angular/compiler';
// import { Terminal } from 'xterm';
// import { WebLinksAddon } from 'xterm-addon-web-links';
// import { io, Socket } from "socket.io-client";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ispeedtest } from '../interface/Ispeedtest';

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
  selectedHosts: Idashboard[] = <any>undefined;
  clusterCount: number = 1;
  selectedService: Idashboard = <any>undefined;
  selectedHostMetrics: IhostMetrics = <any>undefined;
  hostId: any = undefined;
  EStatus = EStatus;
  isChecked: boolean = true;
  intChecked: boolean = true;
  selectedObj: Ispeedtest = <any>undefined;
  loading: boolean = false;
  internetLoading: boolean = false;
  internetChartLoading: boolean = false;
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
    public router: Router,
    private http: HttpClient
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
    await this.internetChart();
    // await this.compareStatus();
    this.intervalId = setInterval(() => {
      if (this.isChecked) {
        this.timer--;
        $('.timer').text(this.timer);
        if (this.timer === 0) {
          this.loading = true;
          this.loadData();
          this.internetChart();
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
    this.loading = true;
    this.responseData = [];
    let res: Idashboard[] = [];
    try {
      res = <any>await this.dashboardService.list();
      // console.log(res)
    } catch (e) {
      setTimeout(async () => {
        <any>await this.audio.play();
        console.log(e);
      }, 1000);
    }
    for (let data of res) {
      if (data.status === EStatus.DOWN || data.status === EStatus.S_DOWN) {
        await this.compareStatus(res);
        // this.audio.play();
      }
    }
    this.responseData = res;
    this.responseData = _.orderBy(this.responseData, ['status'], ['asc']);

    let resInternetData: any = undefined;
    resInternetData = <any>await this.dashboardService.internetMetrics();
    this.selectedObj = resInternetData;
    this.intChecked = resInternetData.internetCheck;

    this.loading = false;
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
    this.isChecked != this.isChecked;
  }

  async internetCheck(event?: any) {
    this.intChecked != this.intChecked;
    let id = this.selectedObj._id;
    let x: any = document.getElementById('internetStatusId');
    if (this.intChecked) {
      x.style.display = 'block';
      this.internetChart();
    } else {
      x.style.display = 'none';
    }
    let req = await (<any>(
      this.dashboardService.internetCheck(id, this.intChecked)
    ));
  }

  async latestPull(event?: any) {
    // let res = await ConstantService.get_promise(this.dashboardservice.latestPull());
    this.loading = true;
    await this.loadData();
    await this.internetChart();
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
      if (changeFound) {
        setTimeout(async () => {
          await this.audio.play();
        }, 1000);
      } else console.log('No change found');
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

  async switchChange(newValue: any, host: Idashboard) {
    await ConstantService.get_promise(
      this.dashboardService.update({
        _id: <any>host._id,
        hostCheck: newValue,
      })
    );
  }
  async metricsCheckSwitch(newValue: any, host: Idashboard) {
    await ConstantService.get_promise(
      this.dashboardService.update({
        _id: <any>host._id,
        metricsCheck: newValue,
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

  // Open new window and drow chart
  async drawChart(_id: any, dataH?: any) {
    this.selectedHostMetrics = <any>undefined;
    let diskStatusChart: any = undefined;
    let memStatusChart: any = undefined;
    let cpuStatusChart: any = undefined;

    let hostId = _id;
    let dataTime: number = -Math.abs(dataH * 12);
    // console.log(dataTime);
    let intervalTimeVar: any = <any>undefined;
    let intervalTimeValue: number = 60;
    let isChecked = true;
    let hostMetricsTimer: number = intervalTimeValue;

    let winHtml = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>${this.selectedService.hostName} / ${this.selectedService.ipAddress}</title>
            <!-- CSS only -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
            <!-- JavaScript Bundle with Popper -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
        </head>
        <body>
          <div id="autoReloadConter" style="font-size: large; font-weight: bold; text-align: center; color: red;"></div>
          <div id="dataTimeId" style="font-size: large; font-weight: bold; text-align: center; color: red;"></div>
          <div>
            <div id="bSpinner" class="spinner-border" role="status">
              <span class="sr-only"></span>
            </div>
            <div id="CPU" style="font-size: large; font-weight: bold;"></div>
            <div id="uptime" style="font-size: large; font-weight: bold;"></div>
          </div>
          <div style="text-align: center">
            <div id="diskStatus" style="width:2500px; height:800px;">
              <div id="bSpinner" class="spinner-border" role="status">
                <span class="sr-only"></span>
              </div>
            </div>
            <div id="memStatus" style="width:2500px; height:800px;">
              <div id="bSpinner" class="spinner-border" role="status">
                <span class="sr-only"></span>
              </div>
            </div>
            <div id="cpuStatus" style="width:2500px; height:800px;">
              <div id="bSpinner" class="spinner-border" role="status">
                <span class="sr-only"></span>
              </div>
            </div>
          </div>
        </body>
    </html>`;

    let winUrl = URL.createObjectURL(
      new Blob([winHtml], { type: 'text/html' })
    );
    let chartWindow: any = window.open(
      winUrl,
      `${this.selectedService.hostName} / ${this.selectedService.ipAddress}`,
      `toolbar=yes,scrollbars=yes,resizable=yes,top=1000,left=1000,width=2500,height=2000`
    );
    // intervalTimeVar = setInterval(() => {
    //   if (isChecked) {
    //     hostMetricsTimer--;
    //     setTimeout(() => {
    //       let autoReloadConter: any = chartWindow.document.getElementById("autoReloadConter");
    //       autoReloadConter.innerHTML = `Auto Reload: ${hostMetricsTimer}s`;
    //     }, 500);
    //     $('.hostMetricsTimer').text(hostMetricsTimer);
    //     if (hostMetricsTimer === 0) {
    //       this.loading = true;
    //       reloadChart();
    //       this.loading = false;
    //       toastr.success('Reload Data Successfully!');
    //       hostMetricsTimer = intervalTimeValue;
    //     }
    //   } else {
    //     // toastr.warning('Auto Reload Data Off!');
    //   }
    // }, 1000);

    let reloadChart = async () => {
      setTimeout(async () => {
        try {
          let res: any = undefined;
          res = <any>await this.dashboardService.hostMetricsData(hostId);
          // console.log(res);
          this.selectedHostMetrics = await res;
          if (res.diskStatus) {
            let diskStatus: any = undefined;
            let memStatus: any = undefined;
            let cpuStatus: any = undefined;

            if (dataH) {
              let disk = await res.diskStatus.slice(dataTime);
              disk.unshift([
                'Timestamp',
                'Disk Total',
                'Disk Usage',
                'Disk Free',
              ]);
              diskStatus = google.visualization.arrayToDataTable(await disk);

              let ram = await res.memStatus.slice(dataTime);
              ram.unshift([
                'Timestamp',
                'Mem Total',
                'Mem Usage',
                'Mem Available',
              ]);
              memStatus = google.visualization.arrayToDataTable(await ram);

              let cpu = await res.cpuStatus.slice(dataTime);
              cpu.unshift(['Timestamp', 'CPU Total', 'CPU Usage', 'CPU Free']);
              cpuStatus = google.visualization.arrayToDataTable(await cpu);
            } else {
              let disk = await res.diskStatus;
              disk.unshift([
                'Timestamp',
                'Disk Total',
                'Disk Usage',
                'Disk Free',
              ]);
              diskStatus = google.visualization.arrayToDataTable(await disk);

              let ram = await res.memStatus;
              ram.unshift([
                'Timestamp',
                'Mem Total',
                'Mem Usage',
                'Mem Available',
              ]);
              memStatus = google.visualization.arrayToDataTable(await ram);

              let cpu = await res.cpuStatus;
              cpu.unshift(['Timestamp', 'CPU Total', 'CPU Usage', 'CPU Free']);
              cpuStatus = google.visualization.arrayToDataTable(await cpu);
            }

            let diskStatusOptions = {
              title: `Disk Status => [ Total: ${res.DiskTotal}G, Use: ${res.DiskUsage}G, Free: ${res.DiskFree}G ]`,
              hAxis: { title: 'Timestemp' },
              vAxis: { title: 'Disk in GB', minValue: 0 },
              curveType: 'function',
              pointSize: 3,
              colors: ['blue', 'red', 'green'],
              // legend: { position: 'bottom' }
            };

            let memStatusOptions = {
              title: `Memory Status => [ Total: ${res.MemTotal}G, Use: ${res.MemUsage}G, Free: ${res.MemFree}G ]`,
              hAxis: { title: 'Timestemp' },
              vAxis: { title: 'Memory in GB', minValue: 0 },
              curveType: 'function',
              pointSize: 3,
              colors: ['blue', 'red', 'green'],
              // legend: { position: 'bottom' }
            };

            let cpuStatusOptions = {
              title: `CPU Status => [ Total: ${res.CpuTotal}%, Use: ${res.CpuUsage}%, Free: ${res.CpuFree}% ]`,
              hAxis: { title: 'Timestemp' },
              vAxis: { title: 'CPU Usage in %', minValue: 0 },
              curveType: 'function',
              pointSize: 3,
              colors: ['blue', 'red', 'green'],
              // legend: { position: 'bottom' }
            };

            setTimeout(() => {
              let dataTimeId: any =
                chartWindow.document.getElementById('dataTimeId');
              if (dataH) {
                dataTimeId.innerHTML = `Metrics Time: Last ${dataH}H`;
              } else {
                dataTimeId.innerHTML = `Metrics: All Data`;
              }
            }, 1000);

            setTimeout(() => {
              let CPU: any = chartWindow.document.getElementById('CPU');
              CPU.innerHTML = `CPU Core: ${this.selectedHostMetrics.CPU} Core`;
            }, 1000);

            setTimeout(() => {
              let uptime: any = chartWindow.document.getElementById('uptime');
              uptime.innerHTML = `Host Up Time: ${this.selectedHostMetrics.uptime}`;
            }, 1000);

            diskStatusChart = await new google.visualization.AreaChart(
              chartWindow.document.getElementById('diskStatus')
            );
            memStatusChart = await new google.visualization.AreaChart(
              chartWindow.document.getElementById('memStatus')
            );
            cpuStatusChart = await new google.visualization.AreaChart(
              chartWindow.document.getElementById('cpuStatus')
            );

            await diskStatusChart.draw(await diskStatus, diskStatusOptions);
            await memStatusChart.draw(await memStatus, memStatusOptions);
            await cpuStatusChart.draw(await cpuStatus, cpuStatusOptions);
          }
        } catch (e) {
          console.log(e);
        }
        let bSpinner: any = chartWindow.document.getElementById('bSpinner');
        bSpinner.style.display = 'none';
      }, 3000);
    };
    await reloadChart();
  }

  async internetChart() {
    let internetStatusChart = undefined;
    let speedChart = async () => {
      setTimeout(async () => {
        try {
          let res: any = undefined;
          // res = <any>await this.dashboardService.internetMetrics();
          res = <any>await this.dashboardService.internetMetricsPullData(12); // Get 1H Internet Data Last 12 Record.
          let internetStatus: any = undefined;
          let internetTest = await res;
          internetTest.unshift(['Timestamp', 'Ping', 'Download', 'Upload']);
          let latestMetrics = internetTest[internetTest.length - 1];
          let Timestamp = latestMetrics[0];
          let Ping = latestMetrics[1];
          let Download = latestMetrics[2];
          let Upload = latestMetrics[3];
          internetStatus = google.visualization.arrayToDataTable(
            await internetTest
          );

          let internetStatusOptions = {
            title: `Internet Status => [ Timestamp: ${Timestamp}, Ping: ${Ping}/ms, Download: ${Download}/Mbps, Upload: ${Upload}/Mbps]`,
            // title: `Disk Status => [ Total: Test ]`,
            hAxis: { title: 'Timestemp' },
            vAxis: { title: 'Speed in Mbps', minValue: 0 },
            curveType: 'function',
            pointSize: 3,
            colors: ['blue', 'red', 'green'],
            chartArea: { left: '10%', top: '8%', width: '75%' },
            // legend: { position: 'bottom' }
          };
          internetStatusChart = await new google.visualization.AreaChart(
            document.getElementById('internetStatus')
          );
          await internetStatusChart.draw(
            await internetStatus,
            internetStatusOptions
          );
        } catch (e) {
          // console.log(e);
        }
      }, 1000);
    };
    this.internetLoading = true;
    await speedChart();
    this.internetLoading = false;
  }

  async internetChartGet(PullData: number) {
    let internetStatusChart = undefined;
    try {
      let res: any = undefined;
      // res = <any>await this.dashboardService.internetMetrics();
      res = <any>await this.dashboardService.internetMetricsPullData(PullData);
      // console.log(res);
      let internetStatus: any = undefined;
      let internetTest = await res;
      internetTest.unshift(['Timestamp', 'Ping', 'Download', 'Upload']);
      // console.log(internetTest)
      let latestMetrics = internetTest[internetTest.length - 1];
      let Timestamp = latestMetrics[0];
      let Ping = latestMetrics[1];
      let Download = latestMetrics[2];
      let Upload = latestMetrics[3];
      internetStatus = google.visualization.arrayToDataTable(
        await internetTest
      );

      let internetStatusOptions = {
        title: `Internet Status => [ Timestamp: ${Timestamp}, Ping: ${Ping}/ms, Download: ${Download}/Mbps, Upload: ${Upload}/Mbps]`,
        // title: `Disk Status => [ Total: Test ]`,
        hAxis: { title: 'Timestemp' },
        vAxis: { title: 'Speed in Mbps', minValue: 0 },
        curveType: 'function',
        pointSize: 3,
        colors: ['blue', 'red', 'green'],
        chartArea: { left: '10%', top: '8%', width: '75%' },
        // legend: { position: 'bottom' }
      };
      internetStatusChart = await new google.visualization.AreaChart(
        document.getElementById('internetStatus')
      );
      await internetStatusChart.draw(
        await internetStatus,
        internetStatusOptions
      );
    } catch (e) {
      console.log(e);
    }
    this.internetLoading = true;
    this.internetLoading = false;
  }

  showInternetStatus() {
    let x: any = document.getElementById('internetStatusId');
    if (x.style.display === 'none') {
      x.style.display = 'block';
      this.internetChart();
    } else {
      x.style.display = 'none';
    }
  }

  // Multiple row selection logic
  async rowChecked(data: any, event?: any) {
    let rowId: any = document.getElementById(data._id);
    // console.log(rowId.style.backgroundColor)
    if (rowId.style.backgroundColor && rowId.style.backgroundColor === 'gray') {
      rowId.style.backgroundColor = 'white';
    } else {
      rowId.style.backgroundColor = 'gray';
    }
  }
  async restartHost(data: Idashboard, playBookName: any) {
    if (
      window.confirm(
        `Do you want to Reboot Host : ${data.hostName + ' : ' + data.ipAddress} ?`
      )
    ) {
      if (
        window.confirm(
          `Again do you want to Reboot Host : ${data.hostName + ' : ' + data.ipAddress} ?`
        )
      ) {
        try {
          let res: any = undefined;
          res = <any>await this.dashboardService.runAnsiblePlaybook(data, playBookName);
          if (res.code === 0) {
            toastr.warning(`${data.hostName} => ${data.ipAddress} is Restarted...`);
          }
          else {
            toastr.error(`${data.hostName} => ${data.ipAddress} Restart Failed...`);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  async shutdownHost(data: Idashboard, playBookName: any) {
    if (
      window.confirm(
        `Do you want to Shutdown Host : ${data.hostName + ' : ' + data.ipAddress} ?`
      )
    ) {
      if (
        window.confirm(
          `Again do you want to Shutdown Host : ${data.hostName + ' : ' + data.ipAddress} ?`
        )
      ) {
        try {
          let res: any = undefined;
          res = <any>await this.dashboardService.runAnsiblePlaybook(data, playBookName);
          if (res.code === 0) {
            toastr.warning(`${data.hostName} => ${data.ipAddress} is Shutdown...`);
          }
          else {
            toastr.error(`${data.hostName} => ${data.ipAddress} Shutdown Failed...`);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  // Host ssh access function
  async openTerminal(hostData: any) {
    let host = hostData.ipAddress;
    let username = hostData.userName;
    let password = hostData.userPass;
    let passwordE = btoa(hostData.userPass);
    // console.log(hostData)
    if (username) {
      let websshURL = `${this.constantService.WEB_SSH_ENDPOINT}/?hostname=${host}&username=${username}&password=${passwordE}`;
      window.open(websshURL, '_blank');
      // window.open(
      //   websshURL,
      //   `${hostData.hostName} / ${hostData.ipAddress}`,
      //   `toolbar=yes,scrollbars=yes,titlebar=yes,resizable=yes,top=1000,left=1000,width=1080,height=720`
      // );
    }
  }
}
