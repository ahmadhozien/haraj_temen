import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform, NavController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { ApiService } from '../api.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AlertService } from '../services/alert.service';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { UserService } from '../services/user.service';
const STORAGE_KEY = 'my_images';
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  images    = [];
  sections  = [];
  pid:any;
  name      = '';
  sect      = '';
  price     = '';
  phone     = '';
  city      = '';
  desc      = '';
  uid       = '';
  slideOpts = {
    speed: 400,
    slidesPerView: 3.5,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  };
  constructor(private camera: Camera, 
    private file: File, 
    private api: ApiService, 
    private webview: WebView,
    private actionSheetController: ActionSheetController, 
    private alert: AlertService,
    private storage: Storage,
    private plt: Platform, 
    private loading: LoadingService,
    private ref: ChangeDetectorRef, 
    private filePath: FilePath,
    public navCtrl: NavController,
    private alertController: AlertController,
    private userdata: UserService)
    {
      this.plt.ready().then(() => {
        this.loadStoredImages();
        this.guser();
        this.api.getAPI("&req=gsections")
        .then(data => {
          data = JSON.parse(data.data);
          this.sections = data['posts'];
        });
      });
    }

    randomString() {
      var result = '';
      var chars  = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (var i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    }
    guser()
    {
      this.userdata.getuser('token').then((data) => {
        this.uid = this.userdata.uval;
      });
    }
    add_product()
    {
      this.pid = this.randomString();
      this.loading.presentLoading();
      this.api.getAPI("&req=add_product", {pid: this.pid,uid: this.uid,name: this.name,section: this.sect,price: this.price,desc: this.desc,phone: this.phone,city: this.city})
        .then(data => {
          data = JSON.parse(data.data);
          if(data['posts']['status'] == '1')
          {
            this.images = [];
            this.p_added();
          }
          else
          {
            this.alert.presentToast(data['posts']['details']);
          }
      });
    }

    loadStoredImages() {
      this.storage.get(STORAGE_KEY).then(images => {
        if (images) {
          let arr = JSON.parse(images);
          this.images = [];
          for (let img of arr) {
            let filePath = this.file.dataDirectory + img;
            let resPath = this.pathForImage(filePath);
            this.images.push({ name: img, path: resPath, filePath: filePath });
          }
        }
      });
    }
   
    pathForImage(img) {
      if (img === null) {
        return '';
      } else {
        let converted = this.webview.convertFileSrc(img);
        return converted;
      }
    }


    async selectImage() {
      const actionSheet = await this.actionSheetController.create({
          header: "اختر صورة",
          cssClass: "alert",
          buttons: [{
                  text: 'اختيار من المعرض',
                  handler: () => {
                      this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                  }
              },
              {
                  text: 'الكاميرا',
                  handler: () => {
                      this.takePicture(this.camera.PictureSourceType.CAMERA);
                  }
              },
              {
                  text: 'إلغاء',
                  role: 'cancel'
              }
          ]
      });
      await actionSheet.present();
  }
   
  takePicture(sourceType: PictureSourceType) {
      var options: CameraOptions = {
          quality: 100,
          sourceType: sourceType,
          saveToPhotoAlbum: false,
          correctOrientation: true
      };
      this.camera.getPicture(options).then(imagePath => {
          if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(imagePath).then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
          } else {
              var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
              var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }
      }, (err) => {
        // Handle error
        alert("Camera issue:" + err);
      });
    
  }

  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
  }
 
  copyFileToLocalDir(namePath, currentName, newFileName) {
      this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
          this.updateStoredImages(newFileName);
      }, error => {
          this.alert.presentToast('عفواً هناك خطأ عند حفظ الصورة الرجاء المحاولة مرة أخرى');
      });
  }
  
  updateStoredImages(name) {
      this.storage.get(STORAGE_KEY).then(images => {
          let arr = JSON.parse(images);
          if (!arr) {
              let newImages = [name];
              this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
          } else {
              arr.push(name);
              this.storage.set(STORAGE_KEY, JSON.stringify(arr));
          }
  
          let filePath = this.file.dataDirectory + name;
          let resPath = this.pathForImage(filePath);
  
          let newEntry = {
              name: name,
              path: resPath,
              filePath: filePath
          };
          this.startUpload(newEntry);
          this.images = [newEntry, ...this.images];
          this.ref.detectChanges(); // trigger change detection cycle
      });
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        let filtered = arr.filter(name => name != imgEntry.name);
        this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

        var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

        this.file.removeFile(correctPath, imgEntry.name).then(res => {
            this.alert.presentToast('تم حذف الصورة بنجاح');
        });
    });
  }

  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
        .then(entry => {
            ( < FileEntry > entry).file(file => this.readFile(file))
        })
        .catch(err => {
            this.alert.presentToast('عفواً حذث خطأ ما أثناء معالجة الصورة');
        });
  }
 
  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
            type: file.type
        });
        formData.append('file', imgBlob, file.name);
        this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    this.loading.presentLoading();
    this.api.getAPI("&req=upl_images&pid="+this.pid+"&"+formData)
      .then(data => {
        data = JSON.parse(data.data);
        if(data['posts']['status'] == 1)
        {
          this.alert.presentToast('تم رفع الصورة بنجاح');
        }
        else{
          this.alert.presentToast(data['posts']['details']);
        }
      });
  }

    ngOnInit() {
    }

    async p_added() {
      const alert = await this.alertController.create({
        header: 'عملية ناجحة!',
        message: '<strong>تم إضافة الإعلان بنجاح</strong>!!!',
        cssClass: 'alert',
        buttons: [
          {
            text: 'إغلاق',
            role: 'cancel',
            cssClass: 'secondary',
            handler: ()=>{
              this.pid = '';
            }
          }, {
            text: 'عرض الإعلان',
            cssClass: 'primary',
            handler: () => {
              this.navCtrl.navigateForward(`/showproduct/${this.pid}`);
            }
          }
        ]
      });
  
      await alert.present();
    }
}
