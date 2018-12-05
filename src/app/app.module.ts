import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { ListerPage } from '../pages/lister/lister';
import { ConfigurerPage } from '../pages/configurer/configurer';
import { ViewerPage } from '../pages/viewer/viewer';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TimerProvider } from '../providers/timer/timer';
import { StorerProvider } from '../providers/storer/storer';

import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { PipesModule } from '../pipes/pipes.module';

import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from "@ionic-native/local-notifications";
import { NotificatorProvider } from '../providers/notificator/notificator';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    ViewerPage,
    ConfigurerPage,
    ListerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    RoundProgressModule,
    PipesModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    ViewerPage,
    ConfigurerPage,
    ListerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    TimerProvider,
    StorerProvider,
    LocalNotifications,
    NotificatorProvider
  ]
})
export class AppModule { }
