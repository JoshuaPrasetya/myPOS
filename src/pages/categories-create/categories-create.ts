import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';

import { CategoriesPage } from '../categories/categories';

@Component({
  selector: 'page-categories-create',
  templateUrl: 'categories-create.html'
})
export class CategoriesCreatePage {
 
  category = { nama: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public restapiServiceProvider: RestapiServiceProvider) {
    
  }

  saveCategory(){
    console.log(JSON.stringify(this.category));
    this.restapiServiceProvider.saveCategory(this.category).then((result) => {
      console.log(result);
      let confirm = this.toastCtrl.create({
        message: 'Category was added successfully',
        duration: 2000
      });
      confirm.present();
      this.navCtrl.pop();
      
    }, (err) => {
      console.log(err);
    });
    
  }

  itemInCategory(catID){
    // shows all item in this category
  }

  createNewItem(catID){
    // create new item in this category
  }

}
