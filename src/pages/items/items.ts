import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';

import { ItemsCreatePage } from '../items-create/items-create';

@Component({
  selector: 'page-items',
  templateUrl: 'items.html'
})
export class ItemsPage {
  public is_search: boolean = false;
  selectedItem: any;
  icons: string[];
  items: any;
  category: { id: '', name: '' };
  categories: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restapiServiceProvider: RestapiServiceProvider) {

  }

  ionViewWillEnter() {

    this.getAllItems();
  }

  getAllItems() {
    this.restapiServiceProvider.getData('getAllItems')
      .then(data => {
        this.items = data['items'];
        this.categories = data['categories'];
      });
  }

  createItems() {
    this.navCtrl.push(ItemsCreatePage);
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

  tappedEvent(id) {
    console.log(id);
    this.navCtrl.push(ItemsCreatePage, {
      idItem: id
    });

  }

}
