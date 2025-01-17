import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  trackByFunction(index: number, item: any): any {
    return item.id || index; // Use a unique identifier or fallback to index
  }

}
