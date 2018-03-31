import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
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
  param : any = {
    pageNum:1,
    pageSize:10,
    searchText:null,
    book_type:1
  }

  selectedIndex = 0;
  tabs = [
    {book_type:1,content:"纸质图书"},{book_type:2,content:"电子书"}
  ]
  _loading : boolean = false;
  data : any = [];
  orderList : any = [
    {id:0,name:"取消订单"},
    {id:1,name:"待付款"},
    {id:2,name:"待发货"},
    {id:3,name:"待收货"},
    {id:4,name:"交易完成"}
  ]
  bookList = false;//图书新增
  seeList = false;//图书详情
  bookData = {};
  constructor(public service: AppService) { }

  load(reset?){
    if (reset == true) {
      this.param.pageNum = 1;
    }
    console.log(this.param)
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

  change(reset?){
    this.param.book_type = reset+1;
    this.load();
  }


  ngOnInit() {
    //加载图书列表
    this.load();
  }

  //关闭弹窗
  bookCancel($event) {
    this.bookList = false;
    this.seeList = false;
    this.myForm.reset();
  }
  //上传确定
  bookOk($event) {
    // this._submitbook();
  }

  //查看详情
  _see(data){

    this.seeList = true;
  } 
  //新增操作
  _add(){
    this.bookList = true;
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
