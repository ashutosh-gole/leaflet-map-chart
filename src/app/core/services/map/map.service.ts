import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PORTS } from '../../constants/constants';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  ports = PORTS;  // List of all ports

  constructor(private http: HttpClient) { }

  searchPorts(searchTerm: string) {
    return of(this.ports.filter(port => port.name.toLowerCase().includes(searchTerm.toLowerCase()))).pipe(
      map((filteredPorts) => filteredPorts[0])  // Return the first match
    );
  }

}
