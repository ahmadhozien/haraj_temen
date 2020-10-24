import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllproductsPage } from './allproducts.page';

describe('AllproductsPage', () => {
  let component: AllproductsPage;
  let fixture: ComponentFixture<AllproductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllproductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
