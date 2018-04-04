import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cw-train-list',
  templateUrl: './cw-train-list.component.html',
  styleUrls: ['./cw-train-list.component.css']
})

export class CwTrainListComponent implements OnInit {
  @ViewChild("video_idss") video_idss;
  _allChecked = false;
  _indeterminate = false;
  tableData: any = []; //数据列表
  formTitle: string
  isVisibleMiddle: boolean = false;
  selectedIndex: number = 0;
  resourceList: any = [];
  videoCatList: any = [];
  tagList: any = [];
  param: any = {
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

  isCollapse: any = true;
  _loading: boolean = true;

  // 实例化一个对象
  constructor(public service: AppService) { }
  //表单
  myForm: FormGroup;
  formBean: any = {
    video_cover: null,
    video_name: null,
    menu_id: null,
    menu_idss: null,
    tag_id: null,
    price: null,
    discount: null,
    real_price: null,
    video_remark: null,
  };

  //文件上传
  fileUpload(info): void {
    if (info.file.response && info.file.response.code == 0) {
      this.formBean.video_cover = info.file.response.data[0].url;
    }
  }
  ngOnInit() {
    //获取商品标签
    this.service.post('/api/busiz/goods/tag/list', { pageNum: 1, pageSize: 1000 }
    ).then(success => {
      if (success.code == 0) {
        this.tagList = success.data.rows;
      }
    })
    //获取资源下拉
    this.service.post('/api/busiz/res/getlist', {
      pageNum: 1,
      pageSize: 10000,
      res_type: "视频"
    }).then(success => {
      if (success.code == 0) {
        this.resourceList = success.data.rows
      }
    })

    this.reload();
    this.myForm = this.service.fb.group({
      video_name: [null, [this.service.validators.required]],
      video_idss: [null, [this.service.validators.required]],
      tag_id: [null, [this.service.validators.required]],
      price: [null, [this.service.validators.required]],
      discount: [null, [this.service.validators.required]],
      real_price: [false],
      video_remark: [false],
    })
  }
  loadCat(e: { option: any, index: number, resolve: Function, reject: Function }): void {
    if (e.index === -1) {
      this.service.post('/api/busiz/videoMenu/gettree', {
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
      this.formBean = { ...bean }
      //部门
      if (this.formBean.dept_id) {
        this.formBean.dept_id = parseInt(this.formBean.dept_id);
      }
      if (this.formBean.org_id) {
        this.formBean.org_id = parseInt(this.formBean.org_id);
      }
      this.formBean.tag_id = this.formBean.tag_id.split(',').map(element => parseInt(element))
      this.formTitle = "修改视频";
    }
    else {
      this.formTitle = "新增视频";
    }
    this.isVisibleMiddle = true;
    this.selectedIndex = 1;

    this.resourceArray = [];
    this.myForm1 = this.service.fb.group({});
    this.service.post('/api/busiz/video/detail', { video_id: this.formBean.video_id }).then(success => {
      if (success.data && success.data.length > 0) {
        this.resourceArray = success.data
        this.resourceArray.forEach((element, index) => {
          element.order_id = index
          element.resources_name = `resources${index}`;
          element.resources_id = element.resources_id
          this.myForm1.addControl(element.resources_name, new FormControl(null, this.service.validators.required));
        })
      } else {
        this.addField1()
      }
    })
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
  //获取折后价
  getPrice() {
    setTimeout(_ => {
      this.formBean.real_price = (this.formBean.price / 10 * this.formBean.discount).toFixed(2)
      if (isNaN(this.formBean.real_price))
        this.formBean.real_price = null;
    }, 50)

  }

  //提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      if (!this.formBean.video_cover) {
        this.service.message.warning('请上传封面');
        return false;
      }
      this.formBean.video_ids_array = []
      this.formBean.video_idss.forEach(element => {
        if (typeof (element) == 'object') {
          this.formBean.video_ids_array.push(element.cat_id);
        }
        else {
          this.formBean.video_ids_array.push(element);
        }
      });
      this.formBean.video_cat_id = this.formBean.video_ids_array[this.formBean.video_ids_array.length - 1];
      this.formBean.video_cat_ids = this.formBean.video_ids_array.join(',');
      this.formBean.video_cat_names = this.video_idss._displayLabelContext.labels.join(',');
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
  //删除
  delRows() {
    if (this.tableData.filter(value => value.checked).length < 1) {
      this.service.message.warning('你没有选择需要删除的数据内容!');
    }
    else {
      let ids = [];
      this.tableData.filter(value => value.checked).forEach(item => { ids.push(item.video_id) })
      this.service.post('/api/busiz/video/del', {
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
  //删除
  _delete(id) {
    this.service.post('/api/busiz/video/del', {
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
      this.param.searchText = this.paramCol.searchText;
    }
    this._loading = true;
    this.service.post('/api/busiz/video/getlist', this.param).then(success => {
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

  //---------------------------------------------  资源文件 start --------------------------------------------
  myForm1: FormGroup;
  resourceArray: any = [];
  addField1(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    const order_id = (this.resourceArray.length > 0) ? this.resourceArray[this.resourceArray.length - 1].order_id + 1 : 0;
    const control = {
      id: null,
      order_id,
      resources_name: `resources${order_id}`,
      resources_id: null,
    };
    const index = this.resourceArray.push(control);
    this.myForm1.addControl(this.resourceArray[index - 1].resources_name, new FormControl(null, this.service.validators.required));
  }

  removeField1(i, e: MouseEvent) {
    e.preventDefault();
    if (this.resourceArray.length > 0) {
      if (i.id) {
        this.service.post('/api/busiz/works/resources/del', { id: i.id }).then(success => {
          if (success.code == 0) {
            const index = this.resourceArray.indexOf(i);
            this.resourceArray.splice(index, 1);
            this.myForm1.removeControl(i.resources_name);
            this.service.message.success("删除成功");
          } else {
            this.service.message.error(success.message);
          }
        })
      } else {
        const index = this.resourceArray.indexOf(i);
        this.resourceArray.splice(index, 1);
        this.myForm1.removeControl(i.resources_name);
      }
    }
  }
  getFormControl1(name) {
    return this.myForm1.controls[name];
  }
  submitForm1() {
    if (!this.formBean.works_id) {
      this.service.message.warning('请先保存作品基本信息');
      return false;
    }
    for (const i in this.myForm1.controls) {
      this.myForm1.controls[i].markAsDirty();
    }

    console.log(this.resourceArray)
    // this.service.post('/api/busiz/works/resources/save', {
    //   works_id: this.formBean.works_id,
    //   id: data.id,
    //   resources_id: data.resources_id,
    // }).then(success => {
    //   if (success.code == 0) {
    //     if (success.data) {
    //     }
    //     this.service.message.success("保存成功")
    //   } else {
    //     this.service.message.error(success.message)
    //   }
    // })
  }

  //---------------------------------------------  资源文件 end --------------------------------------------

}
