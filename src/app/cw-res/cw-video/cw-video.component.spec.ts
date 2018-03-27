import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwVideoComponent } from './cw-video.component';

describe('CwVideoComponent', () => {
  let component: CwVideoComponent;
  let fixture: ComponentFixture<CwVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
