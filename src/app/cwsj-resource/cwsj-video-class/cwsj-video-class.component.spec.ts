import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwsjVideoClassComponent } from './cwsj-video-class.component';

describe('CwsjVideoClassComponent', () => {
  let component: CwsjVideoClassComponent;
  let fixture: ComponentFixture<CwsjVideoClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwsjVideoClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwsjVideoClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
