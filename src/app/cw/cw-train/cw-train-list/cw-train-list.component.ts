import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../../app.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cw-train-list',
  templateUrl: './cw-train-list.component.html',
  styleUrls: ['./cw-train-list.component.css']
})

export class CwTrainListComponent implements OnInit {
  @ViewChild("video_cat_idss") video_cat_idss;
  @ViewChild("searchCatName") searchCatName;
  @ViewChild("searchTagName") searchTagName;
  @ViewChild("searchAuditName") searchAuditName;
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
    works_type: null,
    audit_status: null,
    tag_id: null,
    video_cat_id: []
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

  isDetails : boolean = false;
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
      video_cat_idss: [null, [this.service.validators.required]],
      tag_id: [null, [this.service.validators.required]],
      price: [null, [this.service.validators.required]],
      discount: [null, [this.service.validators.required]],
      real_price: [false],
      video_remark: [false],
    })
  }
  loadCat(e: { option: any, index: number, resolve: Function, reject: Function }): void {
    if (e.index === -1) {
      this.service.post('/api/busiz/video/cat/list', {
        code: null,enabled:1
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
      console.log(bean)
      this.formBean = { ...bean }
      let video_cat_ids_array = this.formBean.video_cat_ids.split(',')
      //部门
      if (video_cat_ids_array) {
        this.formBean.video_cat_idss = [];
        video_cat_ids_array.forEach((element, index) => {
          this.formBean.video_cat_idss.push({ cat_id: element, cat_name: this.formBean.video_cat_names.split(',')[index] })
        });
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
    if(bean){
      this.service.post('/api/busiz/video/detail', { video_id: this.formBean.video_id }).then(success => {
        if (success.data.videoResRelList && success.data.videoResRelList.length > 0) {
          this.resourceArray = success.data.videoResRelList
          this.resourceArray.forEach((element, index) => {
            element.order_id = index
            element.res_name = `resources${index}`;
            element.res_id = element.res_id
            this.myForm1.addControl(element.res_name, new FormControl(null, this.service.validators.required));
          })
        } else {
          this.addField1()
        }
      })
    }
    
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
    this.isDetails = false;
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
  resetForm() {
    this.paramCol.searchText = null;
    this.paramCol.audit_status = null;
    this.paramCol.video_cat_id = [];
    this.paramCol.tag_id = null;
    // this.searchCatName._lastValue = []
    // this.searchTagName._lastValue = []
    // this.searchAuditName._lastValue = []
    this.param = {
      searchText: null,
      total: 0,
      pageSize: 10,
      pageNum: 1
    };
    this.reload();
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
      console.log(this.formBean)
      this.formBean.video_ids_array = []
      this.formBean.video_cat_idss.forEach(element => {
        if (typeof (element) == 'object') {
          this.formBean.video_ids_array.push(element.cat_id);
        }
        else {
          this.formBean.video_ids_array.push(element);
        }
      });
      this.formBean.video_cat_id = this.formBean.video_ids_array[this.formBean.video_ids_array.length - 1];
      this.formBean.video_cat_ids = this.formBean.video_ids_array.join(',');
      this.formBean.video_cat_names = this.video_cat_idss._displayLabelContext.labels.join(',');
      this.formBean.tag_id = this.formBean.tag_id.join(',');
      if (!this.formBean.tag_id) {
        this.service.message.warning('请选择标签');
        return false;
      }
      if (!this.formBean.video_cat_id) {
        this.service.message.warning('请选择分类');
        return false;
      }
      this.selectedIndex = 2



      
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
      this.param.audit_status = this.paramCol.audit_status;
      this.param.tag_id = this.paramCol.tag_id;
      if (this.paramCol.video_cat_id.length > 0)
        this.param.video_cat_id = this.paramCol.video_cat_id[this.paramCol.video_cat_id.length - 1];
      else
        this.param.video_cat_id = null;
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
  _refresh(){
    this._allChecked = false;
  }

  //提交审核
  submitAudit() {
    if (this.tableData.filter(value => value.checked).length < 1) {
      this.service.message.warning('请选择需要提交审核的数据!');
      return false;
    }
    else {
      let idss = [];
      let status = []
      this.tableData.filter(value => value.checked).forEach(item => { idss.push(item.video_id) ;status.push(item.audit_status)});
      if(status.indexOf(3)!=-1 || status.indexOf(4)!=-1){
        this.service.message.warning('只能选择草稿状态的数据!');
        return false;
      }
      this.service.post('/api/busiz/video/submitaudit', {
        ids: idss, mark: 'audit', audit_status: 2
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

  // 审核
  isAudit : boolean = false;
  auditCancel(){
    this.isAudit = false;
  }
  ids : any = [];
  //通过-驳回
  audit(data) {
    this.ids = [];
    if(data.audit_status==1){
      this.service.message.warning('请先进行提交审核!');
      return false;
    }else{
      this.isAudit = true;
      this.ids = [data.video_id];
    }
    
  }
  Ok(){
    this.service.post('/api/busiz/video/audit',{ids: this.ids, audit_status: 4} ).then(success => {
      if (success.code == 0) {
        this.reload();
        this.isAudit = false;
        this.ids = [];
      } else {
        this.isAudit = false;
        this.service.message.error(success.message);
      }
    })
  }
  Not(){
    this.service.post('/api/busiz/video/audit',{ids: this.ids, audit_status: 3} ).then(success => {
      if (success.code == 0) {
        this.reload();
        this.isAudit = false;
        this.ids = [];
      } else {
        this.isAudit = false;
        this.service.message.error(success.message);
      }
    })
  }

  // //通过驳回
  // auditStatus(data, status) {
  //   this.service.post('/api/busiz/video/audit', { ids: [data.video_id], audit_status: status }).then(success => {
  //     if (success.code == 0) {
  //       this.reload();
  //     } else {
  //       this.service.message.error(success.message);
  //     }
  //   })
  // }

  // 顶部标签页转换
  change(rest?){
    if(this.selectedIndex==0){
      this.isVisibleMiddle = false;
      this.isDetails = false;
    }
  }

  nowData : any = {}
  allRecourse : any = [];
  //详情
  videoDetail(data) {
    // window.open('www.baidu.com')
    this.isDetails = true;
    this.formTitle = '详情预览';
    this.nowData = {...data}
    console.log(this.nowData)
    // 获取当前视频的资源
    this.service.post('/api/busiz/video/detail', { video_id:this.nowData.video_id }).then(success => {
      if(success.code==0){
        this.allRecourse = success.data.videoResRelList;
      }
    })
    this.selectedIndex = 1;
  }

  videoModel : any = {};
  isVisibleVideo : boolean = false; 
  look(data){
    this.isVisibleVideo = true;
    this.videoModel = {...data};
  }

  //视频关闭预览
  _vedioCancel($event){
    this.isVisibleVideo = false;
    this.myForm.reset();
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
      res_name: `res${order_id}`,
      res_id: null,
    };
    const index = this.resourceArray.push(control);
    this.myForm1.addControl(this.resourceArray[index - 1].res_name, new FormControl(null, this.service.validators.required));
  }

  removeField1(i, e: MouseEvent) {
    e.preventDefault();
    if (this.resourceArray.length > 0) {
      const index = this.resourceArray.indexOf(i);
      this.resourceArray.splice(index, 1);
      this.myForm1.removeControl(i.res_name);
    }
  }
  getFormControl1(name) {
    return this.myForm1.controls[name];
  }

  
  submitForm1() {
    for (const i in this.myForm1.controls) {
      this.myForm1.controls[i].markAsDirty();
    }

    console.log(this.resourceArray)
    let res_ids = this.resourceArray.map(element => element.res_id);
  
    if (!res_ids || res_ids.length==0 || res_ids[0]==null) {
      this.service.message.warning('请先选择资源');
      return false;
    }
    if([...Array.from(new Set(res_ids))].length != res_ids.length){
      this.service.message.warning('资源选择有重复，请另选资源');
      return false;
    }
   
    this._loading = true;
    this.service.post('/api/busiz/video/save', this.formBean).then(success => {
      if (success.code == 0) {
        this.isVisibleMiddle = false;
        console.log(success)
        if(success.data){
          this.formBean.video_id = success.data.video_id;
          this.service.post('/api/busiz/video/config', {
            video_id: this.formBean.video_id,
            res_ids: res_ids
          }).then(success => {
            this._loading = false;
            if (success.code == 0) {
              this.formClear()
              this.reload();
              this.service.message.success("保存成功")
            } else {
              this.service.message.error(success.message)
            }
          })
        }
      }
      else {
        this.service.message.error(success.message);
      }
    })
    
  }

  //---------------------------------------------  资源文件 end --------------------------------------------

}
