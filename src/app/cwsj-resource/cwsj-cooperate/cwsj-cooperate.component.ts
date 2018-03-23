import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-cwsj-cooperate',
  templateUrl: './cwsj-cooperate.component.html',
  styleUrls: ['./cwsj-cooperate.component.css']
})
export class CwsjCooperateComponent implements OnInit {
  tableData: any = [];
  tableDataTree: any = [];
  editRow: any = {};
  // 实例化一个对象
  constructor(public service: AppService) { }
  ngOnInit() {
    this.load();
  }
  load() {
    this._loading = true;
    this.service.post('/api/busiz/cat/coopertion/gettree').then(success => {
      this.tableData = success.data
      this.service._toisLeaf(this.tableData);
      this._expanData();
      this._loading = false;
    })
  }
  expandDataCache = {};
  expandDataCacheCol = {};
  _expanData() {
    this.expandDataCacheCol = this.expandDataCache;
    this.expandDataCache = {};
    this.tableData.forEach(item => {
      this.expandDataCache[item.cat_id] = this.convertTreeToList(item);
    });
  }
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
      const nodeCol = this.expandDataCacheCol[root.cat_id];
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          let expand = false;
          if (nodeCol) {
            let col = null;
            nodeCol.forEach(mm => {
              if (mm.cat_id == node.children[i].cat_id)
                col = mm;
            })
            if (col) {
              expand = col.expand;
            }
          }
          stack.push({ ...node.children[i], level: node.level + 1, expand: expand, parent: node });
        }
        //父级tree节点创建
        if (node.parent) {
          node.pname = [];
          if (node.parent.pname) {
            node.parent.pname.forEach(element => {
              node.pname.push({
                cat_id: element.cat_id,
                cat_name: element.cat_name
              });
            });
          }
          node.pname.push({
            cat_id: node.parent.cat_id,
            cat_name: node.parent.cat_name
          });
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

  //编辑
  _editRow(data) {
    for (let i in data) {
      this.editRow[i] = data[i];
    }
    data.disabled = true;
  }
  //取消编辑
  _cancel(data) {
    this.editRow = {};
    this.load();
  }
  _loading: boolean = false;
  //保存
  _saveRow() {
    if (!this.editRow.cat_name) {
      this.service.message.error('请填写分类名称');
      return false;
    }
    if (!this.editRow.pname) {
      this.service.message.error('请选择父级');
      return false;
    }
    else {
      let pid = this.editRow.pname[this.editRow.pname.length - 1];
      if (typeof (pid) == 'object') {
        pid = pid.cat_id;
      }
      this.editRow.cat_pid = pid == 0 ? null : pid;
    }
    this._loading = true;
    this.editRow.parent = null;
    this.editRow.children = null;
    this.service.post('/api/busiz/cat/coopertion/save', this.editRow).then(success => {
      if (success.code == 0) {
        this.editRow = {};
        this.load();
      }
      else {
        this._loading = false;
        this.service.message.error(success.message);
      }
    })
  }
  //删除
  _delete(data) {
    this.service.post('/api/busiz/cat/coopertion/del', {
      mark: 'del',
      ids: [data.cat_id]
    }).then(success => {
      this.load();
    })
  }
  //新增同级
  _addAfter(parent: any) {
    this.editRow = {
      enabled: 1,
      remark: null,
      address: null,
      dept_code: null,
      dept_path: null,
      cat_id: null,
      org_id: parent.org_id,
      pname: parent.pname || [],
      cat_name: null,
      disabled: true,
      isLeaf: true
    }
    this.editRow.pname.push({ cat_id: parent.cat_id, cat_name: parent.cat_name })
    if (!parent.children) parent.children = [];
    parent.children.push(this.editRow)
    this._expanData();
  }
  //新增子级
  _addChildren(parent) {
    console.log(parent)
    parent.expand = true;
    this.editRow = {
      enabled: 1,
      remark: null,
      address: null,
      dept_code: null,
      dept_path: null,
      cat_id: null,
      org_id: parent.org_id,
      pname: parent.pname || [],
      cat_name: null,
      disabled: true,
      isLeaf: true
    }
    this.editRow.pname.push({ cat_id: parent.cat_id, cat_name: parent.cat_name })
    if (!parent.children) parent.children = [];
    parent.children.push(this.editRow);
    this._expanData();
  }

}
