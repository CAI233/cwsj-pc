import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { PayComponent } from './pay/pay.component';
 
export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: '首页', module: 'home', power: "SHOW" } },
  { path: 'login', component: LoginComponent, data: { title: '登录', module: 'login', power: "SHOW" } },
  { path: 'pay', component: PayComponent, data: { title: '支付管理', module: 'pay', power: "SHOW" } },
  { path: '404', component: ErrorComponent, data: { title: '404', module: '404', power: "SHOW" } },
  { path: 'system', loadChildren: './system/system.module#SystemModule' },
  { path: 'adv', loadChildren: './adv/adv.module#AdvModule' },

  //路由添加请在 ** 申明之前
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];
