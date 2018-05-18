import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
@Component({
  selector: 'app-cw-email-send',
  templateUrl: './cw-email-send.component.html',
  styleUrls: ['./cw-email-send.component.css']
})
export class CwEmailSendComponent implements OnInit {
  param :any = {
    pageSize:1000,
    pageNum:1,
    searchText:null
  };
  selRow : any = {};
  con_id : any = null;
  email : any = {};
  email_con : any = [];
  constructor(public service: AppService) { }

  get_email_con(){
    this.service.post('/api/system/mailsetting/pagequery',this.param).then(success => {
      
      if(success.code==0){
        this.email_con = success.data.rows;
        this.param.total = success.data.total;
      }else{
        this.email_con = [];
        this.param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }
  selected(id ?){
    if(id){
      for(let item of this.email_con){
        if(id == item.mail_setting_id){
          for(let i in item){
            this.selRow[i] = item[i];
          }
          break;
        }
      }
    }else{
      this.selRow = {};
    }
    
  }

  save($event){
    for(let i in this.selRow){
      this.email[i] = this.selRow[i];
    }
    if(!this.email.mail_setting_id){
      this.service.message.warning('请选择邮件配置!');
      return false;
    }
    
    const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!this.email.email_addr) {
      this.service.message.warning('请填写邮箱发送地址!');
      return false;
    } else if (!EMAIL_REGEXP.test(this.email.email_addr)) {
      this.service.message.warning('请填写正确的邮箱地址!');
      return false;
    }
 
    
    this.service.post('/api/system/mailsetting/sendmail',{mail_setting_id:this.email.mail_setting_id,email:this.email.email_addr}).then(success => {
      if(success.code==0){
        this.selRow = {};
        this.email = {};
      }else{
        this.service.message.error(success.message);
      }
    })

  }

  ngOnInit() {


    // 获取邮件配置列表
    this.get_email_con();
  }

}
