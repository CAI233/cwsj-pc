import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
declare let jQuery: any;
@Injectable()
export class AppService {
    ctxPath: string; //服务器地址
    token: string; //用户登录标识
    loginUserInfo: any; //用户登录信息
    constructor(private http: Http, private router: Router) {
        this.ctxPath = 'http://192.168.2.43:8996';
        // this.ctxPath = 'http://work.cjszyun.net';
        this.ctxPath = 'http://cjzww.cjszyun.cn';
        // this.ctxPath = 'http://192.168.2.43:8989/wk';
    }
    //系统初始化
    init(callback?: any) {
        let token = jQuery.cookie('token');
        let userInfo = jQuery.cookie('userInfo');
        if (token && userInfo && token != '' && userInfo != '') {
            this.token = token;
            this.loginUserInfo = JSON.parse(userInfo);
        }
        if (callback) {
            callback(userInfo);
        }
        let param = {
            // user_name: '18696199399',
            user_name: 'caitianxu',
            user_pwd: '477466'
        }
        this.post('/admin/login', param).then(success => {
            if(success.code == 0){
                this.token = success.data.token;
                this.loginUserInfo = success.data;
                jQuery.cookie('token', success.data.token);
                jQuery.cookie('userInfo', JSON.stringify(success.data));

                this.post('/admin/sysResource/json/getMenus',{
                    org_id: 1
                }).then(res => {
                    console.log(res)
                })
            }
        })
    }
    //注销
    sessionOut(){
        this.token = null;
        this.loginUserInfo = null;
        jQuery.cookie('token', '');
        jQuery.cookie('userInfo', '');
        this.router.navigate['/login'];
    }
    //post请求
    post(url: string, body?: any): Promise<any> {
        body = body ? body : {};
        url = url.indexOf('http://') == -1 || url.indexOf('https://') == -1 ? this.ctxPath + url : url;
        body.token = this.token ? this.token : body.token;
        console.log(url)
        console.log(body)
        let pos = this.http.post(url, body).toPromise();
        //异常就 设置为没有网络
        pos.catch(error => {
            console.log(error)
        })
        pos.then(res => {
            if(res['code'] == 600){
                this.sessionOut();
            }
        })
        return pos;
    }

}