import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PaymentPage } from '../payment/payment';
import { EditTicketPage } from '../edit-ticket/edit-ticket';

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
  }

  toPayment(){
    this.navCtrl.push(PaymentPage);
  }

  editTicket(){
    this.navCtrl.push(EditTicketPage);
  }
}
