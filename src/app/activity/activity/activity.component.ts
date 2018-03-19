import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],

})
export class ActivityComponent implements OnInit {
  _allChecked = false;
  _indeterminate = false;
  tableData: any = []; //数据列表
  //ckeditor配置
  config: any = {
    width: '100%',
    toolbar: 'MyToolbar',
    toolbar_MyToolbar:
      [
        { name: 'clipboard', items: ['Undo', 'Redo', '-'] },
        { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
        { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
        { name: 'tools', items: ['Maximize'] },
        { name: 'document', items: ['Source'] },
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', 'RemoveFormat', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Algin', 'Outdent', 'Indent'] },
        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
      ]
  }
  param: any = {
    org_id: null,
    searchText: null,
    total: 0,
    pageSize: 10,
    pageNum: 1
  };
  paramCol: any = {
    begin_time: null,
    end_time: null
  }
  _loading: boolean = true;

  // 实例化一个对象
  constructor(private service: AppService) { }
  //表单
  myForm: FormGroup;
  formBean: any = {
    formTitle: '新增活动',
    isVisibleMiddle: false,
    vote_img: null,
    vote_remark: null,
    vote_role: null,
    vote_name: null,
    begin_time: null,
    end_time: null,

  };
  ngOnInit() {
    this.reload();
    this.myForm = this.service.fb.group({
      vote_name: [null, [this.service.validators.required]],
      begin_time: [null, [this.service.validators.required]],
      end_time: [null, [this.service.validators.required]],
      vote_img: false,
      vote_remark: [null, [this.service.validators.required]],
      vote_role: false,
    })
  }
  //文件上传
  fileUpload(info): void {
    if (info.file.response && info.file.response.code == 0) {
      this.formBean.vote_img = info.file.response.data[0].url;
    }
  }
  //打开
  showModalMiddle(bean?: any) {
    this.formBean = {};
    if (bean) {
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
    
      this.formBean.formTitle = "编辑活动";
    }
    else {
      this.formBean.formTitle = "新增活动";
      this.formBean.begin_time = null;
      this.formBean.end_time = null;
    }
    this.formBean.isVisibleMiddle = true;
  };
  //关闭
  handleCancelMiddle($event) {
    this.formBean.isVisibleMiddle = false;
    this.formClear()
  }
  //确定
  handleOkMiddle($event) {
    this._submitForm();
  }
  formClear() {
    this.myForm.reset();
  }
  //提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      if (!this.formBean.vote_role || this.formBean.vote_role === '') {
        this.service.message.error('请填写活动规则');
        return false;
      }
      this.service.post('/api/system/vote/manage/save', this.formBean).then(success => {
        if (success.code == 0) {
          this.formBean.isVisibleMiddle = false;
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

      console.log(this.formBean)
      this.formBean.formTitle = '编辑活动';
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
      this.tableData.filter(value => value.checked).forEach(item => { ids.push(item.vote_id) })
      this.service.post('/api/system/vote/manage/del', {
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
  _delete(id) {
    this.service.post('/api/system/vote/manage/del', {
      ids: [id], mark: 'del'
    }).then(success => {
      if (success.code == 0) {
        this.reload();
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }
  //重新查询
  reload(reset?: any) {
    if (reset == true) {
      this.param.pageNum = 1;
      // this.param.begin_time = this.paramCol.searchTime[0];
      // this.param.end_time = this.paramCol.searchTime[1];
    }
    this._loading = true;
    this.service.post('/api/system/vote/manage/list', this.param).then(success => {
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
