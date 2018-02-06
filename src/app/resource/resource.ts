import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
@Component({
  selector: 'app-resource',
  templateUrl: './resource.html',
  styleUrls: ['./resource.css']
})
export class ResourcePage implements OnInit {

  private tableData: any = [];
  private editRow: any = {};
  // 实例化一个对象
  constructor(private service: AppService) { }

  ngOnInit() {
    this.load();
  }
  load(){
    this._loading = true;
    this.service.post('/admin/sysResource/json/list',{
      org_id: this.service.loginUserInfo ? this.service.loginUserInfo.org_id : 1
    }).then(success => {
      this.tableData = success.data;
      this.tableData.forEach(item => {
        this.expandDataCache[ item.res_id ] = this.convertTreeToList(item);
      });
      this._loading = false;
      console.log(success)
    })
  }
  expandDataCache = {};
  collapse(array, data, $event) {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.res_id === d.res_id);
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
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[ i ], level: node.level + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  visitNode(node, hashMap, array) {
    if (!hashMap[ node.res_id ]) {
      hashMap[ node.res_id ] = true;
      array.push(node);
    }
  }

  //编辑
  _editRow(data){
    for(let i in data){
      this.editRow[i] = data[i];
    }
  }
  //取消编辑
  _cancel(data){
    this.editRow = {};
  }
  _loading: boolean = false;
  //保存
  _saveRow(){
    if(!this.editRow.res_name){
      this.service.message.error('请填写资源名称');
      return false;
    }
    if(this.editRow.res_id == 0){
      this.editRow.res_id = null;
    }
    this._loading = true;
    this.service.post('/admin/sysResource/json/update_sysResource',this.editRow).then(success => {
      console.log(success)
      if(success.code == 0){
        this.editRow = {};
        this.load();
      }
      else{
        this.service.message.error(success.message);
      }
    })
  }
  //删除
  _delete(data){
    console.log(data)
    this.service.post('/admin/sysResource/json/delete_sysResource',{
      mark: 'del',
      res_ids: [data.res_id]
    }).then( success => {
      this.load();
    })
  }
  options: any = [{
    label: '菜单',
    value: 1
  },{
    label: '按钮',
    value: 2
  }]
}
