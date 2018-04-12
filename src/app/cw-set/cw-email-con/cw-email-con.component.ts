import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-cw-email-con',
  templateUrl: './cw-email-con.component.html',
  styleUrls: ['./cw-email-con.component.css']
})
export class CwEmailConComponent implements OnInit {

  _allChecked = false;
  _indeterminate = false;


  param :any = {
    pageSize:10,
    pageNum:1,
    searchText:null
  };

  _loading: boolean = true;
  data : any = [];
  editRow : any = [];

  new_tempEditObject : any = {};

  sendVisible : boolean = false;
  sendTo : any = {};
  constructor(public service: AppService) { }

  ngOnInit() {

    this.load();
  }

  //加载列表
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/system/mailsetting/pagequery',this.param).then(success => {
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
      this.data.forEach( value => { 
        
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
      
      this.data.unshift(this.new_tempEditObject);
      this.editRow = this.new_tempEditObject.mail_setting_id;
    }

    //状态
  _enabled(data) {
    if(this.service.validataAction('cw_email_con_status')){
      data.status = data.status == 1 ? 0 : 1;
      console.log(data.status);
      let obj = {...data};
      this.service.post('/api/system/mailsetting/update',obj).then(success => {
        this.load();
      })
    }
  }
  sendCancel($event){
    this.sendVisible = false;
  }
  sendOk($event){
    const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!this.sendTo.email_addr) {
      this.service.message.warning('请填写邮箱发送地址!');
      return false;
    } else if (!EMAIL_REGEXP.test(this.sendTo.email_addr)) {
      this.service.message.warning('请填写正确的邮箱地址!');
      return false;
    }
    this.service.post('/api/system/mailsetting/sendmail',this.sendTo).then(success => {
      if(success.code==0){
        this.sendVisible = false;
        this.load();
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  // 测试发送邮件
  send(data){
    this.sendVisible = true;
    this.sendTo.mail_setting_id = data.mail_setting_id;
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
