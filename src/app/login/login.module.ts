import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// core
import { CoreModule } from "../core/core.module";

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    CoreModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
