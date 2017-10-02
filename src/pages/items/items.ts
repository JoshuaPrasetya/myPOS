import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, Navbar, LoadingController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { DatabaseProvider } from './../../providers/database/database';

import { ItemsCreatePage } from '../items-create/items-create';

@Component({
  selector: 'page-items',
  templateUrl: 'items.html'
})
export class ItemsPage {
  @ViewChild(Navbar) navBar: Navbar;
  public is_search: boolean = false;
  selectedItem: any;
  icons: string[];
  items: any;
  category: { id: '', name: '' };
  categories: any;
  itemActive = [];
  isItemActive = false;
  
  constructor(private databaseprovider: DatabaseProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private vibration: Vibration, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public restapiServiceProvider: RestapiServiceProvider) {
    
  }

  ionViewWillEnter() {

    this.getAllItems();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      if (this.isItemActive == true) {
        this.itemActive = [];
        this.isItemActive = false;
        return false;
      } else {
        console.log('Back Button Clicked');
        this.navCtrl.pop();
      }

    }
  }

  itemTapped(id) {
    if (this.isItemActive == true) {
      if (this.itemActive.indexOf(id) > -1) {
        this.itemActive.splice(this.itemActive.indexOf(id), 1);
        if (this.itemActive.length < 1) {
          this.isItemActive = false;
        }
      } else {
        if (this.itemActive.length < 1) {
          this.isItemActive = true;
        }
        this.itemActive.push(id);
      }
      this.vibration.vibrate(30);
    } else {
      this.truncateAll();
      this.navCtrl.push(ItemsCreatePage, {
        idItem: id
      });
    }
  }

  itemPressed(id) {
    console.log("item Pressed");
    if (this.itemActive.indexOf(id) > -1) {//jika item ada pada list maka nonaktifkan item
      this.itemActive.splice(this.itemActive.indexOf(id), 1);
      if (this.itemActive.length < 1) { //jika ini item terakhir yg dinonaktifkan maka status aktif = false
        this.isItemActive = false;
      }
    } else { //jika tidak ada yang terpilih, maka push ke item terpilih
      if (this.itemActive.length < 1) {
        this.isItemActive = true;
      }
      this.itemActive.push(id);
    }
    this.vibration.vibrate(30);

  }

  checkActive(id) {
    if (this.itemActive.indexOf(id) > - 1) {
      return true;
    } else {
      return false;
    }
  }

  getAllItems() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait..',
      //duration: 10000
    });
    loader.present();

    this.restapiServiceProvider.getData('getAllItems')
      .then(data => {
        this.items = data['items'];
        this.categories = data['categories'];
      });

    setTimeout(() => {
      loader.dismiss();
    }, 50);
  }

  truncateAll(){
    this.databaseprovider.truncateItemsModify();
  this.databaseprovider.truncatePriceVariantsModify();
  }
  

  createItems() {
    this.isItemActive = false;
    this.itemActive = [];
    this.truncateAll();
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

  deleteItems() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete selected items?',
      message: 'Selected categories will be deleted including price variants!',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');

          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log(this.itemActive);
            this.restapiServiceProvider.postData('removeItems', this.itemActive).then((result) => {
              console.log(result);
              let confirm = this.toastCtrl.create({
                message: 'Items was deleted successfully',
                duration: 2000
              });
              confirm.present();
              this.getAllItems();
              this.itemActive = [];
              this.isItemActive = false;
            }, (err) => {
              console.log(err);
            });
          }
        }
      ]
    });
    alert.present();
  }


}
