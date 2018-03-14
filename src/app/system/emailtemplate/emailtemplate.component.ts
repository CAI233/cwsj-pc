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
  _displayData = [];

  editRow : any = null;

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
  load(){
    this.service.post('/api/system/mailtemplate/pagequery',this.param).then(success => {
      console.log(success)
      this.data = success.data.rows;
    })
  }

  // 修改操作
  edit(data) {
    this.editRow = data.user_id;
  }

  // 取消操作
  cancel(data) {
    
    this.editRow = null;
    this.load();
  }

  save(data){
    console.log(data);
    if(!data.mail_template_id){
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


  _displayDataChange($event) {
    this._displayData = $event;
    this._refreshStatus();
  }

  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.disabled || value.checked);
    const allUnChecked = this._displayData.every(value => value.disabled || !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }

  _checkAll(value) {
    if (value) {
      this._displayData.forEach(data => {
        if (!data.disabled) {
          data.checked = true;
        }
      });
    } else {
      this._displayData.forEach(data => data.checked = false);
    }
    this._refreshStatus();
  }

}
