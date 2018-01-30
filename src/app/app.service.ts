import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

declare let jQuery: any;
@Injectable()
export class AppService {
    ctxPath: string; //服务器地址
    constructor(public http: Http) {
        this.ctxPath = 'http://cjszyun.cn';
    }
    //post请求
    post(url: string, body?: any): Promise<any> {
        body = body ? body : {};
        //url = url.indexOf('http://') == -1 || url.indexOf('https://') == -1 ? this.ctxPath + url : url;
        url = this.ctxPath + url;
        // body = jQuery.param(body);
        console.log(url)
        console.log(body)
        //let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        //let options = new RequestOptions({headers: headers});
        let pos = this.http.post(url, body).toPromise();
        //异常就 设置为没有网络
        pos.catch(error => {
            console.log('异常')
        })
        return pos;
    }
   
}