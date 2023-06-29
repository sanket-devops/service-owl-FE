import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Idashboard, IPort } from '../interface/Idashboard';
import { ConstantService } from '../service/constant.service';
import { DashboardService } from '../service/dashboard.service';

declare let toastr: any;

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  back() {
    this.router.navigate(['dashboard']);
  }
}
