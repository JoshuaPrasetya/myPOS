import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ArrayFilterPipe } from '../../pipes/array-filter/array-filter';
import { ReceiptDetailPage} from '../receipt-detail/receipt-detail';

@Component({
  selector: 'page-receipts',
  templateUrl: 'receipts.html',
})
export class ReceiptsPage {
  public is_search: boolean = false;

  receipts: Array<{ value: string, type: string, time: any, date: any }>;
  recdates: Array<{ date: any, countAll: any , stsData: boolean}>;
  public data_valid: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initialization();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiptsPage');
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

  viewReceipt($id){
    this.navCtrl.push(ReceiptDetailPage);
  }

  initialization() {
    this.receipts = [];
    this.receipts.push({
      value: '30.000',
      type: 'Cash',
      time: '21:23',
      date: '2017-09-04',
    }, {
        value: '5.000',
        type: 'Cash',
        time: '05:27',
        date: '2017-09-04',
      }, {
        value: '25.000',
        type: 'Split tender',
        time: '24:20',
        date: '2017-09-04',
      }, {
        value: '45.000',
        type: 'Card',
        time: '04:16',
        date: '2017-09-04',
      }
    );
    this.recdates = [];
    this.recdates.push({
      date: '2017-09-04',
      countAll: '4',
      stsData: true,
    });
    this.data_valid = true;
  }

}
