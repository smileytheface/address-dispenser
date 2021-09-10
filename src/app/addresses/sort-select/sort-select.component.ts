import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { SortSelection } from '../../shared/models/sort-selection.model';
import { FilterAddressesService } from '../filter-addresses.service';

@Component({
  selector: 'app-sort-select',
  templateUrl: './sort-select.component.html',
  styleUrls: ['./sort-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SortSelectComponent implements OnInit {
  @Output() sortSelectChange = new EventEmitter<SortSelection>();
  sortByOptions: string[] = [
    'writer',
    'name',
    'age',
    'city',
    'state',
    'zip',
    'phone',
    'dateCreated',
    'dateAssigned',
  ];

  sortSelection: SortSelection = {
    sortBy: null,
    ascending: true,
  };

  constructor(private filterAddressesService: FilterAddressesService) {}

  ngOnInit(): void {}

  public onSortByChange(): void {
    this.sortSelectChange.emit(this.sortSelection);
  }

  public toggleAscending(): void {
    this.sortSelection.ascending = !this.sortSelection.ascending;
    if (this.sortSelection.sortBy) {
      this.sortSelectChange.emit(this.sortSelection);
    }
  }

  public getAscendingTitle(): string {
    return this.sortSelection.ascending ? 'Ascending' : 'Descending';
  }

  public formatSortByOption(option: string): string {
    return this.filterAddressesService.camelToTitle(option);
  }
}
