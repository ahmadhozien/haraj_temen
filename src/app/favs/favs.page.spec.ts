import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavsPage } from './favs.page';

describe('FavsPage', () => {
  let component: FavsPage;
  let fixture: ComponentFixture<FavsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
