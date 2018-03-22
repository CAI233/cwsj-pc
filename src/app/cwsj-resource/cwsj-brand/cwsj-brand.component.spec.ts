import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwsjBrandComponent } from './cwsj-brand.component';

describe('CwsjBrandComponent', () => {
  let component: CwsjBrandComponent;
  let fixture: ComponentFixture<CwsjBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwsjBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwsjBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
