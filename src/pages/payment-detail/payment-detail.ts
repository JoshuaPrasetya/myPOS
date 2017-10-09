import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Navbar } from 'ionic-angular';

import { SalesPage } from '../sales/sales';

@Component({
  selector: 'page-payment-detail',
  templateUrl: 'payment-detail.html',
})
export class PaymentDetailPage {
  @ViewChild(Navbar) navBar: Navbar;
  total = 0;
  cash = 0;
  change = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public toastCtrl: ToastController) {
    this.total = this.navParams.get('total');
    this.cash = this.navParams.get('cash');
    this.change = this.navParams.get('change');
  }

  ionViewDidEnter() {
    
  }


  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.navCtrl.setRoot(SalesPage);
    }
  }

  toRoot(){
    this.navCtrl.setRoot(SalesPage);
  }

  
  
}
