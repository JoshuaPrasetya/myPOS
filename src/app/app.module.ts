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
import { FeedbackDetailPage } from '../pages/feedback-detail/feedback-detail';
import { PrintersPage } from '../pages/printers/printers';
import { PrinterCreatePage } from '../pages/printer-create/printer-create';
import { ReceiptDetailPage} from '../pages/receipt-detail/receipt-detail';
import { TicketPage } from '../pages/ticket/ticket';
import { PaymentPage } from '../pages/payment/payment';
import { SplitPaymentPage } from '../pages/split-payment/split-payment';
import { EditTicketPage } from '../pages/edit-ticket/edit-ticket';
import { PaymentDetailPage } from '../pages/payment-detail/payment-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ActionSheet } from '@ionic-native/action-sheet';
import { Vibration } from '@ionic-native/vibration';
import { Insomnia } from '@ionic-native/insomnia';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { RestapiServiceProvider } from '../providers/restapi-service/restapi-service';
import { ArrayFilterPipe } from '../pipes/array-filter/array-filter';


import { IonicStorageModule } from '@ionic/storage';
 
import { DatabaseProvider } from '../providers/database/database';
 
import { SQLitePorter } from '@ionic-native/sqlite-porter';


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
    ArrayFilterPipe,
    FeedbackDetailPage,
    PrintersPage,
    PrinterCreatePage,
    ReceiptDetailPage,
    TicketPage,
    EditTicketPage,
    PaymentPage,
    SplitPaymentPage,
    PaymentDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
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
    FeedbackDetailPage,
    PrintersPage,
    PrinterCreatePage,
    ReceiptDetailPage,
    TicketPage,
    EditTicketPage,
    PaymentPage,
    SplitPaymentPage,
    PaymentDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    FilePath,
    FileTransfer,
    ActionSheet,
    Insomnia,
    Vibration,
    DatabaseProvider,
    SQLitePorter,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestapiServiceProvider
  ]
})
export class AppModule {}
