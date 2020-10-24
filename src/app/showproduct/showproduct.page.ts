import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Platform, LoadingController, ActionSheetController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';
import { UserService } from '../services/user.service';
import { FavsPage } from '../favs/favs.page';
@Component({
  selector: 'app-showproduct',
  templateUrl: './showproduct.page.html',
  styleUrls: ['./showproduct.page.scss'],
})
export class ShowproductPage implements OnInit {
  
  pid       = '';
  imgs      = [];
  name      = '';
  price     = '';
  date      = '';
  visits    = '';
  section   = '';
  desc      = '';
  merchant  = '';
  city      = '';
  phone     = '';
  uid       = '';
  comments  = [];
  slideOpts = {
    initialSlide: 1,
    speed: 1000,
    autoplay:true,
    delay:3200,
    loop: true,
  };
  logged   = this.authService.isLoggedIn;
  products = [];
  constructor(private actroute:ActivatedRoute,
    public api:ApiService, 
    private plt:Platform,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    private callNumber: CallNumber,
    private authService: AuthService,
    private alert: AlertService,
    private loading: LoadingService,
    private userdata: UserService,
    private modalController: ModalController,
    private alertController: AlertController
    )
  {
    this.plt.ready().then(()=>{
      this.pid = this.actroute.snapshot.paramMap.get('pid');
      this.api.getAPI("&req=show_product",{id:this.pid, uid:'7952cd55455dd20dfc92144533896605'})
      .then(data => {
        data = JSON.parse(data.data);
        this.imgs     = data['posts']['imgs'];
        this.name     = data['posts']['name'];
        this.price    = data['posts']['price'];
        this.date     = data['posts']['date'];
        this.visits   = data['posts']['visits'];
        this.section  = data['posts']['section'];
        this.desc     = data['posts']['desc'];
        this.merchant = data['posts']['merchant'];
        this.city     = data['posts']['city'];
        this.phone    = data['posts']['phone'];
      });
    });

    //similar products 
    this.plt.ready().then(()=>{
      this.loading.presentLoading();
      this.runapi(this.section);
    });
    this.guser();
    this.have_session();
  }

  ngOnInit() {
  }

  change_pid(pid)
  {
    this.loading.presentLoading();
    this.pid = pid;
    this.api.getAPI("&req=show_product",{id:this.pid, uid:'7952cd55455dd20dfc92144533896605'})
      .then(data => {
        data = JSON.parse(data.data);
        this.imgs     = data['posts']['imgs'];
        this.name     = data['posts']['name'];
        this.price    = data['posts']['price'];
        this.date     = data['posts']['date'];
        this.visits   = data['posts']['visits'];
        this.section  = data['posts']['section'];
        this.desc     = data['posts']['desc'];
        this.merchant = data['posts']['merchant'];
        this.city     = data['posts']['city'];
        this.phone    = data['posts']['phone'];
      });
    this.show_comments();
  }
  runapi(key)
  {
    this.api.getAPI("&req=search",{k:key})
      .then(data => {
        this.pid = key;
        data = JSON.parse(data.data);
        this.products = data['posts'];
    });
    this.show_comments();
  }

  async report() {
    const actionSheet = await this.actionSheetController.create({
      header: 'إبلاغ عن المنتج',
      cssClass: 'report',
      buttons: [{
        text: 'إبلاغ عن المنتج',
        icon: 'bug',
        handler: () => {
          this.alert.presentToast('تم الإبلاغ عن المنتج وسيتم مراجعة الشكوى من قبل الإدارة');
        }
      }, {
        text: 'إلغاء',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

 
  call_num()
  {
    this.callNumber.callNumber(this.phone, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  have_session()
  {
    this.authService.getToken().then(() => {
      this.logged = this.authService.isLoggedIn;
    });
  }

  async openfav() {
    const modal = await this.modalController.create({
      component: FavsPage
    });
    return await modal.present();
  }
  
  add_fav()
  {
    if(this.logged == false)
    {
      this.alert.presentToast('عفواً الرجاء تسجيل الدخول أولاً');
    }
    else{
      this.loading.presentLoading();
      this.api.getAPI('&req=add_fav', {pid:this.pid, uid:this.uid})
        .then(data => {
          data = JSON.parse(data.data);
          if(data['posts']['status'] == 1)
          {
            this.alert.presentToast('تمت إضافة المنتج لقائمة المفضلة بنجاح');
            this.openfav();
          }
        });
      }
  }

  guser()
  {
    this.userdata.getuser('token').then((data) => {
      this.uid = this.userdata.uval;
    });
  }

  show_comments()
  {
    this.api.getAPI("&req=comments",{pid:this.pid})
      .then(data => {
        data = JSON.parse(data.data);
        this.comments = data['posts'];
    });
  }

  async add_comment()
  {
    if(this.logged == false)
    {
      this.alert.presentToast('عفواً الرجاء تسجيل الدخول أولاً');
    }
    else{
      const alert = await this.alertController.create({
        header: 'إضافة تعليق',
        cssClass: 'alert',
        inputs: [
          {
            name: 'key',
            type: 'text',
            placeholder: 'أدخل تعليقك'
          }
        ],
        buttons: [
          {
            text: 'إضافة',
            cssClass: 'primary',
            handler: data => {
              if(data.key != null)
              {
                this.api.getAPI("&req=add_comment",{comment:data.key, pid:this.pid, uid:this.uid})
                .then(data => {
                  data = JSON.parse(data.data);
                  this.products = data['posts'];
                  if(data['posts']['status'] == 1)
                  {
                    this.alert.presentToast('تم إضافة التعليق بنجاح');
                    this.show_comments();
                  }
                });
              }
              else{
                this.alert.presentToast('الرجاء إدخال تعليق أولاً');
              }
            }
          }
        ]
      });
  
      await alert.present();
    }
  }
}
