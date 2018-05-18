

import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';

// const data = [
//   { year: '1991', value: 3 },
//   { year: '1992', value: 4 },
//   { year: '1993', value: 3.5 },
//   { year: '1994', value: 5 },
//   { year: '1995', value: 4.9 },
//   { year: '1996', value: 6 },
//   { year: '1997', value: 7 },
//   { year: '1998', value: 9 },
//   { year: '1999', value: 13 },
// ];

// const scale = [{
//   dataKey: 'value',
//   min: 0,
// },{
//   dataKey: 'year',
//   min: 0,
//   max: 1,
// }];

@Component({
  selector: 'app-cw-market',
  templateUrl: './cw-market.component.html',
  styleUrls: ['./cw-market.component.css']
})

export class CwMarketComponent implements OnInit {
  forceFit: boolean= true;
  height: number = 400;

  // nowdata : any = [];
  allData : any = [];
  param : any = {
    type:null
  }
  data : any = [];
  scale : any = [];

  _loading : boolean = false;
  constructor(public service: AppService) { }
  //加载列表
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/statistical/first/days',this.param).then(success => {
      this._loading = false;
      if(success.code==0){
        let nowArr = [];
        success.data.forEach(element => {
          nowArr.push({
            data:element.date,
            money:element.money || 0 
          })
        });
        // console.log(nowArr)

        this.data = nowArr;
        // console.log(this.nowData )

        // this.data = [
        //   { data: '1991-12-1', money: 3 },
        //   { data: '1992-12-1', money: 4 },
        //   { data: '1993-12-1', money: 3.5 },
        //   { data: '1994-12-1', money: 5 },
        //   { data: '1995-12-1', money: 4.9 },
        //   { data: '1996-12-1', money: 6 },
        //   { data: '1997-12-1', money: 7 },
        //   { data: '1998-12-1', money: 9 },
        //   { data: '1999-12-1', money: 13 },
        // ];

        this.scale = [{
          dataKey: 'money',
          min: 0,
          alias:'金额'
        },{
          dataKey: 'month',
          min: 0,
          max: 1,
          
        }];
        
      }else{
        // this.nowdata = [];
        this.service.message.error(success.message);
      }
    })
  }
  get_load(){
    this.service.post('/api/busiz/statistical/sales',this.param).then(success => {
      if(success.code==0){
        this.allData = success.data
      }else{
        this.service.message.error(success.message);
      }
    })
  }

  _change(rest?){
    if(rest==0){
      this.param.type = 1;
    }else{
      this.param.type = 2;
    }
    this.get_load();
    this.load();
    
  }

  ngOnInit() {
    // 初始
    this.param.type =1;
    // 加载30天销售数据
    this.load();
    // 加载销售统计数据
    this.get_load();
  }
}
