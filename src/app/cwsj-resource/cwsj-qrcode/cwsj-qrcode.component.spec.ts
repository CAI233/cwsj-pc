import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwsjQrcodeComponent } from './cwsj-qrcode.component';

describe('CwsjQrcodeComponent', () => {
  let component: CwsjQrcodeComponent;
  let fixture: ComponentFixture<CwsjQrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwsjQrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwsjQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
