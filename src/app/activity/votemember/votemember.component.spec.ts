import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotememberComponent } from './votemember.component';

describe('VotememberComponent', () => {
  let component: VotememberComponent;
  let fixture: ComponentFixture<VotememberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotememberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotememberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
