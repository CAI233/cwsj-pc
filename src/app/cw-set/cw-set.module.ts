import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CwPayComponent } from './cw-pay/cw-pay.component';
import { CwWinComponent } from './cw-win/cw-win.component';
import { CwAdvComponent } from './cw-adv/cw-adv.component';
import { CwLogisComponent } from './cw-logis/cw-logis.component';
import { CwEmailConComponent } from './cw-email-con/cw-email-con.component';
import { CwEmailModuleComponent } from './cw-email-module/cw-email-module.component';
import { CwEmailSendComponent } from './cw-email-send/cw-email-send.component';

//web ui 
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';//引入NZ 使用的form核心
import { FormsModule, ReactiveFormsModule } from "@angular/forms";//引入NZ 使用的form核心
import { routes } from './cw-set.routing';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule.forRoot(), //引入NZ
    CommonModule
  ],
  declarations: [CwPayComponent, CwWinComponent, CwEmailConComponent, CwEmailModuleComponent, CwEmailSendComponent, CwAdvComponent, CwLogisComponent],
  providers: [  //引入NZ
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } }
  ]
})
export class CwSetModule { }


