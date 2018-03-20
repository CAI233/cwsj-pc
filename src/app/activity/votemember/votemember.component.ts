import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-votemember',
  templateUrl: './votemember.component.html',
  styleUrls: ['./votemember.component.css']
})
export class VoteMemberComponent implements OnInit {
  tableData: any = []; //数据列表

  param: any = {
    total: 0,
    pageSize: 10,
    pageNum: 1,
    contestant_id: this.routerIofo.snapshot.params['id'] == ':id' ? 0 : this.routerIofo.snapshot.params['id'],
  };
  _loading: boolean = true;
  // 实例化一个对象
  constructor(private routerIofo: ActivatedRoute, private service: AppService) { }

  //表单
  activitySelect: any = []; //活动下拉
  playerSelect: any = []; //选手下拉
  ngOnInit() {
    this.reload();
  }
  //重新查询
  reload(reset?: any) {
    if (reset == true) {
      this.param.pageNum = 1;
    }
    console.log(this.param)
    this._loading = true;
    this.service.post('/api/system/vote/user/list', this.param).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.tableData = success.data.rows;
        this.param.total = success.data.total;
      }
      else {
        this.tableData = [];
        this.param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }
}
