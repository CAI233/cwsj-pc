import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwToolClassComponent } from './cw-tool-class.component';

describe('CwToolClassComponent', () => {
  let component: CwToolClassComponent;
  let fixture: ComponentFixture<CwToolClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwToolClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwToolClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
