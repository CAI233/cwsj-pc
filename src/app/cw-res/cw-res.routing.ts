import { Routes } from '@angular/router';
//模块组件
import { CwResTagComponent } from './cw-res-tag/cw-res-tag.component';
import { CwResClassComponent } from './cw-res-class/cw-res-class.component';
import { CwResListComponent } from './cw-res-list/cw-res-list.component';
import { CwResQuesComponent } from './cw-res-ques/cw-res-ques.component';

export const routes: Routes = [
  { path: 'cw_res_tag', component: CwResTagComponent, data: { title: '资源标签', module: 'cw_res_tag', power: "SHOW" } },
  { path: 'cw_res_class', component: CwResClassComponent, data: { title: '资源分类', module: 'cw_res_class', power: "SHOW" } },
  { path: 'cw_res_list', component: CwResListComponent, data: { title: '资源列表', module: 'cw_res_list', power: "SHOW" } },
  { path: 'cw_res_ques', component: CwResQuesComponent, data: { title: '题库管理', module: 'cw_res_ques', power: "SHOW" } },
];
