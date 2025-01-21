import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-weather-details',
  standalone: false,
  templateUrl: './weather-details.component.html',
  styleUrl: './weather-details.component.scss'
})
export class WeatherDetailsComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
