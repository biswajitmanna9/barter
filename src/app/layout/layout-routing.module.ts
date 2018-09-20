import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostItemComponent } from './post-item/post-item.component';
import { EditPostComponent } from './edit-post/edit-post.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '/', redirectTo: '/home',pathMatch: 'full'},
      { path: '', redirectTo: '/home',pathMatch: 'full'},
      { path: '_', redirectTo: '/home',pathMatch: 'full'},
      { path: 'home', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'post-item', component: PostItemComponent },
      { path: 'post-item/:id', component: EditPostComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
