import { Routes } from '@angular/router';
//模块组建
import { ActivityComponent } from './activity/activity.component';
import { PlayerComponent } from './player/player.component';
import { VoteMemberComponent } from './votemember/votemember.component';
import { SettingComponent } from './setting/setting.component';
export const routes: Routes = [
    { path: '', component: ActivityComponent, data: { title: '活动管理', module: 'setting', power: "SHOW" } },
    { path: 'setting', component: SettingComponent, data: { title: '活动设置', module: 'setting', power: "SHOW" } },
    { path: 'activity', component: ActivityComponent, data: { title: '活动列表', module: 'activity', power: "SHOW" } },
    { path: 'player/:id', component: PlayerComponent, data: { title: '选手列表', module: 'player', power: "SHOW" } },
    { path: 'votemember/:id', component: VoteMemberComponent, data: { title: '投票用户列表', module: 'votemember', power: "SHOW" } },
];
