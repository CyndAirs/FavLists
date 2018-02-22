import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
//import { appConfig } from '../app.config';
import { Category } from '../models/Category';

@Injectable()
export class CategoriesService {

  constructor(private http: Http) { }

  // Get all posts from the API
  getList(user: string) {
    return this.http.get('/categories/' + user)
      .map(res => res.json());
  }

  create(category: Category) {
    console.log(category);
    return this.http.post('/categories', category);
  }

  remove(_id: string) {
    console.log(_id);
    return this.http.delete('/categories/' + _id);
  }
}