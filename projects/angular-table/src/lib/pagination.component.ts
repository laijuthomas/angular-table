
import {range as observableRange, Observable} from 'rxjs';

import {toArray, filter, map} from 'rxjs/operators';
import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() offset = 0;
  @Input() limit = 1;
  @Input() size = 1;
  @Input() range = 3;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  pages: Observable<number[]>;
  currentPage: number;
  totalPages: number;

  constructor() { }

  ngOnInit() {
    this.getPages(this.offset, this.limit, this.size);
  }

  ngOnChanges() {
    this.getPages(this.offset, this.limit, this.size);
  }

  getPages(offset: number, limit: number, size: number) {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.totalPages = this.getTotalPages(offset, limit, size);

    this.pages = observableRange(-this.range, this.range * 2 + 1).pipe(
      map(res => this.currentPage + res),
      filter(page => this.isValidPageNumber(page, this.totalPages)),
      toArray(), );
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  getCurrentPage(offset: number, limit: number): number {
    return Math.ceil(offset / limit) + 1;
  }

  getTotalPages(offset, limit: number, size: number): number {
    let pages = Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
    const sum = parseInt(offset, 10) + Math.max(limit, 1);
    const diff = size - sum;
    this.currentPage = this.getCurrentPage(offset, limit);
    if (this.currentPage === pages) {
      pages += 1;
    }
    return pages;
  }

  selectPage(page: number, event) {
    this.cancelEvent(event);
    if (this.isValidPageNumber(page, this.totalPages)) {
      let offset = (page - 1) * this.limit;
      if (offset > this.size) {
        offset = this.offset + Math.max(this.limit, 1);
      }
      this.pageChange.emit(offset);
    }
  }

  cancelEvent(event) {
    event.preventDefault();
  }
}
