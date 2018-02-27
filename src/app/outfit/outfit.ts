import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from '../app.service';
// import { divisions } from '../divisions-of-China/divisions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-outfit',
  templateUrl: './outfit.html',
  styleUrls: ['./outfit.css']
})
export class OutfitPage implements OnInit {
  _allChecked = false;
  _indeterminate = false;
  tableData: any = []; //数据列表
  param: any = {
    org_id: null,
    searchText: null,
    total: 0,
    pageSize: 10,
    pageNum: 1
  };
  _nzChange(e){
    console.log(e)
  }
  paramCol: any = {
    dept_id: null,
    state: null,
    date: null,
    searchText: null
  }
  sortMap = {
    org_name: null,
  };
  _loading: boolean = true;
  _address: any = [{
    code: 1,
    name: '武汉',
    children:[{
      code: 2,
      name: '阿斯顿的',
      isLeaf: true
    }]
  }]//divisions._divisions;
  // 实例化一个对象
  constructor(public routerInfo: ActivatedRoute, private service: AppService, private router: Router) { }
  //表单
  myForm: FormGroup;
  formBean: any = {
    formTitle: '新增机构',
    isVisibleMiddle: false,
    org_id: null,
    org_name: null,
    org_code: null,
    remark: null
  };
  ngOnInit() {
    this.reload();
    this.myForm = this.service.fb.group({
      org_name: [null, [this.service.validators.required]],
      org_code: [null, [this.service.validators.required]],
      remark: [false]
    })
  }
  //打开
  showModalMiddle(bean) {
    if (bean) {
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
      //部门
      if (this.formBean.dept_id) {
        this.formBean.dept_id = parseInt(this.formBean.dept_id);
      }
      if (this.formBean.org_id) {
        this.formBean.org_id = parseInt(this.formBean.org_id);
      }
      console.log(this.formBean)
      this.formBean.formTitle = "修改机构";
    }
    else {
      this.formBean.formTitle = "新增机构";
    }
    this.formBean.isVisibleMiddle = true;
  };
  //关闭
  handleCancelMiddle($event) {
    this.formBean.isVisibleMiddle = false;
    this.myForm.reset();
  }
  //确定
  handleOkMiddle($event) {
    this._submitForm();
  }
  //提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      this.service.post('/api/system/organization/save', this.formBean).then(success => {
        if (success.code == 0) {
          this.formBean.isVisibleMiddle = false;
          this.myForm.reset();
          this.reload();
        }
        else {
          this.service.message.error(success.message);
        }
      })
    }
  }
  //修改
  editModalMiddle() {
    if (this.tableData.filter(value => value.checked).length != 1) {
      this.service.message.warning('请选择修改数据，并且同时只能修改一条!');
    }
    else {
      let bean = this.tableData.filter(value => value.checked);
      for (let i in bean[0]) {
        this.formBean[i] = bean[0][i];
      }
      this.formBean.formTitle = '修改机构';
      this.formBean.isVisibleMiddle = true;
    }
  }
  //删除
  delRows() {
    if (this.tableData.filter(value => value.checked).length < 1) {
      this.service.message.warning('你没有选择需要删除的数据内容!');
    }
    else {
      let ids = [];
      this.tableData.filter(value => value.checked).forEach(item => { ids.push(item.org_id) })
      this.service.post('/api/system/organization/delete', {
        ids: ids, mark: 'del'
      }).then(success => {
        if (success.code == 0) {
          this.reload();
        }
        else {
          this.service.message.error(success.message);
        }
      })
    }
  }
  //重新查询
  reload(reset = false) {
    if (reset) {
      this.param.pageNum = 1;
      this.param.searchText = this.paramCol.searchText;
    }
    this._loading = true;
    this.service.post('/api/system/organization/getList', this.param).then(success => {
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
    if(value){
      this.param.sort_name = name;
      this.param.sort_rule = value == 'ascend' ? 'asc' : 'desc';
    }
    else{
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

  //状态
  _enabled(data){
    data.enabled = data.enabled == 1 ? 2 : 1;
    this.service.post('/api/system/organization/setEnabled', {
      org_ids: [data.org_id],
      enabled: data.enabled
    }).then(success => {
      this.reload();
    })
  }




}
