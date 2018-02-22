import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
//import { appConfig } from '../app.config';
import { User } from '../models/User';
 
@Injectable()
export class UserService {
    constructor(private http: Http) { }
 
    getAll() {
        return this.http.get('/users')
          .map(res => res.json());
    }
 
    getById(_id: string) {
        return this.http.get('/users/' + _id);
    }
 
    create(user: User) {
        return this.http.post('/users/register', user);
    }
 
    update(user: User) {
        return this.http.put('/users/' + user._id, user);
    }
 
    delete(_id: string) {
        return this.http.delete('/users/' + _id);
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}