import { TestBed } from '@angular/core/testing';

import { SortAddressesService } from './sort-addresses.service';

describe('SortAddressesService', () => {
  let service: SortAddressesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortAddressesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
