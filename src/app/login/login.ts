import { Component, OnInit } from '@angular/core';
import { retry } from 'rxjs/operator/retry';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginPage implements OnInit {

  login_type: number = 0;
  constructor() { }

  ngOnInit() {
    
  }
  //修改登录方式
  update_login_type(){
    this.login_type = this.login_type ? 0 : 1;
  }
  //获取页面背景
  getLoginBg(): string{
    let date = new Date();
    let m = date.getMonth();
    if(m >=2 && m <= 4){
      return 'bg0';
    }
    else if(m >=5 && m <= 9){
      return 'bg1';
    }
    else if(m >=10 && m <= 11){
      return 'bg2';
    }
    else{
      return 'bg3';
    }
  }
}
