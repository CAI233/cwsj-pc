import { Routes } from '@angular/router';
//模块组建
import { CwsjResourceComponent } from './cwsj-resource/cwsj-resource.component';
import { CwsjTagComponent } from './cwsj-tag/cwsj-tag.component';
import { CwsjCooperateComponent } from './cwsj-cooperate/cwsj-cooperate.component';
import { CwsjVideoComponent } from './cwsj-video/cwsj-video.component';
import { CwsjWaresComponent } from './cwsj-wares/cwsj-wares.component';
import { CwsjBrandComponent } from './cwsj-brand/cwsj-brand.component';
import { CwsjQrcodeComponent } from './cwsj-qrcode/cwsj-qrcode.component';
import { CwsjVideoClassComponent } from './cwsj-video-class/cwsj-video-class.component';
export const routes: Routes = [
    { path: '', component: CwsjResourceComponent, data: { title: '资源管理', module: 'cwsjresource', power: "SHOW" } },
    { path: 'cwsjresource', component: CwsjResourceComponent, data: { title: '资源管理', module: 'cwsjresource', power: "SHOW" } },
    { path: 'cwsjtag', component: CwsjTagComponent, data: { title: '标签管理', module: 'cwsjtag', power: "SHOW" } },
    { path: 'cwsjcooperate', component: CwsjCooperateComponent, data: { title: '合作分类', module: 'cwsjcooperate', power: "SHOW" } },
    { path: 'cwsjvideo', component: CwsjVideoComponent, data: { title: '视频列表', module: 'cwsjvideo', power: "SHOW" } },
    { path: 'cwsjvideoclass', component: CwsjVideoClassComponent, data: { title: '视频分类', module: 'cwsjvideoclass', power: "SHOW" } },
    { path: 'cwsjwares', component: CwsjWaresComponent, data: { title: '商品分类', module: 'cwsjwares', power: "SHOW" } },
    { path: 'cwsjbrand', component: CwsjBrandComponent, data: { title: '品牌管理', module: 'cwsjbrand', power: "SHOW" } },
    { path: 'cwsjqrcode', component: CwsjQrcodeComponent, data: { title: '二维码管理', module: 'cwsjqrcode', power: "SHOW" } },
];
