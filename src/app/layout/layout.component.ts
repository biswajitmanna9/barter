import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.translate.use(localStorage.getItem('lang_key'));
    this.getLoginData();
  }

  getLoginData() {
    this.loginService.getLoginData().subscribe(
      res => {
        console.log(res)
      },
      error => {
        console.log(error)
      }
    )
  }

}
