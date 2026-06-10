import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassesService } from '../../../core/services/classes.service';
import { ReservationsService } from '../../../core/services/reservations.service';
import { RealtimeService } from '../../../core/services/realtime.service';
import { AuthService } from '../../../core/services/auth.service';
import { GymClass } from '../../../shared/models/class.model';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, BadgeModule, TagModule, SkeletonModule, MessageModule, ToastModule],
  providers: [MessageService],
  templateUrl: './class-list.html',
  styleUrl: './class-list.scss'
})
export class ClassListComponent implements OnInit, OnDestroy {
  private classesService = inject(ClassesService);
  private reservationsService = inject(ReservationsService);
  private realtimeService = inject(RealtimeService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  classes: GymClass[] = [];
  loading = true;
  reservingId: string | null = null;

  constructor() {}

  ngOnInit() {
    this.loadClasses();
    this.realtimeService.connect();
    this.realtimeService.updatedClass$.subscribe(updated => {
      this.classes = this.classes.map(c =>
        c.id === updated.id ? { ...c, ...updated } : c
      );
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.realtimeService.disconnect();
  }

  loadClasses() {
    this.loading = true;
    this.classesService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('clases recibidas:', data);
      },
      error: () => { this.loading = false; }
    });
  }

  reserve(gymClass: GymClass) {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.reservingId = gymClass.id;

    const body = {
      classId: gymClass.id,
      userId,
      idempotencyKey: crypto.randomUUID()
    };

    this.reservationsService.create(body).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Reservado', detail: `Cupo confirmado en ${gymClass.name}` });
        this.loadClasses();
        this.reservingId = null;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo reservar.' });
        this.reservingId = null;
      }
    });
  }

  isFull(gymClass: GymClass): boolean {
    return gymClass.availableCapacity === 0;
  }
}