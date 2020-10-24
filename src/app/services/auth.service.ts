import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertService } from './alert.service';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token:any;
  constructor(public api: ApiService,
  private storage: NativeStorage,
  public plt: Platform,
  private alert:AlertService)
  {}

  login(mail,pass) {
    return this.api.getAPI('&req=login', {user: mail, password: pass})
      .then(data => {
        data = JSON.parse(data.data);
        if (data['posts']['status'] == 1) {
          this.alert.presentToast('تم تسجيل الدخول بنجاح');
          this.storage.setItem('token', data['posts']['id']);
          this.storage.setItem('name' , data['posts']['name']);
          this.storage.setItem('rank' , data['posts']['rank']);
          this.token = data['posts']['id'];
          return this.isLoggedIn = true;
        } else {
          this.alert.presentToast('عفواً رقم الهاتف أو كلمة المرور غير صحيحة');
        }
      });
  }
 
  signup(name,mail,pass,type,phone) { 
    return this.api.getAPI('&req=signup&type='+type+'&phone='+phone, {name: name, user: mail, password: pass})
      .then(data => {
        data = JSON.parse(data.data); 
        if (data['posts']['status'] == 1) {
          this.alert.presentToast(data['posts']['details']);
          return this.isLoggedIn = true;
        } else {
          this.alert.presentToast(data['posts']['details']);
        }
      });
  }

  logout() {
    return this.storage.remove("token").then(()=>
    {
      delete this.token;
      this.isLoggedIn = false;
      if(this.isLoggedIn === false)
      {
        this.alert.presentToast('تم تسجيل الخروج بنجاح');
      }
    });
  }

  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }
  
}
