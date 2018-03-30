import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cw-res-list',
  templateUrl: './cw-res-list.component.html',
  styleUrls: ['./cw-res-list.component.css']
})
export class CwResListComponent implements OnInit {

  param = {
    searchText: null,
    pageNum: 1,
    pageSize: 10,
    searchTime: null,
    res_class_id: null,
    res_tag_id: null,
    res_type: null,
    total: 0,
    pages: 0
  }
  paramCol = {
    searchText: null,
    searchTime: null,
    res_class_id: null,
    res_type: null
  }
  isCollapse: boolean = false;
  _loading: boolean = false;
  _upload: boolean = false;
  tableData: any = [];
  resClassList: any = []; //分类
  resTypeList: any = []; //标签

  _allChecked = false; //全选
  _indeterminate = false; //半选
  constructor(public service: AppService) { }

  ngOnInit() {
    this._getResClass();
    this._searchChange();
    this._reload();
  }
  //获取分类
  _getResClass() {
    this.service.post('/api/busiz/cat/list', {}).then(success => {
      this.service._toisLeaf(success.data);
      this.resClassList = success.data;
    })
  }
  //获取资源类型
  _searchChange(event?) {
    this.service.post('/api/busiz/res/type/getlist', {}).then(success => {
      this.resTypeList = success.data;
    })
  }
  //查询
  _reload(event?) {
    if (event) {
      for (let i in this.paramCol) {
        this.param[i] = this.paramCol[i];
      }
      if (this.paramCol['res_class_ids']) {
        this.param['res_class_id'] = this.paramCol['res_class_ids'][this.paramCol['res_class_ids'].length - 1]
      }
      else {
        this.param['res_class_id'] = null;
      }
      if (this.paramCol.searchTime) {
        this.param['upload_start'] = this.service.dateFormat(this.paramCol.searchTime[0], 'yyyy-MM-dd');
        this.param['upload_end'] = this.service.dateFormat(this.paramCol.searchTime[1], 'yyyy-MM-dd');
      }
      else {
        this.param['upload_start'] = null;
        this.param['upload_end'] = null;
      }
      this.param['searchTime'] = null;
      this.param['res_class_ids'] = null;
      this.param.pageNum = 1;
    }
    this.service.post('/api/busiz/res/getlist', this.param).then(success => {
      this.tableData = success.data.rows;
      this.param.total = success.data.total;
      this.param.pages = success.data.pages;
    })
  }
  //全选
  _checkAll(value) {
    if (value) {
      this.tableData.forEach(data => {
        if (!data.disabled) {
          data.checked = true;
        }
      });
    } else {
      this.tableData.forEach(data => data.checked = false);
    }
    this._refreshStatus();
  }
  //半选
  _refreshStatus() {
    const allChecked = this.tableData.every(value => value.disabled || value.checked);
    const allUnChecked = this.tableData.every(value => value.disabled || !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }
  //重置
  _resetForm(){

  }
}
