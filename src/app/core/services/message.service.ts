import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class MessageService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {

  }

  sendNewConversation(data) {
    return this.http.post(environment.apiEndpoint + 'conversation', data)
  }

  replyConversation(data) {
    return this.http.post(environment.apiEndpoint + 'message', data)
  }

  deleteConversation(id) {
    return this.http.delete(environment.apiEndpoint + 'conversation/' + id)
  }

  acceptAndRejectConversation(id, data, type) {
    return this.http.put(environment.apiEndpoint + 'barter/' + type + '/' + id, data)
  }

  ratingConversation(data) {
    return this.http.post(environment.apiEndpoint + 'rating', data)
  }

}
