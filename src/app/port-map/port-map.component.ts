import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-port-map',
  standalone: false,
  templateUrl: './port-map.component.html',
  styleUrls: ['./port-map.component.scss']
})
export class PortMapComponent implements OnInit, AfterViewInit {
  private map: L.Map | undefined;
  private geoJsonLayer: L.GeoJSON | undefined;

  ports = [
    // China
    { name: 'Port of Shanghai', lat: 31.2304, lng: 121.4737 },
    { name: 'Port of Shenzhen', lat: 22.5431, lng: 114.1074 },
    { name: 'Port of Ningbo-Zhoushan', lat: 29.8683, lng: 121.5440 },
    { name: 'Port of Guangzhou', lat: 23.1291, lng: 113.2644 },
    { name: 'Port of Qingdao', lat: 36.0671, lng: 120.3826 },
    { name: 'Port of Tianjin', lat: 39.0097, lng: 117.7190 },
    { name: 'Port of Xiamen', lat: 24.4798, lng: 118.0819 },
    { name: 'Port of Dalian', lat: 38.9140, lng: 121.6147 },
    { name: 'Port of Yantai', lat: 37.5547, lng: 121.3676 },
    { name: 'Port of Lianyungang', lat: 34.7197, lng: 119.4427 },

    // USA
    { name: 'Port of Los Angeles', lat: 33.7288, lng: -118.2620 },
    { name: 'Port of New York/New Jersey', lat: 40.6924, lng: -74.0445 },
    { name: 'Port of Long Beach', lat: 33.7544, lng: -118.2161 },
    { name: 'Port of Houston', lat: 29.7604, lng: -95.2573 },
    { name: 'Port of Seattle', lat: 47.6062, lng: -122.3321 },
    { name: 'Port of Miami', lat: 25.7742, lng: -80.1694 },
    { name: 'Port of Oakland', lat: 37.8044, lng: -122.2711 },
    { name: 'Port of Charleston', lat: 32.7825, lng: -79.9236 },
    { name: 'Port of Virginia', lat: 36.8529, lng: -76.2896 },
    { name: 'Port of Savannah', lat: 32.0835, lng: -81.0998 },

    // India
    { name: 'Jawaharlal Nehru Port', lat: 18.9490, lng: 72.9525 },
    { name: 'Mumbai Port', lat: 18.9220, lng: 72.8347 },
    { name: 'Chennai Port', lat: 13.1000, lng: 80.2944 },
    { name: 'Visakhapatnam Port', lat: 17.6868, lng: 83.2185 },
    { name: 'Paradip Port', lat: 20.2630, lng: 86.6706 },
    { name: 'Kandla Port', lat: 23.0343, lng: 70.2196 },
    { name: 'Kolkata Port', lat: 22.5414, lng: 88.3005 },
    { name: 'Cochin Port', lat: 9.9312, lng: 76.2673 },
    { name: 'Tuticorin Port', lat: 8.7642, lng: 78.1348 },
    { name: 'Mormugao Port', lat: 15.4025, lng: 73.8048 },

    // Russia
    { name: 'Port of Novorossiysk', lat: 44.7239, lng: 37.7683 },
    { name: 'Port of St. Petersburg', lat: 59.9343, lng: 30.3351 },
    { name: 'Port of Vladivostok', lat: 43.1065, lng: 131.8735 },
    { name: 'Port of Primorsk', lat: 60.3660, lng: 28.6135 },
    { name: 'Port of Ust-Luga', lat: 59.6495, lng: 28.2697 },
    { name: 'Port of Murmansk', lat: 68.9585, lng: 33.0827 },
    { name: 'Port of Kaliningrad', lat: 54.7065, lng: 20.5106 },
    { name: 'Port of Nakhodka', lat: 42.8169, lng: 132.8845 },
    { name: 'Port of Vostochny', lat: 42.7441, lng: 133.0736 },
    { name: 'Port of Vanino', lat: 49.0879, lng: 140.2553 },

    // Japan
    { name: 'Port of Nagoya', lat: 35.0901, lng: 136.8806 },
    { name: 'Port of Yokohama', lat: 35.4437, lng: 139.6380 },
    { name: 'Port of Tokyo', lat: 35.6895, lng: 139.6917 },
    { name: 'Port of Kobe', lat: 34.6882, lng: 135.1961 },
    { name: 'Port of Osaka', lat: 34.6937, lng: 135.5023 },
    { name: 'Port of Chiba', lat: 35.6074, lng: 140.1065 },
    { name: 'Port of Kitakyushu', lat: 33.8834, lng: 130.8750 },
    { name: 'Port of Hakata', lat: 33.6067, lng: 130.4113 },
    { name: 'Port of Shimonoseki', lat: 33.9497, lng: 130.9450 },
    { name: 'Port of Niigata', lat: 37.9161, lng: 139.0364 },

    // France
    { name: 'Port of Marseille', lat: 43.2965, lng: 5.3698 },
    { name: 'Port of Le Havre', lat: 49.4944, lng: 0.1079 },
    { name: 'Port of Dunkirk', lat: 51.0343, lng: 2.3773 },
    { name: 'Port of Calais', lat: 50.9513, lng: 1.8587 },
    { name: 'Port of Saint-Nazaire', lat: 47.2734, lng: -2.2135 },
    { name: 'Port of La Rochelle', lat: 46.1591, lng: -1.1520 },
    { name: 'Port of Bordeaux', lat: 44.8378, lng: -0.5792 },
    { name: 'Port of Nantes', lat: 47.2184, lng: -1.5536 },
    { name: 'Port of Rouen', lat: 49.4431, lng: 1.0993 },
    { name: 'Port of Brest', lat: 48.3904, lng: -4.4861 },

    // UK
    { name: 'Port of Felixstowe', lat: 51.9619, lng: 1.3510 },
    { name: 'Port of Southampton', lat: 50.9098, lng: -1.4037 },
    { name: 'Port of London', lat: 51.5074, lng: 0.0235 },
    { name: 'Port of Liverpool', lat: 53.4084, lng: -2.9916 },
    { name: 'Port of Dover', lat: 51.1279, lng: 1.3134 },
    { name: 'Port of Immingham', lat: 53.6316, lng: -0.2191 },
    { name: 'Port of Belfast', lat: 54.6073, lng: -5.9267 },
    { name: 'Port of Glasgow', lat: 55.8652, lng: -4.2576 },
    { name: 'Port of Bristol', lat: 51.4545, lng: -2.5879 },
    { name: 'Port of Aberdeen', lat: 57.1437, lng: -2.0938 },

    // Major African Ports
    { name: 'Port of Durban', lat: -29.8587, lng: 31.0218 }, // South Africa
    { name: 'Port of Lagos', lat: 6.4531, lng: 3.3958 }, // Nigeria
    { name: 'Port Said', lat: 31.2656, lng: 32.3019 }, // Egypt
    { name: 'Port of Alexandria', lat: 31.2001, lng: 29.9187 }, // Egypt
    { name: 'Port of Tangier Med', lat: 35.8969, lng: -5.5051 }, // Morocco
    { name: 'Port of Mombasa', lat: -4.0435, lng: 39.6682 }, // Kenya
    { name: 'Port of Djibouti', lat: 11.5988, lng: 43.1473 }, // Djibouti
    { name: 'Port of Dar es Salaam', lat: -6.8235, lng: 39.2695 }, // Tanzania
    { name: 'Port of Abidjan', lat: 5.3151, lng: -4.0167 }, // Ivory Coast
    { name: 'Port of Cape Town', lat: -33.9062, lng: 18.4355 }, // South Africa

    { name: 'Port of Veracruz', lat: 19.2026, lng: -96.1345 }, // Mexico
    { name: 'Port of Manzanillo', lat: 19.0544, lng: -104.3236 }, // Mexico

    { name: 'Port of Vancouver', lat: 49.2827, lng: -123.1216 }, // Canada
    { name: 'Port of Halifax', lat: 44.6468, lng: -63.5701 }, // Canada

    { name: 'Gwadar Port', lat: 25.1266, lng: 62.3254 }, // Pakistan

    { name: 'Port of Alexandria', lat: 31.2156, lng: 29.9553 }, // Egypt
    { name: 'Port of Said', lat: 31.2653, lng: 32.3019 }, // Egypt

    { name: 'Port of Santos', lat: -23.9659, lng: -46.3285 }, // Brazil
    { name: 'Port of Rio de Janeiro', lat: -22.8959, lng: -43.1818 }, // Brazil
    { name: 'Port of Paranaguá', lat: -25.5161, lng: -48.5042 }, // Brazil
  ];

  private defaultIcon = L.icon({
    iconUrl: 'assets/leaflet/images/marker-icon.png',
    iconSize: [18, 18],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [18, 18]
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
      zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map!);
  }

  private loadGeoJson(): void {
    const geoJsonData = 'assets/geojson/countries.geo.json'; // Replace with your GeoJSON file path

    fetch(geoJsonData)
      .then((response) => response.json())
      .then((data) => {
        // Count ports per country
        const portCounts: { [key: string]: number } = {};
        this.ports.forEach((port) => {
          data.features.forEach((feature: any) => {
            const bounds = L.geoJSON(feature).getBounds();
            if (bounds.contains([port.lat, port.lng])) {
              const countryName = feature.properties.name;
              portCounts[countryName] = (portCounts[countryName] || 0) + 1;
            }
          });
        });

        // Define a color scale (10 shades of red)
        const getColor = (count: number) => {
          return count > 50
            ? '#800026' // Very dark red
            : count > 40
              ? '#BD0026'
              : count > 30
                ? '#E31A1C'
                : count > 20
                  ? '#FC4E2A'
                  : count > 15
                    ? '#FD8D3C'
                    : count > 10
                      ? '#FEB24C'
                      : count > 5
                        ? '#FED976'
                        : count > 3
                          ? '#FFEDA0'
                          : count > 0
                            ? '#FFF5EB'
                            : '#FFFFFF'; // White for no ports
        };

        this.geoJsonLayer = L.geoJSON(data, {
          style: (feature) => {
            const countryName = feature?.properties.name;
            const portCount = portCounts[countryName] || 0;
            return {
              fillColor: getColor(portCount),
              weight: 1,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => this.onAreaClick(feature, layer));
          }
        }).addTo(this.map!);
      });
  }

  private addPortMarkers(ports: any[]): void {
    ports.forEach((port) => {
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
    this.geoJsonLayer.resetStyle();

    // Highlight the clicked region border only
    const polygonLayer = layer as L.Path;
    polygonLayer.setStyle({
      weight: 3,
      opacity: 1,
      color: 'black',
      fillOpacity: 0 // Make fill transparent
    });

    // Count ports in the clicked area
    const bounds = (layer as L.Polygon).getBounds();
    const portCount = this.ports.filter((port) =>
      bounds.contains([port.lat, port.lng])
    ).length;

    // Display a popup with the port count
    const popup = L.popup()
      .setLatLng(bounds.getCenter())
      .setContent(`<b>${feature.properties.name}</b><br>Port Count: ${portCount}`)
      .openOn(this.map);
  }

}
