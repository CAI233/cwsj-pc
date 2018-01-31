import { Component, OnInit, transition } from '@angular/core';
import { retry } from 'rxjs/operator/retry';
import { AppService } from '../app.service';

declare let layui: any;
declare let jQuery: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginPage implements OnInit {

  login_type: number = 0; //登录方式
  user_name: string; //用户名
  user_pwd: string; //密码
  loading: boolean = false; //form提交状态
  constructor(private service: AppService) { }

  ngOnInit() {
    localStorage.clear();
    jQuery.cookie('token', '');
    this.user_name = jQuery.cookie('USERNAME');
    this.user_pwd = jQuery.cookie('USERPWD');
  }
  //文档初始化
  ngAfterViewInit() {
    layui.use('form', function () {
      layui.form.render();
    });
  }
  //登录
  submit() {
    this.loading = true;
    this.service.post('/admin/login', {
      user_name: this.user_name,
      user_pwd: this.user_pwd
    }).then(success => {
      if (success.code == 0) {
        jQuery.cookie('USERNAME', this.user_name);
        jQuery.cookie('USERPWD', this.user_pwd);
        this.service.loginTo(success, () => {
          if (this.service.loginUserMenus) {
            this.service.router.navigate(['/home']);
          }
          else {
            layui.layer.msg('获取权限失败, 请重新再试~');
            this.loading = false;
          }
        })
      }
      else {
        layui.layer.msg(success.message);
        this.loading = false;
      }
    })
  }
  //修改登录方式
  update_login_type() {
    this.login_type = this.login_type ? 0 : 1;
  }
  //获取页面背景
  getLoginBg(n: number): boolean {
    let date = new Date();
    let m = date.getMonth();
    if (m >= 2 && m <= 4 && n == 1) {
      return true;
    }
    else if (m >= 5 && m <= 9 && n == 2) {
      return true;
    }
    else if (m >= 10 && m <= 11 && n == 3) {
      return true;
    }
    else if (n == 4) {
      return true;
    }
  }
}
