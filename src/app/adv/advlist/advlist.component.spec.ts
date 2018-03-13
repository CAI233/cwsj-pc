import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvListComponent } from './advlist.component';

describe('AdvListComponent', () => {
  let component: AdvListComponent;
  let fixture: ComponentFixture<AdvListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
