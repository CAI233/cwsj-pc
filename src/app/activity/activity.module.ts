import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//web ui 
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';//引入NZ 使用的form核心
import { FormsModule, ReactiveFormsModule } from "@angular/forms";//引入NZ 使用的form核心
import { routes } from './activity.routing';
import { RouterModule } from '@angular/router';

import { ActivityComponent } from './activity/activity.component';
import { VoteMemberComponent } from './votemember/votemember.component';
import { PlayerComponent } from './player/player.component';
import { SettingComponent } from './setting/setting.component';

//富文本编辑器
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule.forRoot(), //引入NZ
    CKEditorModule
  ],
  declarations: [ActivityComponent, SettingComponent, VoteMemberComponent, PlayerComponent],
  providers: [  //引入NZ
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } }
  ]
})
export class ActivityModule { }
