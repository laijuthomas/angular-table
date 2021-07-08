
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'angular-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class AngularTableComponent implements OnChanges {
  @Input() fullColumns = [];
  @Input() columns = [];
  @Input () page: number;
  @Input() config: any = {
    paging: true,
    search: true,
    sorting: false,
    className: ['table-hover'],
    responsive: true,
    limit: true,
    additionalFilters: false,
    defaultRowCount: '25',
  };
  @Input() data: any;
  @Input() totalResults: any;
  @Input() deleteRow: boolean;
  @Input() params: HttpParams = new HttpParams();
  @Input() navigatePage: string;
  @Input() search: string;
  @Input() allChecked: boolean;
  @Input() loading: boolean;

  @Output() tableChanged: EventEmitter<any> = new EventEmitter();
  @Output() paramsChanged: EventEmitter<any> = new EventEmitter();
  @Output() inputChanged: EventEmitter<any> = new EventEmitter();
  @Output() saveColumn: EventEmitter<any> = new EventEmitter();

  rows = ['25', '50', '100'];
  results = [];
  term = new FormControl();
  tableData = {
    'search': '',
    'rows': '25',
    'sort': '',
    'page': 1,
    'offset': 0,
    'filter_type': '',
  };

  start = 1;
  currentPage = 1;

  response: any = {
    tableData: this.tableData,
    start: 1,
    params: this.params
  };

  searchClassName: string;
  id: string = Math.random().toString(36).substr(2, 9);

  selectedColumns = [];

  constructor() {
    this.term.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(
      (data) => {
        this.onChangeTable(data, 'search');
      });
  }

  ngOnChanges(changes: SimpleChanges) {

    this.selectedColumns = Object.assign([], this.columns);

    if (this.config.additionalFilters && !this.config.searchClassName ) {
      this.searchClassName = 'col-md-3';
    } else {
      this.searchClassName = this.config.searchClassName ? this.config.searchClassName : 'col';
    }

    if (changes.data && changes.data.currentValue) {
      this.results = changes.data.currentValue;
    }

    if (this.page && this.page !== this.tableData.page) {
      this.tableData.page = this.page;
    }
    if (changes.deleteRow && this.deleteRow) {
      if (this.data && this.data.length === 1 && this.tableData.page !== 1) {
        const page = this.tableData.page - 1;
        this.onChangeTable(page, 'paging');
      } else {
        this.onChangeTable(this.tableData.page, 'paging');
      }
    }

    if (changes.navigatePage && this.navigatePage) {
      const rows = parseInt(this.tableData.rows, 10);
      if (this.navigatePage === 'first') {
        this.onChangeTable(1, 'paging');
      } else {
        const lastPage = Math.ceil(this.totalResults / rows);
        const newLastPage = Math.ceil((this.totalResults + 1) / rows);
        if (newLastPage > lastPage) {
          this.totalResults += 1;
          this.onChangeTable(newLastPage, 'paging');
        } else {
          this.onChangeTable(lastPage, 'paging');
        }
      }
    }

    if (changes.search && this.search && this.search !== '') {
      this.term.setValue(this.search);
    }

    if (this.params && this.params.has('ordering') && this.params.get('ordering') !== '') {
      let orderingField = this.params.get('ordering');
      let sort = 'asc';
      if (orderingField.charAt(0) === '-') {
        orderingField = orderingField.replace('-', '');
        sort = 'desc';
      }
      this.columns.forEach(function(col) {
        if (orderingField === col.name) {
          col.sort = sort;
        }
      });
    }
  }

  onChangeTable (data, type) {
    this.tableData.filter_type = type;

    if (type === 'sort' && data && data.sort !== false) {
      switch (data.sort_direction) {
        case 'asc':
          data.sort_direction = 'desc';
          break;
        case 'desc':
          data.sort_direction = '';
          break;
        default:
          data.sort_direction = 'asc';
          break;
      }
      this.tableChanged.emit(this.tableData);
      let sortParam = '';
      this.columns.forEach(function(col) {
        if (col.sort) {
          if (data.name === col.name) {
            if (col.sort) {
              if (col.sort_direction === 'desc') {
                sortParam = sortParam !== '' ? sortParam + ',' + col.name  : '-' + col.name;
              } else if (col.sort_direction === 'asc') {
                sortParam = sortParam !== '' ? sortParam + ',' + col.name  : col.name;
              }
            }
          } else {
            col.sort_direction = '';
          }
        }
      });
      this.params = this.params.delete('ordering');
      if (sortParam !== '') {
        this.params = this.params.append('ordering', sortParam);
      }
    } else if (type === 'paging') {
      this.tableData.page = data;
      this.tableChanged.emit(this.tableData);
      const offset = ((this.tableData.page - 1) * parseInt(this.tableData.rows, 10));
      this.start = offset + 1;
      this.tableData.offset = offset;
      this.params = this.params.delete('offset');
      this.params = this.params.append('offset', offset.toString());
    } else if (type === 'row') {
      this.tableData.rows = data.target.value;
      this.tableChanged.emit(this.tableData);
      const offsetValue =  ((this.tableData.page - 1) * parseInt(this.tableData.rows, 10));
      this.start = offsetValue + 1;
      this.params = this.params.delete('offset');
      this.params = this.params.append('offset', offsetValue.toString());
      this.params = this.params.delete('limit');
      this.params = this.params.append('limit', this.tableData.rows);
    } else if (type === 'search') {
      this.start =1;
      this.tableData.search = data;
      this.tableData.page = 1;
      if (this.params && this.params.has('offset')) {
        this.params = this.params.delete('offset');
      }
      this.tableChanged.emit(this.tableData);
      this.params = this.params.delete('search');
      if (this.tableData.search !== '') {
        this.params = this.params.append('search', this.tableData.search);
      }
    }

    this.emitResponse();
  }

  emitResponse() {
    this.response = {
      tableData: this.tableData,
      start: this.start,
      params: this.params
    };

    this.paramsChanged.emit(this.response);
  }

  selectAll(event) {
    this.allChecked = true;
    this.inputChanged.emit(event);
  }

  onChangeColumn(event, column) {
    const index = this.selectedColumns.findIndex(x => x.name === column.name);
    if (event.target.checked) {
      if (index < 0) {
        this.selectedColumns.push(column);
      }
    } else {
      if (index >= 0) {
        this.selectedColumns.splice(index, 1);
      }
    }
  }

  onSaveColumn() {
    this.saveColumn.emit(this.selectedColumns);
  }

}
