

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

### Inputs
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| totalResults | `number` | `` | yes | Set the total count of the data array |
| loading | `boolean` | `false` | no | Set to show loader in the table |
| params | `HttpParams` | `-` | no | Set existing data params |
| columns | `array` | `-` | yes | Set table header column data |
| page | `number` | `-` | no | Set current page number |
| data | `array` | `-` | no | Set data to show in the table |
| [config] | `AngularTableConfig` | `default config` | no | config for the table |

### Outputs

| Output  | Description |
| ------------- | ------------- |
| (paramsChanged)  | Fired when pagination, search, sort etc. changes |

### Other
 Name  | Type | Description |
| ------------- | ------------- | ------------- |
| AngularTableConfig | configuration | Configuration for the AngularTable component.|

### Configuration

| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| paging  | `boolean` | `true` | no | Set pagination enabled or not |
| search  | `boolean` | `true` | no | Set search enabled or not |
| sorting  | `boolean` | `yes` | no | Set table sort enabled or not |
| responsive  | `boolean` | `false` | no | Set bootstrap table responsive class |
| limit  | `boolean` | `false` | no | Set whether to show the option to change the row count |
| additionalFilters  | `boolean` | `false` | no | Set additional filter block enabled or not |
| defaultRowCount  | `number` | `25` | no | Set number of rows to show in the table |
| className  | `string` | `` | no | Set additional css class to the table component |
| theadClassName  | `string` | `` | no | Set css class to the table head |
| searchClassName  | `string` | `` | no | Set css class to the table search block |

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