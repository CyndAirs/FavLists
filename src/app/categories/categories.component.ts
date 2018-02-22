import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CategoriesService } from '../services/categories.service';
import { AlertService } from '../services/alert.service';

import { Category } from '../models/Category';

import { OrderByPipe } from '../pipes/orderByPipe';

@Component({
  moduleId: module.id,
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  model: any = {};
  currCategory = '';
  categories: any = [];
  loading = false;

  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))._id;
    this.categoriesService.getList(currentUser).subscribe(categories => {
      this.categories = categories;
      console.log(this.categories);
    });

  }

  add() {
    this.loading = true;
    const category = {
      _id: null,
      user: JSON.parse(localStorage.getItem('currentUser'))._id,
      name: this.model.newname
    };
    console.log(category);
    this.categoriesService.create(category).subscribe(
      data => {
          this.alertService.success('Category added', true);
          this.ngOnInit();
          this.loading = false;
      },
      error => {
          this.alertService.error(error._body);
          this.loading = false;
      });
  }

  remove(_id){
    this.categoriesService.remove(_id).subscribe(
      data => {
          this.alertService.success('Category removed', true);
          this.ngOnInit();
          this.loading = false;
      },
      error => {
          this.alertService.error(error._body);
          this.loading = false;
      });
  }

  changeCategory(category){
    this.currCategory = category;
  }

}
