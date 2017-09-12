import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PrinterCreatePage } from '../printer-create/printer-create';

/**
 * Generated class for the PrintersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-printers',
  templateUrl: 'printers.html',
})
export class PrintersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrintersPage');
  }

  itemTapped(){
    this.navCtrl.push(PrinterCreatePage);
  }

  createPrinter(){
    this.navCtrl.push(PrinterCreatePage);
  }

}
