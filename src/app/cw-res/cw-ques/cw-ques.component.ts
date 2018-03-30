
import { Component, OnInit } from '@angular/core';

import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';


@Component({
  selector: 'app-cw-ques',
  templateUrl: './cw-ques.component.html',
  styleUrls: ['./cw-ques.component.css']
})
export class CwQuesComponent implements OnInit {

  _allChecked = false;
  _indeterminate = false;
  param :any = {
    pageNum:1,
    pageSize:10
  }

  typeData : any = [{id:1,type_name:'单选题'},{id:2,type_name:'多选题'},{id:3,type_name:'判断题'}]
  myForm: FormGroup;
  data : any = [];
  _loading: boolean = true;
  formTitle : string; 

  isList : boolean = false;//新增与修改
  isDetails : boolean = false;//详情

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
      ],
  }
  
  constructor(public service: AppService,public msg: NzMessageService) { }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      type: false,
      ananlyze:false,
      score:false,
      content:false
    })

    //加载数据
    this.load();

    // this.get_all();
  }

  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }

    this._loading = true;

    this.service.post('/api/busiz/question/getlist',this.param).then(success => {
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

  reload(rest ?){
    if(rest){
      
    }
  }

  //关闭弹窗
handleCancelMiddle($event) {
  this.isList = false;
  this.myForm.reset();
}

//确定
handleOkMiddle($event) {
  this._submitForm();
}

//新增
_addRows(){
  this.isList = true;
  this.formTitle = '新增试题'
  this.param.content = 'ce是地方大使馆'
}

_submitForm() {

  this.isList = false;
  this.myForm.reset();

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
