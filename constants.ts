import { UserRole, ServiceType } from './types';
import { Heart, Stethoscope, Smile, Brain, Activity } from 'lucide-react';

export const APP_NAME = "FrancisCare";
export const COLLEGE_NAME = "St. Francis College Guihulngan";

export const SERVICES_INFO = [
  {
    id: 'medical',
    title: 'Medical Services',
    description: 'General checkups, first aid, and consultations with our campus physician.',
    icon: Stethoscope,
    type: ServiceType.MEDICAL,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    id: 'dental',
    title: 'Dental Care',
    description: 'Routine dental exams, cleaning, and emergency dental care for students and staff.',
    icon: Smile,
    type: ServiceType.DENTAL,
    color: 'text-teal-600',
    bg: 'bg-teal-100'
  },
  {
    id: 'counseling',
    title: 'Guidance & Counseling',
    description: 'Confidential mental health support, stress management, and academic counseling.',
    icon: Brain,
    type: ServiceType.COUNSELING,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    id: 'nutrition',
    title: 'Nutrition & Wellness',
    description: 'Dietary planning and wellness workshops to maintain a healthy lifestyle.',
    icon: Activity,
    type: ServiceType.NUTRITION,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  }
];

// Mock Users for Demo
export const DEMO_USERS = {
  student: {
    id: 'u1',
    name: 'Juan Dela Cruz',
    email: 'juan@sfcg.edu.ph',
    role: UserRole.STUDENT,
    idNumber: '2023-1024'
  },
  admin: {
    id: 'a1',
    name: 'Nurse Maria',
    email: 'admin@sfcg.edu.ph',
    role: UserRole.ADMIN,
    idNumber: 'EMP-001'
  }
};
