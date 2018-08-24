import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// core
import { CoreModule } from "../core/core.module";

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostItemComponent } from './post-item/post-item.component';
import { EditPostComponent } from './edit-post/edit-post.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    CoreModule
  ],
  declarations: [LayoutComponent, HomeComponent, DashboardComponent, PostItemComponent, EditPostComponent]
})
export class LayoutModule { }
