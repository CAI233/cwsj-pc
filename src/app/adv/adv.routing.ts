import { Routes } from '@angular/router';
import { AdvListComponent } from './advlist/advlist.component';
import { AdvClassComponent } from './advclass/advclass.component';
//模块组建
export const routes: Routes = [
    { path: '', component: AdvListComponent, data: { title: '新闻设置', module: 'adv', power: "SHOW" } },
    { path: 'advlist', component: AdvListComponent, data: { title: '新闻列表', module: 'advlist', power: "SHOW" } },
    { path: 'advclass', component: AdvClassComponent, data: { title: '新闻分类', module: 'advclass', power: "SHOW" } },
];