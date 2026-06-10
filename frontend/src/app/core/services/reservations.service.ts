import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation, ReservationRequest } from '../../shared/models/reservation.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Reservation[]>(`${this.API}/api/reservations`);
  }

  getMyReservations(userId: string) {
    return this.http.get<Reservation[]>(`${this.API}/api/reservations/user/${userId}`);
  }

  create(body: ReservationRequest) {
    return this.http.post<Reservation>(`${this.API}/api/reservations`, body);
  }

  cancel(reservationId: string) {
    return this.http.patch<Reservation>(
      `${this.API}/api/reservations/${reservationId}/cancel`,
      {}
    );
  }
}