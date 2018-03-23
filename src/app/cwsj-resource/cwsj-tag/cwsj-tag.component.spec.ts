import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwsjTagComponent } from './cwsj-tag.component';

describe('CwsjTagComponent', () => {
  let component: CwsjTagComponent;
  let fixture: ComponentFixture<CwsjTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwsjTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwsjTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
