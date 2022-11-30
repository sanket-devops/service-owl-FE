import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Idashboard, IPort} from '../interface/Idashboard';
import {ConstantService} from '../service/constant.service';
import {DashboardService} from '../service/dashboard.service';

declare let toastr: any;

@Component({
  selector: 'app-addhost-form',
  templateUrl: './addhost-form.component.html',
  styleUrls: ['./addhost-form.component.scss']
})
export class AddhostFormComponent implements OnInit {
  form: FormGroup;
  data: Idashboard = this.getEmptyTable();

  constructor(public router: Router,
              public formbuilder: FormBuilder,
              public dashboardservice: DashboardService) {
    this.form = this.formbuilder.group({
      _id: [''],
      hostName: [''],
      ipAddress: [''],
      userName: [''],
      userPass: [''],
      groupName: [''],
      clusterName: [''],
      envName: [''],
      vmName: [''],
      note: [''],
      hostCheck: [''],
    });

    if (this.dashboardservice.editObj || this.dashboardservice.cloneObj) {
      let fillObj = this.dashboardservice.editObj || this.dashboardservice.cloneObj;
      this.form.patchValue(fillObj);
      this.data.port = fillObj.port;
      this.data.linkTo = fillObj.linkTo;
    }
  }

  ngOnInit() {
  }

  getEmptyTable(): Idashboard {
    return <any><Partial<Idashboard>>{
      port: [<any>{
        name: 'ssh',
        port: 22,
        http: false,
        path: '/',
        method: 'GET',
        statuscode: 200
      }],
      linkTo: [<any>{
        hostName: '',
        ipAddress: '',
        port: null
      }],
    };
  }

  removePortTableRow(index: any) {
    this.data.port.splice(index, 1);
  }

  AddPortTableRow() {
    this.data.port.push(<any>{});
  }

  AddLinktoTableRow() {
    this.data.linkTo.push(<any>{});
  }

  RemoveLinktoTableRow(index: any) {
    this.data.linkTo.splice(index, 1);
  }

  back() {
    this.router.navigate(['dashboard']);
  }

  async saveData() {
    if (this.form.invalid) return;
    let formValue: Idashboard = this.form.value;
    formValue.port = <any>this.data.port;
    formValue.linkTo = <any>this.data.linkTo;
    try {
      if (formValue._id) {
        let response = await ConstantService.get_promise(this.dashboardservice.update(formValue));
        toastr.success('Data updated.');
      } else {
        delete formValue._id;
        let response: Idashboard = await ConstantService.get_promise(this.dashboardservice.save(formValue));
        toastr.success('Data saved.');
        this.form.reset();
      }
      this.back();
    } catch (e) {
      console.log(e);
    }
  }

}
