import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-cw-goods-list',
  templateUrl: './cw-goods-list.component.html',
  styleUrls: ['./cw-goods-list.component.css']
})
export class CwGoodsListComponent implements OnInit {
  myForm: FormGroup;

  _loading : boolean = false;
  _allChecked : boolean = false;
  _indeterminate : boolean = false;
  isVisibleMiddle : boolean = false;
  formTitle : string;
  data : any = [];//商品列表
  selRow : any = {};//提交的对象
  classData : any = [];//商品分类列表
  tagData : any = [];//商品标签
  brandData : any = [];//品牌标签
  param : any = {
    pageNum:1,
    pageSize:10,
  }
  paramCol = {
    searchTime:[null,null]
  }
  allRecourse : any = [];//所有资源
  ebookRecourse : any = [];//电子书资源
  nowRecourse : any = {};//资源详情
  isShow : boolean = false;//商品详情
  showData : any = {};//商品详情展示对象

  cat_data : any = null;

  isCollapse : boolean = true;
  selectedIndex: number = 0;
  isCheck : boolean = false;//资源列表开关
  constructor(public service: AppService) { }

  //文件上传
  fileUpload(info): void {
    if (info.file.response && info.file.response.code == 0) {
      this.selRow.goods_cover = info.file.response.data[0].url;
    }
  }

  // 商品列表
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    console.log(this.param)
    this._loading = true;
    this.service.post('/api/busiz/goods/getlist',this.param).then(success => {
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
// 获取分类
  get_class(){
    this.service.post('/api/busiz/goods/cat/tree',{enabled:1}).then(success => {
      if(success.code==0){
        this.classData = success.data;
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  // 获取标签
  get_tag(){
    this.service.post('/api/busiz/goods/tag/list',{pageNum:1,pageSize:1000}).then(success => {
      if(success.code==0){
        this.tagData = success.data.rows;
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  // 获取品牌标签
  get_brand(){
    this.service.post('/api/busiz/brand/brandlist').then(success => {
      if(success.code==0){
        this.brandData = success.data;
      }else{
        
        this.service.message.error(success.message);
      }
    })
  }
  // 获取每一种类型的资源
  get_recourse(){
    console.log(this.selRow.goods_type)
    if(this.selRow.goods_type==1 || this.selRow.goods_type==3){
      let book_type = this.selRow.goods_type ==3 ? 2 : 1;
      this.service.post('/api/busiz/book/list',{pageNum:1,pageSize:1000,book_type:book_type}).then(success => {
        if(success.code==0){
          this.allRecourse = success.data.rows;
          if(this.selRow.res_id){
            //得到当前资源文件的详情
            this.selected(this.selRow.res_id);
          }
        }else{
          this.service.message.error(success.message);
        }
      })
      
    }else{
      this.service.post('/api/busiz/video/getlist',{pageNum:1,pageSize:1000}).then(success => {
        if(success.code==0){
          this.allRecourse = success.data.rows;
          if(this.selRow.res_id){
            //得到当前资源文件的详情
            this.selected(this.selRow.res_id);
          }
        }else{
          this.service.message.error(success.message);
        }
      })
    }
    
  }
  //选择资源后显示资源内容
  
  selected(id ?){
    if(id){
      if(this.selRow.goods_type!=2){
        for(let i in this.allRecourse){
          if(this.allRecourse[i].book_id== id){
            this.nowRecourse = {...this.allRecourse[i]};
            break;
          }
        }
      }else{
        for(let i in this.allRecourse){
          if(this.allRecourse[i].video_id== id){
            this.nowRecourse = {...this.allRecourse[i]}
            break;
          }
        }
      }
      console.log(this.nowRecourse)
      // 在查看详情时不需要带出资源
      if(!this.showData.res_id){
        // 获取当前电子书的资源列表
        if(this.selRow.goods_type==3){
          // 获取电子书资源
          this.service.post('/api/busiz/book/res/list',{book_id:this.selRow.res_id}).then(success => {
            if(success.code==0){
              this.ebookRecourse = success.data;
            }else{
              this.service.message.error(success.message);
            }
          })
        }
        // 获取当前视频的资源列表
        if(this.selRow.goods_type==2){
          // 获取视频资源
          this.service.post('/api/busiz/video/detail',{video_id:this.selRow.res_id}).then(success => {
            if(success.code==0){
              this.ebookRecourse = success.data.videoResRelList;
            }else{
              this.service.message.error(success.message);
            }
          })
        }
        }
      }
  }

  get_tagName(id ?){
    let name = '';
    if(id){
      for(let i in this.brandData){
          if(this.brandData[i].brand_id == id){
            name += this.brandData[i].brand_name;
          }
      }
    }
    return name;
  }

  //查询
  reload(reset?){
    if(reset){

      if(this.param.cat_ids && this.param.cat_ids.length>0){
        this.param.cat_id = this.param.cat_ids[this.param.cat_ids.length-1];
      }
      if(this.paramCol.searchTime[0]!=null) this.param.start_time = this.timeOut(this.paramCol.searchTime[0]);
      if(this.paramCol.searchTime[1]!=null) this.param.start_time = this.timeOut(this.paramCol.searchTime[1]);
      this.load();
    }

  }
  // 重置
  resetForm(){
    this.param = {
      pageNum:1,
      pageSize:10
    }
    this.paramCol.searchTime = [null,null];
    this.load();
  }

  // 顶部标签页转换
  change(rest?){
    if(this.selectedIndex==0){
      this.isVisibleMiddle = false;
    }
  }
  //关闭tab
  closeTab() {
    this.isVisibleMiddle = false;
    this.selectedIndex = 0;
    this.myForm.reset();
  }

  now_change(rest?){
    if(rest.length>0){
      console.log(rest);
      
      this.selRow.goods_cat_id = rest[rest.length-1].cat_id;
      this.selRow.goods_cat_name = rest[rest.length-1].cat_name;
      this.selRow.goods_cat_ids = '';
      this.selRow.goods_cat_names = '';
      for(let i in rest){
        this.selRow.goods_cat_ids += rest[i].cat_id+',';
        this.selRow.goods_cat_names += rest[i].cat_name+',';
      }
      this.selRow.goods_cat_ids = this.selRow.goods_cat_ids.substring(0,this.selRow.goods_cat_ids.length-1);
      this.selRow.goods_cat_names = this.selRow.goods_cat_names.substring(0,this.selRow.goods_cat_names.length-1);
    }
  }

  //关闭弹窗
  handleCancelMiddle($event) {
    this.isVisibleMiddle = false;
    this.myForm.reset();
  }

  //确定
  handleOkMiddle($event) {
    this._submitForm();
  }

  // 新增操作
  add(){
    if(!this.param.goods_type){
      this.service.message.warning("请选择一个商品类型")
      return false;
    }
    this.selRow.goods_type = this.param.goods_type
    this.ebookRecourse = [];//清空资源
    this.nowRecourse = [];//清空当前图书，电子书，视频资源详情

    this.isVisibleMiddle = true;
    this.selRow.discount = 1;
    if(this.selRow.goods_type==1){
      this.formTitle = '新增图书商品'
    }else if(this.selRow.goods_type==2){
      this.formTitle = '新增音视频商品'
    }else{
      this.formTitle = '新增电子书商品'
    }
    this.selectedIndex = 1;
    // 获取当前类型的资源
    
  }
  // 修改操作
  edit(data){
    console.log(data)
    this.isVisibleMiddle = true;
    if(this.selRow.goods_type==1){
      this.formTitle = '修改图书商品'
    }else if(this.selRow.goods_type==2){
      this.formTitle = '修改音视频商品'
    }else{
      this.formTitle = '修改电子书商品'
    }
    this.selRow = {...data};
    this.selRow.goods_tag_ids = this.selRow.tag_ids;
    this.cat_data = [];

    let arr_name = this.selRow.goods_cat_names.split(",");
    let arr_id = this.selRow.goods_cat_ids.split(",");

    for(let i in arr_id){
      this.cat_data.push({
        cat_id:arr_id[i],
        cat_name:arr_name[i]
      })
    }
    // 获取当前类型的资源
    this.get_recourse();
  }


  //取消操作
  _ShowCancel($event){
    this.isShow = false;
    this.myForm.reset();
  }

  // 查看所属分类的资源列表
  _onCheck(){
    this.isCheck = true;
    this.get_recourse();
  }
  //
  _CheckCancel($event){
    this.isCheck = false;
    this.myForm.reset();
  }

  //查看商品详情 
  show(data){
    this.isShow = true;
    this.nowRecourse = {};
    this.showData = {...data};
    // 得到当前商品的资源
    this.selRow.goods_type = this.showData.goods_type;
    this.selRow.res_id = this.showData.res_id;
    this.get_recourse();
  }

  // 删除操作
  del(data){
    this.service.post('/api/busiz/goods/del',{ids:[data.goods_id]}).then(success => {
      if(success.code==0){
        this.load();
        this.service.message.success(success.message);
      }else{
        this.service.message.error(success.message);
      }
  })
  }

  //上架状态
  _enabled(data ?){
    if(this.service.validataAction('cw_goods_list_put')){
      let status = data.enabled == 1 ? 2 : 1 ;
      this.service.post('/api/busiz/goods/shelves',{ids:[data.goods_id],enabled:status}).then(success => {
        if(success.code==0){
          this.load();
          this.service.message.success(success.message);
        }else{
          this.service.message.error(success.message);
        }
    })
    }
  }


  // 折后价
  sum(){
    setTimeout(_=>{
      this.selRow.price = this.selRow.price == null ? 0 : this.selRow.price;
      this.selRow.discount = this.selRow.discount == null ? 0 : this.selRow.discount;
      this.selRow.real_price = ((parseInt(this.selRow.price))*(parseInt(this.selRow.discount))*0.1).toFixed(2)
    },50)
  }
  _goTo(){
    this.selectedIndex = 3;
  }


  //提交
  _submitForm(){
    console.log(this.selRow);
    console.log(this.nowRecourse);
    // if(!this.selRow.res_id){
    //   this.service.message.warning('请选择一个文件!');
    //   return false;
    // }
    if(this.selRow.cat_ids){
      let class_id = this.selRow.cat_ids[this.selRow.cat_ids.length-1];
      if(typeof(class_id)=='object'){
        this.selRow.goods_cat_id = parseInt(class_id.cat_id);
      }else{
        this.selRow.goods_cat_id = parseInt(class_id) == null ? '' : parseInt(class_id);
      }
    }
    if(this.selRow.tag_ids){
      // goods_tag_ids
      if(typeof(this.selRow.tag_ids)!='object'){
        this.selRow.goods_tag_ids = this.selRow.tag_ids.split(",");
      }else{
        this.selRow.goods_tag_ids = this.selRow.tag_ids
      }
    }
    this.selRow.goods_cover = this.nowRecourse.book_cover == null ? this.nowRecourse.video_cover : this.nowRecourse.book_cover;
    this.service.post('/api/busiz/goods/save',this.selRow).then(success => {
        if(success.code==0){
          this.load();
          this.isVisibleMiddle = false;
          this.myForm.reset();
          this.service.message.success(success.message);
        }else{
          this.service.message.error(success.message);
        }
    })
  } 

  ngOnInit() {
    this.myForm = this.service.fb.group({
      goods_name: false,
      goods_cat_id:false,
      goods_tag_ids:false,
      goods_brand_id:false,
      key_word:false,
      book_isbn:false,
      publisher:false,
      author_name:false,
      publish_date:false,
      price:false,
      discount:false,
      real_price:false,
      inventory:false,
      limit_buy:false,
      remark:false,
      res_id:false
    })


    // 加载商品列表
    this.load();

    //加载商品分类
    this.get_class();
    // 加载商品标签
    this.get_tag();
    // 加载品牌列表
    this.get_brand();
  }

  //视频资源操作
  isVisibleVideo: boolean = false;
  //电子书资源操作
  isVisiblePdf : boolean = false;
  pdfMinNum: number = 1;
  pdfModel: any = null;
  videoModel : any = null;
  //关闭音频
  _bookCancel(event?) {
    this.isVisiblePdf = false;
    this.pdfModel = null;
  }
  _vedioCancel(event?){
    this.isVisibleVideo = false;
    this.videoModel = null;
  }
  // 预览
  bookSee(row){
    if(this.selRow.goods_type==2){
      this.isVisibleVideo = true;
      this.videoModel = row;
    }
    if(this.selRow.goods_type==3){
      this.isVisiblePdf = true;
      this.pdfModel = row;
    this.pdfMinNum = 1;
    }
    
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

  timeOut(d) {
    let m = new Date(d);
    let M, D, H, mm, ss;
    M = (m.getMonth() + 1) < 10 ? '0' + (m.getMonth() + 1) : (m.getMonth() + 1);
    D = m.getDate() < 10 ? '0' + m.getDate() : m.getDate();
    //   H = m.getHours() <10 ? '0'+m.getHours() : m.getHours();
    //   mm = m.getMinutes() <10 ? '0'+m.getMinutes() : m.getMinutes();
    //   ss = m.getSeconds() <10 ? '0'+m.getSeconds() : m.getSeconds();
    // return m.getFullYear() + '-' + M + '-' + D + ' ' + H + ':' + mm + ':' + ss; 
    return m.getFullYear() + '-' + M + '-' + D;
  }
}
