import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.sqlite.create({
          name: 'mypos.db',
          location: 'default'
        })
          .then((db: SQLiteObject) => {
            this.database = db;
            this.storage.get('database_filled').then(val => {
              if (val) {
                this.databaseReady.next(true);
              } else {
                this.fillDatabase();
              }
            });
          });
      }
    });
    /*
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'mypos.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
    */
  }

  fillDatabase() {
    this.http.get('assets/dummyDump.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }

  addItems(id_real, name, image, category_id) {
    let data = [id_real, name, image, category_id]
    return this.database.executeSql("INSERT INTO items (id_real, name, image, category_id) VALUES (?, ?, ?, ?)", data).then(data => {
      console.log('berhasil');
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  updateCategoryItems(category_id, lastId) {
    let data = [category_id, lastId]
    return this.database.executeSql("UPDATE items set category_id=? where id = ?", data).then(data => {
      console.log('berhasil');
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getLastItemId() {
    return this.database.executeSql("SELECT max(id) as maxid FROM items", {}).then((data) => {
      return data.rows.item(0).maxid;
    });
  }
  getLastPriceVariantId() {
    return this.database.executeSql("SELECT max(id) as maxid FROM pricevariants", {}).then((data) => {
      return data.rows.item(0).maxid;
    });
  }

  deleteItems(ids) {
    return this.database.executeSql("DELETE FROM items WHERE id in (?)", ids).then(() => {
      console.log('berhasil hapus');
    }, err => {
      console.log('Error: ', err);
    });
  }

  getAllItems() {
    return this.database.executeSql("SELECT * FROM items", []).then((data) => {
      let items = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          items.push({
            id: data.rows.item(i).id,
            id_real: data.rows.item(i).id_real,
            name: data.rows.item(i).name,
            image: data.rows.item(i).image,
            category_id: data.rows.item(i).category_id
          });
        }
      }
      return items;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addPriceVariants(id_real, name, price, sku, barcode, image, itemId) {
    let data = [id_real, name, price, sku, barcode, image, itemId]
    return this.database.executeSql("INSERT INTO pricevariants (id_real, name, price, sku, barcode, image, itemId) VALUES (?, ?, ?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  updatePriceVariants(id_real, name, price, sku, barcode, image, itemId, id) {
    let data = [id_real, name, price, sku, barcode, image, itemId, id]
    return this.database.executeSql("UPDATE pricevariants set id_real=?, name=?, price=?, sku=?, barcode=?, image=?, itemId=? WHERE id = ?", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getPriceVariantsById(id) {
    let data = [id]
    return this.database.executeSql("SELECT * FROM pricevariants WHERE id = ?", data).then(data => {
      let items = [];
      if (data.rows.length > 0) {

        items.push({
          id: data.rows.item(0).id,
          id_real: data.rows.item(0).id_real,
          name: data.rows.item(0).name,
          price: data.rows.item(0).price,
          sku: data.rows.item(0).sku,
          barcode: data.rows.item(0).barcode,
          image: data.rows.item(0).image,
          item_id: data.rows.item(0).item_id
        });

      }
      return items;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }
  getPriceVariantsByItemId(id) {
    return this.database.executeSql("SELECT * FROM pricevariants WHERE itemId = ?", [id]).then((data) => {
      let pricevariants = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          pricevariants.push({
            id: data.rows.item(i).id,
            id_real: data.rows.item(i).id_real,
            name: data.rows.item(i).name,
            price: data.rows.item(i).price,
            sku: data.rows.item(i).sku,
            barcode: data.rows.item(i).barcode,
            image: data.rows.item(i).image,
            item_id: data.rows.item(i).itemId
          });
        }
      }
      return pricevariants;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  deletePriceVariants(ids) {
    return this.database.executeSql("DELETE FROM pricevariants WHERE id IN (" + ids + ")", []).then(() => {
      console.log('berhasil hapus');
    }, err => {
      console.log('Error: ', err);
    });
  }

  getAllPriceVariants() {
    return this.database.executeSql("SELECT * FROM pricevariants", []).then((data) => {
      let pricevariants = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          pricevariants.push({
            id: data.rows.item(i).id,
            id_real: data.rows.item(i).id_real,
            name: data.rows.item(i).name,
            price: data.rows.item(i).price,
            sku: data.rows.item(i).sku,
            barcode: data.rows.item(i).barcode,
            image: data.rows.item(i).image,
            item_id: data.rows.item(i).itemId
          });
        }
      }
      return pricevariants;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addItemsOnTicket(pv_id, qty) {
    let data = [pv_id, qty]
    return this.database.executeSql("INSERT INTO itemsonticket (pv_id, qty) VALUES (?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  updateItemsOnTicket(pv_id, qty, id) {
    let data = [pv_id, qty, id]
    return this.database.executeSql("UPDATE itemsonticket set pv_id = ?, qty = ? WHERE id = ?", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getAllItemsOnTicket() {
    return this.database.executeSql("SELECT * FROM itemsonticket", []).then((data) => {
      let itemsonticket = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          itemsonticket.push({
            id: data.rows.item(i).id,
            pv_id: data.rows.item(i).pv_id,
            qty: data.rows.item(i).qty,
          });
        }
      }
      return itemsonticket;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }
  getItemsOnTicketById(id) {
    return this.database.executeSql("SELECT iot.id as id, iot.pv_id as pv_id, iot.qty as qty, pv.name as pv_name, pv.price as pv_price FROM itemsonticket iot, pricevariants pv WHERE iot.pv_id = pv.id_real AND iot.id = ?", [id]).then((data) => {
      let itemsonticket = [];
      if (data.rows.length > 0) {
        
          itemsonticket.push({
            id: data.rows.item(0).id,
            pv_id: data.rows.item(0).pv_id,
            qty: data.rows.item(0).qty,
            pv_name: data.rows.item(0).pv_name,
            pv_price: data.rows.item(0).pv_price,
            pv_total: (data.rows.item(0).pv_price * data.rows.item(0).qty),
          });
        
      }
      return itemsonticket;
    }, err => {
      console.log('Error: ', err);
      return [];
    });

  }

  getTickets() {
    return this.database.executeSql(
      "SELECT t.id as id, t.pv_id as pv_id, t.qty as qty, pv.name as pv_name, pv.price as pv_price, i.name as item_name FROM itemsonticket t, pricevariants pv, items i WHERE t.pv_id = pv.id_real AND pv.itemId = i.id_real", []).then((data) => {
        let itemsonticket = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            itemsonticket.push({
              id: data.rows.item(i).id,
              pv_id: data.rows.item(i).pv_id,
              qty: data.rows.item(i).qty,
              pv_name: data.rows.item(i).pv_name,
              pv_price: data.rows.item(i).pv_price,
              pv_total: (data.rows.item(i).qty * data.rows.item(i).pv_price),
              item_name: data.rows.item(i).item_name,
            });
          }
        }
        return itemsonticket;
      }, err => {
        console.log('Error: ', err);
        return [];
      });
  }

  getLastItemsOnTicket() {
    return this.database.executeSql("SELECT * FROM itemsonticket ORDER BY id DESC", []).then((data) => {
      let itemsonticket = [];
      if (data.rows.length > 0) {

        itemsonticket.push({
          id: data.rows.item(0).id,
          pv_id: data.rows.item(0).pv_id,
          qty: data.rows.item(0).qty,
        });

      }
      return itemsonticket;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addDiscounts(id_real, name, value, type, status) {
    let data = [id_real, name, value, type, status]
    return this.database.executeSql("INSERT INTO discounts (id_real, name, value, type, status) VALUES (?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }
  setDiscountStatus(status, id) {
    return this.database.executeSql("UPDATE discounts set status = ? WHERE id = ?", [status, id]).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getActiveDiscount() {
    return this.database.executeSql("SELECT * FROM discounts WHERE status = 1", []).then((data) => {
      let discounts = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          discounts.push({
            id: data.rows.item(i).id,
            id_real: data.rows.item(i).id_real,
            name: data.rows.item(i).name,
            value: data.rows.item(i).value,
            type: data.rows.item(i).type,
            status: data.rows.item(i).status,
          });
        }
      }
      return discounts;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }
  getAllDiscount() {
    return this.database.executeSql("SELECT * FROM discounts", []).then((data) => {
      let discounts = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          discounts.push({
            id: data.rows.item(i).id,
            id_real: data.rows.item(i).id_real,
            name: data.rows.item(i).name,
            value: data.rows.item(i).value,
            type: data.rows.item(i).type,
            status: data.rows.item(i).status,
          });
        }
      }
      return discounts;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addDiscountsOnTicket(discount_id, itemsonticket_id) {
    let data = [discount_id, itemsonticket_id]
    return this.database.executeSql("INSERT INTO discountsonticket (discount_id, itemsonticket_id) VALUES (?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getAllDiscountsOnTicket() {
    return this.database.executeSql("SELECT * FROM discountsonticket", []).then((data) => {
      let itemsonticket = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          itemsonticket.push({
            id: data.rows.item(i).id,
            discount_id: data.rows.item(i).discount_id,
            itemsonticket_id: data.rows.item(i).itemsonticket_id,
          });
        }
      }
      return itemsonticket;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getDiscountsOnTicketByItemsId(item_id) {
    return this.database.executeSql(
      "SELECT dot.id as id, dot.discount_id as discount_id, dot.itemsonticket_id as itemsonticket_id, d.name as name, d.value as value, d.type as type FROM discountsonticket dot, discounts d WHERE d.id_real = dot.discount_id AND dot.itemsonticket_id = ?", [item_id]).then((data) => {
        let itemsonticket = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            itemsonticket.push({
              id: data.rows.item(i).id,
              discount_id: data.rows.item(i).discount_id,
              itemsonticket_id: data.rows.item(i).itemsonticket_id,
              name: data.rows.item(i).name,
              value: data.rows.item(i).value,
              type: data.rows.item(i).type,
            });
          }
        }
        return itemsonticket;
      }, err => {
        console.log('Error: ', err);
        return [];
      });
  }

  deleteDiscountsOnTicketByItemsId(item_id) {
    return this.database.executeSql(
      "DELETE FROM discountsonticket WHERE itemsonticket_id = ?", [item_id]).then((data) => {
        return data;
      }, err => {
        console.log('Error: ', err);
        return [];
      });
  }

  deleteItemsOnTicketByItemsId(item_id) {
    return this.database.executeSql(
      "DELETE FROM itemsonticket WHERE id = ?", [item_id]).then((data) => {
        return data;
      }, err => {
        console.log('Error: ', err);
        return [];
      });
  }



  truncatePriceVariants() {
    this.database.executeSql('DROP TABLE pricevariants', {}).then(() => { console.log('ok') });
    this.database.executeSql('CREATE TABLE IF NOT EXISTS pricevariants(id INTEGER PRIMARY KEY AUTOINCREMENT,id_real INTEGER, name TEXT,price TEXT,sku TEXT,barcode TEXT,image TEXT,itemId TEXT)', {}).then(() => { console.log('ok') });
  }
  truncateItems() {
    this.database.executeSql('DROP TABLE items', {}).then(() => { console.log('ok') });
    this.database.executeSql('CREATE table IF NOT EXISTS items(id INTEGER PRIMARY KEY AUTOINCREMENT, id_real INTEGER, name TEXT, image TEXT, category_id INTEGER)', {}).then(() => { console.log('ok') });
  }
  truncateDiscounts() {
    this.database.executeSql('DROP TABLE discounts', {}).then(() => { console.log('ok') });
    this.database.executeSql('CREATE TABLE IF NOT EXISTS discounts(id INTEGER PRIMARY KEY AUTOINCREMENT, id_real INTEGER, name TEXT, value TEXT, type TEXT, status INTEGER)', {}).then(() => { console.log('ok') });
  }
  truncateItemsOnTicket() {
    this.database.executeSql('DROP TABLE itemsonticket', {}).then(() => { console.log('ok') });
    this.database.executeSql('CREATE TABLE IF NOT EXISTS itemsonticket(id INTEGER PRIMARY KEY AUTOINCREMENT, pv_id INTEGER, qty INTEGER)', {}).then(() => { console.log('ok') });
  }
  truncateDiscountsOnTicket() {
    this.database.executeSql('DROP TABLE discountsonticket', {}).then(() => { console.log('ok') });
    this.database.executeSql('CREATE TABLE IF NOT EXISTS discountsonticket(id INTEGER PRIMARY KEY AUTOINCREMENT, discount_id INTEGER, itemsonticket_id INTEGER)', {}).then(() => { console.log('ok') });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}