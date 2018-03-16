import { Component, OnInit } from '@angular/core';

import { AppService } from '../../app.service';



@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.css']
})
export class EmailtemplateComponent implements OnInit {

  _allChecked = false;
  _indeterminate = false;


  editRow : any = null;
  _loading: boolean = true;

  param : any = {
    pageSize:10,
    pageNum:1,
    searchText:null
  }
  data : any = [];

  constructor(private service: AppService) { }

  ngOnInit() {


    this.load();


    
  }

  


  //加载邮件模板
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/system/mailtemplate/pagequery',this.param).then(success => {
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

  // 修改操作
  edit(data) {
    
    this.editRow = data.mail_template_id;
  }

  // 取消操作
  cancel(data) {
    
    this.editRow = null;
    this.load();
  }

  save(data){
    if(!data.template_code){
      this.service.message.error('请填写模板编码');
      return false;
    }
    if(!data.content){
      this.service.message.error('请填写模板内容');
      return false;
    }
    this.service.post('/api/system/mailtemplate/update',data).then(success => {
      this.editRow = null;
      this.load();
    })


  }


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
