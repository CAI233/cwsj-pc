import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-cw-res-class',
  templateUrl: './cw-res-class.component.html',
  styleUrls: ['./cw-res-class.component.css']
})
export class CwResClassComponent implements OnInit {
  param: any = {
    key: null
  }
  dataSet = [];
  expandDataCache = {};
  constructor(public service: AppService) { }

  ngOnInit() {
    this._reload();
    this.dataSet.forEach(item => {
      this.expandDataCache[ item.key ] = this.convertTreeToList(item);
    });
  }

  //////////////////tree转化
  collapse(array, data, $event) {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key);
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
    stack.push({ ...root, level: 0, expand: false });

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
    if (!hashMap[ node.key ]) {
      hashMap[ node.key ] = true;
      array.push(node);
    }
  }
  //////////////////tree转化
  //获取资源分类
  _reload(){
    this.service.post('/api/busiz/cat/list',{
      searchText: null
    }).then(success => {
      console.log(success)
    })
  }
}
