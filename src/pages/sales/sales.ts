import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TicketPage } from '../ticket/ticket';
import { PaymentPage } from '../payment/payment';

@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html'
})
export class SalesPage {
  public is_search: boolean = false;
  items = {segment: ''};

  constructor(public navCtrl: NavController) {
    this.items.segment = 'all';
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

  openTicket(){
    this.navCtrl.push(TicketPage);
  }
  toPayment(){
    this.navCtrl.push(PaymentPage);
  }

}
