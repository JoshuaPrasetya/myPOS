import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { CategoriesPage } from '../categories/categories';

@Component({
  selector: 'page-categories-create',
  templateUrl: 'categories-create.html'
})
export class CategoriesCreatePage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    
  }

  saveCategory(){
    let confirm = this.toastCtrl.create({
      message: 'Category was added successfully',
      duration: 2000
    });
    confirm.present();
    this.navCtrl.push(CategoriesPage);
  }

  itemInCategory(catID){
    // shows all item in this category
  }

  createNewItem(catID){
    // create new item in this category
  }

}
