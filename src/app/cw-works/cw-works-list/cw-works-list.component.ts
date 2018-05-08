import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';

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
  isDetail : any = false;//预览
  detailData : any = {};//详情对象
  isShowVisible : boolean = false;
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
  constructor(public service: AppService,private confirmServ: NzModalService) { }
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
    this.myForm2 = this.service.fb.group({
      test_paper_name: [null, [this.service.validators.required]],
      answer_time: [null, [this.service.validators.required]],
      resources_id: [false],
      remark: [false],
    })

    this.service.post('/api/busiz/works/resources/list', { works_id:31}).then(success => {
        console.log(success)
    })
  }
  loadCat(e: { option: any, index: number, resolve: Function, reject: Function }): void {
    if (e.index === -1) {
      this.service.post('/api/busiz/works/cat/list', {
        code: null,enabled:1
      }).then(success => {
        this.service._toisLeaf(success.data);
        e.resolve(success.data);

      })
      return;
    }
  }
  //文件上传
  fileUpload(info): void {
    if (info.file.response && info.file.response.code == 0) {
      this.formBean.works_cover = info.file.response.data[0].url;
    }
  }

  //打开
  showModalMiddle(bean?: any) {

    this.formBean = {};
    if (bean) {
      this.formBean = {...bean}
      let works_cat_ids_array = this.formBean.works_cat_ids.split(',')
      //部门
      if (works_cat_ids_array) {
        this.formBean.works_cat_idss = [];
        works_cat_ids_array.forEach((element, index) => {
          this.formBean.works_cat_idss.push({ cat_id: element, cat_name: this.formBean.works_cat_names.split(',')[index] })
        });
      }
      this.formBean.tag_ids = this.formBean.tag_ids.split(',').map(element => parseInt(element))
      this.formTitle = "修改作品";
    }
    else {
      if (!this.paramCol.works_type) {
        this.service.message.warning('请选择作品类型!')
        return false;
      }
      this.formBean.works_type = this.paramCol.works_type;
      this.formBean.deadline = null;
      this.formBean.discount = 10;
      this.formBean.real_price = 0;
      this.formTitle = "新增作品";
    }
    this.isVisibleMiddle = true;
    this.isDetail = false;
    this.setTopic = false;
    this.selectedIndex = 1;
    if (this.formBean.works_type == "资源包") {
      this.resourceArray = [];
      this.myForm1 = this.service.fb.group({});
      this.service.post('/api/busiz/works/resources/list', { works_id: this.formBean.works_id }).then(success => {
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
    }
    if (this.formBean.works_type == "试题") {
      this.testParam.works_id = this.formBean.works_id;
      this.testFormBean.works_id = this.formBean.works_id;
      this.testReload();
    }

    if (this.formBean.works_type == "教育表格") {
      this.questionArray = [];
      this.myForm4 = this.service.fb.group({});
      this.service.post('/api/busiz/works/form/list', { works_id: this.formBean.works_id }).then(success => {
        if (success.data && success.data.length > 0) {
          this.questionArray = success.data
          this.questionArray.forEach((element, index) => {
            element.order_id = index
            element.question_name = `question${index}`;
            element.answer_name = `answer${index}`;
            this.myForm4.addControl(element.question_name, new FormControl(null, this.service.validators.required));
            this.myForm4.addControl(element.answer_name, new FormControl(false));
            this.myForm4.addControl(element.resources_id, new FormControl(false));

          })
        } else {
          this.addField4()
        }
      })
    }

    //获取资源下拉
    this.service.post('/api/busiz/res/getlist', {
      pageNum: 1,
      pageSize: 10000
    }).then(success => {
      if (success.code == 0) {
        this.resourceList = success.data.rows
      }
    })
  };
  resourceList: any = [];
  //关闭
  handleCancelMiddle($event) {
    this.isVisibleMiddle = false;
    this.formClear()
  }
  //关闭
  handleCancelMiddle2($event) {
    this.testPaperLayer = false;
    this.formClear2()
  }
  //确定
  handleOkMiddle($event) {
    this._submitForm();
  }
  //确定
  handleOkMiddle2($event) {
    this._submitForm2();
  }
  formClear() {
    this.myForm.reset();
  }
  formClear2() {
    this.myForm2.reset();
  }
  //关闭tab
  closeTab() {
    this.isVisibleMiddle = false;
    this.isDetail = false;
    this.selectedIndex = 0;
    this.myForm.reset();
  }
  closeTab2() {
    this.setTopic = false;
    this.selectedIndex = 3;
  }
  resetForm() {
    this.paramCol.searchText = null;
    this.paramCol.audit_status = null;
    this.paramCol.cat_id = [];
    this.paramCol.tag_id = null;
    this.paramCol.works_type = null;
    this.param = {
      searchText: null,
      total: 0,
      pageSize: 10,
      pageNum: 1,
    };
    this.reload();
    // this.searchCatName._lastValue = []
    // this.searchTagName._lastValue = []
    // this.searchAuditName._lastValue = []
  }
  //提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      if (!this.formBean.works_cover) {
        this.service.message.warning('请上传封面');
        return false;
      }
      this.formBean.works_cat_ids_array = []
      this.formBean.works_cat_idss.forEach(element => {
        if (typeof (element) == 'object') {
          this.formBean.works_cat_ids_array.push(element.cat_id);
        }
        else {
          this.formBean.works_cat_ids_array.push(element);
        }
      });
      this.formBean.works_cat_id = this.formBean.works_cat_ids_array[this.formBean.works_cat_ids_array.length - 1];
      this.formBean.works_cat_ids = this.formBean.works_cat_ids_array.join(',');
      this.formBean.works_cat_names = this.cat_idss._displayLabelContext.labels.join(',');

      this.service.post('/api/busiz/works/save', this.formBean).then(success => {
        if (success.code == 0) {
          this.service.message.success('保存成功')
          if (success.data) {
            this.formBean.works_id = success.data.works_id;
            if (this.formBean.works_type == "试题") {
              this.testFormBean.works_id = this.formBean.works_id;
              this.testParam.works_id = this.formBean.works_id;
            }
          }
          this.isVisibleMiddle = false;
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
      if(this.paramCol.works_type){
        this.param.works_type = this.paramCol.works_type;
      }
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
  _refresh(){
    this._allChecked = false;
  }

  //上架下架
  statusWorks(data) {
    if (this.service.validataAction('cw_works_list_put')) {
      if (data.audit_status == 3) {
        data.status = data.status == 1 ? 2 : 1;
        data.tag_ids = data.tag_ids.split(',').map(element => parseInt(element))
        this.service.post('/api/busiz/works/save', data).then(success => {
          this.reload();
        })
      }
      else {
        this.service.message.warning('审核未通过作品无法上架!');
        this.reload();
      }
    }
  }
  //提交审核
  // submitAudit() {
  //   if (this.tableData.filter(value => value.checked).length < 1) {
  //     this.service.message.warning('你没有选择需要提交审核的数据!');
  //   }
  //   else {
  //     let ids = [];
  //     this.tableData.filter(value => value.checked).forEach(item => { ids.push(item.works_id) })
  //     this.service.post('/api/busiz/works/audit', {
  //       ids: ids, mark: 'audit'
  //     }).then(success => {
  //       if (success.code == 0) {
  //         this.reload();
  //       }
  //       else {
  //         this.service.message.error(success.message);
  //       }
  //     })
  //   }
  // }

    //提交审核
  submitAudit(data){
         this.service.post('/api/busiz/works/audit', {
        ids: [data.works_id], mark: 'audit'
      }).then(success => {
        if (success.code == 0) {
          this.reload();
        }
        else {
          this.service.message.error(success.message);
        }
      })
  }

  currentModal ;
  isAudit : boolean = false;
  isConfirmLoading = false;
  auditCancel(){
    this.isAudit = false;
  }

  ids : any = [];//审核作品id
  _status : number = 0;
  //通过-驳回
  auditStatus() {
    if (this.tableData.filter(value => value.checked).length < 1) {
      this.service.message.warning('你没有选择需要审核的数据!');
      return false;
    }
    else if(this.tableData.filter(value => value.checked).length == 1){
      this.ids = [];
      this.tableData.filter(value => value.checked).forEach(item => { this.ids.push(item.works_id);this._status = item.audit_status });
      if(this._status==1){
        this.service.message.warning('请先进行提交审核!');
        return false;
      }else{
        this.isAudit = true;
      }
      
    }else{
      this.service.message.warning('仅能同时操作一条数据,请重新选择!');
      return false;
    }
  }
  Ok(){
    this.isConfirmLoading = true;
    this.service.post('/api/busiz/works/audit',{ids: this.ids, audit_status: 3} ).then(success => {
      if (success.code == 0) {
        this.reload();
        this.isConfirmLoading = false;
        this.isAudit = false;

        this.ids = [];
      } else {
        this.service.message.error(success.message);
      }
    })
  }
  Not(){
    this.service.post('/api/busiz/works/audit',{ids: this.ids, audit_status: 4} ).then(success => {
      if (success.code == 0) {
        this.reload();
        this.isAudit = false;
        this.ids = [];
      } else {
        this.service.message.error(success.message);
      }
    })
  }

  //详情
  worksResource : any = [];//当前作品所带资源
  worksDetail(data) {
    this.formTitle = "作品详情";
    this.isDetail = true;
    this.selectedIndex = 1;
    this.isVisibleMiddle = false;
    this.detailData = {...data};
    console.log(this.detailData.works_type);

    switch (this.detailData.works_type){
      case"资源包":
      this.service.post('/api/busiz/works/resources/list', { works_id:this.detailData.works_id}).then(success => {
        console.log(success)
        if(success.code==0){
          this.worksResource = success.data;
        }
      })
        break;
      case "试题":
      this.service.post('/api/busiz/works/testpaper/list', { works_id:this.detailData.works_id}).then(success => {
        console.log(success)
        if(success.code==0){
          this.worksResource = success.data;
        }
    })
    }
  }

  // 资源预览
  nowData : any ={};
  pdfMinNum: number = 1;
  ListData : any = [];
  look(data){
    console.log(data);
    this.isShowVisible = true;
    switch (this.detailData.works_type){
      case"资源包":
      
      if(data.res_type=="音频"){
        this.nowData.res_type=1;
        this.nowData.url = data.resources_path;
      }else if(data.res_type=="视频"){
        this.nowData.res_type=2;
        this.nowData.url = data.resources_path;
      }else{
        this.nowData.res_type=3;
        this.nowData.url = data.resources_path;
        this.nowData.size = data.res_size;
        this.pdfMinNum = 1;
      }
      
      
      break;
      case"试题":
        this.nowData.paper_name = data.test_paper_name;
        this.service.post('/api/busiz/works/question/list',{paper_name:data.test_paper_name,paper_id:data.id}).then(success => {
          this._loading = false;
          if (success.code == 0) {
            this.ListData = success.data
          } else {
            this.service.message.error(success.message)
          }
        })
      break;
    }
    

  }

  _Cancel($event){
    this.isShowVisible = false;
    this.nowData = {};
  }

   //上一页
   pdfMinNum1() {
    if (this.pdfMinNum > 1) {
      this.pdfMinNum -= 1;
    }
  }
  //上一页
  pdfMinNum2() {
    if (this.pdfMinNum < this.nowData.size) {
      this.pdfMinNum += 1;
    }
  }

  //---------------------------------------------  试题 start --------------------------------------------
  @ViewChild("topicTag") topicTag;
  @ViewChild("topicType") topicType;
  @ViewChild("addTopicTag") addTopicTag;
  @ViewChild("addTopicType") addTopicType;
  myForm2: FormGroup
  testData: any = [];     //试卷列表
  topicData: any = [];    //题目列表
  addTopicData: any = []; //新增题目列表
  resAudioList: any = []; //音频下拉
  testPaperLayer: boolean = false; //创建试卷
  isShowAddTopic: boolean = false; //添加试题
  setTopic: boolean = false; //设置题目
  topicTagList: any = [] //题目标签
  topicTypeList: any = [{ id: 1, name: '单选题' }, { id: 2, name: '多选题' }, { id: 3, name: '判断题' }] //题目类型
  testParam: any = {  //试卷
    works_id: null,
    pageNum: 1,
    pageSize: 10,
    searchText: null,
  }
  topicParam: any = {
    tag_id: null,
    type: null,
    topicContent: null,
    paper_id: null,
    paper_name: null
  }
  addTopicParam: any = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    type: null,
    tag_id: null,
  }
  testFormBean: any = {
    works_id: null,
    test_paper_name: null,
    answer_time: null,
    remark: null,
    resources_id: null,
  }
  //试卷查询
  testReload(reset?: any) {
    if (reset == true) {
      this.testParam.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/works/testpaper/list', this.testParam).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.testData = success.data;
      }
      else {
        this.testData = [];
        this.service.message.error(success.message);
      }
    })
  }

  //创建试卷
  createTestPaper(bean?: any) {
    if (!this.formBean.works_id) {
      this.service.message.warning('请先保存作品基本信息');
      return false;
    }
    this.testPaperLayer = true;
    this.formTitle = "新增试卷"
    this.testFormBean = {
      works_id: this.formBean.works_id
    };
    if (bean) {
      this.formBean = {...bean}
    }
    this.service.post('/api/busiz/res/getlist', {
      pageSize: 1000,
      pages: 1,
      res_type: "音频"
    }).then(success => {
      if (success.code == 0) {
        this.resAudioList = success.data.rows;
      }
    })
  }
  //试卷新增修改
  _submitForm2() {
    for (const i in this.myForm2.controls) {
      this.myForm2.controls[i].markAsDirty();
    }
    if (this.myForm2.valid) {
      this._loading = true;
      this.service.post('/api/busiz/works/testpaper/save', this.testFormBean).then(success => {
        this._loading = false;
        if (success.code == 0) {
          this.testPaperLayer = false;
          this.formClear2();
          this.testReload();

        }
        else {
          this.service.message.error(success.message);
        }
      })
    }
  }
  //试卷删除
  testPaperDel(id) {
    this._loading = true;
    this.service.post('/api/busiz/works/testpaper/del', { id: id, works_id: this.testParam.works_id }).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.testReload();
      } else {
        this.service.message.error(success.message);
      }
    })
  }
  //设置题目
  settingTopic(data?: any) {
    console.log(data)
    this.selectedIndex = 4;
    this.setTopic = true;
    this.topicParam.paper_id = data.id
    this.topicParam.paper_name = data.test_paper_name
    //题目列表
    this._loading = true;
    this.service.post('/api/busiz/goods/tag/list', { pageNum: 1, pageSize: 1000 }).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.topicTagList = success.data.rows;
      } else {
        this.service.message.error(success.message);
      }
    })
    this.topicReload();
  }

  //题目列表查询
  topicReload() {
    this._loading = true;
    this.service.post('/api/busiz/works/question/list', this.topicParam).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.topicData = success.data
      } else {
        this.service.message.error(success.message)
      }
    })
  }
  //题目列表重置
  topicResetForm() {
    this.topicParam.topicContent = null;
    this.topicParam.tag_id = null;
    this.topicParam.type = null;
    this.topicTag._lastValue = []
    this.topicType._lastValue = []
  }
  //新增题目列表重置
  addTopicResetForm() {
    this.addTopicParam.tag_id = null;
    this.addTopicParam.type = null;
    this.addTopicTag._lastValue = []
    this.addTopicType._lastValue = [];
    this.addTopicReload()
  }

  //新增试题
  addTopic() {
    this.isShowAddTopic = true
    this.addTopicReload();
  }
  //新增试题弹窗关闭
  addTopicCancel($event) {
    this.isShowAddTopic = false;
  }

  //新增题目列表查询
  addTopicReload(reset?: any) {
    if (reset == true) {
      this.addTopicParam.pageNum = 1;
    }
    this.service.post('/api/busiz/question/getlist', this.addTopicParam).then(success => {
      if (success.code == 0) {
        this.addTopicData = success.data.rows
        this.addTopicParam.total = success.data.total;
      } else {
        this.addTopicData = [];
        this.addTopicParam.total = 0;
        this.service.message.error(success.message)
      }
    })
  }
  //添加试题
  submitAddTopic(id) {
    this._loading = true;
    this.service.post('/api/busiz/works/question/save', {
      paper_id: this.topicParam.paper_id,
      question_id: id
    }).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.topicReload();
      } else {
        this.service.message.error(success.message);
      }
    })
  }
  //试题删除
  topicDel(id) {
    this._loading = true;
    this.service.post('/api/busiz/works/question/del', { rel_id: id }).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.topicReload();
      } else {
        this.service.message.error(success.message);
      }
    })
  }
  //---------------------------------------------  试题 end --------------------------------------------



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
  submitForm1(data?: any, i?: number) {
    if (!this.formBean.works_id) {
      this.service.message.warning('请先保存作品基本信息');
      return false;
    }
    console.log(data);
    for(let i in this.resourceList){
      if(data.resources_id == this.resourceList[i].res_id){
        if(this.resourceList[i].res_type == "图书"){
          data.resources_path =  this.resourceList[i].res_analysis_url;
        }else{
          data.resources_path =  this.resourceList[i].res_url;
        }
        
        console.log(this.resourceList[i])
        break;
      }
    }
    this.myForm1.controls[i].markAsDirty();
    this.service.post('/api/busiz/works/resources/save', {
      works_id: this.formBean.works_id,
      id: data.id,
      resources_id: data.resources_id,
      resources_path: data.resources_path
    }).then(success => {
      if (success.code == 0) {
        if (success.data) {
          data.id = success.data.id
        }
        this.service.message.success("保存成功")
      } else {
        this.service.message.error(success.message)
      }
    })
  }

  //---------------------------------------------  资源文件 end --------------------------------------------
  //---------------------------------------------  教育表格 start --------------------------------------------
  myForm4: FormGroup;
  questionArray: any = [];
  addField4(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    const order_id = (this.questionArray.length > 0) ? this.questionArray[this.questionArray.length - 1].order_id + 1 : 0;
    const control = {
      id: null,
      order_id,
      question_name: `question${order_id}`,
      answer_name: `answer${order_id}`,
      answer: null,
      question: null,
      resources_id: null,
      res_name: null,
      resource_path: null
    };
    const index = this.questionArray.push(control);
    this.myForm4.addControl(this.questionArray[index - 1].question_name, new FormControl(null, this.service.validators.required));
    this.myForm4.addControl(this.questionArray[index - 1].answer_name, new FormControl(false));
    this.myForm4.addControl(this.questionArray[index - 1].resources_id, new FormControl(false));
  }

  removeField4(i, e: MouseEvent) {
    e.preventDefault();
    if (this.questionArray.length > 0) {
      if (i.id) {
        this._loading = true;
        this.service.post('/api/busiz/works/form/del', { id: i.id }).then(success => {
          this._loading = false;
          if (success.code == 0) {
            const index = this.questionArray.indexOf(i);
            this.questionArray.splice(index, 1);
            this.myForm4.removeControl(i.question_name);
            this.myForm4.removeControl(i.answer_name);
            this.myForm4.removeControl(i.resources_id);
            this.service.message.success("删除成功");
          } else {
            this.service.message.error(success.message);
          }
        })
      } else {
        const index = this.questionArray.indexOf(i);
        this.questionArray.splice(index, 1);
        this.myForm4.removeControl(i.question_name);
        this.myForm4.removeControl(i.answer_name);
        this.myForm4.removeControl(i.resources_id);
      }
    }
  }
  getFormControl4(name) {
    return this.myForm4.controls[name];
  }
  submitForm4(data?: any, i?: number) {
    if (!this.formBean.works_id) {
      this.service.message.warning('请先保存作品基本信息');
      return false;
    }
    this.myForm4.controls[i].markAsDirty();
    this._loading = true;
    this.service.post('/api/busiz/works/form/save', {
      works_id: this.formBean.works_id,
      id: data.id,
      question: data.question,
      answer: data.answer,
      resources_id: data.resources_id,
    }).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.service.message.success("保存成功")
        if (success.data) {
          data.id = success.data.id
        }
      } else {
        this.service.message.error(success.message)
      }
    })
  }

  //---------------------------------------------  教育表格 end --------------------------------------------
}
