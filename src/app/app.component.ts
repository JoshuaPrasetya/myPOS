import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SalesPage } from '../pages/sales/sales';
import { ItemsListPage } from '../pages/items-list/items-list';
import { ReceiptsPage } from '../pages/receipts/receipts';
import { FeedbacksPage } from '../pages/feedbacks/feedbacks';
import { SettingsPage } from '../pages/settings/settings';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SalesPage;

  pages: Array<{title: string, component: any, icons: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Sales', component: SalesPage, icons: 'basket' },
      { title: 'Receipt', component: ReceiptsPage, icons: 'paper' },
      { title: 'Items', component: ItemsListPage, icons: 'list' },
      { title: 'Feedbacks', component: FeedbacksPage, icons: 'heart' },
      { title: 'Back office', component: null, icons: 'laptop' },
      { title: 'Settings', component: SettingsPage, icons: 'settings' },
      { title: 'Support', component: null, icons: 'help-circle' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
