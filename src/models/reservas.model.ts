// src/models/Reservation.ts
import { Schema, model, Types } from 'mongoose';

type ReservationType = {
  user: Types.ObjectId;          // Referencia al usuario que hizo la reserva
  book: Types.ObjectId;           // Referencia al libro reservado
  reservationDate: Date;          // Fecha en que se reservó el libro
  dueDate: Date;                  // Fecha en que se debe devolver el libro
  returnDate?: Date;              // Fecha en que el libro fue devuelto, si ya fue devuelto
  status: 'reserved' | 'returned'  ; // Estado de la reserva
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<ReservationType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  reservationDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['reserved', 'returned', 'overdue'],
    default: 'reserved',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

reservationSchema.pre<ReservationType>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Reservation = model<ReservationType>('Reservation', reservationSchema);
export default Reservation;
