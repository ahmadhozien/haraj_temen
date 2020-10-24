import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform, NavController, ToastController, LoadingController} from '@ionic/angular';
import { ApiService } from '../api.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-estates',
  templateUrl: './estates.page.html',
  styleUrls: ['./estates.page.scss'],
})
export class EstatesPage implements OnInit {

  products = [];
  token    = this.authService.token;
  logged   = this.authService.isLoggedIn;
  uname    = '';
  uid      = '';
  urank    = '';
  constructor(
    private menu: MenuController,
    private router: Router, 
    public plt: Platform, 
    public api: ApiService, 
    public navCtrl: NavController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    private authService: AuthService,
    private userdata: UserService,
    public alert: AlertService)
  {
    this.plt.ready().then(()=>{
      this.runapi('عقار');
      this.guser();
      this.have_session();
    });
  }

  ngOnInit() {
    window.setInterval(function(){
      this.runapi('عقار');
    }, 60000);
  }

  openmenu(id) {
    this.menu.enable(true, id);
    this.menu.open(id);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.runapi('عقار');
      event.target.complete();
    }, 100);
  }

  runapi(key)
  {
    this.api.getAPI("&req=search",{k:key})
        .then(data => {
          data = JSON.parse(data.data);
          this.products = data['posts'];
        });
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
