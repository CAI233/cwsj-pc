import { Component, OnInit } from '@angular/core';

import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-message',
  templateUrl: './phonemessage.component.html',
  styleUrls: ['./phonemessage.component.css']
})
export class PhonemessageComponent implements OnInit {


  _allChecked = false;
  _indeterminate = false;
  _displayData = [];
  isVisibleMiddle: boolean = false;
  myForm: FormGroup;

  param: any = {
    pageSize:10,
    pageNum:1,
    searchText:null
  }

  data :any = [];
  yun_data :any = [];

  editRow :any = null;
  _loading: boolean = true;
  // tempEditObject :any = {};


  constructor(private service: AppService) { }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      test: false,
      num:false
    })

    this.load();
    // 加载云片apikey
    this.load_yun();
  }

  //加载短信模板列表
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/system/msgtpl/getlist',this.param).then(success => {
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
  load_yun(){
    this.service.post('/api/system/msgset/yunpianlist').then(success => {
      console.log(success)
      this.yun_data = success.data;
    })
  }


  //阿里模块新增
  add(){
    this.isVisibleMiddle = true;
  }
  // 云片模块新增
  Yunadd(data){
    this.service.post('/api/system/msgtpl/yunpian/getmsgtpl',{apikey:data}).then(success => {
      this.load();
    })
  }

  // 修改操作
  edit(data) {
    this.editRow = data.id;
  }

  // 修改后保存
  save(data){
    if (!data.tpl_id) {
      this.service.message.error('请填写模板名称');
      return false;
    }
    if (!data.tpl_content) {
          this.service.message.error('请填写模板名称');
          return false;
    }
    if(data.flag==1){
      this.service.post('/api/system/msgtpl/yunpian/getmsgtpl',{apikey:data,tpl_id:data.tpl_id,tpl_content:data.tpl_content,id:data.id}).then(success => {
        this.editRow = null;
        this.load();
      })
    }else{
      this.service.post('/api/system/msgtpl/save',{tpl_id:data.tpl_id,tpl_content:data.tpl_content,id:data.id}).then(success => {
        this.editRow = null;
        this.load();
      })
    }

  }

  // 取消操作
  cancel(data) {
    this.editRow = null;
    this.load();
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
    if (!this.param.tpl_id) {
      this.service.message.error('请填写模板编码');
      return false;
    }
    if (!this.param.tpl_content) {
      this.service.message.error('请填写模板名称');
      return false;
    }
    this.service.post('/api/system/msgtpl/save',{tpl_id:this.param.tpl_id,tpl_content:this.param.tpl_content}).then(success => {
      this.isVisibleMiddle = false;
      this.myForm.reset();
      this.load();
    })
  }

  //删除操作
  del(data){
    this.service.post('/api/system/msgtpl/del',{id:data.id}).then(success => {
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
