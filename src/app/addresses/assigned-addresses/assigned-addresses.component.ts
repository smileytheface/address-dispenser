import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Address } from 'src/app/shared/models/address.model';
import { Writer } from 'src/app/shared/models/writer.model';
import { FilterBottomSheetComponent } from './filter-bottom-sheet/filter-bottom-sheet.component';

@Component({
  selector: 'app-assigned-addresses',
  templateUrl: './assigned-addresses.component.html',
  styleUrls: ['./assigned-addresses.component.scss'],
})
export class AssignedAddressesComponent implements OnInit {
  writers: Writer[] = [];

  addressData: Address[] = [
    {
      id: '0',
      name: 'Gregory Jones',
      street: '1000 Street St',
      city: 'Crete',
      state: 'IL',
      zip: '60417',
      phone: ['708-539-4375'],
      assigned: false,
      writer: {
        name: 'Mark Way',
        email: '',
        phone: '',
        prefersText: true,
        defaultAddressAmount: 6,
        totalCheckedOut: 6,
        color: '#E2F1FF',
      },
    },
    {
      id: '0',
      name: 'Josh Figelhorn',
      street: '1000 Street St',
      city: 'Crete',
      state: 'IL',
      zip: '60417',
      phone: ['708-539-4375'],
      assigned: false,
      writer: null,
    },
    {
      id: '0',
      name: 'Arnold Ord',
      street: '1000 Street St',
      city: 'Crete',
      state: 'IL',
      zip: '60417',
      phone: ['708-539-4375'],
      assigned: false,
      writer: null,
    },
    {
      id: '0',
      name: 'Joshua Ezekiel',
      street: '1000 Street St',
      city: 'Crete',
      state: 'IL',
      zip: '60417',
      phone: ['708-539-4375'],
      assigned: false,
      writer: null,
    },
    {
      id: '0',
      name: 'Plop Juice',
      street: '1000 Street St',
      city: 'Crete',
      state: 'IL',
      zip: '60417',
      phone: ['708-539-4375'],
      assigned: true,
      writer: {
        name: 'Iola Blackman',
        email: '',
        phone: '',
        prefersText: true,
        defaultAddressAmount: 6,
        totalCheckedOut: 15,
        color: '#FFCFD5',
      },
    },
    {
      id: '0',
      name: 'Justine Killo',
      street: '1000 Street St',
      city: 'Crete',
      state: 'IL',
      zip: '60417',
      phone: ['708-539-4375'],
      assigned: true,
      writer: {
        name: 'Mark Way',
        email: '',
        phone: '',
        prefersText: true,
        defaultAddressAmount: 6,
        totalCheckedOut: 6,
        color: '#E2F1FF',
      },
    },
    {
      id: '0',
      name: 'Fun Fran',
      street: '1000 Street St',
      city: 'Crete',
      state: 'IL',
      zip: '60417',
      phone: ['708-539-4375'],
      assigned: true,
      writer: {
        name: 'Iola Blackman',
        email: '',
        phone: '',
        prefersText: true,
        defaultAddressAmount: 6,
        totalCheckedOut: 15,
        color: '#FFCFD5',
      },
    },
  ];

  addresses: Address[] = [];
  filteredWriters: Writer[];

  private _searchTerm: string;
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filteredWriters = this.filterWriters(value);
  }

  filterWriters(searchString: string) {
    return this.writers.filter(
      (writer) =>
        writer.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
    );
  }

  mobile: boolean;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    // creating writers array
    for (const address of this.addressData) {
      // adding addresses to local addresses array from addressData
      if (address.writer) {
        this.addresses.push(address);
      }

      // if there is nothing in writers yet, push first writer in addresses
      if (!this.writers.length && address.writer) {
        this.writers.push(address.writer);
        // console.log('hey');
      } else {
        // if there is something in writers and the writer for the address in question has a writer,
        // only push a new writer if it's not already in writers
        if (address.writer) {
          let writerAlreadyExists = false;

          // go through writers array checking for an existing writer
          for (const writer of this.writers) {
            if (address.writer.name === writer.name) {
              writerAlreadyExists = true;
              break;
            } else {
              writerAlreadyExists = false;
            }
          }

          // if after going through writers array there is no writer that is the same as the addresses writer
          // push the new writer
          if (!writerAlreadyExists) {
            this.writers.push(address.writer);
          }
        }
      }
    }

    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = true;
        } else {
          this.mobile = false;
        }
      });

    this.filteredWriters = this.writers;
  }

  addressesByName(writer: Writer): Address[] {
    let writersAddresses: Address[] = [];

    this.addressData.forEach((address) => {
      if (address.writer && address.writer.name === writer.name) {
        writersAddresses.push(address);
      }
    });
    return writersAddresses;
  }

  filter(name: string) {
    this.searchTerm = name;
  }

  clearFilter() {
    this.searchTerm = '';
  }

  openBottomSheet() {
    let sheet = this.bottomSheet.open(FilterBottomSheetComponent, {
      data: this.writers,
    });

    sheet.afterDismissed().subscribe((writer) => {
      this.searchTerm = writer;
    });
  }
}
