import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
 
//import { appConfig } from '../app.config';
import { Favourite } from '../models/Favourite';

@Injectable()
export class FavouritesService {

  constructor(private http: Http) { }

  // Get all posts from the API
  getFavList(user: string, category : string) {
    return this.http.get('/favourites/' + user + '/' + category)
      .map(res => res.json());
  }

  addFav(favourite: Favourite) {
    return this.http.post('/favourites', favourite);
  }

  removeFav(_id: string) {
    console.log('testdel');
    return this.http.delete('/favourites/' + _id);
  }
}
