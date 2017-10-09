import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestapiServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RestapiServiceProvider {

  data : any;
  //apiUrl = 'http://localhost/myPOS-API/public/api/v1';
  //apiUrl = 'http://192.168.43.161:8000/api/v1';
  //apiUrl = 'http://192.168.1.68:8000/api/v1';
  //apiUrl = 'http://192.168.1.67:8000/api/v1';
  //apiUrl = 'http://10.11.12.171:8000/api/v1';
  //apiUrl = 'http://loyalti.kelelawar.com/public/api/v1';
  apiUrl = 'http://gema-dev.com/myPOS-API/public/api/v1';
  
  limit = 0;

  constructor(public http: Http) {
    console.log('Hello RestapiServiceProvider Provider');
  }

  getUsers(){
    if(this.data){
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/users')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  getData(namespace){
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/'+namespace+'?limit'+this.limit)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data.data;
          resolve(this.data);
        });
    });
  }

  postData(namespace, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/'+namespace, data)
        .map(res=> res.json())
        .subscribe(data => {
          this.data = data.data
          resolve(this.data);
        }, (err) => {
          reject(err);
        });
    });
  }

  putData(namespace, data) {
    return new Promise((resolve, reject) => {
      this.http.put(this.apiUrl+'/'+namespace, data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  

}
