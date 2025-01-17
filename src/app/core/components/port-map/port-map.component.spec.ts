import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortMapComponent } from './port-map.component';

describe('PortMapComponent', () => {
  let component: PortMapComponent;
  let fixture: ComponentFixture<PortMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
