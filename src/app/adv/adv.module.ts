import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//web ui 
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';//引入NZ 使用的form核心
import { FormsModule, ReactiveFormsModule } from "@angular/forms";//引入NZ 使用的form核心
import { routes } from './adv.routing';
import { RouterModule } from '@angular/router';

import { AdvListComponent } from './advlist/advlist.component';
import { AdvClassComponent } from './advclass/advclass.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule.forRoot() //引入NZ
  ],
  declarations: [AdvListComponent, AdvClassComponent],
  providers: [  //引入NZ
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } }
  ]
})
export class AdvModule { }
