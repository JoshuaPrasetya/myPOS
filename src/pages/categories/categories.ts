import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';

import { CategoriesCreatePage } from '../categories-create/categories-create';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  public is_search: boolean = false;
  posts: any;
  itemActive = [];
  isItemActive = false;


  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public restapiServiceProvider: RestapiServiceProvider, public toastCtrl: ToastController) {
    //this.getUsers();

  }

  ionViewWillEnter() {
    console.log('hello, its me again');
    this.getCategories();
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
    } else {
      this.navCtrl.push(CategoriesCreatePage);
    }
  }

  createCategories() {
    this.navCtrl.push(CategoriesCreatePage);
  }

  getCategories() {
    this.restapiServiceProvider.getData('categories')
      .then(data => {
        this.posts = data;
      });
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
