import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwsjVideoComponent } from './cwsj-video.component';

describe('CwsjVideoComponent', () => {
  let component: CwsjVideoComponent;
  let fixture: ComponentFixture<CwsjVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwsjVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwsjVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
