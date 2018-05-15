import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { DataSet } from '@antv/data-set';



// declare let wangEditor: any
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  data : any = [];
  scale : any = [];
  tooltip : any = [];
  itemTpl:any = '';//鼠标滑过提示
  legendTpl : any = '';//图表下方展示信息
  dv : any = null;

  forceFit: boolean = true;
  height: number = 400;
  pieStyle = {
    stroke: "#fff",
    lineWidth: 2
  };
  labelConfig = ['percent', {
    offset: -40,
    textStyle: {
      rotate: 0,
      textAlign: 'center',
      shadowBlur: 2,
      shadowColor: 'rgba(0, 0, 0, .45)'
    }
  }];
  constructor(public service: AppService) { }

  ngOnInit() {
   
    let ds = new DataSet();
   
    let sourceData = [
      { item: '语文', count: 40 },
      { item: '数学', count: 21 },
      { item: '儿童文学', count: 17 }
    ];
    this.scale = [{
      dataKey: 'percent',
      min: 0,
      formatter: '.0%',
    }];
    // let color = ['name', ['#BAE7FF', '#7FC9FE', '#71E3E3', '#ABF5F5', '#8EE0A1', '#BAF5C4']];
    this.itemTpl = '<li><span ></span>{title}: {value}</li>';
    this.tooltip = [
      'item*percent',(item, percent) => {
        percent = (percent * 100).toFixed(2) + '%';
        return {
          title: item,
          value: percent,
        }
      }]

      
    this.legendTpl = ``;


    // let dv = ds.createView().source(sourceData);
    
    this.dv = ds.createView().source(sourceData);
    
    this.dv.transform({
      tooltip:false,
      showTitle: false,
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
    });

  
    console.log(this.dv)
    this.load();
  }

// 加载数据
  load(){


    this.data  = this.dv.rows;
  }

  // ngAfterViewInit(){
  //   var editor = new wangEditor('#editor');
  //   editor.customConfig.uploadImgShowBase64 = true;
  //   editor.create();
  //   editor.txt.clear();
  //   editor.txt.html('<p>用 JS 设置的内容</p>');
  //   editor.txt.append('<p>追加的内容</p>');
  //   console.log(editor.txt.html())
  //   console.log(editor.txt.text())
  // }

}
