import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PortDetailsComponent } from './components/port-details/port-details.component';
import { PortMapComponent } from './components/port-map/port-map.component';
import { MaterialModule } from './material/material.module';
import { SecondaryPortDetailsComponent } from './components/secondary-port-details/secondary-port-details.component';
import { WeatherDetailsComponent } from './components/weather-details/weather-details.component';

@NgModule({
  declarations: [
    PortMapComponent,
    PortDetailsComponent,
    SecondaryPortDetailsComponent,
    WeatherDetailsComponent
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
    PortDetailsComponent,
    SecondaryPortDetailsComponent,
    WeatherDetailsComponent
  ]
})
export class SharedModule { }
