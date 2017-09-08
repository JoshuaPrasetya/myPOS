import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-items-list-detail',
  templateUrl: 'items-list-detail.html'
})
export class ItemsListDetailPage {
  selectedItem: any;
  items: Array<{ title: string, icon: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }
}
