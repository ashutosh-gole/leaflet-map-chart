import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PortDetailsComponent } from './components/port-details/port-details.component';
import { PortMapComponent } from './components/port-map/port-map.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    PortMapComponent,
    PortDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CarouselModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PortMapComponent,
    PortDetailsComponent
  ]
})
export class SharedModule { }
