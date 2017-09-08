import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ItemsCreatePage } from '../items-create/items-create';

@Component({
  selector: 'page-items',
  templateUrl: 'items.html'
})
export class ItemsPage {
  public searchX: boolean = false;
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  createItems(){
    this.navCtrl.push(ItemsCreatePage);
  }

  searchClick(){
    this.searchX = !this.searchX;
  }

  cancelSearch($event){
    this.searchX = false;
  }

}
