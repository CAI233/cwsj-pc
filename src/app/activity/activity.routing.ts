import { Routes } from '@angular/router';
//模块组建
import { ActivityComponent } from './activity/activity.component';
import { PlayerComponent } from './player/player.component';
import { VoteMemberComponent } from './votemember/votemember.component';
export const routes: Routes = [
    { path: '', component: ActivityComponent, data: { title: '活动管理', module: 'activity', power: "SHOW" } },
    { path: 'activity', component: ActivityComponent, data: { title: '活动列表', module: 'activity', power: "SHOW" } },
    { path: 'player', component: PlayerComponent, data: { title: '选手列表', module: 'player', power: "SHOW" } },
    { path: 'votemember', component: VoteMemberComponent, data: { title: '投票用户列表', module: 'votemember', power: "SHOW" } },
];
