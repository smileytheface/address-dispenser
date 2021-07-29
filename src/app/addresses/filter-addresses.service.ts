import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { Address } from '../shared/models/address.model';
import { FilterSelection } from '../shared/models/filter-selection.model';
import { Writer } from '../shared/models/writer.model';

@Injectable({
  providedIn: 'root',
})
export class FilterAddressesService {
  constructor(private datePipe: DatePipe) {}

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

    // If searching for a date, transform all iso formatted dates into short date strings
    if (
      moment(filterOptions[0], moment.ISO_8601, true).isValid() ||
      moment(filterOptions[1], moment.ISO_8601, true).isValid()
    ) {
      for (const [index, option] of filterOptions.entries()) {
        if (moment(option, moment.ISO_8601, true).isValid()) {
          filterOptions[index] = this.datePipe.transform(option, 'short');
        }
      }
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

  /*
  Description:
    createFilterOptions returns an array of filter options based on
    addresses what you are filtering by and what properties are present in addresses

  Params:
    filterBy: string - what address property to populate filter options based on
      i.e. writer will populate filter options based on what writers are present in addresses
    addresses: Address[] - an array of addresses to get filter options from
    writers?: Writer[] - an array of writers to add to filter options.
      This parameter is only needed if filterBy is writer

  Returns:
    An array of filter options
  */
  public createFilterOptions(
    filterBy: string,
    addresses: Address[],
    writers?: Writer[]
  ): any[] {
    let options = [];

    // When adding writers to options, set the options to writers objects themselves that get fetched on init
    if (filterBy === 'writer') {
      options = writers;
    } else if (filterBy === 'phone') {
      // If filtering by phone number, get all phone numbers
      for (let address of addresses) {
        if (address.phone.length > 0) {
          for (let phone of address.phone) {
            options.push(phone);
          }
        } else {
          options.push('No ' + this.formatFilterBy(filterBy));
        }
      }
    } else if (filterBy === 'dateAssigned') {
      // If filtering by date assigned, get the last date assigned for all addresses with assignment history
      for (let address of addresses) {
        if (address.assignmentHistory && address.assignmentHistory.length > 0) {
          options.push(
            address.assignmentHistory[address.assignmentHistory.length - 1].date
          );
        } else {
          options.push('No ' + this.formatFilterBy(filterBy));
        }
      }
    } else {
      for (let address of addresses) {
        // Adding all address.filterBy fields
        // For example if filterBy is name, this will go through all addresses and add address.name to options
        // Any duplicates get removed later with the spread operator
        if (!address[filterBy]) {
          // If the property is null, push No {{ filterBy }}
          options.push('No ' + this.formatFilterBy(filterBy));
        } else {
          options.push(address[filterBy]);
        }
      }
    }

    // Removes duplicates
    return [...new Set(options)];
  }

  /*
  Description:
    updateFilterSelection will either add or remove a filterOption from an array of filterSelections

  Params:
    filterSelections: FilterSelection[] - an array of filterSelections to be updated
    filterBy: string - what address property filterOption refers to
      i.e. writer, name, dateAssigned, etc...
    filterOption: any - a filter option to be added or removed from the filterSelection array
    add: boolean - true if filter option is being added and false if filter option is being removed

  Returns:
    An updated array of filterSelections
  */
  public updateFilterSelections(
    filterSelections: FilterSelection[],
    filterBy: string,
    filterOption: any,
    add: boolean
  ): FilterSelection[] {
    let updatedFilterSelections = filterSelections;
    // If there is already a filterSelection for that filterBy option, store the index of that filterSelection for later
    const filterSelectionsIndex = filterSelections.findIndex(
      (filterSelection) => filterSelection.filterBy === filterBy
    );

    if (add) {
      // If adding the filter option
      if (filterSelectionsIndex < 0) {
        const newFilterSelection: FilterSelection = {
          filterBy: filterBy,
          selectedFilterOptions: [filterOption],
        };

        updatedFilterSelections.push(newFilterSelection);
      } else {
        updatedFilterSelections[
          filterSelectionsIndex
        ].selectedFilterOptions.push(filterOption);
      }
    } else {
      // If removing filter option
      if (filterSelectionsIndex < 0) {
        console.error('Cannot find filter option in ' + filterBy);
      } else {
        // remove that filter option from the filterSelection's array
        updatedFilterSelections[filterSelectionsIndex].selectedFilterOptions =
          updatedFilterSelections[
            filterSelectionsIndex
          ].selectedFilterOptions.filter(
            (filOption) => filOption !== filterOption
          );

        // If the filterSelection has no more filterOptions selected, remove it from the filterSelection array
        if (
          updatedFilterSelections[filterSelectionsIndex].selectedFilterOptions
            .length < 1
        ) {
          updatedFilterSelections.splice(filterSelectionsIndex, 1);
        }
      }
    }

    return updatedFilterSelections;
  }

  // Formats filterBy (which should be in camelCase) and converts it to Title Case
  public formatFilterBy(filterBy: string): string {
    // https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript?page=1&tab=votes#tab-top
    // https://stackoverflow.com/questions/4149276/how-to-convert-camelcase-to-camel-case
    // Adds space between cammel case and makes makes options Title Case
    if (filterBy) {
      return filterBy.replace(/([A-Z])/g, ' $1').replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  }
}
