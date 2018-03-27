
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CwResTagComponent } from './cw-res-tag/cw-res-tag.component';
import { CwResClassComponent } from './cw-res-class/cw-res-class.component';
import { CwResQuesComponent } from './cw-res-ques/cw-res-ques.component';
import { CwVideoComponent } from './cw-video/cw-video.component';
import { CwBookComponent } from './cw-book/cw-book.component';
import { CwAnalysisComponent } from './cw-analysis/cw-analysis.component';

//web ui 
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';//引入NZ 使用的form核心
import { FormsModule, ReactiveFormsModule } from "@angular/forms";//引入NZ 使用的form核心
import { routes } from './cw-res.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule.forRoot(), //引入NZ
    CommonModule
  ],
  declarations: [CwResTagComponent, CwResClassComponent, CwVideoComponent, CwAnalysisComponent,CwBookComponent, CwResQuesComponent],
  providers: [  //引入NZ
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } }
  ]
})
export class CwResModule { }

