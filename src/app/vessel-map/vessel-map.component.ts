import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vessel-map',
  standalone: false,
  templateUrl: './vessel-map.component.html',
  styleUrl: './vessel-map.component.scss'
})
export class VesselMapComponent implements OnInit, AfterViewInit {
  private map: L.Map | undefined;

  private vessels = [
    { name: 'Vessel 1', lat: 20.5937, lng: 78.9629, speed: 15 },
    { name: 'Vessel 2', lat: 35.6895, lng: 139.6917, speed: 18 },
    { name: 'Vessel 3', lat: 37.7749, lng: -122.4194, speed: 12 },
    { name: 'Vessel 4', lat: -33.8688, lng: 151.2093, speed: 10 }
  ];

  private defaultIcon = L.icon({
    iconUrl: 'assets/icons/vessel-icon.png',
    iconSize: [12, 12],
    iconAnchor: [16, 32],
  });

  ngOnInit(): void {
    this.updateVesselPositions();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [20, 0], // Center of the map
      zoom: 2
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private updateVesselPositions(): void {
    setInterval(() => {
      this.vessels.forEach(vessel => {
        vessel.lat += (Math.random() - 0.5) * 0.1;
        vessel.lng += (Math.random() - 0.5) * 0.1;
      });

      this.addVesselMarkers(this.vessels);
    }, 5000);
  }

  private addVesselMarkers(vessels: any[]): void {
    if (this.map) this.map.eachLayer(layer => { if (layer instanceof L.Marker) layer.remove(); });

    vessels.forEach(vessel => {
      const marker = L.marker([vessel.lat, vessel.lng], { icon: this.defaultIcon }).bindPopup(`
        <b>${vessel.name}</b><br>
        Speed: ${vessel.speed} knots<br>
        Location: [${vessel.lat.toFixed(2)}, ${vessel.lng.toFixed(2)}]
      `);
      marker.addTo(this.map!);
    });
  }

}
