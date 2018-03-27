import { Routes } from '@angular/router';
//模块组件
import { CwResTagComponent } from './cw-res-tag/cw-res-tag.component';
import { CwResClassComponent } from './cw-res-class/cw-res-class.component';
import { CwResQuesComponent } from './cw-res-ques/cw-res-ques.component';
import { CwVideoComponent } from './cw-video/cw-video.component';
import { CwBookComponent } from './cw-book/cw-book.component';
import { CwAnalysisComponent } from './cw-analysis/cw-analysis.component';

export const routes: Routes = [
  { path: 'cw_res_tag', component: CwResTagComponent, data: { title: '资源标签', module: 'cw_res_tag', power: "SHOW" } },
  { path: 'cw_res_class', component: CwResClassComponent, data: { title: '资源分类', module: 'cw_res_class', power: "SHOW" } },
  { path: 'cw_video', component: CwVideoComponent, data: { title: '音视频管理', module: 'cw_video', power: "SHOW" } },
  { path: 'cw_book', component: CwBookComponent, data: { title: '图书管理', module: 'cw_book', power: "SHOW" } },
  { path: 'cw_analysis', component: CwAnalysisComponent, data: { title: '批量解析', module: 'cw_analysis', power: "SHOW" } },
  { path: 'cw_res_ques', component: CwResQuesComponent, data: { title: '题库管理', module: 'cw_res_ques', power: "SHOW" } },
];
