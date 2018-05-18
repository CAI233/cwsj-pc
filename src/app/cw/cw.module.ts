import { NgModule } from '@angular/core';
import { RouterModule ,Routes} from '@angular/router';
export const routes: Routes = [
  { path: 'cw_code', loadChildren: './cw-code/cw-code.module#CwCodeModule' },
  { path: 'cw_goods', loadChildren: './cw-goods/cw-goods.module#CwGoodsModule' },
  { path: 'cw_member', loadChildren: './cw-member/cw-member.module#CwMemberModule' },
  { path: 'cw_msg', loadChildren: './cw-msg/cw-msg.module#CwMsgModule' },
  { path: 'cw_orders', loadChildren: './cw-orders/cw-orders.module#CwOrdersModule' },
  { path: 'cw_prj', loadChildren: './cw-prj/cw-prj.module#CwPrjModule' },
  { path: 'cw_res', loadChildren: './cw-res/cw-res.module#CwResModule' },
  { path: 'cw_set', loadChildren: './cw-set/cw-set.module#CwSetModule' },
  { path: 'cw_stat', loadChildren: './cw-stat/cw-stat.module#CwStatModule' },
  // { path: 'cw_tool', loadChildren: './cw-tool/cw-tool.module#CwToolModule' },
  { path: 'cw_train', loadChildren: './cw-train/cw-train.module#CwTrainModule' },
  { path: 'cw_works', loadChildren: './cw-works/cw-works.module#CwWorksModule' },
  { path: 'cw_info', loadChildren: './cw-info/cw-info.module#CwInfoModule' },
  { path: 'cw_tool', loadChildren: './cw-tool/cw-tool.module#CwToolModule' },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [],
})

export class CwModule { }


