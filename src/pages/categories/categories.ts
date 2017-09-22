import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';

import { CategoriesCreatePage } from '../categories-create/categories-create';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  public is_search: boolean = false;
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
    this.restapiServiceProvider.getData('categories')
    .then(data => {
      this.posts = data;
    });
  }

  searchClick(){
    this.is_search = !this.is_search;
  }

  cancelSearch($event){
    this.is_search = false;
  }

  inputSearch($event){
    return false;
  }

}
