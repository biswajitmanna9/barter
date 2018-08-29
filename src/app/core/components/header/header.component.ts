import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private router: Router,
    private loginService: LoginService
  ) {

  }

  ngOnInit() {
    // this.translate.use(localStorage.getItem('lang_key'));
  }

  useLanguage() {
    if (localStorage.getItem('lang_key') == "en") {
      localStorage.setItem('lang_key', 'ar');
      this.translate.use(localStorage.getItem('lang_key'));
    }
    else if (localStorage.getItem('lang_key') == "ar") {
      localStorage.setItem('lang_key', 'en');
      this.translate.use(localStorage.getItem('lang_key'));
    }

  }

  logout() {
    this.loginService.logout().subscribe(
      res => {
        console.log(res)
        localStorage.removeItem('isLoggedin')
        localStorage.removeItem('fbId')
        localStorage.removeItem('name')
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error)
        localStorage.removeItem('isLoggedin')
        localStorage.removeItem('fbId')
        localStorage.removeItem('name')
        this.router.navigate(['/login']);
      }
    )

  }

}
