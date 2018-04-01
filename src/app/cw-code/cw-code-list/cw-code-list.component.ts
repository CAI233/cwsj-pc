import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-cw-code-list',
  templateUrl: './cw-code-list.component.html',
  styleUrls: ['./cw-code-list.component.css']
})
export class CwCodeListComponent implements OnInit {
  paramCol: any = {
    searchText: null,
    tag_id: null
  }
  param: any = {
    pageNum: 1,
    pages: 0,
    pageSize: 16,
    total: 0
  }
  tagOptions: any = [];
  bookOptions: any = [];
  isVisible: boolean = false;
  tabs = [{
    active: true,
    name: '二维码列表',
    icon: 'anticon anticon-appstore'
  },
  {
    active: false,
    name: '二维码配置',
    icon: 'anticon anticon-qrcode'
  }];
  constructor(public service: AppService) { }

  ngOnInit() {
    this._reload();
    this.searchChange(null);
    this.searchChangeBook(null);
    this.myForm = this.service.fb.group({
      code_name: [null, [this.service.validators.required]],
      tag_ids: [null, [this.service.validators.required]],
      book_id: [null, [this.service.validators.required]],
      remark: [false]
    })
  }

  //标签搜索
  searchChange(key?) {
    this.service.post('/api/busiz/tag/list', {
      pageNum: 1,
      pageSize: 10,
      searchText: key
    }).then(success => {
      this.tagOptions = success.data.rows;
    })
  }
  //图书搜索
  searchChangeBook(key?) {
    this.service.post('/api/busiz/book/list', {
      pageNum: 1,
      pageSize: 10,
      searchText: key,
      book_type: 1
    }).then(success => {
      this.bookOptions = success.data.rows;
    })
  }
  formBean: any = {};
  myForm: any;
  _showIsVisible(data?) {
    if (data) {
      for (let i in data) {
        this.formBean[i] = data[i];
      }
      this.formBean['work'] = null;
      console.log(this.formBean)
    }
    this.isVisible = true;
  }
  handleCancel(e?) {
    this.isVisible = false;
    this.formBean = {};
  }
  //保存二维码
  handleOk(e?) {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      this.isVisible = false;
      if (typeof (this.formBean['tag_ids']) == "string")
        this.formBean['tag_ids'] = this.formBean['tag_ids'].split(',');
      console.log(this.formBean)
      this.formBean['publish'] = '崇文书局';
      this.service.post('/api/busiz/code/save', this.formBean).then(success => {
        if (success.code == 0) {
          this.formBean = {};
          this._reload();
        }
        else {
          this.service.message.error(success.message);
        }
      })
    }
  }
  tableData: any = [];
  //列表
  _reload(e?) {
    if (e) {
      for (let i in this.paramCol) {
        this.param[i] = this.paramCol[i];
      }
      this.param.pageNum = 1;
    }
    this.service.post('/api/busiz/code/list', this.param).then(success => {
      this.tableData = success.data.rows;
      this.param.total = success.data.total;
      this.param.pages = success.data.pages;
    })
  }
  //删除
  _delDataRow(row) {
    this.service.post('/api/busiz/code/del', {
      ids: [row.code_id]
    }).then(success => {
      if (success.code == 0) {
        this._reload();
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }
  //配置的二维码对象
  formBeanObject: any;
  nzSelectedIndex: number = 0;
  //配置对象
  _settingBean(data?){
    this.nzSelectedIndex = 1;
    this.formBeanObject = {};
    for(let i in data){
      this.formBeanObject[i] = data[i];
    }
  }
  //作品列表
  workTableData: any = [];
  isShowWorkAdd: boolean = false;
  _addWork(){
    this.isShowWorkAdd = true;
  }
  workCancel(e?){
    this.isShowWorkAdd = false;
  }
}
