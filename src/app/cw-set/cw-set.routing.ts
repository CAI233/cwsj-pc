import { Routes } from '@angular/router';
//模块组件
import { CwEmailComponent } from './cw-email/cw-email.component';
import { CwPayComponent } from './cw-pay/cw-pay.component';
import { CwWinComponent } from './cw-win/cw-win.component';
import { CwAdvComponent } from './cw-adv/cw-adv.component';
import { CwLogisComponent } from './cw-logis/cw-logis.component';

export const routes: Routes = [
  { path: 'cw_email', component: CwEmailComponent, data: { title: '邮件设置', module: 'cw_email', power: "SHOW" } },
  { path: 'cw_pay', component: CwPayComponent, data: { title: '支付设置', module: 'cw_pay', power: "SHOW" } },
  { path: 'cw_win', component: CwWinComponent, data: { title: '橱窗设置', module: 'cw_win', power: "SHOW" } },
  { path: 'cw_adv', component: CwAdvComponent, data: { title: '广告设置', module: 'cw_adv', power: "SHOW" } },
  { path: 'cw_logis', component: CwLogisComponent, data: { title: '物流设置', module: 'cw_logis', power: "SHOW" } },
];
