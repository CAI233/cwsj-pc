import { Component, OnInit } from '@angular/core';
// 引入ActivatedRoute
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  //路由传参
  private id: number;

  // 实例化一个对象
  constructor(public routerInfo: ActivatedRoute) { }

  ngOnInit() {
    // snapshot:路由快照信息
    // ["id"]里id与app.component.html的[queryParams]={id:1}名字得一样
    this.id = this.routerInfo.snapshot.queryParams["id"];
  }

}
