import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ItemsCreatePage } from '../items-create/items-create';

@Component({
  selector: 'page-price-variant',
  templateUrl: 'price-variant.html'
})
export class PriceVariantPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    
  }

  addPriceVariant(){
    let confirm = this.toastCtrl.create({
      message: 'Price and Variant was added successfully',
      duration: 2000
    });
    confirm.present();
    this.navCtrl.push(ItemsCreatePage);
  }

}
