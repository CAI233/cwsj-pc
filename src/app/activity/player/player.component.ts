import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
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
    pageNum: 1,
    vote_id: parseInt(this.routerInfo.snapshot.params['id']),
  };
  _loading: boolean = true;

  // 实例化一个对象
  constructor(private routerInfo: ActivatedRoute, public service: AppService, private router: Router) { }

  //跳转到选手投票用户页面
  routerJump(id) {
    this.router.navigate(['activity/votemember', id]);
  }
  //表单
  myForm: FormGroup;
  formBean: any = {
    formTitle: '新增选手',
    isVisibleMiddle: false,
    contestant_name: null,
    phone: null,
    card: null,
    contestant_ims: null,
    cover: null,
    remark: null,
  };
  activitySelect: any = [];
  ngOnInit() {
    console.log(this.param.vote_id)
    this.service.post('/api/system/vote/manage/list', { pageNum: 1, pageSize: 1000 }).then(success => {
      if (success.code == 0) {
        this.activitySelect = success.data.rows;
        if (!this.param.vote_id || this.param.vote_id == ':id') {
          this.param.vote_id = this.activitySelect[0].vote_id;
        }
        this.reload();
      } else {
        this.service.message.error(success.messaage)
      }
    })
    this.myForm = this.service.fb.group({
      contestant_name: [null, [this.service.validators.required]],
      phone: [null, [this.service.validators.required]],
      card: [null, [this.service.validators.required]],
      contestant_ims: false,
      remark: false,
      cover: false,
    })
  }
  //文件上传
  fileUpload(info): void {
    if (info.file.response && info.file.response.code == 0) {
      this.formBean.cover = info.file.response.data[0].url;
    }
  }
  //打开
  showModalMiddle(bean?: any) {
    this.formBean = {};
    if (bean) {
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }

      this.formBean.formTitle = "编辑选手";
    }
    else {
      this.formBean.formTitle = "新增选手";
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
      if (!this.formBean.cover || this.formBean.cover === '') {
        this.service.message.error('请上传照片');
        return false;
      }
      if (!this.formBean.remark || this.formBean.remark === '') {
        this.service.message.error('请填写个人简介');
        return false;
      }
      this.formBean.vote_id = this.param.vote_id
      this.service.post('/api/system/vote/contestant/save', this.formBean).then(success => {
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

      this.formBean.formTitle = '编辑选手';
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
      this.tableData.filter(value => value.checked).forEach(item => { ids.push(item.id) })
      this.service.post('/api/system/vote/contestant/del', {
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
    this.service.post('/api/system/vote/contestant/del', {
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
    }
    this._loading = true;
    this.service.post('/api/system/vote/contestant/list', this.param).then(success => {
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
  //批量审核
  _audits() {
    if (this.tableData.filter(value => value.checked).length < 1) {
      this.service.message.warning('你没有选择需要审核的数据内容!');
    } else {
      let ids = [];
      this.tableData.filter(value => value.checked).forEach(item => { ids.push(item.id) })
      this.service.post('/api/system/vote/contestant/enabled', { ids: ids }).then(success => {
        if (success.code == 0) {
          this.reload();
        } else {
          this.service.message.error(success.message)
        }
      })
    }
  }
  //审核
  _audit(id) {
    this.service.post('/api/system/vote/contestant/enabled', { ids: [id] }).then(success => {
      if (success.code == 0) {
        this.reload();
      } else {
        this.service.message.error(success.message)
      }
    })
  }

  //锁定
  _lock(id, is_lock) {
    is_lock = is_lock == 1 ? 2 : 1,
      this.service.post('/api/system/vote/contestant/lock', { ids: [id], is_lock: is_lock }).then(success => {
        if (success.code == 0) {
          this.reload();
        } else {
          this.service.message.error(success.message)
        }
      })
  }

  //导出排行榜
  _export() {
    this.service.get('/api/system/vote/export?vote_id=' + this.param.vote_id);
  }
}
