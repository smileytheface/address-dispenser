import { Injectable } from '@angular/core';
import { Address } from '../shared/models/address.model';
import { SortSelection } from '../shared/models/sort-selection.model';
import { Writer } from '../shared/models/writer.model';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class SortAddressesService {
  constructor() {}

  private writers: Writer[];

  public sortAddresses(
    sortSelection: SortSelection,
    addresses: Address[],
    writers: Writer[]
  ): Address[] {
    this.writers = writers;

    const sortBy = sortSelection.sortBy;
    const ascending: boolean = sortSelection.ascending;

    let sortedAddresses = addresses;

    this.quickSort(
      sortedAddresses,
      0,
      sortedAddresses.length - 1,
      sortBy,
      ascending
    );
    return sortedAddresses;
  }

  public quickSort(
    arr: any[],
    low: number,
    high: number,
    sortBy: string,
    ascending: boolean
  ) {
    if (low < high) {
      const partitionIndex: number = this.partition(
        arr,
        low,
        high,
        sortBy,
        ascending
      );

      //left side
      this.quickSort(arr, low, partitionIndex - 1, sortBy, ascending);
      //right side
      this.quickSort(arr, partitionIndex + 1, high, sortBy, ascending);
    }
  }

  private partition(
    arr: any,
    low: number,
    high: number,
    sortBy: string,
    ascending: boolean
  ): number {
    const pivot: any = high;

    let partitionIndex: number = low - 1;

    const comparator: string = ascending ? '<' : '>';

    for (let j = low; j < high; j++) {
      // the comparisons
      if (sortBy === 'writer') {
        if (
          this.compare(
            this.getWriterName(arr[j].writer).toLowerCase(),
            this.getWriterName(arr[pivot].writer).toLowerCase(),
            comparator
          )
        ) {
          partitionIndex++;
          this.swap(arr, j, partitionIndex);
        }
      } else if (sortBy === 'name' || sortBy === 'city' || sortBy === 'state') {
        if (
          this.compare(
            arr[j][sortBy].toLowerCase(),
            arr[pivot][sortBy].toLowerCase(),
            comparator
          )
        ) {
          partitionIndex++;
          this.swap(arr, j, partitionIndex);
        }
      } else if (sortBy === 'dateCreated') {
        if (
          this.compareDates(
            arr[j].dateCreated,
            arr[pivot].dateCreated,
            comparator
          )
        ) {
          partitionIndex++;
          this.swap(arr, j, partitionIndex);
        }
      } else if (sortBy === 'dateAssigned') {
        // compare the last value in assignment histories
        if (
          arr[j].assignmentHistory.length > 0 &&
          arr[pivot].assignmentHistory.length > 0
        ) {
          const jLastIndex = arr[j].assignmentHistory.length - 1;
          const pivotLastIndex = arr[pivot].assignmentHistory.length - 1;
          if (
            this.compare(
              arr[j].assignmentHistory[jLastIndex].date,
              arr[pivot].assignmentHistory[pivotLastIndex].date,
              comparator
            )
          ) {
            partitionIndex++;
            this.swap(arr, j, partitionIndex);
          }
        } else if (arr[j].assignmentHistory.length > 0) {
          partitionIndex++;
          this.swap(arr, j, partitionIndex);
        }
      } else {
        // if not a string compare unaltered values
        if (this.compare(arr[j][sortBy], arr[pivot][sortBy], comparator)) {
          partitionIndex++;
          this.swap(arr, j, partitionIndex);
        }
      }
    }

    this.swap(arr, pivot, partitionIndex + 1);

    return partitionIndex + 1;
  }

  private swap(arr: any[], first: number, last: number) {
    let temp = arr[first];
    arr[first] = arr[last];
    arr[last] = temp;
  }

  private compare(a: any, b: any, comparator: string) {
    switch (comparator) {
      case '<':
        return a < b;
      case '>':
        return a > b;
    }
  }

  private compareDates(a: string, b: string, comparator: string) {
    const aIsDate: boolean = moment(a, moment.ISO_8601, true).isValid();
    const bIsDate: boolean = moment(b, moment.ISO_8601, true).isValid();
    if (!aIsDate && bIsDate) {
      return false;
    } else if (aIsDate && !bIsDate) {
      return true;
    } else {
      return this.compare(a, b, comparator);
    }
  }

  private getWriterName(id: string) {
    const index = this.writers.findIndex((writer) => writer.id === id);
    return this.writers[index].name;
  }
}
