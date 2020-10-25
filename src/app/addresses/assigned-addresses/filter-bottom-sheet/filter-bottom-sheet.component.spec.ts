import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBottomSheetComponent } from './filter-bottom-sheet.component';

describe('FilterBottomSheetComponent', () => {
  let component: FilterBottomSheetComponent;
  let fixture: ComponentFixture<FilterBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
