import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastController: ToastController)
  {

  }
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2600,
      position: 'bottom',
      color: 'dark',
      cssClass: 'alert'
    });
    toast.present();
  }
}
