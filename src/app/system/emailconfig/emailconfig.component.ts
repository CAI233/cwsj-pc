import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-emailconfig',
  templateUrl: './emailconfig.component.html',
  styleUrls: ['./emailconfig.component.css']
})
export class EmailconfigComponent implements OnInit {

  _allChecked = false;
  _indeterminate = false;
  _displayData = [];

  param :any = {
    pageSize:10,
    pageNum:1,
    searchText:null
  };

  data : any = [];
  editRow : any = [];

  new_tempEditObject : any = {};

  constructor(private service: AppService) { }

  ngOnInit() {

    this.load();
  }

  //加载列表
  load(){
    this.service.post('/api/system/mailsetting/pagequery',this.param).then(success => {
      console.log(success)
      this.data = success.data.rows;
    })
  }

    // 修改操作
    edit(data) {
      this.editRow = data.mail_setting_id;
    }
  
    // 取消操作
    cancel(data) {
      this.editRow = null;
      this.load();
    }
  
     //删除操作
     del(data){
       console.log(data);
      this.service.post('/api/system/mailsetting/del',{ids:[data.mail_setting_id]}).then(success => {
        this.load();
      })
    }

    // 一键删除
    delRows(){
      let now_arrList = [];
    console.log(this._displayData)
    this._displayData.forEach( value => { 
      
      if(value.checked){now_arrList.push(value.mail_setting_id)}
    })

    if (now_arrList.length==0) {
      this.service.message.error('请选择要删除的模块');
      return false;
    }
    this.service.post('/api/system/mailsetting/del',{ids:now_arrList}).then(success => {
      this.load();
    })
    }

    // 新增
    add(){
      this.new_tempEditObject= {
        account: null,
        pwd: null,
        port: null,
        smtp_url: '',
        status: 1,
        update_time: null,
        mail_setting_id:null
      };
      this._displayData.unshift(this.new_tempEditObject);
      this.editRow = this.new_tempEditObject.mail_setting_id;
    }

    //状态
  _enabled(data) {
    data.status = data.status == 1 ? 0 : 1;
    console.log(data.status)
  }

    //保存
    save(data){
      console.log(data);
      if(!data.account){
        this.service.message.error('请填写账号信息');
        return false;
      }
      if(!data.pwd){
        this.service.message.error('请填写密码');
        return false;
      }
      if(!data.port){
        this.service.message.error('请填写端口号');
        return false;
      }
      if(!data.smtp_url){
        this.service.message.error('请填写服务器地址');
        return false;
      }
      this.service.post('/api/system/mailsetting/update',this.new_tempEditObject).then(success => {
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