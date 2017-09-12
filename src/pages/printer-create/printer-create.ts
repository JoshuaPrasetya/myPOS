import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the PrinterCreatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-printer-create',
  templateUrl: 'printer-create.html',
})
export class PrinterCreatePage {

  printer = {nama: '', printer: '', print: ''};
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.printer.print = '0';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrinterCreatePage');
  }

  savePrinter(){
    let confirm = this.toastCtrl.create({
      message: 'Printer was added successfully',
      duration: 2000
    });
    confirm.present();
    this.navCtrl.pop();
  }

}
