import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvClassComponent } from './advclass.component';

describe('AdvClassComponent', () => {
  let component: AdvClassComponent;
  let fixture: ComponentFixture<AdvClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
