import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-cw-win',
  templateUrl: './cw-win.component.html',
  styleUrls: ['./cw-win.component.css']
})
export class CwWinComponent implements OnInit {
  myForm: FormGroup;

  _loading: boolean = false;
  _allChecked: boolean = false;
  _indeterminate: boolean = false;
  isVisibleMiddle: boolean = false;
  isGoods: boolean = false;
  formTitle: string;
  goToindex: number = 0;
  data: any = [];//商品列表
  windowData: any = {}//橱窗对象
  param: any = {
    pageNum: 1,
    pageSize: 10,
    total: 0
  }
  //橱窗里商品列表操作对象
  goods_param: any = {
    pageNum: 1,
    pageSize: 10,
    total: 0
  }
  // 商品列表
  goodsparam: any = {
    pageNum: 1,
    pageSize: 10,
    total: 0
  }
  goodsData: any = []; //橱窗里商品列表
  goodsallData: any = [];//商品列表
  classData: any = [];//分类列表
  tagData: any = [];//标签列表
  // 商品类型
  goodsType: any = [
    { id: 1, name: "实体书" },
    { id: 2, name: "音视频" },
    { id: 3, name: "电子书" }
  ]

  constructor(public service: AppService) { }

  // 橱窗列表
  load(reset?) {
    if (reset == true) {
      this.param.pageNum = 1;
    }
    console.log(this.param)
    this._loading = true;
    this.service.post('/api/busiz/window/list', this.param).then(success => {
      this._loading = false;
      if (success.code == 0) {
        this.data = success.data.rows;
        this.param.total = success.data.total;
      } else {
        this.data = [];
        this.param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }

  //获取橱窗里商品列表
  get_goodslist(reset?) {
    if (reset == true) {
      this.goodsparam.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/window/goodslist', this.goods_param).then(success => {
      if (success.code == 0) {
        this.goodsData = success.data.rows;
        this.goods_param.total = success.data.total;
        this._loading = false;
      } else {
        this.goodsData = [];
        this.goods_param.total = 0;
        this.service.message.error(success.message);
      }
    })
  }
  // 获取商品列表
  get_goods() {
    this.service.post('/api/busiz/goods/getlist', this.goodsparam).then(success => {
      if (success.code == 0) {
        this.goodsallData = success.data.rows;
        this.goodsparam.total = success.data.total;
        this._loading = false;
      } else {
        this.goodsallData = [];
        this.goodsparam.total = 0;
        this.service.message.error(success.message);
      }
    })
  }
  // 获取分类列表
  get_class() {
    this.service.post('/api/busiz/goods/cat/tree').then(success => {
      if (success.code == 0) {
        this.classData = success.data;
      } else {
        this.service.message.error(success.message);
      }
    })
  }
  // 获取标签列表
  get_tag(rest?) {
    let tag_id = null;
    if (rest) {
      tag_id = rest;
    }
    this.service.post('/api/busiz/goods/tag/list', { pageNum: 1, pageSize: 10, tag_id: tag_id }).then(success => {
      if (success.code == 0) {
        this.tagData = success.data.rows;
      } else {
        this.service.message.error(success.message);
      }
    })
  }

  //获取到分类id
  search_change(rest?) {
    console.log(rest)
    if (rest.length > 0) {
      this.goodsparam.cat_id = rest[rest.length - 1].cat_id;
    }
  }


  //查询
  reload(reset?) {
    if (reset) {
      this.goodsparam.cat_ids = null;
      this.get_goods();
    }
  }
  resetForm() {
    this.goodsparam.searchText = null;
    this.goodsparam.goods_type = null;
    this.goodsparam.tag_id = null;
    this.goodsparam.cat_ids = null;
    this.goodsparam.cat_id = null;
    this.get_goods();
  }

  //关闭弹窗
  Cancel($event) {
    this.isVisibleMiddle = false;
    this.isGoods = false;
    this.myForm.reset();
  }

  //确定
  Ok($event) {
    // this._submitForm();
    if (!this.windowData.window_name) {
      this.service.message.warning('请填写橱窗名!');
      return false;
    }
    if (!this.windowData.order_weight) {
      this.service.message.warning('请填写序号!');
      return false;
    }
    // if (!this.windowData.max_count) {
    //   this.service.message.warning('请填写数量!');
    //   return false;
    // }
    if (!this.windowData.remark) {
      this.service.message.warning('请填写简介!');
      return false;
    }
    this.service.post('/api/busiz/window/save', this.windowData).then(success => {
      if (success.code == 0) {
        this.load();
        this.isVisibleMiddle = false;
        this.service.message.success(success.message);
      } else {
        this.service.message.error(success.message);
      }
    })

  }

  //新增操作
  _add() {
    this.formTitle = '创建橱窗';
    this.isVisibleMiddle = true;
    this.windowData = {};
  }
  // 修改操作
  _edit(data) {
    this.formTitle = '修改橱窗';
    this.isVisibleMiddle = true;
    this.windowData = {};
    for (let i in data) {
      this.windowData[i] = data[i];
    }
  }
  //删除操作
  _del(data) {
    this.service.post('/api/busiz/window/del', { ids: [data.window_id] }).then(success => {
      if (success.code == 0) {
        this.load();
        this.service.message.success(success.message);
      } else {
        this.service.message.error(success.message);
      }
    })
  }
  //查看橱窗 
  _set(data) {
    this.goToindex = 1;
    this.goods_param.window_id = data.window_id;
    this.get_goodslist();
  }
  // 橱窗里商品删除
  goods_del(data) {
    this.service.post('/api/busiz/window/rmconfig', { window_id: this.goods_param.window_id, goods_id: data.goods_id }).then(success => {
      if (success.code == 0) {
        this.get_goodslist();
        this.service.message.success(success.message);
      } else {
        this.service.message.error(success.message);
      }
    })
  }
  //新增商品
  _add_goods() {
    this.formTitle = '新增商品';
    this.isGoods = true;
    this.get_goods();
  }
  //选择商品后添加
  addTo(data) {
    this.service.post('/api/busiz/window/config', { window_id: this.goods_param.window_id, goods_id: data.goods_id }).then(success => {
      if (success.code == 0) {
        this.get_goodslist();
        this.service.message.success(success.message);
      } else {
        this.service.message.error(success.message);
      }
    })

  }


  // del(data){
  //   this.service.post('/api/busiz/comments/del',{ids:[data.id]}).then(success => {
  //     if(success.code==0){
  //       this.get_goodslist();
  //       this.service.message.success(success.message);
  //     }else{
  //       this.service.message.error(success.message);
  //     }
  //   })
  // }
  // //一键删除
  // delRows(){
  //   let ids = [];
  //   if (this.data.filter(value => value.checked).length < 1) {
  //     this.service.message.warning('你没有选择需要删除的数据内容!');
  //   }else{
  //     this.goodsData.filter(value => value.checked).forEach(item => { ids.push(item.id) });
  //     this.service.post('/api/busiz/comments/del',{ids:ids}).then(success => {
  //       if(success.code==0){
  //         this.get_goodslist();
  //         this.service.message.success(success.message);
  //       }else{
  //         this.service.message.error(success.message);
  //       }
  //     })
  //   }
  // }


  ngOnInit() {
    this.myForm = this.service.fb.group({
      window_name: false,
      order_weight: false,
      max_count: false,
      remark: false
    })
    // 加载商品列表
    this.load();

    //获取分类
    this.get_class();
    // 获取标签
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
  _refreshStatus() {
    const allChecked = this.data.every(value => value.disabled || value.checked);
    const allUnChecked = this.data.every(value => value.disabled || !value.checked);
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

  _enabled(data){
    if(this.service.validataAction('cw_win_enable')){
      data.enabled = data.enabled == 1 ? 2 : 1 ;
      this.service.post('/api/busiz/window/save',data).then(success => {
        if(success.code==0){
          this.load();
          this.service.message.success(success.message);
        }else{
          this.service.message.error(success.message);
        }
    })
    }
  }
}
