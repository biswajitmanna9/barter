import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

let header = new Headers();




@Injectable()
export class PostService {
  allCookies: any;
  // request: HttpRequest<any>
  cookieString: string;
  headers: any;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {

    this.allCookies = cookieService.getAll();

    this.cookieString = Object.keys(this.allCookies).reduce((accumulator, cookieName) => {
      accumulator += cookieName + '=' + this.allCookies[cookieName] + ';';
      return accumulator;
    }, '');
    // this.request = this.request.clone({
    //   headers: this.request.headers.set('Cookie', cookieString)
    // });
    // console.log(this.allCookies)
    this.headers = new HttpHeaders({
      'Cookie': this.cookieString
    });
  }



  getAllPost(data): Observable<any> {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Credentials': 'true'
    //   })
    // };
    return this.http.post(environment.apiEndpoint + 'posts', data)
  }

  postItem(data) {
    return this.http.post(environment.apiEndpoint + 'post', data)
  }

  getDashboardPosts() {
    return this.http.get(environment.apiEndpoint + 'posts')
  }

  getPostDetails(id) {
    return this.http.get(environment.apiEndpoint + 'post/' + id)
  }

  getPostImage(data) {
    return this.http.post(environment.apiEndpoint + 'getpostimage', data)
  }

  updatePost(data) {
    return this.http.post(environment.apiEndpoint + 'updatePost', data)
  }

  deletePost(id) {
    return this.http.delete(environment.apiEndpoint + 'post/' + id)
  }

}
