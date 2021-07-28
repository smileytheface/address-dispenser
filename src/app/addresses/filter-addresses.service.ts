import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterAddressesService {
  constructor() {}

  // searchFilterOptions returns a filtered array of filterOptions based on the search string
  public searchFilterOptions(
    filterOptions: any[],
    searchString: string
  ): any[] {
    // If searching for a writer name
    if (filterOptions[0].name) {
      return filterOptions.filter(
        (filterOption) =>
          filterOption.name
            .toString()
            .toLowerCase()
            .indexOf(searchString.toLowerCase()) !== -1
      );
    }

    // If searching anything that's not a writer name
    return filterOptions.filter(
      (filterOption) =>
        filterOption
          .toString()
          .toLowerCase()
          .indexOf(searchString.toLowerCase()) !== -1
    );
  }
}
