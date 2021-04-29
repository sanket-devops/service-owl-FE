import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Idashboard, IPort} from '../interface/Idashboard';
import {ConstantService} from '../service/constant.service';
import {DashboardService} from '../service/dashboard.service';

@Component({
  selector: 'app-addhost-form',
  templateUrl: './addhost-form.component.html',
  styleUrls: ['./addhost-form.component.scss']
})
export class AddhostFormComponent implements OnInit {
  form: FormGroup;
  data: Idashboard = this.getEmptyTable();

  // linkData: Idashboard = this.getEmptyTable();

  constructor(public router: Router,
              public formbuilder: FormBuilder,
              public dashboardservice: DashboardService) {
    this.form = this.formbuilder.group({
      hostName: [''],
      ipAddress: [''],
      groupName: [''],
      clusterName: [''],
      envName: [''],
      vmName: [''],
      note: [''],
    });
  }

  ngOnInit() {
  }

  getEmptyTable(): Idashboard {
    return <any> <Partial<Idashboard>> {
      port: [<any> {
        name: 'ssh',
        port: 22
      }],
      linkTo: [<any> {
        hostName: '',
        ipAddress: '',
        port: null
      }],
    };
  }

  removePortTableRow(index: any) {
    this.data.port.splice(this.data.port.indexOf(index), 1);
  }

  AddPortTableRow() {
    console.log('sds');
    this.data.port.push(<any> {});

  }

  AddLinktoTableRow() {
    this.data.linkTo.push(<any> {});

  }

  RemoveLinktoTableRow(index: any) {
    this.data.linkTo.splice(this.data.linkTo.indexOf(index), 1);

  }

  back() {
    this.router.navigate(['dashboard']);
  }

  async saveData() {
    // console.log(this.data.port);
    // console.log(this.data.linkTo);
    // console.log(this.form.value);
    if (this.form.invalid) {
      // this.utils.show_message('Please fill all required fields');
      return;
    }
    let formValue: Idashboard = this.form.value;
    formValue.port = <any> this.data.port;
    formValue.linkTo = <any> this.data.linkTo;
    console.log(formValue);
    try {
      // Update Stock In location
      if (formValue._id) {
        // formValue._id = this.id;
        let response = await ConstantService.get_promise(this.dashboardservice.update(formValue));
        // this.utils.show_message('Stock updated.');
      } else {
        // save Stock In location
        let response: Idashboard = await ConstantService.get_promise(this.dashboardservice.save(formValue));
        // this.form.patchValue(this.setEmptyData());
        // this.utils.show_message('Stock saved.');
        this.form.reset();
      }
    } catch (e) {
      console.log(e);
    }
  }

}
