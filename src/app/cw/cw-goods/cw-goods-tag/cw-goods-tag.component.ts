import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-cw-goods-tag',
  templateUrl: './cw-goods-tag.component.html',
  styleUrls: ['./cw-goods-tag.component.css']
})
export class CwGoodsTagComponent implements OnInit {
  _loading : boolean = false;
  isVisible : boolean = false;
  goods_isVisible : boolean = false;
  formTitle : string;
  myForm: FormGroup;
  data : any = [];//品牌列表
  nowList : any = {
    brand_code:null,
    brand_id:null,
    brand_name:null,
    create_time:null,
    remark:null 
  }
  goods_data : any = []; //商品列表
  nowGlist : any ={create_time:null,is_delete:null,tag_id:null,tag_name:null,update_time:null}
  selRow : any = {};
  goods_selRow : any = {};
  param : any = {
    pageNum:1,
    pageSize:10,
    searchText:null
  }
  goods_param : any = {
    pageNum:1,
    pageSize:10,
    searchText:null
  }

  edRow : any = null;

  constructor(public service: AppService) { }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      brand_code: false,
      brand_name:false,
      remark:false,
      tag_name:false
    })


    // 加载品牌列表
    this.load();

    // 加载商品列表
    this.goods_load();
  }

  // 项目列表
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    console.log(this.param)
    this._loading = true;
    this.service.post('/api/busiz/brand/getlist',this.param).then(success => {
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
  goods_load(reset?){
    if (reset == true) {
      this.goods_param.pageNum = 1;
    }
    console.log(this.goods_param)
    this._loading = true;
    this.service.post('/api/busiz/goods/tag/list',this.goods_param).then(success => {
      this._loading = false;
      if(success.code==0){
        this.goods_data = success.data.rows;
        this.goods_param.total = success.data.total;
      }else{
        this.goods_data = [];
        this.goods_param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }

  //品牌标签查询
  reload(reset?){
    if(reset){
        this.load();
    }

  }
  //品牌标签查询
  goods_reload(reset?){
    if(reset){
        this.goods_load();
    }

  }
  // 品牌搜索重置
  resetForm(){
    this.param.searchText = null;
    this.load();
  }
  // 商品搜索重置
  goods_resetForm(){
    this.goods_param.searchText = null;
    this.goods_load();
  }

  //品牌新增操作
  add(){
    console.log(this.data)
    if(this.data.length>0 && this.data[0].brand_id==null){
      return false;
    }
    this.selRow = {};
    this.data.unshift(this.nowList);
  }
  //商品新增操作 
  goods_add(){
    if(this.goods_data.length>0 && this.goods_data[0].tag_id==null){
      return false;
    }
    this.goods_selRow = {};
    this.goods_data.unshift(this.nowGlist)
  }
  // 品牌修改操作
  edit(data){
    this.selRow = {...data};
    
    this.edRow = this.selRow.brand_id;
  }
  // 品牌取消
  _cancel(){
    this.edRow = null;
    this.load();
  }

  // 商品修改操作
  goods_edit(data){
    this.goods_selRow = {...data};
    this.edRow = this.goods_selRow.tag_id
  }
  // 商品取消
  goods_cancel(){
    this.edRow = null;
    this.goods_load();
  }
  
  //品牌删除操作
  del(data){
    this.service.post('/api/busiz/brand/del',{ids:[data.brand_id]}).then(success => {
      if(success.code==0){
        this.load();
        this.service.message.success(success.message);
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  //商品删除操作
  goods_del(data){
    this.service.post('/api/busiz/goods/tag/del',{ids:[data.tag_id]}).then(success => {
      if(success.code==0){
        this.goods_load();
        this.service.message.success(success.message);
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  //品牌提交
  _saveRow(){
    // if(!this.selRow.brand_code){
    //   this.service.message.error('请填写品牌编码');
    //   return false;
    // }
    if(!this.selRow.brand_name){
      this.service.message.error('请填写标签名称');
      return false;
    }
    this.service.post('/api/busiz/brand/save',this.selRow).then(success => {
        if(success.code==0){
          this.load();
          this.edRow = null;
          this.service.message.success(success.message);
        }else{
          this.service.message.error(success.message);
        }
    })
  }  
  //商品提交
  goods_saveRow(){
    if(!this.goods_selRow.tag_name){
      this.service.message.error('请填写标签名称');
      return false;
    }
    this.service.post('/api/busiz/goods/tag/save',this.goods_selRow).then(success => {
        if(success.code==0){
          this.goods_load();
          this.edRow = null;
          this.service.message.success(success.message);
        }else{
          this.service.message.error(success.message);
        }
    })
  } 
  
  // 全选
  _allChecked : boolean = false;
  _indeterminate : boolean = false;
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

   // 全选
   _goods_allChecked : boolean = false;
   _goods_indeterminate : boolean = false;
    // 全选
    _goods_checkAll(value) {
     if (value) {
       this.goods_data.forEach(data => {
         if (!data.disabled) {
           data.checked = true;
         }
       });
     } else {
       this.goods_data.forEach(data => data.checked = false);
     }
     this._goods_refreshStatus();
   }
   _goods_refreshStatus() {
     const allChecked = this.goods_data.every(value => value.disabled || value.checked);
     const allUnChecked = this.goods_data.every(value => value.disabled || !value.checked);
     this._goods_allChecked = allChecked;
     this._indeterminate = (!allChecked) && (!allUnChecked);
   }
}
