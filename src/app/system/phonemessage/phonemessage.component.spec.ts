import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { phonemessageComponent } from './phonemessage.component';

describe('phoneMessageComponent', () => {
  let component: phonemessageComponent;
  let fixture: ComponentFixture<phonemessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ phonemessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(phonemessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
