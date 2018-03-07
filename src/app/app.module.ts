import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

//国际化
import { NZ_LOCALE, zhCN } from 'ng-zorro-antd';
//web ui
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';
//路由
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
//页面
import { ErrorPage404 } from './404/404';
import { HomePage } from './home/home';
import { ResourcePage } from './resource/resource';
import { LoginPage } from './login/login';
import { UsersPage } from './users/users';
import { RolePage } from './role/role';
import { OrgPage } from './org/org';
import { OutfitPage } from './outfit/outfit';
import { MessagePage } from './message/message';
import { AuthorityPage } from './authority/authority';
import { PayPage } from './pay/pay';
//公共服务
import { Http, HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { HttpService } from './http.service';
//消息提示

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions) {
  let service = new HttpService(xhrBackend, requestOptions);
  return service;
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorPage404, HomePage, LoginPage, 
    ResourcePage, UsersPage, RolePage, OrgPage, OutfitPage, MessagePage,AuthorityPage,PayPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot()
  ],
  providers: [
    { provide: NZ_LOCALE, useValue: zhCN },
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } },
    HttpService,
    {
      provide: Http,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions]
    },
    AppService,
    //hash url
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
