import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  uval = '';
  constructor(private storage: NativeStorage) { }

  getuser(type) {
    return this.storage.getItem(type).then(
      data => {
        this.uval = data;
      }
    );
  }
}
 