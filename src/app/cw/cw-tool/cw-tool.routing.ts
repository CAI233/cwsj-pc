import { Routes } from '@angular/router';
//模块组件
import { CwToolClassComponent } from './cw-tool-class/cw-tool-class.component';
import { CwToolListComponent } from './cw-tool-list/cw-tool-list.component';

export const routes: Routes = [
  { path: 'cw_tool_class', component: CwToolClassComponent, data: { title: '工具书分类', module: 'cw_tool_class', power: "SHOW" } },
  { path: 'cw_tool_list', component: CwToolListComponent, data: { title: '工具书列表', module: 'cw_tool_list', power: "SHOW" } },
];
