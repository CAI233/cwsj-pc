import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwsjCooperateComponent } from './cwsj-cooperate.component';

describe('CwsjCooperateComponent', () => {
  let component: CwsjCooperateComponent;
  let fixture: ComponentFixture<CwsjCooperateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwsjCooperateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwsjCooperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
