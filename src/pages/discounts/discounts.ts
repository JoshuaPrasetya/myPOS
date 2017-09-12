import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DiscountCreatePage } from '../discount-create/discount-create';

@Component({
  selector: 'page-discounts',
  templateUrl: 'discounts.html'
})
export class DiscountsPage {
  public is_search: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  createDiscount(){
    this.navCtrl.push(DiscountCreatePage);
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
