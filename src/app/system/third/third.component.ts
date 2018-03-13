import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay',
  templateUrl: './third.component.html',
  styleUrls: ['./third.component.css']
})
export class ThirdComponent implements OnInit {

  tableData: any = []; //数据列表
  _loading: boolean = true;
  // 实例化一个对象
  constructor(public routerInfo: ActivatedRoute, private service: AppService, private router: Router) { }
  //表单
  myForm: FormGroup;
  formBean: any = {
    access_token_url: null,    //获取token路径
    app_id: null,              //appid
    authorize_url: null,       //授权路径
    base_url: null,            //基础路径	
    create_time: null,         //rsa秘钥
    name: null,                //配置名称
    redirect_url: null,        //重定向路径
  }
  isVisibleMiddle: boolean = false;
  formTitle: string;

  param: any = {
    pageSize: 10,
    pageNum: 1,
    total: 0
  }
  ngOnInit() {
    this.reload();
    this.myForm = this.service.fb.group({
      access_token_url: false,
      app_id: false,
      authorize_url: false,
      base_url: false,
      create_time: false,
      name: false,
      redirect_url: false,
    })
  }
  //打开
  showModalMiddle(bean?: any) {
    this.formBean = {};
    if (bean) {
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
      this.formBean.formTitle = "修改机构";
    }
    else {
      this.formBean.formTitle = "新增机构";
    }
    this.formBean.isVisibleMiddle = true;
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

  //提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      this.service.post("/api/system/sologinset/getlist", this.formBean).then(success => {
        if (success.code == 0) {
          this.isVisibleMiddle = false;
          this.myForm.reset();
          this.reload();
        }
        else {
          this.service.message.error(success.message);
        }
      })
    }
  }
  //重新查询
  reload() {
    this._loading = true;
    this.service.post('/api/system/sologinset/getlist', this.param).then(success => {
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
