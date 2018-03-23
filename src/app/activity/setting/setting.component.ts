import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  constructor(public service: AppService) { }

  myForm: FormGroup;
  formBean: any = {
    user_contestant_count: null,   //用户给选手的总票数
    out_lock: null,                //5分钟超过多少票锁定选手	
    user_vote_count: null,         //用户每天可投票数量
    contestant_count: null,        //选手每天获得最大投票数	
  }

  ngOnInit() {
    this.myForm = this.service.fb.group({
      user_contestant_count: [null, [this.service.validators.required]],
      out_lock: [null, [this.service.validators.required]],
      user_vote_count: [null, [this.service.validators.required]],
      contestant_count: [null, [this.service.validators.required]]
    });
    this.reload();
  }
  reload() {
    this.service.post('/api/system/vote/setting/getSetting').then(success => {
      if (success.code == 0) {
        this.formBean = success.data;
      } else {
        this.service.message.error(success.message)
      }
    })
  }
  //提交
  _submitForm() {
    for (const i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
    }
    if (this.myForm.valid) {
      this.service.post('/api/system/vote/setting/save', this.formBean).then(success => {
        if (success.code == 0) {
          this.service.message.success(success.message);
          this.reload();
        }
        else {
          this.service.message.error(success.message);
        }
      })
    }
  }
}
