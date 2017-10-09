import { Component, ViewChild, } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, Loading, ToastController, Platform, Navbar, AlertController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { Vibration } from '@ionic-native/vibration';
import { Insomnia } from '@ionic-native/insomnia';
import { DatabaseProvider } from './../../providers/database/database';

import { CategoriesCreatePage } from '../categories-create/categories-create';
import { ItemsPage } from '../items/items';
import { PriceVariantPage } from '../price-variant/price-variant';

import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

@Component({
  selector: 'page-items-create',
  templateUrl: 'items-create.html'
})
export class ItemsCreatePage {
  @ViewChild(Navbar) navBar: Navbar;
  lastImage: string = null;
  loading: Loading;
  public isColor: boolean = true; //Whatever you want to initialise it as
  selectedItem: any;
  icons: string[];

  posts: any;
  item = { id: '', id_real: '', name: '', image: '', category_id: 'no_category', pricevariant: [{ id: '', id_real: '', name: '', price: '', sku: '', barcode: '', image: '', item_id: '' }] };
  public retriveData;
  isPriceVariants = false;
  itemActive = [];
  isItemActive = false;
  pricevariants = [];
  lastItemId = null;
  totalPriceVar: any;
  consoleLog = '';
  lastPriceVariantId = null;

  constructor(private databaseprovider: DatabaseProvider, private alertCtrl: AlertController, private vibration: Vibration, public navCtrl: NavController, public navParams: NavParams, public restapiServiceProvider: RestapiServiceProvider, public toastCtrl: ToastController, private camera: Camera, private transfer: FileTransfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController, private insomnia: Insomnia) {
    if (this.retriveData = navParams.get('idItem')) { //jika ubah data
      console.log('idItem : ' + this.retriveData);
      this.getItems(this.retriveData);
    } else { //jika tambah data baru..
      this.lastItemId = null; //reset last Item ID karena belum ada item id
      //this.getCategories();
    }
    this.consoleLog = this.consoleLog + ' constructor()';
  }

  loadPriceVariants() {
    this.databaseprovider.getAllPriceVariants().then(data => {
      this.pricevariants = data;
    });
  }
  loadItems() {
    this.databaseprovider.getAllItems().then(data => {
      this.item.id = data['id'];
      this.item.id_real = data['id_real'];
      this.item.name = data['name'];
      this.item.image = data['image'];
      this.item.category_id = data['category_id'];
    });
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

  reloadLast() {
    this.getItems(null);
  }

  ionViewDidEnter() {
    this.getCategories();
    this.item.category_id = 'no_category';
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        //this.loadPriceVariants();
        this.databaseprovider.getLastItemId().then(data => {
          this.lastItemId = data;
          if (this.lastItemId) {
            this.getItems(null);
          }
        })
      }
    });
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = "http://gema-dev.com/myPOS/upload.php";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

  createNewCategory() {
    this.databaseprovider.addItems(null, this.item.name, this.item.image, null).then(() => {
      this.navCtrl.push(CategoriesCreatePage, {
        justCreate: true
      });
    })

  }

  addPriceVariant() {
    // if item name and or item category id not set yet, user are not allowed to add price and variant
    if (this.item.name == '') {
      this.showToast('Please provide item name.');
      return false;
    } else if (this.item.category_id == 'no_category') {
      this.showToast('Please choose one category');
      return false;
    } else {

      // when user try to add variant, save the items to local database first
      if (this.lastItemId == null) { //jika item merupakan data baru, maka save item dulu
        this.databaseprovider.addItems(null, this.item.name, this.item.image, parseInt(this.item.category_id))
          .then(() => {
          });
      }
      //buka halaman price variant
      this.navCtrl.push(PriceVariantPage);
    }
  }

  saveItems(idItem = null) {
    console.log(this.item);
    if (this.item.name == '') {
      this.showToast('Please input item name');
    } else if (this.item.category_id == 'no_category') {
      this.showToast('Please select category');
    } else {
      //  add some dummy data
      /*
      this.item.pricevariant.push({
        id: null,
        name: '43',
        price: '128000',
        sku: '0001',
        barcode: null,
        image: null,
        item_id: null,
      }, {
          id: null,
          name: '44',
          price: '130000',
          sku: '0002',
          barcode: null,
          image: null,
          item_id: null,
        });
      console.log(this.item);
      */
      this.item.pricevariant = this.pricevariants;
      if (idItem == null) {
        this.restapiServiceProvider.postData('items', this.item).then((result) => {
          console.log(result);
          this.showToast('Item was added successfully');
          this.navCtrl.pop();

        }, (err) => {
          console.log(err);
          this.showToast('Please provide Item Add Data');
        });
      } else {
        this.restapiServiceProvider.putData('items/' + idItem, this.item).then((result) => {
          console.log(result);
          this.showToast('Item was updated successfully');
          this.truncateAll()
          this.navCtrl.pop();

        }, (err) => {
          console.log(err);
          this.showToast('Please provide Item Data');
        });
      }
    }
  }

  // change display when user choose color or image on Representation in POS
  setType(type) {
    if (type == 'image') {
      this.isColor = false;
    } else {
      this.isColor = true;
    }
  }

  getCategories() {
    this.restapiServiceProvider.getData('categories')
      .then(data => {
        this.posts = data;
      });
  }

  truncateAll() {
    this.databaseprovider.truncatePriceVariants();
    this.databaseprovider.truncateItems();
    this.lastItemId = null;
  }

  getItems(idItem) {
    //this.databaseprovider.deleteAllPriceVariants();
    if (idItem == null) { // untuk mengakomodasi fungsi back button
      this.databaseprovider.getAllItems().then(data => {
        this.item.id = data[0]['id'];
        this.item.id_real = data[0]['id_real'];
        this.item.name = data[0]['name'];
        this.item.image = data[0]['image'];
        this.item.category_id = data[0]['category_id'];
        if (this.item.category_id == null) {
          this.item.category_id = 'no_category';
        }
        this.loadPriceVariants();
        this.databaseprovider.getLastPriceVariantId().then(data => {
          this.lastPriceVariantId = data;
          if (this.lastPriceVariantId) {
            this.isPriceVariants = true;
          }
        });
        this.consoleLog = this.consoleLog + ' getItem(null)';
      });
    } else {
      //this.truncateAll();
      this.restapiServiceProvider.getData('items/' + idItem + '/edit')
        .then(data => {
          //this.posts = data;
          this.item.id = data['items']['id'];
          this.item.id_real = data['items']['id'];
          this.item.name = data['items']['name'];
          this.item.image = data['items']['image'];
          this.item.category_id = data['items']['category_id'];
          this.item.pricevariant = data['items']['price_variants'];

          // masukkan data item ke local storage
          this.databaseprovider.addItems(this.item.id, this.item.name, this.item.image, this.item.category_id);

          // masukkan data price variant ke local storage
          this.item.pricevariant.forEach(r => {
            this.databaseprovider.addPriceVariants(r.id, r.name, r.price, r.sku, r.barcode, r.image, r.item_id);
          });
          //this.addPriceVariant(data['items']['price_variants'])
          this.posts = data['categories'];
          this.isPriceVariants = data['items']['is_price_variants'];
          this.loadItems();
          this.loadPriceVariants();
          this.databaseprovider.getLastItemId().then(data => {
            this.lastItemId = data;
          });
        });
    }
  }

  showToast(message) {
    let confirm = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    confirm.present();
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
      this.navCtrl.push(PriceVariantPage, {
        idPriceVariant: id
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

  deletePriceVariants() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete selected price & variants?',
      message: 'Selected price & variants will be deleted!',
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
            this.consoleLog = this.itemActive.join(', ');
            //this.consoleLog = this.itemActive.map(function(x) {return x +',';});

            this.databaseprovider.deletePriceVariants(this.itemActive.join(', ')).then(() => {
              let confirm = this.toastCtrl.create({
                message: 'Price Variants was deleted successfully',
                duration: 2000
              });
              confirm.present();
              this.getItems(null);
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



