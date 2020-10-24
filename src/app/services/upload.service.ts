import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { ApiService } from '../api.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertService } from './alert.service';
import { LoadingService } from './loading.service';
const STORAGE_KEY = 'my_images';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  images = [];
  pid    = '';
  constructor(private camera: Camera, 
    private file: File, 
    private api: ApiService, 
    private webview: WebView,
    private actionSheetController: ActionSheetController, 
    private alert: AlertService,
    private storage: NativeStorage,
    private plt: Platform, 
    private loading: LoadingService,
    private ref: ChangeDetectorRef, 
    private filePath: FilePath)
    {
      this.plt.ready().then(() => {
        this.loadStoredImages();
      });
    }

    loadStoredImages() {
      this.storage.getItem(STORAGE_KEY).then(images => {
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
              this.filePath.resolveNativePath(imagePath)
                  .then(filePath => {
                      let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                      let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                  });
          } else {
              var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
              var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }
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
      this.storage.getItem(STORAGE_KEY).then(images => {
          let arr = JSON.parse(images);
          if (!arr) {
              let newImages = [name];
              this.storage.setItem(STORAGE_KEY, JSON.stringify(newImages));
          } else {
              arr.push(name);
              this.storage.setItem(STORAGE_KEY, JSON.stringify(arr));
          }
  
          let filePath = this.file.dataDirectory + name;
          let resPath = this.pathForImage(filePath);
  
          let newEntry = {
              name: name,
              path: resPath,
              filePath: filePath
          };
  
          this.images = [newEntry, ...this.images];
          this.ref.detectChanges(); // trigger change detection cycle
      });
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

    this.storage.getItem(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        let filtered = arr.filter(name => name != imgEntry.name);
        this.storage.setItem(STORAGE_KEY, JSON.stringify(filtered));

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

    this.api.getAPI("&req=upl_images",{formData, pid: this.pid})
      .then(data => {
        data = JSON.parse(data.data);
        if(data['posts']['status'] == 1)
        {
          this.alert.presentToast('تم رفع الصورة بنجاح');
        }
        else{
          this.alert.presentToast('عفواً هناك خطأ أثماء رفع الصورة');
        }
      });
  }
    
}
