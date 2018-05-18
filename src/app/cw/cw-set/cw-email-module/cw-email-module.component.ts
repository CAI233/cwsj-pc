import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
declare let wangEditor: any;
@Component({
  selector: 'app-cw-email-module',
  templateUrl: './cw-email-module.component.html',
  styleUrls: ['./cw-email-module.component.css']
})
export class CwEmailModuleComponent implements OnInit {
  _allChecked = false;
  _indeterminate = false;
  isVisibleMiddle: boolean = false;
  myForm: FormGroup;

  _loading: boolean = true;

  param : any = {
    pageSize:10,
    pageNum:1,
    total:0,
    searchText:null,
    content:null
  }
  data : any = [];


  constructor(public service: AppService,public msg: NzMessageService) { }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      test: false,
      num:false
    })

    this.load();
  }
  //加载邮件模板
  load(reset?: any){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/system/mailtemplate/pagequery',this.param).then(success => {
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
  // 新增操作
  add(){
    this.param.mail_template_id = null;
    this.param.content = null;
    this.isVisibleMiddle = true;

    this.ngAfterViewInit();
  }

  // 修改操作
  edit(data) {
    this.param.mail_template_id = data.mail_template_id;
    this.param.content = data.content;
    this.isVisibleMiddle = true;
    
    this.ngAfterViewInit();
  }
  //删除
  // del(data){
  //   let ids = [data.mail_template_id]
  //   this.service.post('/api/system/mailsetting/del',{ids:ids}).then(success => {
  //     if(success.code==0){
  //       this.load();
  //       this.service.message.success(success.message);
  //     }else{
  //       this.service.message.error(success.message);
  //     }
  //   })
  // }


//关闭弹窗
handleCancelMiddle($event) {
  this.isVisibleMiddle = false;
  this.myForm.reset();
}

//确定
handleOkMiddle($event) {
  this._submitForm();
}

_submitForm() {
  console.log(this.param)
  this.param.content = this.editor.txt.html();
  if(!this.param.mail_template_id){
    this.service.message.error('请填写模板编码');
    return false;
  }
  if(!this.param.content){
    this.service.message.error('请填写模板内容');
    return false;
  }
  this.service.post('/api/system/mailtemplate/update',{mail_template_id:this.param.mail_template_id,content:this.param.content}).then(success => {
    this.isVisibleMiddle = false;
    this.myForm.reset();
    this.load();
  })
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
 
  this.editor.txt.html(this.param.content);
  // this.editor.txt.html('<p>用 JS 设置的内容</p>');
  // editor.txt.append('<p>追加的内容</p>');
  // console.log(editor.txt.html())
  // console.log(editor.txt.text())
}

}
