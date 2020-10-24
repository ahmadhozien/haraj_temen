import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform, NavController} from '@ionic/angular';
import { ApiService } from '../api.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';
@Component({
  selector: 'app-myads',
  templateUrl: './myads.page.html',
  styleUrls: ['./myads.page.scss'],
})
export class MyadsPage implements OnInit {

  products = [];
  uid      = this.authService.token;
  logged   = this.authService.isLoggedIn;
  uname    = '';
  urank    = '';
  constructor(
    private router: Router, 
    public plt: Platform, 
    public api: ApiService, 
    public navCtrl: NavController,
    public alertController : AlertController,
    private authService: AuthService, 
    private userdata: UserService,
    private alert:AlertService, 
    private loading: LoadingService,
    ) {
      this.plt.ready().then(()=>{
        this.guser();
        this.have_session();
        this.runapi();
      });
    }

  ngOnInit() {
  }

  runapi()
  {
    this.api.getAPI("&req=my_products",{uid:this.uid})
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

  async delete(pid) {
    const alert = await this.alertController.create({
      header: 'حذف الإعلان',
      message: '<strong>هل تريد حذف الإعلان؟</strong>',
      cssClass: 'alert',
      buttons: [
        {
          text: 'إلغاء',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'حذف',
          cssClass: 'danger',
          handler: () => {
            this.loading.presentLoading();
            this.api.getAPI("&req=delete&tbl=products&id="+pid)
            .then(data => {
              data = JSON.parse(data.data);
              if(data['posts']['status'] == 1)
              {
                this.alert.presentToast('تم حذف المنتج بنجاح');
                this.runapi();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
