import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwAudioComponent } from './cw-audio.component';

describe('CwAudioComponent', () => {
  let component: CwAudioComponent;
  let fixture: ComponentFixture<CwAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
