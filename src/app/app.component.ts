import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //路由列表
  menuList: Array<{ title: string, module: string, power: string, select: boolean }> = [];
  activeMenu: any;
  // 2.构造函数实例化router对象
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title, private service: AppService) {
    //检测当前是否登录
    this.service.init();
    //路由事件
    this.router.events.filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        //路由data的标题
        let title = event['title'];
        this.menuList.forEach(p => p.select = false);
        var menu = { title: title, module: event['module'], power: event['power'], select: true };
        this.titleService.setTitle(title);
        let exitMenu = this.menuList.find(info => info.title == title);
        this.activeMenu = menu;
        if(menu.module != 'login' && (!this.service.token || this.service.token == '')){
          this.router.navigate(['/login']);
          this.menuList = [];
        }
        if (exitMenu) {//如果存在不添加，当前表示选中
          this.menuList.forEach(p => p.select = p.title == title);
          return;
        }
        this.menuList.push(menu);
      });
  }
  //是否需要显示X
  isMain(module) {
    if (module == '' || !module || module == 'home')
      return false;
    else
      return true;
  }
  //关闭选项标签
  closeUrl(module: string, select: boolean) {
    //当前关闭的是第几个路由
    let index = this.menuList.findIndex(p => p.module == module);
    //如果只有一个不可以关闭
    if (this.menuList.length == 1) return;

    this.menuList = this.menuList.filter(p => p.module != module);
    //删除复用
    if (!select) return;
    //显示上一个选中
    let menu = this.menuList[index - 1];
    if (!menu) {//如果上一个没有下一个选中
      menu = this.menuList[index + 1];
    }
    this.menuList.forEach(p => p.select = p.module == menu.module);
    //显示当前路由信息
    this.router.navigate(['/' + menu.module]);
  }

  toDetail() {
    //3.路由跳转，Router：负责在执行时路由的对象，可以通过调用navigate（）和navigateByUrl()方法导航到另一个路由
    this.router.navigate(['/detail']);
  }
}
