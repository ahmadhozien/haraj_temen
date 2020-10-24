import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HTTP) { }

  public getAPI(req, param = {}, headers = {})
  {
    req = 'https://awedes.net/haraj/api/request.php?key=b555a3c23542867d108be9592df75f5f'+req;
    return this.http.get(req,param,headers);
  }
}
