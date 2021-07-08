export interface AngularTableConfig {
  paging?: boolean;
  search?: boolean;
  sorting?: boolean;
  responsive?: boolean;
  limit?: boolean,
  additionalFilters?: boolean,
  defaultRowCount?: '25' | string;
  className?: string[];
  theadClassName?: string;
  searchClassName?: string;
}

export const angularTableConfig: AngularTableConfig = {
  paging: true,
  search: true,
  sorting: false,
  className: ['table-hover'],
  responsive: true,
  limit: true,
  additionalFilters: false,
  defaultRowCount: '25'
};

