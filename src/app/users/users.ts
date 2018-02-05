import { Component, OnInit } from '@angular/core';
// 引入ActivatedRoute
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersPage implements OnInit {
  _allChecked = false;
  _indeterminate = false;
  tableData: any = []; //数据列表
  param: any = {
    dept_id: null,
    state: null,
    date: null,
    searchText: null,
    sortName: null,
    sortValue: null,
    total: 0,
    pageSize: 10,
    pageNum: 1
  };
  paramCol: any = {
    dept_id: null,
    state: null,
    date: null,
    searchText: null
  }
  deptList: any = []; //部门
  userState: any = []; //用户状态
  sortMap = {
    user_ream_name: null,
    user_name: null
  };
  _loading: boolean = true;
  // 实例化一个对象
  constructor(public routerInfo: ActivatedRoute, private service: AppService) { }

  ngOnInit() {
    // snapshot:路由快照信息
    // ["id"]里id与app.component.html的[queryParams]={id:1}名字得一样
    // this.id = this.routerInfo.snapshot.queryParams["id"];


    this.service.post('/admin/organization/getTree', {
      dept_id: null,
      org_id: this.service.loginUserInfo ? this.service.loginUserInfo.org_id : null,
      pageSize: 1000,
      searchText: null
    }).then(success => {
      this.deptList = success.data;
    })

    this.userState = [{
      id: 1,
      name: '启用'
    }, {
      id: 2,
      name: '停用'
    }];
    this.reload();
  }
  //设置状态
  set_state(item) {
    if (item) {
      this.param.state_id = item.id;
      this.param.state_name = item.name;
    }
    else {
      this.param.state_id = null;
      this.param.state_name = '全部';
    }
  }
  //清空form
  resetForm() {
    this.param.searchText = null;
    this.param.date = null;
    this.param.dept_id = null;
    this.param.state = null;
  }
  //重新查询
  reload(reset = false) {
    if (reset) {
      this.param.pageNum = 1;
      this.param.searchText = this.paramCol.searchText;
      this.param.date = this.paramCol.date;
      this.param.state = this.paramCol.state;
      this.param.dept_id = this.paramCol.dept_id ? this.paramCol.dept_id.toString() : null;
    }
    this._loading = true;
    this.service.post('/admin/user/listAll', this.param).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.tableData = success.data.rows;
        this.param.total = success.data.total;
      }
      else {
        this.tableData = [];
        this.param.total = 0;
        this.service.message.error(success.message);
      }
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
  _refreshStatus() {
    const allChecked = this.tableData.every(value => value.disabled || value.checked);
    const allUnChecked = this.tableData.every(value => value.disabled || !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }
  //排序
  sort(name, value) {
    this.param.sortName = name;
    this.param.sortValue = value;
    Object.keys(this.sortMap).forEach(key => {
      if (key !== name) {
        this.sortMap[key] = null;
      } else {
        this.sortMap[key] = value;
      }
    });
    this.reload();
  }
  //启用、停用
  enabledUser(data){
    data.enabled = data.enabled == 1? 2 : 1;
    console.log(data)
  }
}
