import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, Navbar, LoadingController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';


import { CategoriesCreatePage } from '../categories-create/categories-create';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  @ViewChild(Navbar) navBar: Navbar;
  public is_search: boolean = false;
  categories: any;
  itemActive = [];
  isItemActive = false;


  constructor(public loadingCtrl: LoadingController, private vibration: Vibration, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public restapiServiceProvider: RestapiServiceProvider, public toastCtrl: ToastController) {
    //this.getUsers();
  }

  ionViewWillEnter() {
    console.log('hello, its me again');
    this.getCategories();
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
      this.navCtrl.push(CategoriesCreatePage, {
        idCategory: id
      });
    }
  }

  createCategories() {
    this.isItemActive = false;
    this.itemActive = [];
    this.navCtrl.push(CategoriesCreatePage);
  }

  getCategories() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait..',
      //duration: 10000
    });
    loader.present();

    this.restapiServiceProvider.getData('categories')
      .then(data => {
        console.log(data);
        this.categories = data;
      });

    setTimeout(() => {
      loader.dismiss();
    }, 50);

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

  itemPressed(id) {

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

  deleteCategory() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete selected categories?',
      message: 'Selected categories will be deleted including items and price variants!',
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
            this.restapiServiceProvider.postData('removeCategories', this.itemActive).then((result) => {
              console.log(result);
              let confirm = this.toastCtrl.create({
                message: 'Category was deleted successfully',
                duration: 2000
              });
              confirm.present();
              this.getCategories();
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
