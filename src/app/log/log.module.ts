import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//web ui 
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';//引入NZ 使用的form核心
import { FormsModule, ReactiveFormsModule } from "@angular/forms";//引入NZ 使用的form核心
import { routes } from './log.routing';
import { RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { ActionlogComponent } from './actionlog/actionlog.component';
import { SyslogComponent } from './syslog/syslog.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule.forRoot() //引入NZ
  ],
  declarations: [
    MainComponent,
    ActionlogComponent,
    SyslogComponent],
  providers: [  //引入NZ
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } }
  ]
})
export class LogModule { }
