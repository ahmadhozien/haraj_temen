import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Events } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  umail = '';
  upass = '';
  token = '';
  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private loading: LoadingService,
    public  plt: Platform,
    public events: Events
  )
  {
    this.plt.ready().then(()=>{
      this.have_session();
    });
  }

  ngOnInit() {
  }

  dismissLogin() {
    this.modalController.dismiss();
  }

  async gosignup()
  {
    this.dismissLogin();
    const registerModal = await this.modalController.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }

  login()
  {
    this.loading.presentLoading();
    this.authService.login(this.umail,this.upass).then(() => {
        if(this.authService.isLoggedIn == true) {
          this.token    = this.authService.token;
          this.createUser(this.token);
          this.navCtrl.navigateForward('');
          this.dismissLogin();
        }
      }
    );
  }
  createUser(token) {
    this.events.publish('user:created', token, Date.now());
  }
  have_session()
  {
    this.authService.getToken().then(() => {
      if(this.authService.isLoggedIn == true) {
        this.navCtrl.navigateForward('');
        this.dismissLogin();
      }
    });
  }
}
