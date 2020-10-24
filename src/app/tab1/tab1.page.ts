import { Component } from '@angular/core';
import { MenuController, AlertController, Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform, NavController, ToastController, LoadingController} from '@ionic/angular';
import { ApiService } from '../api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  products = [];
  token    = this.authService.token;
  logged   = this.authService.isLoggedIn;
  uname    = '';
  uid      = '';
  urank    = '';
  constructor(private menu: MenuController,
    private router: Router, 
    public plt: Platform, 
    public api: ApiService, 
    public navCtrl: NavController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private geolocation: Geolocation,
    public alert: AlertService,
    public alertController : AlertController,
    private authService: AuthService,
    private userdata: UserService,
    public events: Events
    )
  {
    this.plt.ready().then(()=>{
      this.api.getAPI("&req=products")
      .then(data => {
        data = JSON.parse(data.data);
        this.products = data['posts'];
      });

      this.guser();
      this.have_session();
    });
    window.setInterval(function(){
      this.runapi();
    }, 60000);
    events.subscribe('user:created', () => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.have_session();
    });
  }

  openmenu(id) {
    this.menu.enable(true, id);
    this.menu.open(id);
  }

  runapi()
  {
    this.api.getAPI("&req=products")
        .then(data => {
          data = JSON.parse(data.data);
          this.products = data['posts'];
        });
  }
  doRefresh(event) {
    setTimeout(() => {
      this.runapi();
      event.target.complete();
    }, 100);
  }

  async fire_search() {
    const alert = await this.alertController.create({
      header: 'بحث في المنتجات',
      cssClass: 'alert',
      inputs: [
        {
          name: 'key',
          type: 'text',
          placeholder: 'ادخل الكلمة التي تود البحث عنها'
        }
      ],
      buttons: [
        {
          text: 'بحث',
          cssClass: 'primary',
          handler: data => {
            this.api.getAPI("&req=search",{k:data.key})
            .then(data => {
              data = JSON.parse(data.data);
              this.products = data['posts'];
            });
          }
        }
      ]
    });

    await alert.present();
  }

  show_product(pid)
  {
    this.navCtrl.navigateForward(`/showproduct/${pid}`);
  }

  guser()
  {
    this.userdata.getuser('name').then((data) => {
      this.uname = this.userdata.uval;
    });
    this.userdata.getuser('token').then((data) => {
      this.uid = this.userdata.uval;
    });
    this.userdata.getuser('rank').then((data) => {
      this.urank = this.userdata.uval;
    });
  }

  have_session()
  {
    this.authService.getToken().then(() => {
      this.logged = this.authService.isLoggedIn;
    });
  }

  header_pages(page)
  {
    if(this.logged == false)
    {
      this.alert.presentToast('عفواً الرجاء تسجيل الدخول أولاً');
    }
    else{
      this.navCtrl.navigateForward(page);
    }
  }
}
