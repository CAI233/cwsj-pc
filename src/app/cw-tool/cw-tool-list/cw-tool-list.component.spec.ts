import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwToolListComponent } from './cw-tool-list.component';

describe('CwToolListComponent', () => {
  let component: CwToolListComponent;
  let fixture: ComponentFixture<CwToolListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwToolListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwToolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
