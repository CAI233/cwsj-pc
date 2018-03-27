import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwBookComponent } from './cw-book.component';

describe('CwBookComponent', () => {
  let component: CwBookComponent;
  let fixture: ComponentFixture<CwBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
