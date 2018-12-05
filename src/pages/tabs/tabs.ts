import { Component } from '@angular/core';

import { ViewerPage } from '../viewer/viewer';
import { ListerPage } from '../lister/lister';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  viewerRoot = ViewerPage;
  listerRoot = ListerPage;

  constructor() {

  }
}
