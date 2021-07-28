import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Address } from '../shared/models/address.model';
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
  createFilterOptions returns an array of filter options based on
  addresses what you are filtering by and what properties are present in addresses
  Params:
    filterBy: string - what address property to populate filter options based on
      i.e. writer will populate filter options based on what writers are present in addresses
    addresses: Address[] - an array of addresses to get filter options from
    writers?: Writer[] - an array of writers to add to filter options.
      This parameter is only needed if filterBy is writer

  Returns: An array of filter options
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
        } else if (filterBy === 'dateCreated') {
          options.push(this.datePipe.transform(address[filterBy], 'short'));
        } else {
          options.push(address[filterBy]);
        }
      }
    }

    return [...new Set(options)];
    // What i want from the service
    // this.filterOptions = this.filterAddressesService.createFilterOptions(filterBy, addresses, writers)
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
