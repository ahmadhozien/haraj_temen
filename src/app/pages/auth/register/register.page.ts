import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform, Events } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  umail  = '';
  uphone = '';
  upass  = '';
  uname  = '';
  token  = '';
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

  async gologin()
  {
    this.dismissLogin();
    const loginmodal = await this.modalController.create({
      component: LoginPage
    });
    return await loginmodal.present();
  }

  register()
  {
    this.loading.presentLoading();
    this.authService.signup(this.uname,this.umail,this.upass,'0',this.uphone);
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
