import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwAdvComponent } from './cw-adv.component';

describe('CwAdvComponent', () => {
  let component: CwAdvComponent;
  let fixture: ComponentFixture<CwAdvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwAdvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwAdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
