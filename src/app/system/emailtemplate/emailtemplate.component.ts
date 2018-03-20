import { Component, OnInit } from '@angular/core';

import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.css']
})
export class EmailtemplateComponent implements OnInit {

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

  //ckeditor配置
  config: any = {
    width: '100%',
    toolbar: 'MyToolbar',
    toolbar_MyToolbar:
      [
        { name: 'clipboard', items: ['Undo', 'Redo', '-'] },
        { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
        { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
        { name: 'tools', items: ['Maximize'] },
        { name: 'document', items: ['Source'] },
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', 'RemoveFormat', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Algin', 'Outdent', 'Indent'] },
        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
      ]
  }


  constructor(private service: AppService) { }

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

  // 修改操作
  edit(data) {
    this.param.mail_template_id = data.mail_template_id;
    this.param.content = data.content;
    this.isVisibleMiddle = true;
  }


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



  
}
