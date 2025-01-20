import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SecondaryPortDetailsComponent } from '../secondary-port-details/secondary-port-details.component';

@Component({
  selector: 'app-port-details',
  standalone: false,
  templateUrl: './port-details.component.html',
  styleUrl: './port-details.component.scss'
})
export class PortDetailsComponent {

  carouselOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    nav: false,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    margin: 10,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) { }

  trackByFunction(index: number, item: any): any {
    return item.id || index; // Use a unique identifier or fallback to index
  }

  openSecondaryDialog() {
    this.dialog.open(SecondaryPortDetailsComponent, {
      width: '50vw',
      height: '100vh',
      position: { top: '0', left: '0' },
      panelClass: 'secondary-port-details-dialog',
      data: {
        name: this.data.name,
        summary: 'A major port known for its container handling efficiency.',
        weather: {
          icon: 'assets/weather/sunny.png',
          condition: 'Sunny',
          temperature: 30,
          forecast: [
            { day: 'Today', condition: 'Sunny', min: 13, max: 30 },
            { day: 'Wed', condition: 'Rainy', min: 12, max: 30 },
            { day: 'Thu', condition: 'Sunny', min: 15, max: 28 },
            { day: 'Fri', condition: 'Sunny', min: 14, max: 30 },
            { day: 'Sat', condition: 'Cloudy', min: 13, max: 27 },
            { day: 'Sun', condition: 'Rainy', min: 12, max: 25 },
            { day: 'Mon', condition: 'Sunny', min: 19, max: 30 },
            { day: 'Tue', condition: 'Rainy', min: 18, max: 29 },
            { day: 'Wed', condition: 'Cloudy', min: 15, max: 22 },
            { day: 'Thu', condition: 'Rainy', min: 13, max: 30 },
            { day: 'Fri', condition: 'Rainy', min: 22, max: 32 },
            { day: 'Sat', condition: 'Rainy', min: 13, max: 30 },
            { day: 'Sun', condition: 'Sunny', min: 18, max: 36 },
            { day: 'Mon', condition: 'Rainy', min: 19, max: 30 },
            { day: 'Tue', condition: 'Cloudy', min: 18, max: 30 }
          ]
        },
        trafficStats: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          data: [120, 150, 170, 200, 180]
        },
        vesselTypes: {
          labels: ['Cargo', 'Passenger', 'Fishing', 'Others'],
          data: [60, 20, 10, 10]
        }
      }
    });
  }

}
