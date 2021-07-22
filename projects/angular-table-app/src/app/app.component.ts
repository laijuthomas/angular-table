import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { AngularTableConfig } from 'angular-table';;

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
  listData = {
    'count': 0,
    'results': []
  };
  columns: Array<any> = [
    { title: 'Date', name: 'date', sort: true, sort_direction: 'desc' },
    { title: 'Company', name: 'company', sort: true },
    { title: 'Contact', name: 'contact', sort: true },
    { title: 'Actions', name: 'actions', sort: false, className: ['w-100px'] }
  ];
  loading: boolean;
  start: Number = 1;
  page: number;
  params: HttpParams;


  constructor() { }

  ngOnInit() {
    this.params = new HttpParams();
  }

  onParamsChange(event) {
    console.log(event)
  }


}
