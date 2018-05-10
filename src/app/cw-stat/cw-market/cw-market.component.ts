
import 'zone.js';
import 'reflect-metadata';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ViserModule } from 'viser-ng';
// import { DataSet } from '@antv/data-set';

const data = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 3.5 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9 },
  { year: '1996', value: 6 },
  { year: '1997', value: 7 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 },
];

const scale = [{
  dataKey: 'value',
  min: 0,
},{
  dataKey: 'year',
  min: 0,
  max: 1,
}];

@Component({
  selector: 'app-cw-market',
  templateUrl: './cw-market.component.html',
  styleUrls: ['./cw-market.component.css']
})
export class CwMarketComponent implements OnInit {
  forceFit: boolean= true;
  height: number = 400;
  scale =  [{
    dataKey: 'money',
    min: 0,
  },{
    dataKey: 'data',
    min: 0,
    // max: 1,
  }];
  nowdata : any = []
  allData : any = [];
  param : any = {
    type:null
  }

  // const dv = new DataSet.View().source(sourceData);
  // dv.transform({
  //   type: 'fold',
  //   fields: ['Tokyo', 'London'],
  //   key: 'city',
  //   value: 'temperature',
  // });
  // const data = dv.rows;
  
  // const scale = [{
  //   dataKey: 'month',
  //   min: 0,
  //   max: 1,
  // }];

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
        // this.data = success.data;
        this.nowdata = [{
          "cumulative": null,
          "date": "2018-05-10",
          "first_days": null,
          "money": 12,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-05-09",
          "first_days": null,
          "money": 24,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-05-08",
          "first_days": null,
          "money": 32,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-05-07",
          "first_days": null,
          "money": 13.0,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-05-06",
          "first_days": null,
          "money": 6.01,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-05-05",
          "first_days": null,
          "money": 234,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-05-04",
          "first_days": null,
          "money": 21,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-05-03",
          "first_days": null,
          "money": 45,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-05-02",
          "first_days": null,
          "money": 34,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-05-01",
          "first_days": null,
          "money": 65,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-30",
          "first_days": null,
          "money": 5,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-29",
          "first_days": null,
          "money": 234,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-28",
          "first_days": null,
          "money": 67,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-27",
          "first_days": null,
          "money": 4,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-26",
          "first_days": null,
          "money": 5,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-25",
          "first_days": null,
          "money": 3,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-24",
          "first_days": null,
          "money": 23,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-23",
          "first_days": null,
          "money": 45.02,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-22",
          "first_days": null,
          "money": 66,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-21",
          "first_days": null,
          "money": 23,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-20",
          "first_days": null,
          "money": 43,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-19",
          "first_days": null,
          "money": 43,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-18",
          "first_days": null,
          "money": 23,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-17",
          "first_days": null,
          "money": 21,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-16",
          "first_days": null,
          "money": 11,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-15",
          "first_days": null,
          "money": 2,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-14",
          "first_days": null,
          "money": 22,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-13",
          "first_days": null,
          "money": 23,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-12",
          "first_days": null,
          "money": 1,
          "the_days": null,
          "yesterday": null
        }, {
          "cumulative": null,
          "date": "2018-04-11",
          "first_days": null,
          "money": 100,
          "the_days": null,
          "yesterday": null
        }]
      }else{
        this.nowdata = [];
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
    if(rest){
      if(rest==0){
        this.param.type = 1;
      }else{
        this.param.type = 2;
      }
      this.get_load();
      this.load();
    }
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
