import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';

import { SplitPaymentPage } from '../split-payment/split-payment';
import { PaymentDetailPage } from '../payment-detail/payment-detail';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  public isCash = true;
  payment = {total: '', cash: '', type: ''};
  totalPayment = 0;
  discountsOnTicket = [{id: '', discount_id: '', item_id:''}];
  itemsOnTicket = [{id: '', pv_id: '', qty: ''}];
  postData = {discounts: [], items: [], payment: {}};
  consoleLog = '';

  constructor(public restapiServiceProvider: RestapiServiceProvider, private databaseprovider: DatabaseProvider, public navCtrl: NavController, public navParams: NavParams,  public toastCtrl: ToastController) {
    this.totalPayment = this.navParams.get('totalPayment');
    
    this.payment.cash = this.totalPayment.toString();
  }

  ionViewDidEnter() {
    this.databaseprovider.getAllDiscountsOnTicket().then(data => {
      this.discountsOnTicket = data;
    })
    this.databaseprovider.getAllItemsOnTicket().then(data=>{
      this.itemsOnTicket = data;
    })
  }

  changePayment(){
    this.isCash = !this.isCash;
  }

  toSplitPayment(){
    this.navCtrl.push(SplitPaymentPage);
  }

  doCharge(){
    if (parseInt(this.payment.cash) < this.totalPayment){
      this.showToast('Please provide item name.');
      return false;
    } else {
      // 1. ambil semua data diskon
      // 2. ambil semua data itemsonticket
      // 3. gabungkan data discount dan items on ticket serta tipe dan jumlah pembayaran
      // 4. kirim ke API, if response ok maka push ke halaman payment-detail

      if(this.isCash){
        this.payment.type = 'cash';
      } else {
        this.payment.type = 'card';
      }
      this.postData.discounts = this.discountsOnTicket;
      this.postData.items = this.itemsOnTicket;
      this.postData.payment = this.payment;
      this.postData.payment['total'] = this.totalPayment;
      this.consoleLog = JSON.stringify(this.postData);
      this.restapiServiceProvider.postData('addSales', this.postData).then((result) => {
        console.log(result);
        this.showToast('Item was added successfully');
        this.databaseprovider.truncateDiscounts();
        this.databaseprovider.truncateDiscountsOnTicket();
        this.databaseprovider.truncateItems();
        this.databaseprovider.truncateItemsOnTicket();
        this.databaseprovider.truncatePriceVariants();
        this.navCtrl.setRoot(PaymentDetailPage, {
          total : result['total'],
          cash : result['cash'],
          change : result['change']
        });

      }, (err) => {
        console.log(err);
        this.showToast(err);
      });
      
      

      //this.consoleLog = this.postData.payment['type'];

    }

  }
  showToast(message) {
    let confirm = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    confirm.present();
  }

}
