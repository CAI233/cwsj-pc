import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-cw-analysis',
  templateUrl: './cw-analysis.component.html',
  styleUrls: ['./cw-analysis.component.css']
})
export class CwAnalysisComponent implements OnInit {
  param: object ={
    total: 0,
    pageSize: 10,
    pageNum: 1,
    pages: 0
  }
  _loading: boolean = false;
  isVisibleMiddle: boolean = false;
  tableData: any = [];
  formBean: any = {
    task_id: null,
    task_name: null,
    task_url: null
  }
  myForm: any;
  constructor(public service: AppService) { }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      task_name: [null, [this.service.validators.required]],
      task_url: [null, [this.service.validators.required]]
    });
    this._reload();
  }
  //创建任务
  _cwAnalysisAdd(){
    this.isVisibleMiddle = true;

  }
  //提交任务
  _submitForm(){
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if(!this.myForm.valid){
      return false;
    }
    console.log(this.formBean)
  }
  //取消编辑
  _cancelMiddle(){
    this.isVisibleMiddle = false;
  }
  //提交编辑
  _okMiddle(){
    this._submitForm();
  }
  //刷新列表
  _reload(event?: any){
    console.log(this.param)
    this._loading = true;
    this.tableData = [{
      task_name: '第一批内容',
      task_url: '/2018/03/28',
      create_time: '2018-03-28',
      state: 1, //1 未解析  2解析中  3解析完成 4解析失败
      success_num: 0,
      error_num: 0
    },{
      task_name: '第一批内容',
      task_url: '/2018/03/28',
      create_time: '2018-03-28',
      state: 2, //1 未解析  2解析中  3解析完成 4解析失败
      success_num: 18988,
      error_num: 7
    },{
      task_name: '第一批内容',
      task_url: '/2018/03/28',
      create_time: '2018-03-28',
      state: 3, //1 未解析  2解析中  3解析完成 4解析失败
      success_num: 18988,
      error_num: 7
    },{
      task_name: '第一批内容',
      task_url: '/2018/03/28',
      create_time: '2018-03-28',
      state: 4, //1 未解析  2解析中  3解析完成 4解析失败
      success_num: 0,
      error_num: 0
    }];
    this._loading = false;
  }
}
