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
  data : any = [];
  param : any = {
    pageNum:1,
    pageSize:10,
    goods_type:null,//商品名称
    tag_id:null,//标签id
    cat_id:null,//分类id
    enabled:null,//上架状态
    start_time:null,
    end_time:null
  }
  paramCol = {
    searchTime:[null,null]
  }
  constructor(public service: AppService) { }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      test: false,
      project_name:false,
      
    })


    // 加载商品列表
    this.load();
  }

  // 项目列表
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

  reload(reset?){
    if(reset){

    }

  }
  // 重置
  resetForm(){
    
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
}
