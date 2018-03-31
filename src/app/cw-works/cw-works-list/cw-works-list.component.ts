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
  @ViewChild("cat_idss") cat_idss;
  @ViewChild("searchCatName") searchCatName;
  @ViewChild("searchTagName") searchTagName;
  @ViewChild("searchAuditName") searchAuditName;
  _allChecked = false;
  _indeterminate = false;
  tableData: any = []; //数据列表
  param: any = {
    searchText: null,
    total: 0,
    pageSize: 10,
    pageNum: 1,
  };
  paramCol: any = {
    works_type: null,
    audit_status: null,
    tag_id: null,
    cat_id: []
  }
  auditList: any = [{
    id: 1,
    name: '草稿'
  }, {
    id: 2,
    name: '待审核'
  }, {
    id: 3,
    name: '通过'
  }, {
    id: 4,
    name: '驳回'
  }]
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
    works_cover: null,
    works_name: null,
    works_cat_ids: null,
    works_type: null,
    discount: null,
    real_price: null,
    works_remark: null,
  };

  worksTagList: any; //作品标签
  ngOnInit() {
    //获取作品标签
    this.service.post('/api/busiz/works/tag/list', { pageSize: 1000, pageNum: 1 }).then(success => {
      if (success.code == 0)
        this.worksTagList = success.data.rows;
    })
    this.reload();
    this.myForm = this.service.fb.group({
      works_cover: false,
      works_name: [null, [this.service.validators.required]],
      works_cat_idss: [null, [this.service.validators.required]],
      works_type: [null, [this.service.validators.required]],
      tag_ids: [null, [this.service.validators.required]],
      price: [null, [this.service.validators.required]],
      discount: [null, [this.service.validators.required]],
      real_price: [null, [this.service.validators.required]],
      deadline: [null, [this.service.validators.required]],
      works_remark: false,
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

  loadCat(e: { option: any, index: number, resolve: Function, reject: Function }): void {
    if (e.index === -1) {
      this.service.post('/api/busiz/works/cat/list', {
        code: null
      }).then(success => {
        this.service._toisLeaf(success.data);
        e.resolve(success.data);

      })
      return;
    }
  }
  //打开
  showModalMiddle(bean?: any) {

    this.formBean = {};
    if (bean) {
      for (let i in bean) {
        this.formBean[i] = bean[i];
      }
      let works_cat_ids_array = this.formBean.works_cat_ids.split(',')
      //部门
      if (works_cat_ids_array) {
        this.formBean.works_cat_idss = [];
        works_cat_ids_array.forEach((element, index) => {
          this.formBean.works_cat_idss.push({ cat_id: element, cat_name: this.formBean.works_cat_names.split(',')[index] })
        });
      }
      this.formTitle = "修改作品";
    }
    else {
      if (!this.paramCol.works_type) {
        this.service.message.warning('请选择作品类型!')
        return false;
      }
      this.formBean.works_type = this.paramCol.works_type;
      this.formBean.deadline = null;
      this.formBean.real_price = 0;
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
    this.myForm.reset();
  }
  resetForm() {
    this.paramCol.audit_status = null;
    this.paramCol.cat_id = [];
    this.paramCol.tag_id = null;
    this.searchCatName._lastValue = []
    this.searchTagName._lastValue = []
    this.searchAuditName._lastValue = []
  }
  //提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      // if(!this.formBean.works_cover){
      //   this.service.message.error('请上传封面');
      //   return false;
      // }

      this.formBean.works_cat_id = this.formBean.works_cat_idss[this.formBean.works_cat_idss.length - 1]
      this.formBean.works_cat_names = this.cat_idss._displayLabelContext.labels.join(',');
      this.service.post('/api/busiz/works/save', this.formBean).then(success => {
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
  //删除
  delRows() {
    if (this.tableData.filter(value => value.checked).length < 1) {
      this.service.message.warning('你没有选择需要删除的数据内容!');
    }
    else {
      let ids = [];
      this.tableData.filter(value => value.checked).forEach(item => { ids.push(item.works_id) })
      this.service.post('/api/busiz/works/del', {
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
    this.service.post('/api/busiz/works/del', {
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
  //获取折后价
  getPrice() {
    setTimeout(_ => {
      this.formBean.real_price = (this.formBean.price / 10 * this.formBean.discount).toFixed(2)
      if (isNaN(this.formBean.real_price))
        this.formBean.real_price = null;
    }, 50)

  }
  //重新查询
  reload(reset?: any) {
    if (reset == true) {
      this.param.pageNum = 1;
      this.param.searchText = this.paramCol.searchText;
      this.param.audit_status = this.paramCol.audit_status;
      this.param.tag_id = this.paramCol.tag_id;

      if (this.paramCol.cat_id.length > 0)
        this.param.cat_id = this.paramCol.cat_id[this.paramCol.cat_id.length - 1];
      else
        this.param.cat_id = null;
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

  //上架下架
  statusWorks(data) {
    if (this.service.validataAction('cw_works_list_put')) {
      data.status = data.status == 1 ? 2 : 1;
      this.service.post('/api/busiz/works/save', data).then(success => {
        this.reload();
      })
    }
  }
  //提交审核
  submitAudit() {
    if (this.tableData.filter(value => value.checked).length < 1) {
      this.service.message.warning('你没有选择需要提交审核的数据!');
    }
    else {
      let ids = [];
      this.tableData.filter(value => value.checked).forEach(item => { ids.push(item.works_id) })
      this.service.post('/api/busiz/works/audit', {
        ids: ids, mark: 'audit'
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

}
