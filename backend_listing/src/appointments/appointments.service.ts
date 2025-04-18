import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private usersService: UsersService,
  ) {}

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    if (appointmentData.userId) {
      const user = await this.usersService.findOne(appointmentData.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      appointmentData.user = user;
    }
    const appointment = this.appointmentsRepository.create(appointmentData);
    return await this.appointmentsRepository.save(appointment);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({ relations: ['user'] });
  }

  async updateAppointmentStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Promise<Appointment> {
    await this.appointmentsRepository.update(id, { status });
    return await this.appointmentsRepository.findOne({ where: { id }, relations: ['user'] });
  }
} 