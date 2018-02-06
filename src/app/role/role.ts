import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { retry } from 'rxjs/operator/retry';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-role',
  templateUrl: './role.html',
  styleUrls: ['./role.css']
})
export class RolePage implements OnInit {
  myForm: FormGroup;
  userName: string; //用户名
  password: string; //密码
  loading: boolean = false; //form提交状态
  //构造
  constructor(private service: AppService, private fb: FormBuilder) { }
  //开始加载
  ngOnInit() {
   
  }
}
