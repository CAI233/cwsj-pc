import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// 引入要用的组件
import { HomePage } from "./home/home";
import { ErrorPage404 } from './404/404';
import { LoginPage } from "./login/login";
import { ResourcePage } from './resource/resource';
import { UsersPage } from './users/users';
import { RolePage } from './role/role';
import { OrgPage } from './org/org';
import { OutfitPage } from './outfit/outfit';
import { MessagePage } from './message/message';
import { AuthorityPage } from './authority/authority';
import { PayPage } from './pay/pay';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '404', component: ErrorPage404, data: { title: '404', module: '404', power: "SHOW" } },
  { path: 'home', component: HomePage, data: { title: '首页', module: 'home', power: "SHOW" } },
  { path: 'login', component: LoginPage, data: { title: '登录', module: 'login', power: "SHOW" } },
  { path: 'resource', component: ResourcePage, data: { title: '资源管理', module: 'resource', power: "SHOW" } },
  { path: 'user', component: UsersPage, data: { title: '用户管理', module: 'user', power: "SHOW" } },
  { path: 'role', component: RolePage, data: { title: '角色管理', module: 'role', power: "SHOW" } },
  { path: 'org', component: OrgPage, data: { title: '组织管理', module: 'org', power: "SHOW" } },
  { path: 'outfit', component: OutfitPage, data: { title: '机构管理', module: 'outfit', power: "SHOW" } },
  { path: 'message', component: MessagePage, data: { title: '消息管理', module: 'message', power: "SHOW" } },
  { path: 'authority', component: AuthorityPage, data: { title: '权限管理', module: 'authority', power: "SHOW" } },
  { path: 'pay', component: PayPage, data: { title: '支付管理', module: 'pay', power: "SHOW" } },

  //路由添加请在 ** 申明之前
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
