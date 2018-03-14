import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-smsconfigur',
  templateUrl: './smsconfigur.component.html',
  styleUrls: ['./smsconfigur.component.css']
})
export class SmsconfigurComponent implements OnInit {

  _allChecked = false;
  _indeterminate = false;
  _displayData = [];

  myForm: FormGroup;

  param :any = {};
  isVisibleMiddle :boolean = false;
  data :any = [];
  yun_data : any = [];
  editRow : any = null;

  constructor(private service: AppService) { }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      accesskeyid: false,
      accesskeysercet:false,
      apikey:false,
      name:false,
      sign_name:false
    })

    this.load();

    this.load_yun();
  }

  // 修改操作
  edit(data) {
    this.editRow = data.id;
  }

  // 取消操作
  cancel(data) {
    this.editRow = null;
    this.load();
  }

   //删除操作
   del(data){
    this.service.post('/api/system/msgset/del',{id:data.id}).then(success => {
      this.load();
    })
  }

  // 修改后保存
  save(data){
    let now_data = {
      id:data.id,
      flag:data.flag,
      accesskeyid:data.accesskeyid,
      accesskeysercet:data.accesskeysercet,
      apikey:data.apikey,
      sign_name:data.sign_name,
      name:data.name
    };
    if(data.flag==1){
      if(!data.apikey){
        this.service.message.error('请填写apikey');
        return false;
      }
      
    }else{
      if(!data.accesskeyid){
        this.service.message.error('请填写accesskeyid');
        return false;
      }
      if(!data.accesskeysercet){
        this.service.message.error('请填写accesskeysercet');
        return false;
      }
    }

    if (!data.name) {
      this.service.message.error('请填写name');
      return false;
    }
    if(!data.sign_name){
      this.service.message.error('请填写sign_name');
      return false;
    }
    this.service.post('/api/system/msgset/save',now_data).then(success => {
      this.editRow = null;
      this.load();
    })
  }
  

  //加载列表 
  load(){
    this.service.post('/api/system/msgset/list').then(success => {
        console.log(success);
        this.data = success.data;
    })
  }
  // 加载云片列表
  load_yun(){
    this.service.post('/api/system/msgset/yunpianlist').then(success => {
      console.log(success)
      this.yun_data = success.data;
    })
  }

  // 新增
  add(){
    this.isVisibleMiddle = true;
    this.param.flag = 2;

  }

  onckeck(){
    this.param = {};
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
    if(this.param.flag==1){
      if(!this.param.apikey){
        this.service.message.error('请填写apikey');
        return false;
      }
    }else{
      if(!this.param.accesskeyid){
        this.service.message.error('请填写accesskeyid');
        return false;
      }
      if(!this.param.accesskeysercet){
        this.service.message.error('请填写accesskeysercet');
        return false;
      }
    }

    if(!this.param.name){
      this.service.message.error('请填写name');
      return false;
    }
    if(!this.param.sign_name){
      this.service.message.error('请填写sign_name');
      return false;
    }
    
    this.service.post('/api/system/msgset/save',this.param).then(success => {
      this.isVisibleMiddle = false;
      this.myForm.reset();
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