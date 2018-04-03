import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-cw-msg-com',
  templateUrl: './cw-msg-com.component.html',
  styleUrls: ['./cw-msg-com.component.css']
})
export class CwMsgComComponent implements OnInit {
  myForm: FormGroup;

  _loading : boolean = false;
  _allChecked : boolean = false;
  _indeterminate : boolean = false;
  isVisibleMiddle : boolean = false;
  goToindex : number = 0;
  data : any = [];//商品列表
  classData : any = [];//分类列表
  tagData : any = [];//标签列表
  param : any = {
    pageNum:1,
    pageSize:10
  }
  //评论列表操作对象
  comment_param : any = {
    pageNum:1,
    pageSize:10,
    total:0,
    searchTime:[null,null]
  }
  commentData : any = []; //评论列表
  goodsType : any =[
    {id:1,name:"实体书"},
    {id:2,name:"音视频"},
    {id:3,name:"电子书"}
  ]

  constructor(public service: AppService) { }

  // 商品列表
  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    console.log(this.param)
    this._loading = true;
    this.service.post('/api/busiz/goods/getcommentlist',this.param).then(success => {
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
// 获取分类列表
  get_class(){
    this.service.post('/api/busiz/goods/cat/tree').then(success => {
      if(success.code==0){
        this.classData = success.data;
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  // 获取标签列表
  get_tag(rest?){
    let tag_id = null;
    if(rest){
      tag_id = rest;
    }
    this.service.post('/api/busiz/goods/tag/list',{pageNum:1,pageSize:10,tag_id:tag_id}).then(success => {
      if(success.code==0){
        this.tagData = success.data.rows;
      }else{
        this.service.message.error(success.message);
      }
    })
  }

  //获取评论列表
  get_commentslist(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/comments/list',this.comment_param).then(success => {
      if(success.code==0){
        this.commentData = success.data.rows;
        this.comment_param.total = success.data.total;
        this._loading = false;
      }else{
        this.commentData = [];
        this.comment_param.total = 0;
        this.service.message.error(success.message);
      }
    })

  }


  //获取到搜索分类id
  search_change(rest?){
    console.log(rest)
    if(rest.length>0){
      this.param.cat_id = rest[rest.length-1].cat_id;
    }
  } 

  //查询
  reload(reset?){
    if(reset){
      this.load();
    }
  }
  resetForm(){
    this.param.searchText = null;
    this.param.goods_type = null;
    this.param.tag_id = null;
    this.param.cat_ids = null;
    this.param.cat_id = null;
    this.load();
  }

  //评论查询
  comment_reload(rest?){
    if (rest) {
      this.comment_param.pageNum = 1;
    }
    console.log(this.comment_param)
    if (this.comment_param.searchTime.length > 0) {
      this.comment_param.date_begin = this.comment_param.searchTime[0] == null ? null : this.timeOut(this.comment_param.searchTime[0]);
      this.comment_param.date_end = this.comment_param.searchTime[1] == null ? null : this.timeOut(this.comment_param.searchTime[1]);
    }
    this.get_commentslist()
  }
  //清除查询条件
  comment_resetForm(){
    this.comment_param.searchText = null;
    this.comment_param.searchTime = [null,null];
    this.comment_param.date_begin = null;
    this.comment_param.date_end = null;
    this.get_commentslist()
    // this.load();
  }

  //查看评论 
  see(data){
    this.goToindex =1;
    this.comment_param.goods_id = data.goods_id;
    this.get_commentslist();
  }

  // 删除评论
  del(data){
    this.service.post('/api/busiz/comments/del',{ids:[data.id]}).then(success => {
      if(success.code==0){
        this.get_commentslist();
        this.service.message.success(success.message);
      }else{
        this.service.message.error(success.message);
      }
    })
  }
  //一键删除
  delRows(){
    let ids = [];
    if (this.data.filter(value => value.checked).length < 1) {
      this.service.message.warning('你没有选择需要删除的数据内容!');
    }else{
      this.commentData.filter(value => value.checked).forEach(item => { ids.push(item.id) });
      this.service.post('/api/busiz/comments/del',{ids:ids}).then(success => {
        if(success.code==0){
          this.get_commentslist();
          this.service.message.success(success.message);
        }else{
          this.service.message.error(success.message);
        }
      })
    }
  }


  ngOnInit() {

    // 加载商品列表
    this.load();
    //加载商品分类
    this.get_class();
    // 加载商品标签
    this.get_tag();
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
// 评论全选
comment_checkAll(value){
  if (value) {
    this.commentData.forEach(data => {
      if (!data.disabled) {
        data.checked = true;
      }
    });
  } else {
    this.commentData.forEach(data => data.checked = false);
  }
  this.comment__refreshStatus();
}

_refreshStatus() {
  const allChecked = this.data.every(value => value.disabled || value.checked);
  const allUnChecked = this.data.every(value => value.disabled || !value.checked);
  this._allChecked = allChecked;
  this._indeterminate = (!allChecked) && (!allUnChecked);
}
comment__refreshStatus() {
  const allChecked = this.commentData.every(value => value.disabled || value.checked);
  const allUnChecked = this.commentData.every(value => value.disabled || !value.checked);
  this._allChecked = allChecked;
  this._indeterminate = (!allChecked) && (!allUnChecked);
}

//时间转换
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
