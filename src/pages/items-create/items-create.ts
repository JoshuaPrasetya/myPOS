import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, Loading, ToastController, Platform } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';

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
  lastImage: string = null;
  loading: Loading;
  public isColor: boolean = true; //Whatever you want to initialise it as
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;

  posts: any;
  item = { name: '', category_id: 'no_category', pricevariant: [] };

  constructor(public navCtrl: NavController, public navParams: NavParams, public restapiServiceProvider: RestapiServiceProvider, public toastCtrl: ToastController, private camera: Camera, private transfer: FileTransfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController) {
    this.getCategories();
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
    this.navCtrl.push(CategoriesCreatePage);
  }

  addPriceVariant() {
    this.navCtrl.push(PriceVariantPage);
  }

  saveItems() {
    
    console.log(this.item);
    if (this.item.name == '') {
      this.showToast('Please input item name');
    } else if (this.item.category_id == 'no_category') {
      this.showToast('Please select category');
    } else {
      this.item.pricevariant.push({
        name: '43',
        price: '128000',
        sku: '0001'
      },{
        name: '44',
        price: '130000',
        sku: '0002'
      });
      console.log(this.item);
      
      this.restapiServiceProvider.postData('items', this.item).then((result) => {
        console.log(result);
        this.showToast('Item was added successfully');
        this.navCtrl.pop();

      }, (err) => {
        console.log(err);
        this.showToast('Please provide Item Data');
      });

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

  updatePriceVariant(varID) {
    this.navCtrl.push(PriceVariantPage);
  }

  getCategories() {
    this.restapiServiceProvider.getData('categories')
      .then(data => {
        this.posts = data;
      });
  }

  showToast(message) {
    let confirm = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    confirm.present();
  }



}
