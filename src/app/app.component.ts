import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');

    if (localStorage.getItem('lang_key') == "en") {
      localStorage.setItem('lang_key', 'en');
    }
    else if (localStorage.getItem('lang_key') == "ar") {
      localStorage.setItem('lang_key', 'ar');
    }
    else {
      localStorage.setItem('lang_key', 'en');
    }

  }

}
