import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';

import { TicketPage } from '../ticket/ticket';
import { PaymentPage } from '../payment/payment';

@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html'
})
export class SalesPage {
  public is_search: boolean = false;
  public pricevariant: boolean = false;
  segment = '';

  itemNames: string[];
  itemAlls: Array<{ title: string, price: number, image: string }>;
  itemFavorits: Array<{ title: string, price: number, image: string }>;

  activeItem: any;
  items: any;
  pricevariants: any;
  category: { id: '', name: '' };
  categories: any;
  consoleLog = "";
  totalItemsOnTicket = 0;
  totalCharge = 0;
  totalDiscount = 0;
  discounts: any;

  resultId = '';

  constructor(public restapiServiceProvider: RestapiServiceProvider, public loadingCtrl: LoadingController, private databaseprovider: DatabaseProvider, private platform: Platform, public navCtrl: NavController) {
    this.segment = 'all';

    //sthis.initializeItems();
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        //this.loadPriceVariantsData();
      }
    })
  }

  ionViewDidEnter() {
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.consoleLog = 'Get Item';
        this.databaseprovider.truncateItems();
        this.databaseprovider.truncatePriceVariants();
        this.databaseprovider.truncateDiscounts();
        this.getAllItemsAndPriceVariants();
        this.getAllDiscount();

      }
    })

  }

  setDiscount(id) {
    this.databaseprovider.setDiscountStatus(1, id).then(() => {
      this.databaseprovider.getAllDiscount().then(data => {
        this.discounts = data;
      })
    })
  }



  getAllDiscount() {

    this.restapiServiceProvider.getData('discounts')
      .then(data => {
        console.log(data);
        Object.keys(data).forEach(r => {
          this.databaseprovider.addDiscounts(data[r]['id'], data[r]['name'], data[r]['value'], data[r]['type'], 0);
        })
        this.databaseprovider.getAllDiscount().then(data2 => {
          this.discounts = data2;
        })
      });
  }

  getAllItemsAndPriceVariants() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait..',
      //duration: 10000
    });
    loader.present();

    this.restapiServiceProvider.getData('getAllItems')
      .then(data => {

        //this.consoleLog = this.consoleLog + ', getItems';
        this.items = data['items'];

        Object.keys(this.items).forEach(r => {
          // this.consoleLog = this.consoleLog + ', addItems'+ this.items[r]['name'];
          this.databaseprovider.addItems(this.items[r]['id'], this.items[r]['name'], this.items[r]['image'], this.items[r]['category_id']);


          Object.keys(this.items[r]['price_variants']).forEach(pv => {
            //this.consoleLog = this.consoleLog + ', add PV '+ this.items[r]['price_variants'][pv]['name'];
            this.databaseprovider.addPriceVariants(
              this.items[r]['price_variants'][pv]['id'],
              this.items[r]['price_variants'][pv]['name'],
              this.items[r]['price_variants'][pv]['price'],
              this.items[r]['price_variants'][pv]['sku'],
              this.items[r]['price_variants'][pv]['barcode'],
              this.items[r]['price_variants'][pv]['image'],
              this.items[r]['price_variants'][pv]['item_id']
            );
          })
        })
        //this.databaseprovider.getAllItemsOnTicket().then(data => {
        this.databaseprovider.getTickets().then(data => {
          this.totalItemsOnTicket = data.length;
          if (this.totalItemsOnTicket > 0) {
            this.totalCharge = 0;
            this.totalDiscount = 0;
            Object.keys(data).forEach(key => {

              //this.databaseprovider.getPriceVariantsById(data[key]['pv_id']).then(pv => {
                // hitung total harga
                this.totalCharge = this.totalCharge + (data[key]['qty'] * data[key]['pv_price']);
              //})
              this.databaseprovider.getDiscountsOnTicketByItemsId(data[key]['id']).then(data2 => {
                Object.keys(data2).forEach(d => {
                  var dis;
                  if (data2[d]['type'] == 'percent') {
                    dis = Math.floor((parseInt(data[key]['pv_total']) * parseInt(data2[d]['value'])) / 100);
                  } else {
                    dis = parseInt(data2[d]['value']);
                  }
                  this.totalDiscount = this.totalDiscount + dis;
                })

              })

            })

          } else {
            this.totalCharge = 0;
            this.totalDiscount = 0;
          }
        })

        this.getAllItems();

        this.categories = data['categories'];
        loader.dismiss();
      });

  }
  addDummyTicket() {

    //this.getAllItemsAndPriceVariants();
    //tambah tiket sembarang
    //this.databaseprovider.addItemsOnTicket(3, 1).then(() => {
    // id pv 1
    //this.addItemsOnTicket(1);
    // id pv 1 harusnya data jadi 2
    //this.addItemsOnTicket(1);
    // id pv 2
    //this.addItemsOnTicket(2);
    // id pv 1 lagi, bertambah sebagai item yang berbeda
    this.addItemsOnTicket(3);
    //})



  }

  addItemsOnTicket(pv_id, qty = 1) {
    this.databaseprovider.getLastItemsOnTicket().then(data => {
      //this.consoleLog = 'pv_id: ' + data[0]['pv_id'] + ', qty :  ' + data[0]['qty'];
      if (typeof (data[0]) == "undefined") {
        this.consoleLog = this.consoleLog + "> add new";
        this.databaseprovider.addItemsOnTicket(pv_id, qty).then(data2 => {
          this.resultId = data2['insertId'];
          this.databaseprovider.getActiveDiscount().then(data3 => {
            Object.keys(data3).forEach(ds => {
              this.databaseprovider.addDiscountsOnTicket(data3[ds]['id_real'], data2['insertId']);
            })
          })
        });
      } else {
        //this.consoleLog = this.consoleLog + "> masuk else";
        if (data[0]['pv_id'] == pv_id) {
          var new_qty;
          new_qty = parseInt(data[0]['qty']) + qty;
          this.consoleLog = 'qty = ' + new_qty;
          this.consoleLog = this.consoleLog + "> update qty";
          this.databaseprovider.updateItemsOnTicket(data[0]['pv_id'], new_qty, data[0]['id']);
        } else {
          this.databaseprovider.addItemsOnTicket(pv_id, qty).then(data2 => {
            this.resultId = data2['insertId'];
            this.databaseprovider.getActiveDiscount().then(data3 => {
              Object.keys(data3).forEach(ds => {
                this.databaseprovider.addDiscountsOnTicket(data3[ds]['id_real'], data2['insertId']);
              })
            })
          });
        }
      }

      this.databaseprovider.getTickets().then(data => {
        //this.tickets = data;
        this.totalItemsOnTicket = data.length;
        this.totalCharge = 0;
        this.totalDiscount = 0;
        Object.keys(data).forEach(key => {

          this.totalCharge = this.totalCharge + data[key]['pv_total'];
          this.databaseprovider.getDiscountsOnTicketByItemsId(data[key]['id']).then(data2 => {
            Object.keys(data2).forEach(d => {
              var dis = 0;
              if (data2[d]['type'] === 'percent') {
                dis = Math.floor((parseInt(data[key]['pv_total']) * parseInt(data2[d]['value'])) / 100);
              } else {
                dis = parseInt(data2[d]['value']);
              }
              this.totalDiscount = this.totalDiscount + dis;
            })

          })
        })


      })
      this.databaseprovider.getAllItemsOnTicket().then(data => {
        this.totalItemsOnTicket = data.length;
      })
    })

  }

  getAllItems() {
    this.databaseprovider.getAllItems().then(data => {
      this.items = data;
    })
  }

  loadPriceVariantsData() {
    this.databaseprovider.getAllPriceVariants().then(data => {
      this.pricevariants = data;
      this.pricevariant = true;
    })
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

  backToItems(){
    this.pricevariant = false;
  }

  openTicket() {
    this.navCtrl.push(TicketPage);
  }
  toPayment() {
    this.navCtrl.push(PaymentPage, {
      totalPayment: this.totalCharge - this.totalDiscount
    });
  }

  tappedItem(item) {
    if (item == this.activeItem) {
      this.activeItem = '';
    } else {
      this.activeItem = item;
    }
  }

  selectPriceVariant(id) {
    this.databaseprovider.getPriceVariantsByItemId(id).then(data=>{
      this.pricevariants = data;
      this.pricevariant = !this.pricevariant;
    })
    
  }

  addPriceVariant(id) {
    this.addItemsOnTicket(id);
    this.pricevariant = false;
  }

  checkActive(item) {
    return item == this.activeItem;
  }

}
