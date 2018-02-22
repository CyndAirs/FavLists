import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';

import { FavouritesService } from '../services/favourites.service';
import { AlertService } from '../services/alert.service';

import { Favourite } from '../models/Favourite';

import { OrderByPipe } from '../pipes/orderByPipe';


@Component({
  moduleId: module.id,
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit, OnChanges {
  @Input() category = '';
  model: any = {};
  favourites: any = [];
  loading = false;
  active = false;

  constructor(
    private favouritesService: FavouritesService,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit () {
    // Retrieve posts from the API
    this.ngOnChanges();
  }

  ngOnChanges () {
    // Retrieve posts from the API
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))._id;
    if (this.category !== '') {
      this.favouritesService.getFavList(currentUser, this.category).subscribe(favourites => {
        this.favourites = favourites;
        this.active = true;
      });
    } else {
      this.active = false;
    }
  }

  addFav() {
    this.loading = true;
    const favourite = {
      _id: '',
      user: JSON.parse(localStorage.getItem('currentUser'))._id,
      category:  this.category,
      rank: this.model.newrank,
      title: this.model.newtitle
    };
    console.log(favourite);
    this.favouritesService.addFav(favourite).subscribe(
      data => {
          this.alertService.success('Favourite added', true);
          this.ngOnChanges();
          this.loading = false;
      },
      error => {
          this.alertService.error(error._body);
          this.loading = false;
      });
  }

  removeFav(_id){
    this.favouritesService.removeFav(_id).subscribe(
      data => {
          this.alertService.success('Favourite removed', true);
          this.ngOnChanges();
          this.loading = false;
      },
      error => {
          this.alertService.error(error._body);
          this.loading = false;
      });
  }

}
