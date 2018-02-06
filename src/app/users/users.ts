import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { retry } from 'rxjs/operators/retry';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersPage implements OnInit {
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
  roleList: any = []; //角色
  // 实例化一个对象
  constructor(private service: AppService) { }

  ngOnInit() {
    this.service.post('/admin/organization/getTree', {
      dept_id: null,
      org_id: this.service.loginUserInfo ? this.service.loginUserInfo.org_id : null,
      pageSize: 1000,
      searchText: null
    }).then(success => {
      this.deptList = success.data;
    })
    this.service.post('/admin/role/listAll',{
      pageNum: 1,
      pageSize: 1000,
      dept_id: null,
      org_id: this.service.loginUserInfo ? this.service.loginUserInfo.org_id : null,
      searchText: null
    }).then(success => {
      this.roleList = success.data.rows;
    })

    this.userState = [{
      id: 1,
      name: '启用'
    }, {
      id: 2,
      name: '停用'
    }];
    this.reload();

    this.myForm = this.service.fb.group({
      user_name: [null, [this.service.validators.required]],
      user_pwd: [null, [this.service.validators.required]],
      user_real_name: [null, [this.service.validators.required]],
      dept_name: [null, [this.service.validators.required]],
      role_name: [null, [this.service.validators.required]],
      email: [false],
      icon: [false],
      user_id: [false],
      phone: [false]
    });
  }


  /**************************表单部分*************************/
  myForm: any;
  formBean: any = {
    user_name: null,
    user_pwd: null,
    user_real_name: null,
    dept_name: null,
    role_name: null,
    email: null,
    phone: null,
    icon: null,
    user_id: null
  };
  //表单提交
  _submitForm() {
    console.log(this.formBean)
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      this.service.post('/admin/user/save', this.formBean).then(success => {
          if(success.code == 0){
            this.isVisibleMiddle = false;
            this.myForm.reset();
            this.reload();
          }
          else{
            this.service.message.error(success.message);
          }
      })
    }
  }
  //文件上传
  fileUpload(info): void {
    if (info.file.response && info.file.response.code == 0) {
      this.formBean.icon = info.file.response.data[0].url;
    }
  }
  //表单
  isVisibleMiddle: boolean = false;
  formTitle: string;
  //打开
  showModalMiddle(bean) {
    if (bean) {
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
      //部门
      if(this.formBean.dept_id){
        this.formBean.dept_id = parseInt(this.formBean.dept_id);
      }
      if(this.formBean.role_id){
        this.formBean.role_id = parseInt(this.formBean.role_id);
      }
      console.log(this.formBean)
      this.formTitle = "修改用户";
    }
    else {
      this.formTitle = "新增用户";
    }
    this.isVisibleMiddle = true;
  };
  //关闭
  handleCancelMiddle($event) {
    this.isVisibleMiddle = false;
    this.myForm.reset();
  }
  //确定
  handleOkMiddle($event) {
    this._submitForm();
  }
  /**************************表单部分*************************/

  /**************************表格部分*************************/
  _allChecked = false; //全选
  _indeterminate = false; //半选
  tableData: any = []; //数据列表
  sortMap = { //允许排序的字段
    user_ream_name: null,
    user_name: null
  };
  _loading: boolean = true; //loading 状态
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
  //查询列表数据
  reload(reset? : any) {
    if (reset == true) {
      this.param.pageNum = 1;
      this.param.searchText = this.paramCol.searchText;
      this.param.date = this.paramCol.date;
      this.param.state = this.paramCol.state;
      this.param.dept_id = this.paramCol.dept_id ? this.paramCol.dept_id.toString() : null;
    }
    else if(reset){
      this.param.pageNum = reset;
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
  /**************************表格部分*************************/

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
  //启用、停用
  enabledUser(data) {
    data.enabled = data.enabled == 1 ? 2 : 1;
    console.log(data)
  }

}
