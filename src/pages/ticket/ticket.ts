import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ItemSliding   } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';

import { PaymentPage } from '../payment/payment';
import { EditTicketPage } from '../edit-ticket/edit-ticket';

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  tickets : any;
  totalCharge = 0;
  totalDiscount = 0;
  totalItemsOnTicket = 0;

  constructor(private alertCtrl: AlertController, private databaseprovider: DatabaseProvider, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
  }

  ionViewDidEnter(){
    this.getAllTickets();
  }

  getAllTickets(){
    this.databaseprovider.getTickets().then(data => {
      this.tickets = data;
      this.totalItemsOnTicket = data.length;
      this.totalCharge = 0;
      this.totalDiscount = 0;
      Object.keys(data).forEach(key=>{
        this.totalCharge = this.totalCharge + data[key]['pv_total'];
        this.databaseprovider.getDiscountsOnTicketByItemsId(data[key]['id']).then(data2 => {
          Object.keys(data2).forEach(d => {
            var dis = 0;
            if (data2[d]['type'] === 'percent') {
              dis = Math.floor((parseInt(data[key]['pv_total']) * parseInt(data2[d]['value'])) / 100);
            } else {
              dis = parseInt(data2[d]['value']);
            }
            this.totalDiscount = this.totalDiscount + dis;
          })
        })
      })
    })
  }

  toPayment(){
    this.navCtrl.push(PaymentPage, {
      totalPayment: this.totalCharge - this.totalDiscount,
    });
  }

  editTicket(id){
    this.navCtrl.push(EditTicketPage, {
      ticket_id : id
    });
  }

  deleteTicket(){
    let alert = this.alertCtrl.create({
      title: 'Clear ticket',
      message: 'Are you sure you want to clear the ticket?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');

          }
        },
        {
          text: 'Clear',
          handler: () => {
            // kosongkan semua tabel yang ada dalam tiket
            this.databaseprovider.truncateItemsOnTicket();
            this.databaseprovider.truncateDiscountsOnTicket();

            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  deleteThisItemOnTicket(item_id){
    // ambil discountonitem by item_id dan hapus
    this.databaseprovider.deleteDiscountsOnTicketByItemsId(item_id);

    // ambil items on ticket by item_id, hapus
    this.databaseprovider.deleteItemsOnTicketByItemsId(item_id);

    this.getAllTickets();
  }

  closeSliding(slidingItem: ItemSliding) {
    slidingItem.close();
  }
  
}
