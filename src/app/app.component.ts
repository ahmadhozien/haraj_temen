import { Component } from '@angular/core';

import { Platform, NavController, MenuController, ModalController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginPage } from './pages/auth/login/login.page';
import { RegisterPage } from './pages/auth/register/register.page';
import { FavsPage } from './favs/favs.page';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  logged  = this.authService.isLoggedIn;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private menu: MenuController,
    private modalController: ModalController,
    private authService: AuthService,
    private loading: LoadingService,
    public events: Events
  ) {
    this.initializeApp();

    this.platform.ready().then(()=>{
      this.have_session();
    });
    events.subscribe('user:created', () => {
      this.have_session();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#073245');
      this.splashScreen.hide();
    });
  }

  go_search(key)
  {
    this.navCtrl.navigateForward(`/cars/${key}`);
    this.menu.close('sections');
  }

  go_to(page)
  {
    this.navCtrl.navigateForward(page);
    this.menu.close('main');
  }

  async logs(page) {
    if(page == 'LoginPage'){
      const modal = await this.modalController.create({
          component: LoginPage
      });
      return await modal.present();
    }
    else if(page == 'FavsPage')
    {
      const modal = await this.modalController.create({
          component: FavsPage
      });
      return await modal.present();
    }
    else
    {
      const modal = await this.modalController.create({
        component: RegisterPage
      });
      return await modal.present();
    }
  }

  logout()
  {
    this.loading.presentLoading();
    this.authService.logout().then(() => {
      if(this.authService.isLoggedIn == false) {
        this.menu.close('main');
        this.navCtrl.navigateRoot('/tab1');
        this.logged = false;
      }
    });
  }

  have_session()
  {
    this.authService.getToken().then(() => {
      this.logged = this.authService.isLoggedIn;
    });
  }
}
