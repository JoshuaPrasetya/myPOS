import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, Loading, ToastController, Platform, Navbar, AlertController } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';

import { ItemsCreatePage } from '../items-create/items-create';

@Component({
  selector: 'page-price-variant',
  templateUrl: 'price-variant.html'
})
export class PriceVariantPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  pricevariant = {};
  lastItemId : any;

  constructor(private databaseprovider: DatabaseProvider, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController ) {

  }

  ionViewDidEnter(){
    this.databaseprovider.getLastItemId().then(data => {
      this.lastItemId = data;
    })
  }

  addPriceVariant(){
    this.databaseprovider.addPriceVariantsModify(this.pricevariant['name'], this.pricevariant['price'], this.pricevariant['sku'], this.pricevariant['barcode'], this.pricevariant['image'], this.lastItemId)
    .then(() => {
      let confirm = this.toastCtrl.create({
        message: 'Price and Variant was added successfully',
        duration: 2000
      });
      confirm.present();
      this.navCtrl.pop();
    })
    
  }

}
