import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
//表单 绑定规则、控件组、响应式表单验证（驱动式表单验证）
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//消息提示
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
declare let window: any;
@Injectable()
export class AppService {
    ctxPath: string; //服务器地址
    token: string; //用户登录标识
    loginUserInfo: any; //用户登录信息
    loginUserMenus: any; //用户菜单
    public validators: any = Validators;
    public formGroup: any = FormGroup;
    public formControl: any = FormControl;
    constructor(private http: Http, public router: Router, public routerInfo: ActivatedRoute,
        public message: NzMessageService, public confirm: NzModalService,
        public fb: FormBuilder) {
        this.ctxPath = 'http://gw.cjszyun.net';
        // this.ctxPath = 'http://work.cjszyun.net';
        // this.ctxPath = 'http://cjzww.cjszyun.cn';
        // this.ctxPath = 'http://192.168.2.43:8989/wk';
    }
    //系统初始化
    init(callback?: any) {
        let token = localStorage.getItem('token');
        let userInfo = localStorage.getItem('userInfo');
        let menus = localStorage.getItem('userMenus');
        if (token && userInfo && token != '' && userInfo != '' && menus && menus != '') {
            this.token = token;
            this.loginUserInfo = JSON.parse(userInfo);
            this.loginUserMenus = JSON.parse(menus);
            if (callback) {
                callback();
            }
        }
        else if (token && token != '') {
            localStorage.setItem('token', token);
            this.post('/api/system/login', {
                token: token
            }).then(success => {
                this.loginTo(success, callback);
            })
        }
    }
    //用户成功登录
    loginTo(success: any, callback?: any) {
        if (success.code == 0) {
            this.token = success.data.token;
            this.loginUserInfo = success.data;
            localStorage.setItem('userInfo', JSON.stringify(success.data));
            localStorage.setItem('token', success.data.token);
            this.post('/api/system/resource/menus').then(res => {
                if (res.code == 0) {
                    localStorage.setItem('userMenus', JSON.stringify(res.data));
                    this.loginUserMenus = res.data;
                }
                if (callback) {
                    callback();
                }
            })
        }
        else {
            if (callback) {
                callback();
            }
        }
    }
    //注销
    sessionOut() {
        this.token = null;
        this.loginUserInfo = null;
        this.loginUserMenus = null;
        localStorage.clear();
    }
    //post请求
    post(url: string, body?: any): Promise<any> {
        body = body ? body : { token: this.token };
        url = url.indexOf('http://') == -1 || url.indexOf('https://') == -1 ? this.ctxPath + url : url;
        let pos = this.http.post(url, body).toPromise();
        //异常就 设置为没有网络
        pos.catch(error => {
            this.message.error('接口异常!-' + url);
        })
        pos.then(res => {
            if (res['code'] == 600) {
                this.sessionOut();
            }
        })
        return pos;
    }
    //isLeaf转换
    _toisLeaf(root) {
        root.forEach(element => {
            if (element.children && element.children.length > 0) {
                element.isLeaf = false;
                this._toisLeaf(element.children);
            }
            else {
                element.isLeaf = true;
            }
        });
    }
}
