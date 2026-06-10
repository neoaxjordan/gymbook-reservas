import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../core/services/reservations.service';
import { AuthService } from '../../core/services/auth.service';
import { Reservation } from '../../shared/models/reservation.model';
import { DatePipe } from '@angular/common';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, SkeletonModule, MessageModule, ToastModule, DatePipe],
  providers: [MessageService],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.scss'
})
export class MyReservationsComponent implements OnInit {
  private reservationsService = inject(ReservationsService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  reservations: Reservation[] = [];
  loading = true;
  cancelingId: string | null = null;

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loading = true;
    this.reservationsService.getMyReservations(userId).subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('mis clases:', data);
      },
      error: () => { this.loading = false; }
    });
  }

  cancel(reservation: Reservation) {
    this.cancelingId = reservation.id;

    this.reservationsService.cancel(reservation.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Cancelada', detail: `Reserva de ${reservation.classId.name} cancelada.` });
        this.loadReservations();
        this.cancelingId = null;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo cancelar.' });
        this.cancelingId = null;
      }
    });
  }

  isConfirmed(r: Reservation): boolean {
    return r.status === 'confirmed';
  }
}