import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ItemsListDetailPage } from '../items-list-detail/items-list-detail';
import { ItemsPage } from '../items/items';
import { CategoriesPage } from '../categories/categories';
import { DiscountsPage } from '../discounts/discounts';

@Component({
  selector: 'page-items-list',
  templateUrl: 'items-list.html'
})
export class ItemsListPage {
  selectedItem: any;
  items: Array<{ title: string, icon: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.selectedItem = navParams.get('item');

    this.items = [];
    this.items.push(
      {
        title: 'Items',
        icon: 'list'
      },
      {
        title: 'Categories',
        icon: 'albums'
      },
      {
        title: 'Discounts',
        icon: 'pricetag'
      }
    );

  }

  itemTapped(event, item) {

    if (item.title == 'Items') {
      this.navCtrl.push(ItemsPage);
    } else if(item.title == 'Categories'){
      this.navCtrl.push(CategoriesPage);
    } else if(item.title == 'Discounts'){
      this.navCtrl.push(DiscountsPage);
    } else {
      return false;
    }
  }
}
