import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';

import { CategoriesCreatePage } from '../categories-create/categories-create';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  posts: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restapiServiceProvider: RestapiServiceProvider) {
    //this.getUsers();
    
  }

  ionViewWillEnter() {
    console.log('hello, its me again');
    this.getCategories();
  }

  itemTapped(id){
    this.navCtrl.push(CategoriesCreatePage);
  }

  createCategories(){
    this.navCtrl.push(CategoriesCreatePage);
  }

  getCategories() {
    this.restapiServiceProvider.getCategories()
    .then(data => {
      this.posts = data;
    });
  }

}
