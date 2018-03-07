import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-authority',
  templateUrl: './authority.html',
  styleUrls: ['./authority.css']
})
export class AuthorityPage implements OnInit {

  private tableTreeData: any = [];
  private tableData: any = [];
  private editRow: any = {};
  //角色list
  private roleRow: any = [];
  param: any = {
    role_id:null,
    pid:null,
    total: 0,
    pageSize: 10,
    pageNum: 1
  };
  constructor(private service: AppService) { }
  ngOnInit() {
    this.load();
  }
  load() {
    // 获取角色列表
    this.service.post('/api/system/role/list', {
      pageNum: 1,
      pageSize: 1000
    }).then(success => {
      this.roleRow = success.data.rows;
      this.param.role_id = this.roleRow[0].role_id;
      console.log(this.param)
      //得到当前角色的权限列表
      this._get_menu_tree();
    })
    // this._loading = true;
  }
  _get_menu_tree() {
    this.service.post('/api/system/resource/list', {
      org_id: this.service.loginUserInfo ? this.service.loginUserInfo.org_id : 1
    }).then(success => {

      this.tableTreeData = [{
        org_id: this.service.loginUserInfo.org_id,
        res_id: 0,
        res_name: '根节点',
        children: success.data
      }];
      this.service._toisLeaf(this.tableTreeData);

      console.log(this.tableTreeData)
      this._expanData();
      //   this._loading = false;
    })
  }

  _get_list() {
    this.param.pid=0;
    this.service.post('/api/system/resource/list', this.param).then(success => {
        if(success.code==0){
         
        }else{

        }
        console.log(success);
    })
  }

  expandDataCacheCol = {};
  expandDataCache = {};

  _expanData() {
    this.expandDataCacheCol = this.expandDataCache;
    this.expandDataCache = {};
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.res_id] = this.convertTreeToList(item);
    });
  };


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
    event.stopPropagation();
  }

  convertTreeToList(root) {
    const stack = [], array = [], hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      const nodeCol = this.expandDataCacheCol[root.res_id];

      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          let expand = false;
          if (nodeCol) {
            let col = null;
            nodeCol.forEach(mm => {
              if (mm.res_id == node.children[i].res_id)
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
                res_id: element.res_id,
                res_name: element.res_name
              });
            });
          }
          node.pname.push({
            res_id: node.parent.res_id,
            res_name: node.parent.res_name
          });
        }
      }
    }

    return array;
  }

  visitNode(node, hashMap, array) {
    if (!hashMap[node.res_id]) {
      hashMap[node.res_id] = true;
      array.push(node);
    }
  }


  _enabled() {
    console.log(1);
  }

  //查询
  reload() {

  }
  //重置
  reset() {

  }

}