import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-cw-info-class',
  templateUrl: './cw-info-class.component.html',
  styleUrls: ['./cw-info-class.component.css']
})
export class CwInfoClassComponent implements OnInit {

  param: any = {
    cat_id: null,
    children: []
  }
  paramCol: any = {
    searchText: null
  }
  paramSearch: any = {
    searchText: null
  }
  dataSet = [];
  tableData = [];
  _loading = false;
  formBean = {
    cat_id: null,
    cat_name: null,
    enabled: null,
    order_weight: null,
    create_time: null,
    cat_pid: null
  };
  expandDataCache = {};
  _isShow = false;//新建分类按钮是否显示
  constructor(public service: AppService) { }

  ngOnInit() {
    this._reload();
  }

  //////////////////tree转化
  collapse(array, data, $event) {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.cat_id === d.cat_id);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }
  convertTreeToList(root) {
    const stack = [], array = [], hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        if (this.param.cat_id == node.cat_id)
          this.param.children = node.children;
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }
  visitNode(node, hashMap, array) {
    if (!hashMap[node.cat_id]) {
      hashMap[node.cat_id] = true;
      array.push(node);
    }
  }
  //////////////////tree转化
  //获取资源分类
  _reload(bool?: any) {
    if (bool) {
      this.paramSearch.searchText = this.paramCol.searchText;
    }
    this.service.post('/api/busiz/book/cat/list', {
      searchText: this.paramSearch.searchText
    }).then(success => {
      this.dataSet = [{
        cat_id: 0,
        cat_name: '所有分类',
        children: success.data
      }];
      this.dataSet.forEach(item => {
        this.expandDataCache[item.cat_id] = this.convertTreeToList(item);
      });
      if (!this.param.cat_id)
        this.param = this.dataSet[0];
    })
  }
  //保存
  _saveRow() {
    if (!this.formBean.cat_name) {
      this.service.message.warning('请填写分类名称');
      return false;
    }
    if (!this.formBean.cat_id) {
      this.formBean.cat_pid = this.param.cat_id;
    }
    this.service.post('/api/busiz/book/cat/save', this.formBean).then(success => {
      if (success.code == 0) {
        for (let i in this.formBean) {
          this.formBean[i] = null;
        }
        this._reload();
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }
  //取消
  _cancelRow(row) {
    this.formBean = {
      cat_id: null,
      cat_name: null,
      enabled: null,
      order_weight: null,
      create_time: null,
      cat_pid: null
    };
    this._reload();
  }
  //选中
  _selectItem(row) {
    this.param = row;
    if(row.level==2){
      this._isShow = true;
    }else{
      this._isShow = false;
    }
  }
  //启用/停用
  _rowEnabled(row) {
    row.enabled = row.enabled == 1 ? 2 : 1;
    this.formBean = row;
    this._saveRow();
  }
  //新增
  _cwResClassAdd() {
    if(this.param.children.length>0 && this.param.children[0].cat_id==null){
      return false;
    }
    this.param.children.unshift(this.formBean);
  }
  //修改
  _editRow(row) {
    this.formBean = row;
  }
  //删除
  _delRow(row) {
    this.service.post('/api/busiz/book/cat/del', {
      ids: [row.cat_id]
    }).then(success => {
      if (success.code == 0) {
        this._reload();
      }
      else {
        this.service.message.error(success.message);
      }
    })
  }
}
