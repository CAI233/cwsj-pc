import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
// import { DataSet } from '@antv/data-set';



// declare let wangEditor: any
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  forceFit: boolean= true;
  height: number = 400;

  // nowdata : any = [];
  allData : any = [];
  param : any = {
    type:null,
    date:null
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

        this.data = nowArr;
       
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

  reload(rest?){
    console.log(this.timeOut(this.param.date))
    if(this.param.date){
      this.param.date = this.timeOut(this.param.date);
      this.load();
    }
  }
  resetForm(){
    this.param.date = null;
    this.load();
  }

    // 导出
    daochu(){
      let idss:any = [];
      
      this.data.filter(value => value.checked).forEach(item => { idss.push(item.id)});
      idss = idss.join(',');

      let doc = document.createElement('a');
        doc.href = this.service.ctxPath+'/api/busiz/statistical/sales/info/export?type='+this.param.type;
        doc.style.display = 'none';
        doc.target = "_self";
        doc.click();
        document.body.appendChild(doc);
    }

  ngOnInit() {
    // 初始
    this.param.type =1;
    // 加载30天销售数据
    this.load();
    // 加载销售统计数据
    this.get_load();
  }

  timeOut(d) {
    let m = new Date(d);
    let M, D, H, mm, ss;
    M = (m.getMonth() + 1) < 10 ? '0' + (m.getMonth() + 1) : (m.getMonth() + 1);
    // D = m.getDate() < 10 ? '0' + m.getDate() : m.getDate();
    // H = m.getHours() <10 ? '0'+m.getHours() : m.getHours();
    // mm = m.getMinutes() <10 ? '0'+m.getMinutes() : m.getMinutes();
    // ss = m.getSeconds() <10 ? '0'+m.getSeconds() : m.getSeconds();
    // return m.getFullYear() + '-' + M + '-' + D + ' ' + H + ':' + mm + ':' + ss; 
    return m.getFullYear() + '-' + M ;
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
