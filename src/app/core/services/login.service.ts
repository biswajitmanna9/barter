import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LoginService {
  allCookies: any;
  // request: HttpRequest<any>
  cookieString: string;
  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.allCookies = cookieService.getAll();

    this.cookieString = Object.keys(this.allCookies).reduce((accumulator, cookieName) => {
      accumulator += cookieName + '=' + this.allCookies[cookieName] + ';';
      return accumulator;
    }, '');
  }

  loginWithFb(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'auth/facebook')
  }

  getLoginData() {
    return this.http.get(environment.apiEndpoint + 'loggedIn')
  }

  logout() {
    return this.http.get(environment.apiEndpoint + 'logout')
  }

}
