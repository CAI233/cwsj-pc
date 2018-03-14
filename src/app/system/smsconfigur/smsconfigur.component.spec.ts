import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsconfigurComponent } from './smsconfigur.component';

describe('SmsconfigurComponent', () => {
  let component: SmsconfigurComponent;
  let fixture: ComponentFixture<SmsconfigurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsconfigurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsconfigurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
