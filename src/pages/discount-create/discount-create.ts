import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';


@Component({
  selector: 'page-discount-create',
  templateUrl: 'discount-create.html',
})
export class DiscountCreatePage {
  public valActive = 'percent';
  discount = {id:'', name : '', value : '', type: ''};
  public retriveData;
  
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public restapiServiceProvider: RestapiServiceProvider) {
    this.discount.type = 'percent';
    if (this.retriveData = navParams.get('idDiscount')) {
      console.log('idDiscount : ' + this.retriveData);
      this.getDiscounts(this.retriveData);
    } else {
      this.getDiscounts();
    }
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscountCreatePage');
  }

  getDiscounts(id = null) {
    var str = '/x';
    if (id !== null) {
      console.log('edit discounts:' + id);
      str = '/' + id;
    }
    this.restapiServiceProvider.getData('discounts' + str)
      .then(data => {
        console.log(data);
        this.discount.id = data['id'];
        this.discount.name = data['name'];
        this.discount.value = data['value'];
        this.discount.type = data['type'];
        if(this.discount.type == 'percent'){
          this.setActive('percent');
        } else {
          this.setActive('nominal')
        }
      });
  }


  setActive(type){
    this.valActive = type;
  }

  saveDiscount(idDiscount = null) {
    if (idDiscount == null) {
      console.log(JSON.stringify(this.discount));
      this.restapiServiceProvider.postData('discounts', this.discount).then((result) => {
        console.log(result);
        let confirm = this.toastCtrl.create({
          message: 'Discount was added successfully',
          duration: 2000
        });
        confirm.present();
        this.navCtrl.pop();

      }, (err) => {
        console.log(err);
      });
    } else {
      this.restapiServiceProvider.putData('discounts/'+idDiscount, this.discount).then((result) => {
        console.log(result);
        let confirm = this.toastCtrl.create({
          message: 'Discount was updated successfully',
          duration: 2000
        });
        confirm.present();
        this.navCtrl.pop();

      }, (err) => {
        console.log(err);
      });
    }
    
  }



}
