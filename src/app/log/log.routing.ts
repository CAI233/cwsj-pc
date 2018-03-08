import { Routes } from '@angular/router';
//模块组建
import { MainComponent } from './main/main.component'
import { ActionlogComponent } from './actionlog/actionlog.component';
import { SyslogComponent } from './syslog/syslog.component';

export const routes: Routes = [
  { path: '', component: MainComponent, data: { title: '日志管理', module: 'log', power: "SHOW" } },
  { path: 'actionLog', component: ActionlogComponent, data: { title: '操作日志', module: 'actionLog', power: "SHOW" } },
  { path: 'sysLog', component: SyslogComponent, data: { title: '系统日志', module: 'sysLog', power: "SHOW" } },

];