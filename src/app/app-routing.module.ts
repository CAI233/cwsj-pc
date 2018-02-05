import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// 引入要用的组件
import { HomePage } from "./home/home";
import { ErrorPage404 } from './404/404';
import { LoginPage } from "./login/login";
import { ResourcePage } from './resource/resource';
import { UsersPage } from './users/users';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '404', component: ErrorPage404, data: { title: '404', module: '404', power: "SHOW" } },
  { path: 'home', component: HomePage, data: { title: '首页', module: 'home', power: "SHOW" } },
  { path: 'login', component: LoginPage, data: { title: '登录', module: 'login', power: "SHOW" } },
  { path: 'resource', component: ResourcePage, data: { title: '资源管理', module: 'resource', power: "SHOW" } },
  { path: 'user', component: UsersPage, data: { title: '用户管理', module: 'user', power: "SHOW" } },

  //路由添加请在 ** 申明之前
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
