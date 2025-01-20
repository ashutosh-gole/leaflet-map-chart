import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryPortDetailsComponent } from './secondary-port-details.component';

describe('SecondaryPortDetailsComponent', () => {
  let component: SecondaryPortDetailsComponent;
  let fixture: ComponentFixture<SecondaryPortDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondaryPortDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryPortDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
