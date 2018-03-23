import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-cwsj-brand',
  templateUrl: './cwsj-brand.component.html',
  styleUrls: ['./cwsj-brand.component.css']
})
export class CwsjBrandComponent implements OnInit {
  _allChecked = false;
  _indeterminate = false;
  tableData: any = []; //数据列表
  param: any = {
    searchText: null,
    total: 0,
    pageSize: 10,
    pageNum: 1
  };
  _loading: boolean = true;
  // 实例化一个对象
  constructor( public service: AppService) { }

  //表单
  myForm: any;
  formBean: any = {
    formTitle: '新增品牌',
    isVisibleMiddle: false,
    brand_id: null,
    brand_name: null,
    remark: null
  };
  ngOnInit() {
    this.reload();
    this.myForm = this.service.fb.group({
      brand_name: [null, [this.service.validators.required]],
      remark: [false]
    })
  }
  //打开
  showModalMiddle(bean?: any) {
    this.formBean = {};
    if (bean) {
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
      this.formBean.formTitle = "修改品牌";
    }
    else {
      this.formBean.formTitle = "新增品牌";
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
      this.service.post('/api/busiz/brand/save', this.formBean).then(success => {
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
      this.formBean.formTitle = '修改品牌';
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
      this.tableData.filter(value => value.checked).forEach(item => { ids.push(item.brand_id) })
      this.service.post('/api/busiz/brand/del', {
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
  reload(reset?) {
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/brand/getlist', this.param).then(success => {
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
  

}
