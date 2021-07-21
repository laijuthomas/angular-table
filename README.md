

# AngularTable
A bootstrap based table component for Angular 2+

## Getting Started

### Installation

Install via [npm][npm] package manager 

```bash
npm install @laijuthomas/angular-table --save
```

### Usage

Import `angular-table` module

```js
import { HttpClientModule} from '@angular/common/http';
import { AngularTableModule } from '@laijuthomas/angular-table';

@NgModule({
  imports: [ HttpClientModule, AngularTableModule ]
})
```

Then in HTML

```html
  <angular-table [totalResults]="listData.count" [loading]="loading" [params]="params" [columns]="columns"
    [page]="page" [config]="config" [data]="listData['results']" (paramsChanged)="onParamsChange($event)">

    <tbody table body>
      <tr *ngFor="let request of listData['results']; let i=index">

      </tr>
      <tr *ngIf="listData.count === 0">
        <td [attr.colspan]="columns.length">No data available in table</td>
      </tr>
    </tbody>
  </angular-table>
```

## What's included

Within the download you'll find the following directories and files. You'll see something like this:

```
angular-table/
└── projects/
    ├── angular-table/
    └── angular-table-app/
```
`angular-table/` - library

`angular-table-app/` - demo application

## Creators

**Laiju Thomas**

* <https://github.com/laijuthomas>