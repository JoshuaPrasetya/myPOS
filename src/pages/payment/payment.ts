import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SplitPaymentPage } from '../split-payment/split-payment';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  public isCash = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  changePayment(){
    this.isCash = !this.isCash;
  }

  toSplitPayment(){
    this.navCtrl.push(SplitPaymentPage);
  }

}
