import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GymClass } from '../../shared/models/class.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private eventSource: EventSource | null = null;
  updatedClass$ = new Subject<GymClass>();

  connect() {
    if (this.eventSource) return;
    this.eventSource = new EventSource(`${environment.apiUrl}/api/reservations/classes/events`);

    this.eventSource.onmessage = (event) => {
      const data: GymClass = JSON.parse(event.data);
      this.updatedClass$.next(data);
    };

    this.eventSource.onerror = () => {
      this.disconnect();
    };
  }

  disconnect() {
    this.eventSource?.close();
    this.eventSource = null;
  }
}