import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';

import { TicketPage } from '../ticket/ticket';
import { PaymentPage } from '../payment/payment';

@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html'
})
export class SalesPage {
  public is_search: boolean = false;
  items = { segment: '' };

  itemNames: string[];
  itemAlls: Array<{title: string, price: number, image: string}>;
  itemFavorits: Array<{title: string, price: number, image:string}>;

  activeItem: any;
  developer = {};
  developers = [];
  pricevar = [];

  constructor( private databaseprovider: DatabaseProvider, private platform: Platform, public navCtrl: NavController) {
    this.items.segment = 'all';

    this.initializeItems();
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadDeveloperData();
      }
    })
  }

  loadDeveloperData() {
    this.databaseprovider.getAllPriceVariantsModify().then(data => {
      this.pricevar = data;
    })
  }
 
  addDeveloper() {
    this.databaseprovider.addDeveloper(this.developer['name'], this.developer['skill'], parseInt(this.developer['yearsOfExperience']))
    .then(data => {
      this.loadDeveloperData();
    });
    this.developer = {};
  }

  initializeItems() {
    this.itemNames = [
      'Afrika',
      'Bogota',
      'Buenos Aires',
      'Cairo',
      'Dhaka',
      'Edinburgh',
      'Geneva',
      'Genoa',
      'Glasglow',
      'Hanoi',
      'Hong Kong',
      'Islamabad',
      'Istanbul',
      'Jakarta',
      'Kiel',
      'Kyoto',
      'Le Havre',
      'Lebanon',
      'Lhasa',
      'Lima',
      'London',
      'Los Angeles',
      'Madrid',
      'Manila',
      'New York',
      'Olympia',
      'Oslo',
      'Panama City',
      'Peking',
      'Philadelphia'      
    ];
    
    this.itemAlls = [];
    for (let i = 1; i < 17; i++) {
      this.itemAlls.push({
        title: this.itemNames[i],
        price: 2000 * (i+1),
        image: 'man-shoes.jpg'
      });
    }
    this.itemFavorits = [];
    for (let j = 17; j < this.itemNames.length; j++) {
      this.itemFavorits.push({
        title: this.itemNames[j],
        price: 2000 * (j+1),
        image: 'man-shoes-2.jpg'
      });
    }
    
  }

  searchClick() {
    this.is_search = !this.is_search;
  }

  cancelSearch($event) {
    this.is_search = false;
  }

  inputSearch($event) {
    return false;
  }

  openTicket() {
    this.navCtrl.push(TicketPage);
  }
  toPayment() {
    this.navCtrl.push(PaymentPage);
  }

  tappedItem(item) {
    if (item == this.activeItem) {
      this.activeItem = '';
    } else {
      this.activeItem = item;
    }
  }

  checkActive(item) {
    return item == this.activeItem;
  }

}
