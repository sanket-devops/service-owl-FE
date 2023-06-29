import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GraphComponent} from './graph/graph.component';
import {GuiGridModule} from '@generic-ui/ngx-grid';
import {DashboardService} from './service/dashboard.service';
import {ConstantService} from './service/constant.service';
import {HttpClientModule} from '@angular/common/http';
import {GridModule} from '@progress/kendo-angular-grid';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {AddhostFormComponent} from './addhost-form/addhost-form.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {LoginComponent} from './login/login.component';
import {CheckBoxModule} from '@progress/kendo-angular-treeview';
import {SwitchModule} from '@progress/kendo-angular-inputs';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {TableModule} from 'primeng-lts/table';
import {ToastModule} from 'primeng-lts/toast';
import {CalendarModule} from 'primeng-lts/calendar';
import {SliderModule} from 'primeng-lts/slider';
import {MultiSelectModule} from 'primeng-lts/multiselect';
import {ContextMenuModule} from 'primeng-lts/contextmenu';
import {DialogModule} from 'primeng-lts/dialog';
import {ButtonModule} from 'primeng-lts/button';
import {DropdownModule} from 'primeng-lts/dropdown';
import {ProgressBarModule} from 'primeng-lts/progressbar';
import {InputTextModule} from 'primeng-lts/inputtext';
import {FileUploadModule} from 'primeng-lts/fileupload';
import {ToolbarModule} from 'primeng-lts/toolbar';
import {RatingModule} from 'primeng-lts/rating';
import {RadioButtonModule} from 'primeng-lts/radiobutton';
import {InputNumberModule} from 'primeng-lts/inputnumber';
import {ConfirmDialogModule} from 'primeng-lts/confirmdialog';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';



// import * as http from 'http';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddhostFormComponent,
    LoginComponent,
    GraphComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        GuiGridModule,
        HttpClientModule,
        GridModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSlideToggleModule,
        FormsModule,
        MatInputModule,
        CheckBoxModule,
        SwitchModule,
        MatCheckboxModule,
        TableModule,
        ToastModule,
        CalendarModule,
        SliderModule,
        MultiSelectModule,
        ContextMenuModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        ProgressBarModule,
        InputTextModule,
        FileUploadModule,
        ToolbarModule,
        RatingModule,
        RadioButtonModule,
        InputNumberModule,
        ConfirmDialogModule,
        InputTextareaModule,
    ],
  providers: [ConstantService, DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
