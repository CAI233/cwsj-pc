import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwsjResourceComponent } from './cwsj-resource.component';

describe('CwsjResourceComponent', () => {
  let component: CwsjResourceComponent;
  let fixture: ComponentFixture<CwsjResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwsjResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwsjResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
