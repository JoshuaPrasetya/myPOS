import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { DatabaseProvider } from './../../providers/database/database';

import { CategoriesPage } from '../categories/categories';

@Component({
  selector: 'page-categories-create',
  templateUrl: 'categories-create.html'
})
export class CategoriesCreatePage {
  public retriveData;
  category = { id: null, name: null };
  details = { count_items: 0, total_items: 0 };
  justCreate = false;
  lastItemId: any;

  constructor(private databaseprovider: DatabaseProvider, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public restapiServiceProvider: RestapiServiceProvider) {
    if (this.retriveData = navParams.get('idCategory')) {
      console.log('idItem : ' + this.retriveData);
      this.getCategories(this.retriveData);
    } else {
      this.getCategories();
    }
    this.justCreate = navParams.get('justCreate');
  }

  ionViewWillEnter() {
    this.getCategories(this.retriveData);
    this.databaseprovider.getLastItemId().then(data => {
      this.lastItemId = data;
    })
  }

  getCategories(id = null) {
    var str = '/x';
    if (id !== null) {
      console.log('edit category:' + id);
      str = '/' + id;
    }
    this.restapiServiceProvider.getData('categories' + str)
      .then(data => {
        console.log(data);
        this.category.id = data['id'];
        this.category.name = data['name'];
        this.details.count_items = data['count_items'];
        this.details.total_items = data['total_items'];
      });
  }

  saveCategory(idCategory = null) {
    if (idCategory == null) {
      //console.log(JSON.stringify(this.category));
      this.restapiServiceProvider.postData('categories', this.category).then(result => {
        //var res = JSON.parse(result);
        if (this.justCreate) { // jika proses tambah data = true, maka update item category id = result
          this.databaseprovider.updateCategoryItems(parseInt(result['id']), this.lastItemId);
          let confirm = this.toastCtrl.create({
            message: 'Category ' + result['name'] + ' was added successfully',
            duration: 2000
          });
          confirm.present();

          this.navCtrl.pop();
        } else {

          let confirm = this.toastCtrl.create({
            message: 'Category was added successfully',
            duration: 2000
          });
          confirm.present();

          this.navCtrl.pop();
        }
      }, (err) => {
        console.log(err);
      });
    } else {
      this.restapiServiceProvider.putData('categories/' + idCategory, this.category).then((result) => {
        console.log(result);
        let confirm = this.toastCtrl.create({
          message: 'Category was updated successfully',
          duration: 2000
        });
        confirm.present();
        this.navCtrl.pop();

      }, (err) => {
        console.log(err);
      });
    }

  }

  itemInCategory(catID) {
    // shows all item in this category
  }

  createNewItem(catID) {
    // create new item in this category
  }

}
