import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare let wangEditor: any;
@Component({
  selector: 'app-cw-email-send',
  templateUrl: './cw-email-send.component.html',
  styleUrls: ['./cw-email-send.component.css']
})
export class CwEmailSendComponent implements OnInit {
  param :any = {
    pageSize:10,
    pageNum:1,
    searchText:null
  };
  selRow : any = {
    mail_template:null
  };

  mail_template : any = [];
  _loading : boolean = false;
  _allChecked : boolean = false;
  _indeterminate : boolean = false;
  data : any = [];//邮件对象数组
  isTitle :string;//新增与修改弹出层标题
  isCheck : boolean = false;
  isShow : boolean = false;
  myForm: FormGroup;
  constructor(public service: AppService) { }

  get_template(){
    this.service.post('/api/system/mailtemplate/pagequery',{pageSize:10,pageNum:1}).then(success => {
      if(success.code==0){
        this.mail_template = success.data.rows;
        this.param.total = success.data.total;
      }else{
        this.mail_template = [];
        this.param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }
  select(){
    // if(bool){
      console.log(this.selRow.mail_template_id)
    if(this.selRow.mail_template_id){
      for(let i in this.mail_template){
        if(this.selRow.mail_template_id == this.mail_template[i].mail_template_id){
          this.editor.txt.html(this.mail_template[i].content)
          break;
        }
      }
      
    }
  }
  //加载邮件列表
  load(reset?: any){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/mailemail/list',this.param).then(success => {
      this._loading = false;
      console.log(success)
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

  // 查询
  reload(rest?){
    if(rest){
      this.load();
    }
  }
  //重置
  resetForm(){
    this.param.searchText = null;
    this.load();
  } 
  // 关闭
  _Cancel($event){
    this.isCheck = false;
    this.isShow = false;
    this.myForm.reset();
  }
  // 保存
  _Ok($event){
    if(!this.selRow.mail_title){
      this.service.message.error('请填写邮件标题');
      return false;
    }
    // if(!this.param.mail_template_id){
    //   this.service.message.error('请选择模板');
    //   return false;
    // }
    this.selRow.mail_content = this.editor.txt.html();
    if(!this.selRow.mail_content){
      this.service.message.error('请填写模板内容');
      return false;
    }
    
     this.service.post('/api/busiz/mailemail/save',this.selRow).then(success => {
      if(success.code==0){
        this.selRow = {};
        this.isCheck = false;
        this.load();
      }else{
        this.service.message.error(success.message);
      }
    })
  }

  // get_list(rest?){
  //   if(rest){
  //     this.service.post('/api/system/mailtemplate/pagequery',{pageSize:10,pageNum:1,searchText:rest}).then(success => {
  //       if(success.code==0){
  //         this.mail_template = success.data.rows;
  //         this.param.total = success.data.total;
  //       }else{
  //         this.mail_template = [];
  //         this.param.total = 0;
  //         this.service.message.error(success.message);
  //       }
  //     })
  //   }
  // }

  
  //新增
  add(){
    this.isCheck = true;
    this.isTitle = '新增邮件';
  } 
  // 发送
  send(data){
    this._loading = true;
    // /api/busiz/mailemail/mass/email
    this.service.post('/api/busiz/mailemail/mass/email',{id:data.id}).then(success => {
      this._loading = false;
      if(success.code==0){
        this.load();
        this.service.message.success(success.message);
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  // 修改
  edit(data){
    this.selRow = {};
    this.isCheck = true;
    this.isTitle = '修改邮件';
    this.selRow = {...data}
    this.editor.txt.html(this.selRow.mail_content);
  }
  // 删除
  del(data){
    this.service.post('/api/busiz/mailemail/delete',{ids:[data.id]}).then(success => {
      if(success.code==0){
        this.load();
        this.service.message.success(success.message);
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  // 可以多行删除
  delRows(){
    let ids = [];
    this.data.filter(value => value.checked).forEach(item => { ids.push(item.id) });
    this.service.post('/api/busiz/mailemail/delete',{ids:ids}).then(success => {
      if(success.code==0){
        this.load();
        this.service.message.success(success.message);
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  // 查看
  showSelRow : any = {}
  show(data){
    this.isShow = true;
    this.isTitle = '邮件详情';
    this.showSelRow = {...data};
    // this.editor.txt.html(this.showSelRow.mail_content);
  }
  // 
  ngOnInit() {
    this.myForm = this.service.fb.group({
      mail_title:false,
      mail_template_id:false
    })

    // 获取邮件配置列表
    this.get_template();
    // 加载邮件列表
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

    editor:any
ngAfterViewInit(){
  this.editor = new wangEditor('#editor');
  this.editor.customConfig.uploadImgShowBase64 = true;
  this.editor.create();
  this.editor.txt.clear();
  // if(this.now_num == 1){
  //   this.editor.txt.html('<p >【题干】</p><p >【答案】</p><p >【解析】</p>');
  // }else if(this.now_num == 2){
  //   this.editor.txt.html('<p >【题干】</p>'+this.now_data.title+'<p >【答案】</p>'+this.now_data.analysis+'<p >【解析】</p>'+this.now_data.parsing);
  // }

}
}
