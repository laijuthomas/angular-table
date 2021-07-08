
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularTableComponent } from './table.component';
import { PaginationComponent } from './pagination.component';
import { SpinnerComponent } from './spinner.component';
import { SpinnerDirective } from './spinner.directive';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [AngularTableComponent, PaginationComponent, SpinnerComponent, SpinnerDirective],
  declarations: [AngularTableComponent, PaginationComponent, SpinnerComponent, SpinnerDirective],
  entryComponents: [],
})
export class AngularTableModule {}
