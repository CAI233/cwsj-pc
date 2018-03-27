import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwEmailComponent } from './cw-email.component';

describe('CwEmailComponent', () => {
  let component: CwEmailComponent;
  let fixture: ComponentFixture<CwEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
