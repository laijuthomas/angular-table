
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularTableComponent } from './table.component';
import { PaginationModule } from './pagination/pagination.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerDirective } from './spinner/spinner.directive';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationModule],
    exports: [AngularTableComponent, SpinnerComponent, SpinnerDirective],
    declarations: [AngularTableComponent, SpinnerComponent, SpinnerDirective]
})
export class AngularTableModule {}
