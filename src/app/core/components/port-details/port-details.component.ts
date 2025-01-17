import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-port-details',
  standalone: false,
  templateUrl: './port-details.component.html',
  styleUrl: './port-details.component.scss'
})
export class PortDetailsComponent {
  portDetails: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Example of available data properties
    this.portDetails = {
      name: this.data.name,
      images: this.data.images || [], // Array of image URLs
      description: this.data.description || 'No description available',
      type: this.data.type || 'Unknown',
      capacity: this.data.capacity || 'N/A',
      location: { lat: this.data.lat, lng: this.data.lng },
      additionalDetails: this.data.additionalDetails || [],
    };
  }

}
