import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonemessageComponent } from './phonemessage.component';

describe('PhonemessageComponent', () => {
  let component: PhonemessageComponent;
  let fixture: ComponentFixture<PhonemessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhonemessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonemessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
