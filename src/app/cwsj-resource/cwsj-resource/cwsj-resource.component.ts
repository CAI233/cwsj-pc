import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service'
@Component({
  selector: 'app-cwsj-resource',
  templateUrl: './cwsj-resource.component.html',
  styleUrls: ['./cwsj-resource.component.css']
})
export class CwsjResourceComponent implements OnInit {
  isCollapse = true;
  userState: any;
  param: any = {
    dept_id: null,
    enabled: null,
    searchText: null,
    sort_name: null,
    sort_rule: null,
    total: 0,
    pageSize: 10,
    pageNum: 1
  };
  paramCol: any = {
    searchTime: null,
    dept_id: null,
    enabled: null,
    searchText: null,
    org_id: this.service.loginUserInfo ? this.service.loginUserInfo.org_id : null
  }
  proList: any = []; //专业
  depthList: any = []; //深度
  purposeList: any = [];//目的
  // 实例化一个对象
  constructor(public service: AppService) { }

  ngOnInit() {
    //获取专业
    this.service.post('/api/busiz/tag/prolist').then(success => {
      this.proList = success.data.rows;
    })
    //获取深度
    this.service.post('/api/busiz/tag/depthlist').then(success => {
      this.depthList = success.data.rows;
    })
    //获取目的
    this.service.post('/api/busiz/tag/purposelist').then(success => {
      this.purposeList = success.data.rows;
    })
    
    this.reload();

    this.myForm = this.service.fb.group({
      user_name: [null, [this.service.validators.required]],
      user_pwd: [null, [this.service.validators.required]],
      role_id: [null, [this.service.validators.required]],
      dept_idss: [null, [this.service.validators.required]],
      user_real_name: false,
      icon: [false],
      user_id: [false],
      email: [false],
      phone: [false]
    });
  }
  

  /**************************表单部分*************************/
  myForm: any;
  formBean: any = {
    user_name: null,
    user_pwd: null,
    user_real_name: null,
    dept_idss: null,
    role_idss: null,
    icon: null,
    user_id: null,
    email: null,
    phone: null
  };
  //表单提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      this.formBean.dept_ids_array = [];
      this.formBean.dept_idss.forEach(element => {
        if (typeof (element) == 'object') {
          this.formBean.dept_ids_array.push(element.dept_id);
        }
        else {
          this.formBean.dept_ids_array.push(element);
        }
      });
      this.formBean.role_names = [];
      this.formBean.role_ids_array = [];
   
      this.formBean.role_names = this.formBean.role_names.toString();
      this.service.post('/api/system/user/save', this.formBean).then(success => {
        if (success.code == 0) {
          this.isVisibleMiddle = false;
          this.formClear();
          this.reload();
        }
        else {
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
  showModalMiddle(bean?: any) {
    this.formBean = {}
    if (bean) {
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
      //部门
      if (this.formBean.dept_ids_array) {
        this.formBean.dept_idss = [];
        this.formBean.dept_ids_array.forEach((element, index) => {
          this.formBean.dept_idss.push({ dept_id: element, dept_name: this.formBean.dept_names.split(',')[index] })
        });
      }
      //角色
      if (this.formBean.role_ids_array) {
        this.formBean.role_idss = this.formBean.role_ids_array;
      }
      this.formBean.user_pwd = "123456";
      this.formTitle = "修改用户";
    }
    else {
      this.formTitle = "新增用户";
      this.formBean.org_id = this.paramCol.org_id
    }
    this.isVisibleMiddle = true;
  };
  //删除
  _delete(id) {
    this.service.post('/api/system/user/delete', { ids: [id] }).then(success => {
      if (success.code == 0) {
        this.reload();
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }

  //关闭
  handleCancelMiddle($event) {
    this.isVisibleMiddle = false;
    this.formClear();
  }
  //确定
  handleOkMiddle($event) {
    this._submitForm();
  }
  formClear() {
    this.myForm.reset();

  }
  /**************************表单部分*************************/

  /**************************表格部分*************************/
  _allChecked = false; //全选
  _indeterminate = false; //半选
  tableData: any = []; //数据列表
  sortMap = { //允许排序的字段
    create_time: null,
    enabled: null
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
    if (value) {
      this.param.sort_name = name;
      this.param.sort_rule = value == 'ascend' ? 'asc' : 'desc';
    }
    else {
      this.param.sort_name = null;
      this.param.sort_rule = null;
    }
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
  reload(reset?: any) {
    if (reset == true) {
      this.param.pageNum = 1;
      this.param.searchText = this.paramCol.searchText;
      this.param.enabled = this.paramCol.enabled;
      this.param.dept_id = this.paramCol.dept_id && this.paramCol.dept_id.length != 0 ? this.paramCol.dept_id[this.paramCol.dept_id.length - 1].toString() : null;
      this.param.org_id = this.paramCol.org_id;
    }
    this._loading = true;
    this.service.post('/api/busiz/res/getlist', this.param).then(success => {
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
    this.paramCol.searchText = null;
    this.paramCol.dept_id = [];
    this.paramCol.enabled = null;

  }

}
