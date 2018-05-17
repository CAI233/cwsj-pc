import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: '首页', module: 'home', power: "SHOW" } },
  { path: 'login', component: LoginComponent, data: { title: '登录', module: 'login', power: "SHOW" } },
  { path: 'error', component: ErrorComponent, data: { title: '404', module: 'error', power: "SHOW" } },
  { path: 'system', loadChildren: './system/system.module#SystemModule' },
  
  //崇文模块
  { path: 'cw', loadChildren: './cw/cw.module#CwModule' },

  //路由添加请在 ** 申明之前
  { path: '**', redirectTo: '/error', pathMatch: 'full' }
];
