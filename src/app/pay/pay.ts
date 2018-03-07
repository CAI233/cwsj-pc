import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.html',
  styleUrls: ['./pay.css']
})
export class PayPage implements OnInit {
  tableData: any = []; //数据列表
  param: any = {
    total: 0,
    pageSize: 10,
    pageNum: 1
  };
  _loading: boolean = true;
  // 实例化一个对象
  constructor(public routerInfo: ActivatedRoute, private service: AppService, private router: Router) { }
  //表单
  myForm: FormGroup;
  formBean: any = {
    formTitle: '修改配置',
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
      streetParent: [null, [this.service.validators.required]],
      office_address: [null, [this.service.validators.required]],
      link_man: [null, [this.service.validators.required]],
      link_mobile: [null, [this.service.validators.required]],
      auth_date_begin: [null, [this.service.validators.required]],
      auth_date_end: [null, [this.service.validators.required]],
      remark: [false]
    })
  }
  
 
  //打开
  showModalMiddle(bean?:any) {
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
      let bean = this.tableData.filter(value => value.checked)[0];
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
      //地理组织
      this.formBean.streetParent = [{
        code: bean.province_code,
        region_name: bean.province
      },{
        code: bean.city_code,
        region_name: bean.city
      },{
        code: bean.area_code,
        region_name: bean.area
      },{
        code: bean.street_code,
        region_name: bean.street
      }];
      console.log(this.formBean)
      this.formBean.formTitle = '修改机构';
      this.formBean.isVisibleMiddle = true;
    }
  }

  //重新查询
  reload(reset = false) {
    if (reset) {
      this.param.pageNum = 1;
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

}
