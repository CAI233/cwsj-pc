import { Component, OnInit} from '@angular/core';
import { AppService } from '../../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-cw-info-book',
  templateUrl: './cw-info-book.component.html',
  styleUrls: ['./cw-info-book.component.css']
})
export class CwInfoBookComponent implements OnInit {
  
  myForm: FormGroup;
  _allChecked : boolean = false;
  _indeterminate : boolean = false;
  isCollapse : boolean = true;
  param : any = {
    pageNum:1,
    pageSize:10,
    searchText:null,
    book_type:1
  }
  selectedIndex: number = 0;
  // selectedIndex = 0;
  tabs = [
    {book_type:1,content:"图书"},{book_type:2,content:"电子书"}
  ]
  _loading : boolean = false;
  data : any = [];
  pullList : any = [
    {id:null,name:"全部"},
    {id:1,name:"上架"},
    {id:2,name:"下架"}
  ]
  // 1：草稿，2：待审核，3：审核通过，4：审核不通过
  auilt : any = [
    {id:1,name:'草稿'},
    {id:2,name:'待审核'},
    {id:3,name:'审核通过'},
    {id:4,name:'审核不通过'},
  ]
  cat_data : any = null;//分类对象
  bookList = false;//图书新增
  seeList = false;//图书详情
  bookData : any = {};//图书列表
  bookTag : any = [];//标签列表
  bookClass : any = [];//分类列表
  bookResource : any = [];//已选的图书资源--二维码
  ebookResource : any = [];//已选的电子书资源
  ebookAllResource : any = [];//所有电子书资源
  AllResourceList : boolean = false;//所有电子书资源页面
  nowTitle : string;
  AllResource_param : any = {
    pageNum:1,
    pageSize:10,
    res_type:'图书'
  }
  ebookRlist : boolean = false;
  publish_date : any = null;
  constructor(public service: AppService) { }

  // 图书列表
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/book/list',this.param).then(success => {
      this._loading = false;
      if(success.code==0){
        this.data = success.data.rows;
        this.param.total = success.data.total;


      }else{
        this.data = [];
        this.param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }

  // 图书标签列表
  get_tagList(rest?){
    let search = null;
    if(rest){
      search = rest
    }
    this.service.post('/api/busiz/tag/list',{pageNum:1,pageSize:10,searchText:search}).then(success => {
      if(success.code==0){
        this.bookTag = success.data.rows;
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  // 图书分类列表
  get_classList(){
    this.service.post('/api/busiz/book/cat/list',{enabled:1}).then(success => {
      if(success.code==0){
        this.bookClass = success.data;
      }else{
        this.service.message.error(success.message);
      }
    })
  }

  //获取到当前电子书的资源列表
  get_ebookResource(){
    this.service.post('/api/busiz/book/res/list',{book_id:this.bookData.book_id}).then(success => {
      if(success.code==0){
        this.ebookResource = success.data;
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  // 获取当前图书的二维码列表
  get_code(){
    this.service.post('/api/busiz/book/qrcode/list',{book_id:this.bookData.book_id}).then(success => {
      if(success.code==0){
        this.bookResource = success.data;
      }else{
        this.service.message.error(success.message);
      }
    })
  }

  newTrue : any = false;//当前标签页的位置

    //关闭tab
    closeTab() {
      this.bookList = false;
      this.seeList = false;
      if(this.bookData.book_type==1){
        this.selectedIndex = 0;
      }else{
        this.selectedIndex = 1;
      }
      
      this.myForm.reset();
    }

  // 选项卡切换
  change(reset?){
    // console.log(this.selectedIndex)
    this.param.book_type = reset+1;
    if(reset!=2){
      this.bookList = false;
    }
    this.load();
  }
  //查询
  reload(rest?){
    if(rest){
      console.log(this.param);

      this.load();
    }
  }
  //重置
  cat_ids : any = null;
  resetForm(){
    this.param.searchText = null;
    this.param.status = null;
    this.param.tag_id = null;
    this.param.book_cat_id = null;
    this.cat_ids = null;
    this.isCollapse = true;
    this.load();

  }
  // 提交审核
  _audit(){
    if (this.data.filter(value => value.checked).length < 1) {
      this.service.message.warning('请选择需要提交审核的数据!');
      return false;
    }
    else {
      let idss = [];
      let status = []
      this.data.filter(value => value.checked).forEach(item => { idss.push(item.book_id) ;status.push(item.audit_status)});
      if(status.indexOf(3)!=-1 || status.indexOf(4)!=-1){
        this.service.message.warning('只能选择草稿状态的数据!');
        return false;
      }
      this.service.post('/api/busiz/submit/audit',{ids:idss}).then(success => {
        if(success.code==0){
              this.load();
            }else{
              this.service.message.error(success.message);
              this.load();
            }
      })
    } 
  }

  // 审核
  isAudit : boolean = false;
  auditCancel(){
    this.isAudit = false;
  }
  
  //通过-驳回
  audit(data) {
    if(data.audit_status==1){
      this.service.message.warning('请先进行提交审核!');
      return false;
    }else{
      this.isAudit = true;
      this.bookData = {};
      this.bookData = {...data};
      this.bookData.book_type = this.param.book_type;
      this.bookData.tag_ids = this.bookData.tag_ids.split(",");
    }
  }
  Ok(){
    this.bookData.audit_status = 3;
    this.service.post('/api/busiz/book/audit',this.bookData).then(success => {
      if (success.code == 0) {
        this.reload();
        this.isAudit = false;
        this.bookData = {};
      } else {
        this.isAudit = false;
        this.service.message.error(success.message);
      }
    })
  }
  Not(){
    this.bookData.audit_status = 4;
    this.service.post('/api/busiz/book/audit',this.bookData).then(success => {
      if (success.code == 0) {
        this.reload();
        this.isAudit = false;
        this.bookData = {};
      } else {
        this.isAudit = false;
        this.service.message.error(success.message);
      }
    })
  }




// 发布状态
_enabled(data){
  data.status = data.status == 1 ? 2 : 1;
  this.bookData = {...data}
  this.bookData.book_type = this.param.book_type;
  this.bookData.tag_ids = this.bookData.tag_ids.split(",");
  this.service.post('/api/busiz/book/release',this.bookData).then(success => {
    if(success.code==0){
      this.load();
    }else{
      this.service.message.error(success.message);
      this.load();
    }
  })
}

  //文件上传
  fileUpload(info): void {
    if (info.file.response && info.file.response.code == 0) {
      this.bookData.book_cover = info.file.response.data[0].url;
    }
  }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      book_name:false,
      book_cat_id:false,
      tag_ids:false,
      key_word:false,
      book_isbn:false,
      publisher:false,
      author_name:false,
      publish_date:false,
      all_num:false,
      limit_num:false,
      book_remark:false,
    })
    console.log(this.service.validataAction('cw_info_book_add'));
    //加载图书列表
    this.load();
    //加载图书标签列表
    this.get_tagList();
    //加载图书分类列表
    this.get_classList();
  }

  //关闭弹窗
  bookCancel($event) {
    this.bookList = false;
    this.seeList = false;
    this.AllResourceList = false;
    this.publish_date = null;
    this.myForm.reset();
  }
  goToindex = 0;
  //电子书下一步操作

  //确定
  bookOk($event?) {
    // this._getRecouse();
    this.bookData.publish_date  = this.timeOut(this.publish_date);
    if(!this.bookData.book_name){
      this.service.message.warning('请填写书名!');
      return false;
    }
    if(!this.bookData.book_cat_id){
      this.service.message.warning('请选择分类!');
      return false;
    }
    if(!this.bookData.tag_ids || this.bookData.tag_ids.length==0){
      this.service.message.warning('请选择标签!');
      return false;
    }
    if(!this.bookData.book_cover){
      this.service.message.warning('请选择图片!');
      return false;
    }
    if(!this.bookData.book_isbn){
      this.service.message.warning('请填写图书isbn!');
      return false;
    }
    if(!this.bookData.author_name){
      this.service.message.warning('请填写作者!');
      return false;
    }
    if(!this.bookData.publish_date){
      this.service.message.warning('请填写出版时间!');
      return false;
    }
    if(!this.bookData.book_remark){
      this.service.message.warning('请填写简介!');
      return false;
    }
    if(typeof(this.bookData.tag_ids)=='object'){
      this.bookData.tag_ids = this.bookData.tag_ids
    }else{
      this.bookData.tag_ids = this.bookData.tag_ids.split(",")
    }
    
    this.service.post('/api/busiz/book/save',this.bookData).then(success => {
      if(success.code==0){
        if(this.bookData.book_type==2){
          this.ebookRlist = true;
          this.goToindex = 1;
          console.log(success); 
          console.log(this.bookData); 
          this.bookData.tag_ids = this.bookData.tag_ids.join(",")
          if(success.data){
            this.bookData.book_id = success.data.book_id;
          }
          this.get_ebookResource();
        }else{
          this.bookList = false;
          this.publish_date = null;
          this.selectedIndex = 0;
          this.myForm.reset();
        }
        this.load();
        
        this.service.message.success(success.message);
      }else{
        this.service.message.error(success.message);
      }
    })
  }


  //获取到搜索分类id
  search_change(rest?){
    console.log(rest)
    if(rest.length>0){
      this.param.book_cat_id = rest[rest.length-1].cat_id;
    }
  } 

  // 获取到分类id
  now_change(rest?){
    console.log(rest)
    if(rest.length>0){
      this.bookData.book_cat_name = '';
      this.bookData.book_cat_names = '';
      this.bookData.book_cat_ids = '';
      this.bookData.book_cat_id = rest[rest.length-1].cat_id;
      this.bookData.book_cat_name = rest[rest.length-1].cat_name;
      for(let i in rest){
        this.bookData.book_cat_names += rest[i].cat_name+",";
        this.bookData.book_cat_ids += rest[i].cat_id+",";
      }
      this.bookData.book_cat_names = this.bookData.book_cat_names.substring(0,this.bookData.book_cat_names.length-1);
      this.bookData.book_cat_ids = this.bookData.book_cat_ids.substring(0,this.bookData.book_cat_ids.length-1);
    }
    console.log(this.bookData)
  }
// ----------------------------------电子书新增  所有资源--------
  //获取资源库里的电子书的资源列表
  _getRecouse(){
    this.AllResourceList = true;
    // ebookAllResource  AllResource_param
    this.service.post('/api/busiz/res/getlist',this.AllResource_param).then(success => {
      if(success.code==0){
          this.ebookAllResource = success.data.rows;
          this.AllResource_param.total = success.data.total;
          this.service.message.success(success.message);
      }else{
        this.ebookAllResource = [];
        this.AllResource_param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }
    //关闭弹窗
    AllResourceCancel($event) {
      this.AllResourceList = false;
      this.myForm.reset();
    }
    addTo(data){
      console.log(this.bookData);
      this.service.post('/api/busiz/book/res/save',{book_id:this.bookData.book_id,res_id:data.res_id,type:'add'}).then(success => {
        if(success.code==0){
          this.get_ebookResource();
            this.service.message.success(success.message);
        }else{
          
          this.service.message.error(success.message);
        }
      })
    }
    delTo(data){
      console.log(this.bookData);
      this.service.post('/api/busiz/book/res/save',{book_id:this.bookData.book_id,res_id:data.res_id,type:'del'}).then(success => {
        if(success.code==0){
          this.get_ebookResource();
            this.service.message.success(success.message);
        }else{
          
          this.service.message.error(success.message);
        }
      })
    }

    submit(){
      this.bookList = false;
      this.myForm.reset();
    }
// ------------------------------------------------------------ 电子书 end----------------
  //查看详情
  _see(data){
    this.bookData = {};
    this.seeList = true;
    this.bookData = {...data};
    console.log(this.bookData)
    this.nowTitle = "查看详情"
    this.bookData.book_type = this.param.book_type;
    if(this.bookData.book_type==1){
      //当图书时  获取二维码
      this.get_code();
    }else{
      //当电子书时 获取资源列表
      this.get_ebookResource();
    }
    this.selectedIndex = 2;
  } 
  //新增操作
  _add(){
    
    this.bookData = {};
    this.bookData.book_type = this.param.book_type;
    if(this.bookData.book_type==1){
      this.nowTitle = "图书新增页面";
    }else{
      this.nowTitle = "电子书新增页面";
    }
    console.log(this.param.book_type)
    this.bookList = true;
    this.selectedIndex = 2;
    this.bookData.publisher = "崇文书局";
  }
  // 修改操作
  _edit(data){
    console.log(data);
    this.bookData = {};
    this.bookData.book_type = this.param.book_type;
    if(this.bookData.book_type==1){
      this.nowTitle = "图书修改页面";
    }else{
      this.nowTitle = "电子书修改页面";
    }
    this.bookList = true;
    this.selectedIndex = 2;
    this.goToindex = 0;
    
    for(let i in data){
      this.bookData[i] = data[i];
    }
    this.publish_date = new Date(this.bookData.publish_date);
    this.cat_data = [];

    let arr_name = this.bookData.book_cat_names.split(",");
    let arr_id = this.bookData.book_cat_ids.split(",");

    for(let i in arr_id){
      this.cat_data.push({
        cat_id:arr_id[i],
        cat_name:arr_name[i]
      })
    }
 
  }
  //删除操作
  del(data){
    this.service.post('/api/busiz/book/del',{ids:[data.book_id]}).then(success => {
      if(success.code==0){
        this.load();
        this.service.message.success(success.message);
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  //批量删除
  delRows(){
    let ids = [];
    if (this.data.filter(value => value.checked).length < 1) {
      this.service.message.warning('你没有选择需要删除的数据内容!');
    }else{
      this.data.filter(value => value.checked).forEach(item => { ids.push(item.book_id) })
      this.service.post('/api/busiz/book/del',{ids:ids}).then(success => {
        if(success.code==0){
          this.load();
          this.service.message.success(success.message);
        }else{
          this.service.message.error(success.message);
        }
      })
    }
  }
  isVisiblePdf : boolean = false;
  pdfMinNum: number = 1;
  pdfModel: any = null;
  //关闭音频
  _bookCancel(event?) {
   
    this.isVisiblePdf = false;
   
  }
  // 预览
  bookSee(row){
    this.isVisiblePdf = true;
    this.pdfModel = row;
    this.pdfMinNum = 1;
  }

    //上一页
    pdfMinNum1() {
      if (this.pdfMinNum > 1) {
        this.pdfMinNum -= 1;
      }
    }
    //上一页
    pdfMinNum2() {
      if (this.pdfMinNum < this.pdfModel.res_size) {
        this.pdfMinNum += 1;
      }
    }

    daochu(){
      // bookResource
      let ids = ''
      for(let i in this.bookResource){
        console.log(i)
        ids +=this.bookResource[i].code_id+',';
      }
      ids = ids.substring(0,ids.length-1);
      // let doc = `<iframe style="display: none" src="${this.service.ctxPath}/api/busiz/code/export/ids=${data.code_id}"></iframe>`;
      let doc = document.createElement('iframe');
      doc.src = this.service.ctxPath + '/api/busiz/code/export?ids=' + ids;
      doc.style.display = 'none';
      // a.href =  this.service.ctxPath + '/api/busiz/code/export?ids=' + data.code_id;
      // a.target = '_blank';
      // a.download = '二维码.pdf';
      document.body.appendChild(doc);
      // a.click();
  }

  // 全选
  _checkAll(value) {
    if (value) {
      this.data.forEach(data => {
        if (!data.disabled) {
          data.checked = true;
        }
      });
    } else {
      this.data.forEach(data => data.checked = false);
    }
    this._refreshStatus();
  }
  _refreshStatus() {
    const allChecked = this.data.every(value => value.disabled || value.checked);
    const allUnChecked = this.data.every(value => value.disabled || !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }
  _refresh(){
    this._allChecked = false;
  }
  timeOut(d) {
    let m = new Date(d);
    let M, D, H, mm, ss;
    M = (m.getMonth() + 1) < 10 ? '0' + (m.getMonth() + 1) : (m.getMonth() + 1);
    D = m.getDate() < 10 ? '0' + m.getDate() : m.getDate();
    H = m.getHours() <10 ? '0'+m.getHours() : m.getHours();
    mm = m.getMinutes() <10 ? '0'+m.getMinutes() : m.getMinutes();
    ss = m.getSeconds() <10 ? '0'+m.getSeconds() : m.getSeconds();
    return m.getFullYear() + '-' + M + '-' + D + ' ' + H + ':' + mm + ':' + ss; 
  }

}
