import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortMapComponent } from './components/port-map/port-map.component';
import { MaterialModule } from './material/material.module';
import { PortDetailsComponent } from './components/port-details/port-details.component';

@NgModule({
  declarations: [
    PortMapComponent,
    PortDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
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
