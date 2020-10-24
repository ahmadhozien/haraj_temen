import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowproductPage } from './showproduct.page';

describe('ShowproductPage', () => {
  let component: ShowproductPage;
  let fixture: ComponentFixture<ShowproductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowproductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
