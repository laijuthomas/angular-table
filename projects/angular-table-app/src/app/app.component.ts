import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AngularTableConfig } from '../../../angular-table/src/lib/config';;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  config: AngularTableConfig = {
    paging: true,
    search: true,
    sorting: true,
    responsive: true,
    className: ['table-hover'],
    limit: true,
    additionalFilters: false
  };
  listData: { limit: number; products: any[]; skip: number; total: number } = {
    limit: 0,
    products: [],
    skip: 0,
    total: 0,
  };
  productsData: any = {
    products: [],
    limit: 0,
    total : 0
  };

  columns: Array<any> = [
    { title: 'Brand', name: 'brand', sort: false },
    { title: 'Category', name: 'category', sort: true },
    { title: 'Price', name: 'price', sort: true },
    { title: 'Actions', name: 'actions', sort: false, className: ['w-100px'] }
  ];
  loading: boolean;
  start: Number = 1;
  page: number;
  params: HttpParams;
  url: string;


  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.url = 'https://dummyjson.com/products';

    this.params = new HttpParams();
    this.params = this.params.delete('limit');
    this.params = this.params.append('limit', 15);
    this.getData();
  }

  onParamsChange(event:any) {
    this.params = event.params;
    this.start = event.start;
    this.getSearch(this.params);

  }

  getData() {
    this.loading = true;
    this.http.get(this.url, { params: this.params }).subscribe((data) => {
      this.productsData = data;
      this.loading = false;
    });
  }
  getSearch(params) {
    console.log('para',params)
    const searchUrl = `${this.url}/search?q=${params.get('search') || ''}`;
    this.loading = true;

    this.http.get(searchUrl,  params ).subscribe((data) => {
      this.productsData = data;
      this.loading = false;
      console.log('data', this.productsData);
    });
  }
}
