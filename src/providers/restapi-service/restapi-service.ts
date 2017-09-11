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
  //apiUrl = 'https://jsonplaceholder.typicode.com';
  apiUrl = 'http://localhost/myPOS-API/public/api/v1';
  //apiUrl = 'http://gema-dev.com/myPOS-API/public/api/v1';
  
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
  getCategories(){
    //if(this.data){
    //  return Promise.resolve(this.data);
    //}

    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/categories'+'?limit'+this.limit)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data.data;
          resolve(this.data);
        });
    });
  }

  saveCategory(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/categories', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}
