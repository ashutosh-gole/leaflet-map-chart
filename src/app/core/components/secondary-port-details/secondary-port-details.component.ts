import { Component, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-secondary-port-details',
  standalone: false,
  templateUrl: './secondary-port-details.component.html',
  styleUrls: ['./secondary-port-details.component.scss'],
})
export class SecondaryPortDetailsComponent {
  trafficChartInitialized = false;
  vesselChartInitialized = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  onTabChange(event: any): void {
    if (event.index === 1 && !this.trafficChartInitialized) {
      this.initializeTrafficChart();
      this.trafficChartInitialized = true;
    } else if (event.index === 2 && !this.vesselChartInitialized) {
      this.initializeVesselChart();
      this.vesselChartInitialized = true;
    }
  }

  initializeTrafficChart(): void {
    if (this.data.trafficStats) {
      const ctx = document.getElementById('trafficChart') as HTMLCanvasElement;
      new Chart(ctx, {
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
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 14,
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time Period',
                font: {
                  size: 16,
                },
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: 'Traffic Volume (in thousands)',
                font: {
                  size: 16,
                },
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    }
  }

  initializeVesselChart(): void {
    if (this.data.vesselTypes) {
      const ctx = document.getElementById('vesselChart') as HTMLCanvasElement;
      new Chart(ctx, {
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
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 14,
                },
              },
            },
          },
        },
      });
    }
  }

}
