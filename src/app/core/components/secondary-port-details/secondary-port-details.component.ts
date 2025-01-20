import { Component, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-secondary-port-details',
  standalone: false,
  templateUrl: './secondary-port-details.component.html',
  styleUrls: ['./secondary-port-details.component.scss'],
})
export class SecondaryPortDetailsComponent implements AfterViewInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
    this.initializeTrafficChart();
    this.initializeVesselChart();
  }

  initializeTrafficChart(): void {
    if (this.data.trafficStats) {
      new Chart('trafficChart', {
        type: 'bar',
        data: {
          labels: this.data.trafficStats.labels,
          datasets: [
            {
              label: 'Traffic Volume',
              data: this.data.trafficStats.data,
              backgroundColor: '#007bff',
            },
          ],
        },
      });
    }
  }

  initializeVesselChart(): void {
    if (this.data.vesselTypes) {
      new Chart('vesselChart', {
        type: 'pie',
        data: {
          labels: this.data.vesselTypes.labels,
          datasets: [
            {
              data: this.data.vesselTypes.data,
              backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107'],
            },
          ],
        },
      });
    }
  }

}
