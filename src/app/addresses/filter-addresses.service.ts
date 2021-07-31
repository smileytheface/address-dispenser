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
    filterBy: string,
    searchString: string
  ): any[] {
    // If searching for a writer name
    if (filterOptions[0]) {
      if (filterOptions[0].name) {
        return filterOptions.filter(
          (filterOption) =>
            filterOption.name
              .toString()
              .toLowerCase()
              .indexOf(searchString.toLowerCase()) !== -1
        );
      }
    }

    // If searching anything that's not a writer name
    return filterOptions.filter((filterOption) => {
      if (!filterOption) {
        filterOption = 'No ' + filterBy;
      }

      // If filterOption is a date, transform it into a short date string
      if (moment(filterOption, moment.ISO_8601, true).isValid()) {
        filterOption = this.datePipe.transform(filterOption, 'short');
      }

      return (
        filterOption
          .toString()
          .toLowerCase()
          .indexOf(searchString.toLowerCase()) !== -1
      );
    });
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
        options.push(address[filterBy]);
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

  /*
  Description:
  filterAddresses takes an array of addresses and an array of filter selections and
  returns an array of addresses that match the filter selection options

  Params:
    addresses: Address[] - an array of addresses to be filtered
    filterSelections: FilterSelection[] - an array of filterSelections for filtering addresses with

  Returns:
    Address[] - filtered array of addresses
  */
  public filterAddresses(
    addresses: Address[],
    filterSelections: FilterSelection[]
  ): Address[] {
    let filteredAddresses: Address[] = addresses;

    if (filterSelections.length > 0) {
      filteredAddresses = filteredAddresses.filter((address) => {
        let addressMatchesFilterOption: boolean = false;
        for (const filterSelection of filterSelections) {
          addressMatchesFilterOption = false;
          if (filterSelection.filterBy === 'writer') {
            // If filtering by writer check if address.writer matches
            // any writer.id in selectedFilterOptions
            for (const filterOption of filterSelection.selectedFilterOptions) {
              if (address.writer === filterOption.id) {
                addressMatchesFilterOption = true;
              }
            }
          } else if (filterSelection.filterBy === 'phone') {
            // If filtering by phone check if any of the phone numbers in address.phone
            // match any of the phone numbers in selectedFilterOptions
            for (const filterOption of filterSelection.selectedFilterOptions) {
              for (const phone of address.phone) {
                if (phone === filterOption) {
                  addressMatchesFilterOption = true;
                }
              }
            }
          } else {
            for (const filterOption of filterSelection.selectedFilterOptions) {
              if (address[filterSelection.filterBy] === filterOption) {
                addressMatchesFilterOption = true;
              }
            }
          }

          if (!addressMatchesFilterOption) {
            return false;
          }
        }
        return true;
      });
    }

    return filteredAddresses;
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
