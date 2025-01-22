import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PORTS } from '../../constants/constants';
import { MapService } from '../../services/map/map.service';
import { PortDetailsComponent } from '../port-details/port-details.component';
import { WeatherDetailsComponent } from '../weather-details/weather-details.component';

@Component({
  selector: 'app-port-map',
  standalone: false,
  templateUrl: './port-map.component.html',
  styleUrls: ['./port-map.component.scss']
})
export class PortMapComponent implements OnInit, AfterViewInit {
  private map: L.Map | undefined;
  private geoJsonLayer: L.GeoJSON | undefined;
  private legend: L.Control | undefined;
  private markers: { [key: string]: L.Marker } = {};
  public searchQuery: string = '';
  ports = PORTS;
  searchSubject: Subject<string> = new Subject();
  selectedPort: any;
  private savedView: { center: L.LatLng, zoom: number, layers: string[] } | null = null;
  private weatherLayer: L.TileLayer | null = null;
  selectedWeatherType: string = 'wind'; // Default weather layer

  private defaultIcon = L.icon({
    iconUrl: 'assets/leaflet/images/marker-icon.png',
    iconSize: [18, 18],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [18, 18]
  });

  // Define a custom icon for route points
  private routeIcon = L.icon({
    iconUrl: 'assets/icons/pin.png', // Path to the custom icon image
    iconSize: [25, 41], // Adjust size as needed
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Position of the popup relative to the icon
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  })

  constructor(
    private mapService: MapService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadGeoJson();
    this.addPortMarkers(this.ports);
    this.addLegend(); // Add legend here
    this.drawRoute(); // Draw the route
    this.drawAdditionalRoute(); // Draw the new route
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
            : count > 18
              ? '#BD0026'
              : count > 15
                ? '#E31A1C'
                : count > 10
                  ? '#FC4E2A'
                  : count > 8
                    ? '#FD8D3C'
                    : count > 5
                      ? '#FEB24C'
                      : count > 3
                        ? '#FED976'
                        : count > 1
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
      const marker = L.marker([port.lat, port.lng], { icon: this.defaultIcon });

      marker.on('click', () => {
        this.dialog.open(PortDetailsComponent, {
          width: '30vw',
          minWidth: '30vw',
          height: '100vh',
          position: { top: '0', right: '0' },
          panelClass: 'port-details-dialog',
          data: port,
        });
      });

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

  private addLegend(): void {
    if (!this.map) return;

    // Create a custom control class
    class LegendControl extends L.Control {
      private div: HTMLElement | undefined;

      constructor() {
        super({ position: 'bottomright' });
      }

      override onAdd(map: L.Map): HTMLElement {
        this.div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 1, 3, 5, 8, 10, 15, 18, 50];
        const labels = [];

        if (this.div) {
          this.div.style.backgroundColor = 'white';
          this.div.style.padding = '6px 8px';
          this.div.style.border = '1px solid rgba(0,0,0,0.2)';
          this.div.style.borderRadius = '4px';
          this.div.style.lineHeight = '18px';
          this.div.style.color = '#555';

          // Add legend title
          labels.push('<strong>Ports per Country</strong><br>');

          // Loop through our density intervals and generate a label with a colored square for each interval
          for (let i = 0; i < grades.length; i++) {
            const from = grades[i];
            const to = grades[i + 1];

            labels.push(
              '<i style="background:' + this.getColor(from + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7"></i> ' +
              from + (to ? '&ndash;' + to : '+')
            );
          }

          this.div.innerHTML = labels.join('<br>');
        }

        return this.div!;
      }

      override onRemove(map: L.Map): void {
        // Cleanup code here
      }

      private getColor(count: number): string {
        return count > 50 ? '#800026'
          : count > 18 ? '#BD0026'
            : count > 15 ? '#E31A1C'
              : count > 10 ? '#FC4E2A'
                : count > 8 ? '#FD8D3C'
                  : count > 5 ? '#FEB24C'
                    : count > 3 ? '#FED976'
                      : count > 1 ? '#FFEDA0'
                        : count > 0 ? '#FFF5EB'
                          : '#FFFFFF';
      }
    }

    // Create and add the legend control
    this.legend = new LegendControl();
    this.legend.addTo(this.map);
  }

  // Draw the route with custom icons for route points
  private drawRoute(): void {
    // Define the route coordinates
    const routeCoordinates = [
      { name: 'Jawaharlal Nehru Port', lat: 18.9490, lng: 72.9525 },
      { name: 'Pune', lat: 18.5204, lng: 73.8567 },
      { name: 'Sambhaji Nagar', lat: 19.8762, lng: 75.3433 },
      { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    ];

    // Create the polyline (route)
    const route = L.polyline(routeCoordinates.map((point) => [point.lat, point.lng]), {
      color: 'blue', // Route color
      weight: 3, // Line thickness
      opacity: 0.9, // Line opacity
    }).addTo(this.map!);

    // Bind a popup to the polyline
    route.bindPopup(`<b>Route Details:</b><br>Source: ${routeCoordinates[0].name}<br>Destination: ${routeCoordinates[routeCoordinates.length - 1].name}`);

    // Add markers for each point with the custom icon
    routeCoordinates.forEach((point) => {
      L.marker([point.lat, point.lng], { icon: this.routeIcon })
        // .bindPopup(`<b>${point.name}</b><br>Location: [${point.lat.toFixed(2)}, ${point.lng.toFixed(2)}]`)
        .addTo(this.map!)
        .on('click', () => this.fetchWeatherForRoute(routeCoordinates))
    });

    // Adjust map bounds to fit the route
    this.map!.fitBounds(route.getBounds());
  }

  private drawAdditionalRoute(): void {
    // Define the additional route coordinates
    const additionalRouteCoordinates = [
      { name: 'Visakhapatnam Port', lat: 17.7041, lng: 83.2977 },
      { name: 'Jamshedpur', lat: 22.8056, lng: 86.2029 },
      { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
      { name: 'Jhansi', lat: 25.4486, lng: 78.5685 },
      { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
    ];

    // Create the polyline (route) for the new line
    const additionalRoute = L.polyline(
      additionalRouteCoordinates.map((point) => [point.lat, point.lng]),
      {
        color: 'orange', // New line color
        weight: 3, // Line thickness
        opacity: 0.9, // Line opacity
      }
    ).addTo(this.map!);

    // Bind a popup to the polyline
    additionalRoute.bindPopup(`<b>Route Details:</b><br>Source: ${additionalRouteCoordinates[0].name}<br>Destination: ${additionalRouteCoordinates[additionalRouteCoordinates.length - 1].name}`);

    additionalRoute.on('click', () => this.fetchWeatherForRoute(additionalRouteCoordinates));

    // Add markers for each point with the custom icon
    additionalRouteCoordinates.forEach((point) => {
      L.marker([point.lat, point.lng], { icon: this.routeIcon })
        // .bindPopup(`<b>${point.name}</b><br>Location: [${point.lat.toFixed(2)}, ${point.lng.toFixed(2)}]`)
        .addTo(this.map!)
        .on('click', () => this.fetchWeatherForRoute(additionalRouteCoordinates))
        ;
    });

    // Adjust map bounds to fit both routes
    this.map!.fitBounds(additionalRoute.getBounds());
  }

  setupSearch() {
    // Search debounce setup
    this.searchSubject.pipe(
      debounceTime(2000),  // 2000ms after typing stops
      switchMap((searchTerm) => this.mapService.searchPorts(searchTerm))  // Call service to search ports
    ).subscribe((port) => {
      if (port) {
        this.focusOnPort(port);  // Focus map on port
      }
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.searchSubject.next(searchTerm);  // Trigger search when typing
  }

  focusOnPort(port: any) {
    // Ensure port is found and handle zooming animation
    const lat = port.lat;
    const lon = port.lng;
    const zoomLevel = 12;  // Adjust zoom level as necessary

    if (this.map) {
      this.map.flyTo([lat, lon], zoomLevel, { animate: true, duration: 5 });  // Smooth zoom to port
      this.selectedPort = port;

      // Ensure popup is open (handle undefined port)
      if (port && port.popup) {
        port.popup.openOn(this.map);  // Open the port's popup
      }
    }
  }

  saveBookmark(): void {
    const center = this.map?.getCenter();
    const zoom = this.map?.getZoom();
    const layers: any[] = [];
    this.map?.eachLayer((layer: any) => {
      if (layer.options && layer.options.id) {
        layers.push(layer.options.id);
      }
    });

    const bookmark = { center, zoom, layers };
    localStorage.setItem('savedView', JSON.stringify(bookmark));
  }

  loadBookmark(): void {
    const savedView = localStorage.getItem('savedView');
    if (!savedView) {
      alert('No saved view to load.');
      return;
    }

    const { center, zoom, layers } = JSON.parse(savedView);

    // Smooth animation to the saved center and zoom level
    this.map?.flyTo(center, zoom, {
      animate: true,
      duration: 5, // Animation duration in seconds (adjust as needed)
      easeLinearity: 0.25, // Controls the ease of the zoom animation
    });

    this.map?.eachLayer((layer: any) => {
      if (layer.options && layer.options.id) {
        this.map?.removeLayer(layer);
      }
    });

    layers.forEach((layerId: any) => {
      const layer = this.getLayerById(layerId); // Implement this method if needed
      if (layer) {
        this.map?.addLayer(layer);
      }
    });
  }

  private getLayerById(id: string): L.Layer | null {
    // Replace this with your layer management logic
    // For example, you might have a layers registry
    return null;
  }

  toggleWeatherLayer(): void {
    if (this.weatherLayer) {
      this.map?.removeLayer(this.weatherLayer);
      this.weatherLayer = null;
    } else {
      this.addWeatherLayer(this.selectedWeatherType);
    }
  }

  onWeatherLayerChange(event: any): void {
    if (this.weatherLayer) {
      this.map?.removeLayer(this.weatherLayer);
    }
    this.addWeatherLayer(event.value);
  }

  private addWeatherLayer(type: string): void {
    const layerUrls: { [key: string]: string } = {
      wind: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${environment.WEATHER_API}`,
      rain: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${environment.WEATHER_API}`,
      storm: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${environment.WEATHER_API}`,
      clouds: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${environment.WEATHER_API}`,
      temperature: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${environment.WEATHER_API}`,
      pressure: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${environment.WEATHER_API}`
    };

    const layerUrl = layerUrls[type];
    this.weatherLayer = L.tileLayer(layerUrl, {
      attribution: '© OpenWeatherMap',
      opacity: 1
    }).addTo(this.map!);
  }

  private fetchWeatherForRoute(routeCoordinates: any[]): void {
    const weatherData: any[] = [];

    const fetchWeatherData = (lat: number, lon: number) => {
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${environment.WEATHER_API}`;

      return fetch(weatherApiUrl)
        .then((response) => response.json())
        .then((data) => ({
          temperature: data.main.temp,
          windSpeed: data.wind.speed,
          rain: data.rain ? data.rain['1h'] : '0',
        }))
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          return null;
        });
    };

    Promise.all(routeCoordinates.map((point) => fetchWeatherData(point.lat, point.lng)))
      .then((results) => {
        results.forEach((data, index) => {
          if (data) {
            weatherData.push({
              name: routeCoordinates[index].name,
              ...data,
            });
          }
        });

        if (weatherData.length > 0) {
          this.openWeatherDialog(weatherData);
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data for route:', error);
      });
  }

  private openWeatherDialog(weatherData: any): void {
    this.dialog.open(WeatherDetailsComponent, {
      width: '400px',
      data: weatherData,
    });
  }

  // Optional: Clean up legend when component is destroyed
  ngOnDestroy(): void {
    if (this.map && this.legend) {
      this.legend.remove();
    }
  }

}
