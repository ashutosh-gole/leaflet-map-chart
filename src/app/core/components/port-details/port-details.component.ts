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
      minWidth: '50vw',
      height: '100vh',
      position: { top: '0', right: '0' },
      panelClass: 'secondary-port-details-dialog',
      data: {
        name: this.data.name,
        summary: 'A major port known for its container handling efficiency.',
        media: [
          { type: 'image', url: 'assets/port/port1.jpg', caption: 'Port Image 1' },
          { type: 'image', url: 'assets/port/port2.jpg', caption: 'Port Image 2' },
          { type: 'image', url: 'assets/port/port3.jpg', caption: 'Port Image 3' },
          { type: 'video', url: 'assets/port/video1.mp4', caption: 'Vessel Video 1' },
          { type: 'image', url: 'assets/port/port4.jpg', caption: 'Port Image 4' },
          { type: 'video', url: 'assets/port/video2.mp4', caption: 'Vessel Video 2' },
          { type: 'image', url: 'assets/port/port5.jpg', caption: 'Port Image 5' },
          { type: 'image', url: 'assets/port/port6.jpg', caption: 'Port Image 6' },
          { type: 'video', url: 'assets/port/video3.mp4', caption: 'Vessel Video 3' }
        ],
        weather: {
          icon: 'assets/weather/sunny.png',
          condition: 'Sunny',
          temperature: 30,
          forecast: [
            { date: '21-01-2025', day: 'Today', condition: 'Sunny', min: 13, max: 30 },
            { date: '22-01-2025', day: 'Wed', condition: 'Rainy', min: 12, max: 30 },
            { date: '23-01-2025', day: 'Thu', condition: 'Sunny', min: 15, max: 28 },
            { date: '24-01-2025', day: 'Fri', condition: 'Sunny', min: 14, max: 30 },
            { date: '25-01-2025', day: 'Sat', condition: 'Cloudy', min: 13, max: 27 },
            { date: '26-01-2025', day: 'Sun', condition: 'Rainy', min: 12, max: 25 },
            { date: '27-01-2025', day: 'Mon', condition: 'Sunny', min: 19, max: 30 },
            { date: '28-01-2025', day: 'Tue', condition: 'Rainy', min: 18, max: 29 },
            { date: '29-01-2025', day: 'Wed', condition: 'Cloudy', min: 15, max: 22 },
            { date: '30-01-2025', day: 'Thu', condition: 'Rainy', min: 13, max: 30 },
            { date: '31-01-2025', day: 'Fri', condition: 'Rainy', min: 22, max: 32 },
            { date: '01-02-2025', day: 'Sat', condition: 'Rainy', min: 13, max: 30 },
            { date: '02-02-2025', day: 'Sun', condition: 'Sunny', min: 18, max: 36 },
            { date: '03-02-2025', day: 'Mon', condition: 'Rainy', min: 19, max: 30 },
            { date: '04-02-2025', day: 'Tue', condition: 'Cloudy', min: 18, max: 30 }
          ]
        },
        trafficStats: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
          data: [120, 150, 170, 200, 180, 49, 230, 180, 160, 130, 90, 180]
        },
        vesselTypes: {
          labels: ['Cargo', 'Passenger', 'Fishing', 'Others'],
          data: [60, 20, 10, 10]
        }
      }
    });
  }

}
