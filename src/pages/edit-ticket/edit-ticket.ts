import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-edit-ticket',
  templateUrl: 'edit-ticket.html',
})
export class EditTicketPage {
  private currentNumber = 0;
  item = { id: '', pv_id: '', name: '', qty: 0, price: 0, total: 0 };
  discounts= [{ id: '', discount_id: '', name: '', value: '', type: '' }];
  ticket_id = '';
  consoleLog = '';

  constructor(private databaseprovider: DatabaseProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.consoleLog = "constructor";
    this.ticket_id = this.navParams.get('ticket_id');

    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getData();
      }
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTicketPage');
  }

  getData() {
    this.databaseprovider.getItemsOnTicketById(this.ticket_id).then(data => {
      this.item['id'] = data[0]['id'];
      this.item['pv_id'] = data[0]['pv_id'];
      this.item['name'] = data[0]['pv_name'];
      this.item['qty'] = data[0]['qty'];
      this.item['price'] = data[0]['pv_price'];
      this.item['total'] = data[0]['pv_total'];
      this.consoleLog = data[0]['pv_total'];

      // seharusnya tampilkan semua diskon, lalu aktifkan yang telah dipilih.
      this.databaseprovider.getDiscountsOnTicketByItemsId(this.ticket_id).then(pricevar => {
        this.consoleLog = pricevar.length.toString();
        this.discounts = pricevar
      })
      
    })
  }
  private increment() {
    this.item['qty']++;
    this.item['total'] = this.item['price'] * this.item['qty'];
  }

  private decrement() {
    if (this.item['qty'] > 0) {
      this.item['qty']--;
      this.item['total'] = this.item['price'] * this.item['qty'];
    }
  }
  ionViewDidEnter() {

  }

  saveItemsOnTicket(id){
    this.databaseprovider.updateItemsOnTicket(this.item['pv_id'], this.item['qty'], id);
    this.navCtrl.pop();
  }

}
