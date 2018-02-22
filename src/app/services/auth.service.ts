import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
 
//import { AppConfig } from '../app.config';
 
@Injectable()
export class AuthService {
  constructor(private http: Http) { }

  login(username: string, password: string) {
      return this.http.post('/users/authenticate', { username: username, password: password })
          .map(res => {
              // login successful if there's a jwt token in the response
              let user = res.json();
              if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('currentUser', JSON.stringify(user));
              }
          });
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
  }
}