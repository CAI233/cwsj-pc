import { Routes } from '@angular/router';
//模块组建
import { CwsjResourceComponent } from './cwsj-resource/cwsj-resource.component';
import { CwsjTagComponent } from './cwsj-tag/cwsj-tag.component';
export const routes: Routes = [
    { path: '', component: CwsjResourceComponent, data: { title: '资源管理', module: 'cwsjresource', power: "SHOW" } },
    { path: 'cwsjresource', component: CwsjResourceComponent, data: { title: '资源管理', module: 'cwsjresource', power: "SHOW" } },
    { path: 'cwsjtag', component: CwsjTagComponent, data: { title: '标签管理', module: 'cwsjtag', power: "SHOW" } },
];
