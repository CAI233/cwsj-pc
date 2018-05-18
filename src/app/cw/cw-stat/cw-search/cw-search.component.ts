import { Component, OnInit } from '@angular/core';

import { AppService } from '../../../app.service';


@Component({
  selector: 'app-cw-search',
  templateUrl: './cw-search.component.html',
  styleUrls: ['./cw-search.component.css']
})
export class CwSearchComponent implements OnInit {

  _allChecked : boolean = false;
  _indeterminate : boolean = false;
  param : any = {
    pageNum:1,
    pageSize:10,
  }
  sortMap = {
    search_text: null,
    search_count: null
  };
  _loading : boolean = false;
  data : any = [];
  constructor(public service: AppService) { }

//加载列表
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/statistical/search',this.param).then(success => {
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
  // 导出
  daochu(){

    let doc = document.createElement('a');
      doc.href = this.service.ctxPath+'/api/busiz/statistical/search/info/export';
      doc.style.display = 'none';
      doc.target = "_self";
      doc.click();
      document.body.appendChild(doc);
  }

  ngOnInit() {

    this.load();
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

