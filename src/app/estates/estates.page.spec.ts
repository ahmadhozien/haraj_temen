import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatesPage } from './estates.page';

describe('EstatesPage', () => {
  let component: EstatesPage;
  let fixture: ComponentFixture<EstatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
