import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwResQuesComponent } from './cw-res-ques.component';

describe('CwResQuesComponent', () => {
  let component: CwResQuesComponent;
  let fixture: ComponentFixture<CwResQuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwResQuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwResQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
