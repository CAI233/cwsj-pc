import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let wangEditor: any;

@Component({
  selector: 'app-cw-msg-qa',
  templateUrl: './cw-msg-qa.component.html',
  styleUrls: ['./cw-msg-qa.component.css']
})
export class CwMsgQaComponent implements OnInit {

  _allChecked: boolean = false;
  _indeterminate: boolean = false;
  _loading: boolean = true;
  isVisibleMiddle : boolean = false;
  isSanswer : boolean = false;
  isCollapse : any = true;
  param: any = {
    pageSize: 10,
    pageNum: 1
  }
  paramCol : any ={
    time:[null,null]
  }
  myForm: FormGroup;
  status : any = [{"name":"未回答","id":1},{"name":"已回答","id":2},{"name":"超时","id":3},{"name":"拒绝回答","id":4}];
  data : any = [];//问答列表
  selRow : any = {};//当前提问对象

  constructor(public service: AppService) { }

  // 加载问答list
  load(reset?) {
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/problem/list', this.param).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.data = success.data.rows;
        this.param.total = success.data.total;
      } else {
        this.data = [];
        this.param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }

  reload(rest ?){
    if(this.paramCol.time[0]){
      this.param.start_time = this.timeOut(this.paramCol.time[0]);
    }
    if(this.paramCol.time[1]){
      this.param.end_time = this.timeOut(this.paramCol.time[1]);
    }
    this.load();
  }
  resetForm(){
    this.param = {
      pageSize: 10,
      pageNum: 1
    }
    this.param.searchText = null;
    this.paramCol.time = [null,null];
    this.param.status = null;
    this.load();
  }

  //回答
  Yanswer(data){
    this.isVisibleMiddle = true;
    this.selRow = {...data};
  }

  // 拒绝回答
  Nanswer(data){
    this.selRow.status = 4;
    this.selRow.id = data.id;
    this.answer();
  }
  // 查看
  Sanswer(data){
    this.selRow = {};
    this.isSanswer = true;
    this.selRow = {...data}
  }
  // 取消查看
  SanswerCancel($event){
    this.isSanswer = false;

  }
  //关闭弹窗
  handleCancelMiddle($event) {
    this.isVisibleMiddle = false;
    this.isSanswer = false;
    this.myForm.reset();
  }

  //确定
  handleOkMiddle($event) {
    this.selRow.status = 2;
    this.selRow.answer = this.editor.txt.html();
 
    this.answer();
  }

  // 回答或拒绝回答
  answer(){
    let obj ={
      id:this.selRow.id,
      status:this.selRow.status,
      answer:this.selRow.answer
    }
    this.service.post('/api/busiz/problem/update',obj).then(success => {
      if (success.code == 0) {
        this.load();
        this.isVisibleMiddle = false;
      } else {
        this.service.message.error(success.message);
      }
    })
  }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      // nick_name:false,
      // create_time:false
    })
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
    this.editor.txt.html()
   
  }

  timeOut(d) {
    let m = new Date(d);
    let M, D, H, mm, ss;
    M = (m.getMonth() + 1) < 10 ? '0' + (m.getMonth() + 1) : (m.getMonth() + 1);
    D = m.getDate() < 10 ? '0' + m.getDate() : m.getDate();
    H = m.getHours() <10 ? '0'+m.getHours() : m.getHours();
    mm = m.getMinutes() <10 ? '0'+m.getMinutes() : m.getMinutes();
    ss = m.getSeconds() <10 ? '0'+m.getSeconds() : m.getSeconds();
    return m.getFullYear() + '-' + M + '-' + D + ' ' + H + ':' + mm + ':' + ss; 
  }

}
