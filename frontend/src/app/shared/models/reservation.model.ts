export interface Reservation {
  id: string;
  userId: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
  classId: {
    _id: string;
    name: string;
    instructor: string;
    date: string;
  };
  status: 'confirmed' | 'cancelled';
  idempotencyKey: string;
  isActive: boolean;
}

export interface ReservationRequest {
  classId: string;
  userId: string;
  idempotencyKey: string;
}