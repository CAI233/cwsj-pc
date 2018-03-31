import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


declare let wangEditor: any
@Component({
  selector: 'app-cw-works-list',
  templateUrl: './cw-works-list.component.html',
  styleUrls: ['./cw-works-list.component.css']
})
export class CwWorksListComponent implements OnInit {
  @ViewChild("nzTabAdd") nzTabAdd;
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
  paramCol: any = {
    dept_id: null,
    state: null,
    date: null,
    searchText: null
  }
  sortMap = {
    org_name: null,
    org_code: null
  };
  isCollapse: any = true;
  _loading: boolean = true;
  //省 市 区 街 
  _address: any;

  // 实例化一个对象
  constructor(public service: AppService) { }
  //表单
  myForm: FormGroup;
  formTitle: string;
  isVisibleMiddle: boolean = false;
  selectedIndex: number = 0;
  formBean: any = {
    role_id: null,
    role_idss: null,
    email: null,
    phone: null,
    vote_role: null,
  };
  ngOnInit() {
    this.reload();
    this.myForm = this.service.fb.group({
      org_name: [null, [this.service.validators.required]],
      org_code: [null, [this.service.validators.required]],
      streetParent: [null, [this.service.validators.required]],
      office_address: [null, [this.service.validators.required]],
      link_man: [null, [this.service.validators.required]],
      link_mobile: [null, [this.service.validators.required]],
      auth_date_begin: [null, [this.service.validators.required]],
      auth_date_end: [null, [this.service.validators.required]],
      remark: [false],
      time: [false],
      phone: [false],
      works_name: [false],
      vote_role: [false],
      email: [false],
      role_id: [false]
    })
  }
  _initEditor() {
    setTimeout(time => {
      var editor = new wangEditor('#editor');
      editor.customConfig.uploadImgShowBase64 = true;
      editor.create();
      editor.txt.html(this.formBean.works_remark);
      // editor.txt.clear();
      // editor.txt.append('<p>追加的内容</p>');
      // console.log(editor.txt.html())
      // console.log(editor.txt.text())
    })
  }

  loadData(e: { option: any, index: number, resolve: Function, reject: Function }): void {
    if (e.index === -1) {
      this.service.post('/api/system/region/list/tree', {
        code: null
      }).then(success => {
        e.resolve(success.data);
      })
      return;
    }
    const option = e.option;
    option.loading = true;
    this.service.post('/api/system/region/list/tree', {
      code: option.code
    }).then(success => {
      option.loading = false;
      if (e.index == 2)
        success.data.forEach(element => element.isLeaf = true);
      e.resolve(success.data);
    })
  }
  //打开
  showModalMiddle(bean?: any) {
    this.formBean = {};
    if (bean) {
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
      this.formTitle = "修改作品";
    }
    else {
      this.formTitle = "新增作品";
    }
    this.isVisibleMiddle = true;
    this.selectedIndex = 1;
    this._initEditor();
  };

  //关闭
  handleCancelMiddle($event) {
    this.isVisibleMiddle = false;
    this.formClear()
  }
  //确定
  handleOkMiddle($event) {
    this._submitForm();
  }
  formClear() {
    this.myForm.reset();
  }
  //关闭tab
  closeTab() {
    this.isVisibleMiddle = false;
    this.selectedIndex = 0;
  }
  //提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      this.service.post('//api/busiz/video/save', this.formBean).then(success => {
        if (success.code == 0) {
          this.isVisibleMiddle = false;
          this.formClear()
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
      let bean = this.tableData.filter(value => value.checked)[0];
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
      //地理组织
      this.formBean.streetParent = [{
        code: bean.province_code,
        region_name: bean.province
      }, {
        code: bean.city_code,
        region_name: bean.city
      }, {
        code: bean.area_code,
        region_name: bean.area
      }, {
        code: bean.street_code,
        region_name: bean.street
      }];
      console.log(this.formBean)
      this.formTitle = '修改机构';
      this.isVisibleMiddle = true;
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
      this.service.post('/api/busiz/video/delete', {
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
  reload(reset?: any) {
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/works/list', this.param).then(success => {
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

  //状态
  _enabled(data) {
    if (this.service.validataAction('cw_train_list_enable')) {
      data.enabled = data.enabled == 1 ? 2 : 1;
      this.service.post('/api/system/organization/setEnabled', {
        ids: [data.org_id],
        enabled: data.enabled
      }).then(success => {
        this.reload();
      })
    }
  }

}
