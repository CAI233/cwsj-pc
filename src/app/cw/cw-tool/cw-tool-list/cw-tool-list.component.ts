import { Component, OnInit ,ViewChild} from '@angular/core';
import { AppService } from '../../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-cw-tool-list',
  templateUrl: './cw-tool-list.component.html',
  styleUrls: ['./cw-tool-list.component.css']
})
export class CwToolListComponent implements OnInit {
  myForm: FormGroup;
  // @ViewChild("upload_ids") upload_ids;
  param : any= {
    searchText: null,
    pageNum: 1,
    pageSize: 10,
  }
  paramCol = {
    searchText: null,
    searchTime: null,
    res_class_ids: null,
    res_cat_id: null,
    res_type: null
  }
  isCollapse: boolean = true;
  _loading: boolean = false;
  _upload: boolean = false;
  tableData: any = [];

  _allChecked = false; //全选
  _indeterminate = false; //半选
  formBean: any = {
    res_id: null,
    res_name: null,
    res_cat_name: null
  };

  upload_cat_ids : any = null;
  constructor(public service: AppService) { }

  ngOnInit() {

    this.myForm = this.service.fb.group({
      context:false,
      upload_cat_id:false,
      upload_label_id:false,
      upload_id:false,
      startpage:false,
      endpage:false,
      page:false
    })
    this._reload();

    // 获取资源分类
    this.get_calss();
  }

  //查询
  _reload(reset?) {
    if (reset == true) {
      this.param.pageNum = 1;
    }
    this._loading = true;
    this.service.post('/api/busiz/dict/upload/list', this.param).then(success => {
      this._loading = false;
      if(success.code==0){
        this.tableData = success.data.rows;
        this.param.total = success.data.total;
        this.param.pages = success.data.pages;
      }else{
        this.tableData = [];
        this.param.total = 0;
        this.service.message.error(success.message);
      }
      
    })
  }

  class_data : any = [];//资源分类
  // 
  get_calss(){
    this.service.post('/api/busiz/dict/cat/list',{pageNum:1,pageSize:1000}).then(success => {
      if(success.code==0){
        this.class_data = success.data.rows;
      }else{
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
  //半选
  _refreshStatus() {
    const allChecked = this.tableData.every(value => value.disabled || value.checked);
    const allUnChecked = this.tableData.every(value => value.disabled || !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }
  //重置
  _resetForm() {
    this.paramCol.searchText = null;
    this.paramCol.searchTime = null;
    this.paramCol.res_class_ids = null;
    this.paramCol.res_cat_id = null;
    this.paramCol.res_type = null;
    this._reload(true);
  }
  // 删除
  del(data){
    this.service.post('/api/busiz/dict/upload/del', { upload_id: data.upload_id}).then(success => {
      if (success.code == 0) {
        this._reload(true);
        this.service.message.success(success.message);
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }
  //删除
  _delRow(row) {
    this.service.post('/api/busiz/res/del', { ids: [row.res_id] }).then(success => {
      if (success.code == 0) {
        this._reload(true);
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }

  upload_param : any = {}
  fileList : any = [];
  uploadList : boolean = false;

  _uploadDisabled: boolean = false;
  _loadingFile: any = null;

  //上传
  upload(){
    this.upload_param = {};
    this.fileList = [];
    this.uploadList = true;
  }
  _beforeUpload(file, fileList){
    console.log(file);
    // if(file.name.indexOf(".pdf")!=-1){
    //   let span =  document.createElement('span');
    //   span.innerHTML = '<i class="anticon anticon-close" style="color: #fff;padding: 3px;background: red;border-radius: 50%;vertical-align: inherit;margin-right: 5px;"></i>文件上传名字里不能包含空格';
    //   span.style.cssText = 'position:absolute;top:45px;z-index:999;left:50%;padding:10px 15px;width:250px;background:#fff;box-shadow:1px 1px 1px 0.5px #b1b1b1;border-radius:5px;'
    //   document.body.appendChild(span);
    //   setTimeout(function(){
    //     span.style.display = "none";
    //     span.remove();
    //   },1500)
    //   return false;
    // }
  }


  //文件上传
  fileUpload(info): void {
    if (info.file.response && info.file.response.code == 0) {
      this.upload_param.file_name = info.file.response.data.file_name;
      this.upload_param.upload_url = info.file.response.data.upload_url;
    }
  }

    //关闭弹窗
    uploadCancel($event) {
      this.uploadList = false;
      // this.upload_ids._lastValue = [];
      this.myForm.reset();
    }
    uploadOk($event){
      if (!this.upload_param.upload_name) {
        this.service.message.warning('请填写资源名称!');
        return false;
      }
      if (!this.upload_param.cat_arr || !this.upload_param.cat_arr.cat_id) {
        this.service.message.warning('请选择资源分类!');
        return false;
      }
      this.upload_param.cat_id = this.upload_param.cat_arr.cat_id;
      this.upload_param.cat_name = this.upload_param.cat_arr.cat_name;
      if (!this.upload_param.start_page ) {
        this.service.message.warning('请填写正文起始页码!');
        return false;
      }
      if (!this.upload_param.end_page ) {
        this.service.message.warning('请填写正文结束页码!');
        return false;
      }
      if (!this.upload_param.end_page ) {
        this.service.message.warning('请填写开始内容页码!');
        return false;
      }
      if (!this.upload_param.file_name || !this.upload_param.upload_url ) {
        this.service.message.warning('请选择上传文件!');
        return false;
      }
      
      this.service.post('/api/busiz/dict/upload/save', this.upload_param).then(success => {
        if(success.code==0){
          this.uploadList = false;
          this._reload();
          this.myForm.reset();
          this.service.message.success(success.message);
        }else{
          this.service.message.error(success.message);
        }
        
      })

    }

  isVisibleAudio: boolean = false;
  isVisibleVideo: boolean = false;
  isVisiblePdf: boolean = false;
  audioModel: any = null;
  videoModel: any = null;
  pdfModel: any = null;
  pdfMinNum: number = 1;
  //预览
  _fwRow(row) {
    console.log(row)
    if(!row.anaylsis_url){
      this.service.message.warning("请稍后，还在解析中···");
      this._reload();
      return false;
    }

      this.isVisiblePdf = true;
      this.pdfModel = row;
      this.pdfMinNum = 1;
    
  }
  //关闭音频
  _handleCancelAudio(event?) {
    this.isVisibleAudio = false;
    this.audioModel = null;
    this.isVisibleVideo = false;
    this.videoModel = null;
    this.isVisiblePdf = false;
    this.pdfModel = null;
  }
  //上一页
  pdfMinNum1() {
    if (this.pdfMinNum > 1) {
      this.pdfMinNum -= 1;
    }
  }
  //上一页
  pdfMinNum2() {
    if (this.pdfMinNum < this.pdfModel.file_num) {
      this.pdfMinNum += 1;
    }
  }
}
