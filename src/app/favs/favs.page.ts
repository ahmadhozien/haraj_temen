import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';
@Component({
  selector: 'app-favs',
  templateUrl: './favs.page.html',
  styleUrls: ['./favs.page.scss'],
})
export class FavsPage implements OnInit {

  favs = [];
  uid  = '';
  constructor(
    public modalController: ModalController,
    public plt: Platform,
    public api: ApiService,
    public alertController: AlertController,
    private router:Router, 
    public loadingController:LoadingController,
    private userdata: UserService,
    private alert: AlertService,
    private loading: LoadingService)
  {
    this.plt.ready().then(()=>{
      this.getfavs();
      this.guser();
    });
  }

  ngOnInit() {
  }

  guser()
  {
    this.userdata.getuser('token').then((data) => {
      this.uid = this.userdata.uval;
    });
  }
  getfavs()
  {
    this.userdata.getuser('token').then((data) => {
      this.uid = this.userdata.uval;
      this.api.getAPI("&req=myfav",{uid:this.uid})
      .then(data => {
        data = JSON.parse(data.data);
        this.favs = data['posts'];
      });
    });
  }

  del_fav(pid)
  {
    this.loading.presentLoading();
    this.api.getAPI("&req=del_fav",{uid:this.uid,pid:pid})
      .then(data => {
        data = JSON.parse(data.data);
        if(data['posts']['status'] == 1)
        {
          this.alert.presentToast('تم الحذف بنجاح');
          this.api.getAPI("&req=myfav",{uid:this.uid})
          .then(data => {
            data = JSON.parse(data.data);
            this.favs = data['posts'];
          });
        }
        else
        {
          alert('there is an error');
        }
    });
  }

  dismissLogin() {
    this.modalController.dismiss();
  }

}
