import {
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {getValueInRange, isNumber} from '../util';


export interface PaginationLinkContext {
  /**
   * The currently selected page number
   */
  currentPage: number;

  /**
   * If `true`, the current link is disabled
   */
  disabled: boolean;
}

/**
 * A context for the `PaginationNumber` link template in case you want to override one.
 *
 * Extends `PaginationLinkContext`.
 *
 */
export interface PaginationNumberContext extends PaginationLinkContext {
  /**
   * The page number, displayed by the current page link.
   */
  $implicit: number;
}

/**
 * A directive to match the 'ellipsis' link template
 *
 */
@Directive({selector: 'ng-template[paginationEllipsis]'})
export class PaginationEllipsis {
  constructor(public templateRef: TemplateRef<PaginationLinkContext>) {}
}

/**
 * A directive to match the 'first' link template
 *
 */
@Directive({selector: 'ng-template[paginationFirst]'})
export class PaginationFirst {
  constructor(public templateRef: TemplateRef<PaginationLinkContext>) {}
}

/**
 * A directive to match the 'last' link template
 *
 */
@Directive({selector: 'ng-template[paginationLast]'})
export class PaginationLast {
  constructor(public templateRef: TemplateRef<PaginationLinkContext>) {}
}

/**
 * A directive to match the 'next' link template
 *
 */
@Directive({selector: 'ng-templatepngbPaginationNext]'})
export class PaginationNext {
  constructor(public templateRef: TemplateRef<PaginationLinkContext>) {}
}

/**
 * A directive to match the page 'number' link template
 *
 */
@Directive({selector: 'ng-template[pPaginationNumber]'})
export class PaginationNumber {
  constructor(public templateRef: TemplateRef<PaginationNumberContext>) {}
}

/**
 * A directive to match the 'previous' link template
 *
 */
@Directive({selector: 'ng-template[paginationPrevious]'})
export class PaginationPrevious {
  constructor(public templateRef: TemplateRef<PaginationLinkContext>) {}
}

/**
 * A component that displays page numbers and allows to customize them in several ways.
 */
@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'role': 'navigation'},
  template: `
    <ng-template #first><span aria-hidden="true">&laquo;&laquo;</span></ng-template>
    <ng-template #previous><span aria-hidden="true">&laquo;</span></ng-template>
    <ng-template #next><span aria-hidden="true">&raquo;</span></ng-template>
    <ng-template #last><span aria-hidden="true">&raquo;&raquo;</span></ng-template>
    <ng-template #ellipsis>...</ng-template>
    <ng-template #defaultNumber let-page let-currentPage="currentPage">
      {{ page }}
      <span *ngIf="page === currentPage" class="sr-only">(current)</span>
    </ng-template>
    <ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
      <li *ngIf="boundaryLinks" class="page-item"
        [class.disabled]="previousDisabled()">
        <a aria-label="First" class="page-link" href
          (click)="selectPage(1); $event.preventDefault()" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <ng-template [ngTemplateOutlet]="tplFirst?.templateRef || first"
                       [ngTemplateOutletContext]="{disabled: previousDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>

      <li *ngIf="directionLinks" class="page-item"
        [class.disabled]="previousDisabled()">
        <a aria-label="Previous" class="page-link" href
          (click)="selectPage(page-1); $event.preventDefault()" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <ng-template [ngTemplateOutlet]="tplPrevious?.templateRef || previous"
                       [ngTemplateOutletContext]="{disabled: previousDisabled()}"></ng-template>
        </a>
      </li>
      <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page"
        [class.disabled]="isEllipsis(pageNumber) || disabled">
        <a *ngIf="isEllipsis(pageNumber)" class="page-link">
          <ng-template [ngTemplateOutlet]="tplEllipsis?.templateRef || ellipsis"
                       [ngTemplateOutletContext]="{disabled: true, currentPage: page}"></ng-template>
        </a>
        <a *ngIf="!isEllipsis(pageNumber)" class="page-link" href (click)="selectPage(pageNumber); $event.preventDefault()">
          <ng-template [ngTemplateOutlet]="tplNumber?.templateRef || defaultNumber"
                       [ngTemplateOutletContext]="{disabled: disabled, $implicit: pageNumber, currentPage: page}"></ng-template>
        </a>
      </li>
      <li *ngIf="directionLinks" class="page-item" [class.disabled]="nextDisabled()">
        <a aria-label="Next" class="page-link" href
          (click)="selectPage(page+1); $event.preventDefault()" [attr.tabindex]="(hasNext() ? null : '-1')">
          <ng-template [ngTemplateOutlet]="tplNext?.templateRef || next"
                       [ngTemplateOutletContext]="{disabled: nextDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>

      <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="nextDisabled()">
        <a aria-label="Last" class="page-link" href
          (click)="selectPage(pageCount); $event.preventDefault()" [attr.tabindex]="(hasNext() ? null : '-1')">
          <ng-template [ngTemplateOutlet]="tplLast?.templateRef || last"
                       [ngTemplateOutletContext]="{disabled: nextDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>
    </ul>
  `
})
export class PaginationComponent implements OnChanges {
  pageCount = 0;
  pages: number[] = [];

  @ContentChild(PaginationEllipsis) tplEllipsis: PaginationEllipsis;
  @ContentChild(PaginationFirst) tplFirst: PaginationFirst;
  @ContentChild(PaginationLast) tplLast: PaginationLast;
  @ContentChild(PaginationNext) tplNext: PaginationNext;
  @ContentChild(PaginationNumber) tplNumber: PaginationNumber;
  @ContentChild(PaginationPrevious) tplPrevious: PaginationPrevious;

  /**
   * If `true`, pagination links will be disabled.
   */
  @Input() disabled: boolean;

  /**
   * If `true`, the "First" and "Last" page links are shown.
   */
  @Input() boundaryLinks: boolean;

  /**
   * If `true`, the "Next" and "Previous" page links are shown.
   */
  @Input() directionLinks: boolean;

  /**
   * If `true`, the ellipsis symbols and first/last page numbers will be shown when `maxSize` > number of pages.
   */
  @Input() ellipses: boolean;

  /**
   * Whether to rotate pages when `maxSize` > number of pages.
   *
   * The current page always stays in the middle if `true`.
   */
  @Input() rotate: boolean;

  /**
   *  The number of items in your paginated collection.
   *
   *  Note, that this is not the number of pages. Page numbers are calculated dynamically based on
   *  `collectionSize` and `pageSize`. Ex. if you have 100 items in your collection and displaying 20 items per page,
   *  you'll end up with 5 pages.
   */
  @Input() collectionSize: number;

  /**
   *  The maximum number of pages to display.
   */
  @Input() maxSize: number;

  /**
   *  The current page.
   *
   *  Page numbers start with `1`.
   */
  @Input() page = 1;

  /**
   *  The number of items per page.
   */
  @Input() pageSize: number;

  /**
   *  An event fired when the page is changed. Will fire only if collection size is set and all values are valid.
   *
   *  Event payload is the number of the newly selected page.
   *
   *  Page numbers start with `1`.
   */
  @Output() pageChange = new EventEmitter<number>(true);

  /**
   * The pagination display size.
   *
   * Bootstrap currently supports small and large sizes.
   */
  @Input() size: 'sm' | 'lg';

  constructor() {
    this.disabled = false;
    this.boundaryLinks = false;
    this.directionLinks = true;
    this.ellipses = true;
    this.maxSize = 0;
    this.pageSize = 10;
    this.rotate = false;
    this.size = 'lg';
  }

  hasPrevious(): boolean { return this.page > 1; }

  hasNext(): boolean { return this.page < this.pageCount; }

  nextDisabled(): boolean { return !this.hasNext() || this.disabled; }

  previousDisabled(): boolean { return !this.hasPrevious() || this.disabled; }

  selectPage(pageNumber: number): void { this._updatePages(pageNumber); }

  ngOnChanges(changes: SimpleChanges): void { this._updatePages(this.page); }

  isEllipsis(pageNumber): boolean { return pageNumber === -1; }

  /**
   * Appends ellipses and first/last page number to the displayed pages
   */
  private _applyEllipses(start: number, end: number) {
    if (this.ellipses) {
      if (start > 0) {
        if (start > 1) {
          this.pages.unshift(-1);
        }
        this.pages.unshift(1);
      }
      if (end < this.pageCount) {
        if (end < (this.pageCount - 1)) {
          this.pages.push(-1);
        }
        this.pages.push(this.pageCount);
      }
    }
  }

  /**
   * Rotates page numbers based on maxSize items visible.
   * Currently selected page stays in the middle:
   *
   * Ex. for selected page = 6:
   * [5,*6*,7] for maxSize = 3
   * [4,5,*6*,7] for maxSize = 4
   */
  private _applyRotation(): [number, number] {
    let start = 0;
    let end = this.pageCount;
    let leftOffset = Math.floor(this.maxSize / 2);
    let rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;

    if (this.page <= leftOffset) {
      // very beginning, no rotation -> [0..maxSize]
      end = this.maxSize;
    } else if (this.pageCount - this.page < leftOffset) {
      // very end, no rotation -> [len-maxSize..len]
      start = this.pageCount - this.maxSize;
    } else {
      // rotate
      start = this.page - leftOffset - 1;
      end = this.page + rightOffset;
    }

    return [start, end];
  }

  /**
   * Paginates page numbers based on maxSize items per page.
   */
  private _applyPagination(): [number, number] {
    let page = Math.ceil(this.page / this.maxSize) - 1;
    let start = page * this.maxSize;
    let end = start + this.maxSize;

    return [start, end];
  }

  private _setPageInRange(newPageNo) {
    const prevPageNo = this.page;
    this.page = getValueInRange(newPageNo, this.pageCount, 1);

    if (this.page !== prevPageNo && isNumber(this.collectionSize)) {
      this.pageChange.emit(this.page);
    }
  }

  private _updatePages(newPage: number) {
    this.pageCount = Math.ceil(this.collectionSize / this.pageSize);

    if (!isNumber(this.pageCount)) {
      this.pageCount = 0;
    }

    // fill-in model needed to render pages
    this.pages.length = 0;
    for (let i = 1; i <= this.pageCount; i++) {
      this.pages.push(i);
    }

    // set page within 1..max range
    this._setPageInRange(newPage);

    // apply maxSize if necessary
    if (this.maxSize > 0 && this.pageCount > this.maxSize) {
      let start = 0;
      let end = this.pageCount;

      // either paginating or rotating page numbers
      if (this.rotate) {
        [start, end] = this._applyRotation();
      } else {
        [start, end] = this._applyPagination();
      }

      this.pages = this.pages.slice(start, end);

      // adding ellipses
      this._applyEllipses(start, end);
    }
  }
}