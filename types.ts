export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

export enum ServiceType {
  MEDICAL = 'Medical Checkup',
  DENTAL = 'Dental Services',
  COUNSELING = 'Mental Health Counseling',
  NUTRITION = 'Nutrition Consultation'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  idNumber?: string; // School ID
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  serviceType: ServiceType;
  date: string; // ISO Date string
  time: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string; // Admin notes
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface HealthStat {
  name: string;
  value: number;
  fill: string;
}