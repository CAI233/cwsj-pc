import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//web ui 
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';//引入NZ 使用的form核心
import { FormsModule, ReactiveFormsModule } from "@angular/forms";//引入NZ 使用的form核心
import { routes } from './cwsj-resource.routing';
import { RouterModule } from '@angular/router';

import { CwsjResourceComponent } from './cwsj-resource/cwsj-resource.component';
import { CwsjTagComponent } from './cwsj-tag/cwsj-tag.component';
import { CwsjVideoComponent } from './cwsj-video/cwsj-video.component';
import { CwsjWaresComponent } from './cwsj-wares/cwsj-wares.component';
import { CwsjCooperateComponent } from './cwsj-cooperate/cwsj-cooperate.component';
import { CwsjBrandComponent } from './cwsj-brand/cwsj-brand.component';
import { CwsjQrcodeComponent } from './cwsj-qrcode/cwsj-qrcode.component';
import { CwsjVideoClassComponent } from './cwsj-video-class/cwsj-video-class.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule.forRoot(), //引入NZ
  ],
  declarations: [CwsjTagComponent, CwsjVideoComponent, CwsjWaresComponent, CwsjCooperateComponent, CwsjBrandComponent, CwsjQrcodeComponent, CwsjVideoClassComponent, CwsjResourceComponent],
  providers: [  //引入NZ
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } }
  ]
})
export class CwsjResourceModule { }
