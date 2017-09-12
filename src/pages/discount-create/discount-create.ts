import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-discount-create',
  templateUrl: 'discount-create.html',
})
export class DiscountCreatePage {
  public valActive = 'percent';
  discount = {nama : '', value : '', type: ''};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.discount.type = 'percent';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscountCreatePage');
  }

  setActive(type){
    this.valActive = type;
  }

  saveDiscount() {
    let confirm = this.toastCtrl.create({
      message: 'Category was added successfully',
      duration: 2000
    });
    confirm.present();
    this.navCtrl.pop();
  }



}
