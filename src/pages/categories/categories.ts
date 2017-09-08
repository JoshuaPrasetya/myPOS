import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CategoriesCreatePage } from '../categories-create/categories-create';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  createCategories(){
    this.navCtrl.push(CategoriesCreatePage);
  }

}
