import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressesComponent } from './add-addresses.component';

describe('AddAddressesComponent', () => {
  let component: AddAddressesComponent;
  let fixture: ComponentFixture<AddAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
