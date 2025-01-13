import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-port-map',
  standalone: false,
  templateUrl: './port-map.component.html',
  styleUrl: './port-map.component.scss'
})
export class PortMapComponent implements OnInit, AfterViewInit {
  private map: L.Map | undefined;
  private geoJsonLayer: L.GeoJSON | undefined;

  private ports = [
    { name: 'Port 1', lat: 20.5937, lng: 78.9629 },
    { name: 'Port 2', lat: 35.6895, lng: 139.6917 },
    { name: 'Port 3', lat: 37.7749, lng: -122.4194 },
    { name: 'Port 4', lat: -33.8688, lng: 151.2093 }
  ];

  private defaultIcon = L.icon({
    iconUrl: 'assets/leaflet/images/marker-icon.png',
    // shadowUrl: 'assets/leaflet/images/marker-shadow-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadGeoJson();
    this.addPortMarkers(this.ports);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [20, 0],
      zoom: 2
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map!);
  }

  private loadGeoJson(): void {
    const geoJsonData = 'assets/geojson/countries.geo.json'; // Replace with your GeoJSON file path

    fetch(geoJsonData)
      .then(response => response.json())
      .then(data => {
        this.geoJsonLayer = L.geoJSON(data, {
          style: {
            fillColor: 'blue',
            weight: 2,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.5
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => this.onAreaClick(feature, layer));
          }
        }).addTo(this.map!);
      });
  }

  private addPortMarkers(ports: any[]): void {
    ports.forEach(port => {
      const marker = L.marker([port.lat, port.lng], { icon: this.defaultIcon }).bindPopup(`
        <b>${port.name}</b><br>
        Location: [${port.lat.toFixed(2)}, ${port.lng.toFixed(2)}]
      `);
      marker.addTo(this.map!);
    });
  }

  private onAreaClick(feature: any, layer: L.Layer): void {
    if (!this.map || !this.geoJsonLayer) return;

    // Reset styles for all regions
    this.geoJsonLayer.setStyle(() => ({
      fillColor: 'blue',
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.5
    }));

    // Highlight the clicked region (cast layer to L.Path)
    const polygonLayer = layer as L.Path;
    polygonLayer.setStyle({
      fillColor: 'red',
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.8
    });

    // Count ports in the clicked area
    const bounds = (layer as L.Polygon).getBounds();
    const portCount = this.ports.filter(port =>
      bounds.contains([port.lat, port.lng])
    ).length;

    // Display a popup with the port count
    const popup = L.popup()
      .setLatLng(bounds.getCenter())
      .setContent(`<b>${feature.properties.name}</b><br>Port Count: ${portCount}`)
      .openOn(this.map);
  }

}
