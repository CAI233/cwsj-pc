import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
declare let jQuery: any;
declare let layer: any;
@Injectable()
export class AppService {
    ctxPath: string; //服务器地址
    token: string; //用户登录标识
    loginUserInfo: any; //用户登录信息
    loginUserMenus: any; //用户菜单
    constructor(private http: Http, public router: Router) {
        this.ctxPath = 'http://192.168.2.43:8994';
        // this.ctxPath = 'http://work.cjszyun.net';
        // this.ctxPath = 'http://cjzww.cjszyun.cn';
        // this.ctxPath = 'http://192.168.2.43:8989/wk';
    }
    //系统初始化
    init(callback?: any) {
        let token = localStorage.getItem('token');
        token = token ? token : jQuery.cookie('token');
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
            this.post('/admin/login', {
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
            jQuery.cookie('token', success.data.token);
            localStorage.setItem('userInfo', JSON.stringify(success.data));
            localStorage.setItem('token', success.data.token);
            this.post('/admin/sysResource/json/getMenus').then(res => {
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
        jQuery.cookie('token', '');
        localStorage.clear();
        this.router.navigate['/login']
    }
    //post请求
    post(url: string, body?: any): Promise<any> {
        body = body ? body : { token: this.token };
        url = url.indexOf('http://') == -1 || url.indexOf('https://') == -1 ? this.ctxPath + url : url;
        let pos = this.http.post(url, body).toPromise();
        //异常就 设置为没有网络
        pos.catch(error => {
            layer.msg('接口异常!-' + url);
        })
        pos.then(res => {
            if (res['code'] == 600) {
                this.sessionOut();
            }
        })
        return pos;
    }

}