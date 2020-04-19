import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripecheckoutComponent } from './stripecheckout.component';

describe('StripecheckoutComponent', () => {
  let component: StripecheckoutComponent;
  let fixture: ComponentFixture<StripecheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripecheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripecheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
