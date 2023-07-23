import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AddhostFormComponent} from './addhost-form/addhost-form.component';
import {LoginComponent} from './login/login.component';
import {WebsshComponent} from './webssh/webssh.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'addhost', component: AddhostFormComponent},
  {path: 'webssh', component: WebsshComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
