import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ArrayFilterPipe } from '../../pipes/array-filter/array-filter';


@Component({
  selector: 'page-feedbacks',
  templateUrl: 'feedbacks.html',
})
export class FeedbacksPage {

  feedOption = {type:''};
  feedbacks: Array<{ type: string, customer: string, content: string, date: any, response: string, response_date: string }>;
  feeddates: Array<{ date: any, countAll: any, isPositive: boolean, countPositive: any, isNeutral: boolean, isNegative: boolean, countNeutral: any, countNegative: any }>;

  stsPositive: boolean;
  stsNeutral: boolean;
  stsNegative: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initialization();
    this.feedOption.type = "all";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbacksPage');
  }

  initialization() {
    this.feedbacks = [];
    this.feedbacks.push({
      type: 'positive',
      customer: 'Client 1',
      content: 'Terimakasih pelayanan nya bagus',
      date: '2017-09-12',
      response: 'Sama sama gan.',
      response_date: '2017-09-13'
    }, {
        type: 'negative',
        customer: 'Client 2',
        content: 'Waiting list nya terlalu lama',
        date: '2017-09-12',
        response: 'Mohon maaf untuk ketidak nyamanannya.',
        response_date: '2017-09-13'
      }, {
        type: 'positive',
        customer: 'Client 3',
        content: 'Barangnya OK',
        date: '2017-09-14',
        response: 'Siap gan!',
        response_date: '2017-19-15'
      });
    this.feeddates = [];
    this.feeddates.push({
      date: '2017-09-12',
      countAll: 2,
      isPositive: true,
      countPositive: 1,
      isNeutral: false,
      countNeutral: 0,
      isNegative: true,
      countNegative: 1,
    }, {
        date: '2017-09-14',
        countAll: 1,
        isPositive: true,
        countPositive: 1,
        isNeutral: false,
        countNeutral: 0,
        isNegative: false,
        countNegative: 0,
      });

    this.stsPositive = true;
    this.stsNegative = true;
    this.stsNeutral = false;


  }

}
