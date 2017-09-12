import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the FeedbackDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-feedback-detail',
  templateUrl: 'feedback-detail.html',
})
export class FeedbackDetailPage {
  public stsResponse = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  sendResponse(){
    this.stsResponse = !this.stsResponse;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackDetailPage');
  }

}
