import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwPayComponent } from './cw-pay.component';

describe('CwPayComponent', () => {
  let component: CwPayComponent;
  let fixture: ComponentFixture<CwPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
