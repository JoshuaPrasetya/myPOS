import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SalesPage } from '../pages/sales/sales';
import { ItemsListPage } from '../pages/items-list/items-list';
import { ItemsListDetailPage } from '../pages/items-list-detail/items-list-detail';
import { ItemsPage } from '../pages/items/items';
import { CategoriesPage } from '../pages/categories/categories';
import { DiscountsPage } from '../pages/discounts/discounts';
import { CategoriesCreatePage } from '../pages/categories-create/categories-create';
import { ItemsCreatePage } from '../pages/items-create/items-create';
import { PriceVariantPage } from '../pages/price-variant/price-variant';
import { DiscountCreatePage } from '../pages/discount-create/discount-create';
import { ReceiptsPage } from '../pages/receipts/receipts';
import { FeedbacksPage } from '../pages/feedbacks/feedbacks';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ActionSheet } from '@ionic-native/action-sheet';
import { RestapiServiceProvider } from '../providers/restapi-service/restapi-service';
import { ArrayFilterPipe } from '../pipes/array-filter/array-filter';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SalesPage,
    ItemsListPage,
    ItemsListDetailPage,
    ItemsPage,
    CategoriesPage,
    DiscountsPage,
    CategoriesCreatePage,
    ItemsCreatePage,
    PriceVariantPage,
    DiscountCreatePage,
    ReceiptsPage,
    FeedbacksPage,
    SettingsPage,
    ArrayFilterPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SalesPage,
    ItemsListPage,
    ItemsListDetailPage,
    ItemsPage,
    CategoriesPage,
    DiscountsPage,
    CategoriesCreatePage,
    ItemsCreatePage,
    PriceVariantPage,
    DiscountCreatePage,
    ReceiptsPage,
    FeedbacksPage,
    SettingsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    FilePath,
    FileTransfer,
    ActionSheet,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestapiServiceProvider
  ]
})
export class AppModule {}
