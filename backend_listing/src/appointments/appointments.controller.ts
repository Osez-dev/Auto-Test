import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Body() appointmentData: Partial<Appointment>) {
    return await this.appointmentsService.createAppointment(appointmentData);
  }

  @Get()
  async getAllAppointments() {
    return await this.appointmentsService.getAllAppointments();
  }

  @Put(':id/status')
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'approved' | 'rejected',
  ) {
    return await this.appointmentsService.updateAppointmentStatus(Number(id), status);
  }
} 