import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../services/login.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('isLoggedin')) {
      return true
    }
    else {
      this.loginService.getLoginData().subscribe(
        res => {
          console.log(res)
          if (res['fbId'] != undefined) {
            localStorage.setItem('isLoggedin', 'true')
            localStorage.setItem('fbId', res['fbId'])
            localStorage.setItem('name', res['name'])
            this.router.navigate(['/home']);
            return false;
          }
          else {
            this.router.navigate(['/login']);
            return false;
          }
        },
        error => {
          console.log(error)
          this.router.navigate(['/login']);
          return false;
        }
      )
    }
  }
}
