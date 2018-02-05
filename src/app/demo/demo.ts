import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.html',
  styleUrls: ['./demo.css']
})
export class DemoPage implements OnInit {

  //构造
  constructor(private service: AppService) { }
  //开始加载
  ngOnInit() {
  }
  //文档初始化
  ngAfterViewInit() {
  }
  //离开页面
  ngOnDestroy(){    
  }
}
