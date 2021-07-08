import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  PaginationComponent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationNumber,
  PaginationPrevious
} from './pagination';

export {
  PaginationComponent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationNumber,
  PaginationPrevious
} from './pagination';

const DIRECTIVES = [
  PaginationComponent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationNumber,
  PaginationPrevious
];

@NgModule({declarations: DIRECTIVES, exports: DIRECTIVES, imports: [CommonModule]})
export class PaginationModule {}
