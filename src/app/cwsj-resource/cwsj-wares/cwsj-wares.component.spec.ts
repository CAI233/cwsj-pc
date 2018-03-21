import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwsjWaresComponent } from './cwsj-wares.component';

describe('CwsjWaresComponent', () => {
  let component: CwsjWaresComponent;
  let fixture: ComponentFixture<CwsjWaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwsjWaresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwsjWaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
