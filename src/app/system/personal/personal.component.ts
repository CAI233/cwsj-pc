import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  _loading: boolean = true;
  // 实例化一个对象
  constructor(public service: AppService, ) { }
  //表单
  myForm: FormGroup;
  myForm2: FormGroup;
  myMess  = this.service.loginUserInfo
  
  formBean : any = {}
  formBean2: any = {
    old_pwd:null,
    new_pwd:null,
    confirm_new_pwd:null,
  }

  ngOnInit() {
    //加载个人基本信息
    this.load();
    this.myForm = this.service.fb.group({
      user_name: [null, [this.service.validators.required]],
      user_real_name: false,
      dept_name:false,
      role_name:false,
      email: false,
      phone: false,
    })
    this.myForm2 = this.service.fb.group({
      old_pwd: [null, [this.service.validators.required]],
      new_pwd: [null, [this.service.validators.required]],
      confirm_new_pwd: [null, [this.service.validators.required, this.confirmationValidator]],
    })
    console.log(this.formBean)
  }

  load(){
    console.log(this.myMess)
    this.service.post("/api/system/user/my",{user_id:this.myMess.user_id}).then(success => {
      if(success.code==0){
        console.log(success);
        this.formBean = success.data; 
      }

      // this.formBean = 
    })
  }



  getFormControl(name) {
    return this.myForm2.controls[name];
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.myForm2.controls['new_pwd'].value) {
      return { confirm: true, error: true };
    }
  };
  //修改个人信息提交
  _submitForm() {
    console.log(this.formBean)
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }

    const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!this.formBean.email) {
      this.service.message.warning('请填写邮箱发送地址!');
      return false;
    } else if (!EMAIL_REGEXP.test(this.formBean.email)) {
      this.service.message.warning('请填写正确的邮箱地址!');
      return false;
    }
    const PHONE_REGEXP = /^1[3|4|5|7|8][0-9]{9}$/;
    if (!this.formBean.phone) {
      this.service.message.warning('请填写手机号!');
      return false;
    } else if (!PHONE_REGEXP.test(this.formBean.phone)) {
      this.service.message.warning('请填写正确的手机号!');
      return false;
    }
    if (this.myForm.valid) {
      // this.formBean.user_pwd = "123456";
      this.service.post("/api/system/user/save", this.formBean).then(success => {
        if (success.code == 0) {
          this.service.loginUserInfo = success.data
          this.isVisibleMiddle = false;
        }
        else {
          this.service.message.error(success.message);
        }
      })
    }
  }
  //提交
  _submitForm2() {
    console.log(this.formBean2)
    if(this.formBean2.old_pwd === this.formBean2.new_pwd){
      this.service.message.warning("新密码不能和旧密码相同")
      return false;
    }
    // for (const i in this.myForm.controls) {
    //   this.myForm2.controls[i].markAsDirty();
    // }
    if (this.myForm.valid) {
      // this.formBean.user_pwd = "123456";
      this.service.post("/api/system/user/updatePwd", this.formBean2).then(success => {
        if (success.code == 0) {
          this.service.loginUserInfo = success.data
          this.service.message.success("修改密码成功");
          this.isVisibleMiddle2 = false;

        }
        else {
          this.service.message.error(success.message);
        }
      })
    }
  }

  //文件上传
  fileUpload(info): void {
    if (info.file.response && info.file.response.code == 0) {
      this.formBean.icon = info.file.response.data[0].url;
    }
  }

  //表单
  isVisibleMiddle: boolean = false;
  isVisibleMiddle2: boolean = false;
  formTitle: string;
  //打开
  showModalMiddle(bean?: any) {
    console.log(bean)
    if (bean && bean === 'pwd') {
      this.isVisibleMiddle2 = true;
    } else {
      this.isVisibleMiddle = true;
    }
  }
  //关闭
  handleCancelMiddle($event) {
    this.isVisibleMiddle = false;
    this.isVisibleMiddle2 = false;
  }
  //确定
  handleOkMiddle($event) {
    this._submitForm();
  }
  //确定
  handleOkMiddle2($event) {
    this._submitForm2();
  }
  updateConfirmValidator() {
    setTimeout(_ => {
      this.myForm2.controls['confirm_new_pwd'].updateValueAndValidity();
    });
  }
}
