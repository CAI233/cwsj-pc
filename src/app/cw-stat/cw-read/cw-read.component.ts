import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-cw-read',
  templateUrl: './cw-read.component.html',
  styleUrls: ['./cw-read.component.css']
})
export class CwReadComponent implements OnInit {
  _allChecked : boolean = false;
  _indeterminate : boolean = false;
  param : any = {
    pageNum:1,
    pageSize:10,
    type:1
  }

  resTypeList : any = [
    {type:2,type_name:'音频'},{type:3,type_name:'视频'}
  ]

  _loading : boolean = false;
  data : any = [];
  constructor(public service: AppService) { }

  reload(rest?){
    if(rest){
      this.load();
    }
  }
  resetForm(){
    this.param = {
      pageNum:1,
      pageSize:10,
      type:1
    }
    this.param.searchText = null;
    this.param.type = null;
    this.load();
  }

    //加载列表
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/statistical/reading',this.param).then(success => {
      this._loading = false;
      if(success.code==0){
        this.data = success.data.rows;
        this.param.total = success.data.total;
      }else{
        this.data = [];
        this.param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }
  ngOnInit() {

    this.load();
  }

  // 导出
    // 导出
    daochu(){
      let idss:any = [];
      
      this.data.filter(value => value.checked).forEach(item => { idss.push(item.id)});
      idss = idss.join(',');

      let doc = document.createElement('a');
        doc.href = this.service.ctxPath+'/api/busiz/statistical/reading/info/export?type=1&ids='+idss;
        doc.style.display = 'none';
        doc.target = "_self";
        doc.click();
        document.body.appendChild(doc);
    }

   // 全选
   _checkAll(value) {
    if (value) {
      this.data.forEach(data => {
        if (!data.disabled) {
          data.checked = true;
        }
      });
    } else {
      this.data.forEach(data => data.checked = false);
    }
    this._refreshStatus();
  }
  _refreshStatus() {
    const allChecked = this.data.every(value => value.disabled || value.checked);
    const allUnChecked = this.data.every(value => value.disabled || !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }

}
