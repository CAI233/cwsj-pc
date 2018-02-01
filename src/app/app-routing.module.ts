import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// 引入要用的组件
import { HomePage } from "./home/home";
import { LoginPage } from "./login/login";
import { ResourcePage } from './resource/resource';

const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'home', component: HomePage, data: { title: '首页', module: 'home', power: "SHOW" } },
  { path: 'login', component: LoginPage, data: { title: '登录', module: 'login', power: "SHOW" } },
  { path: 'resource', component: ResourcePage, data: { title: '资源管理', module: 'resource', power: "SHOW" } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
