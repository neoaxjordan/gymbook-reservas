import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GymClass } from '../../shared/models/class.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClassesService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(date?: string) {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http.get<GymClass[]>(`${this.API}/api/reservations/class`, { params });
  }

  getById(id: string) {
    return this.http.get<GymClass>(`${this.API}/api/reservations/class/${id}`);
  }
}