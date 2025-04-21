import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDto } from 'src/dto/payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post()
  async create(@Body() paymentDto: PaymentDto) {
    const payment = await this.paymentService.createPayment(paymentDto);

    if (payment['message']) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: payment['message'],
      };
    }

    if (!payment) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Payment not created',
      };
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Payment created successfully',
      data: payment,
    };
  }

  @Get()
  async findAll() {
    const payments = await this.paymentService.getPayments();

    if (!payments) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Payments not found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Payments retrieved successfully',
      data: payments,
    };
  }

  @Get(':clientId')
  async findByClientId(@Param('clientId') clientId: number) {
    const payments = await this.paymentService.getClientPayments(clientId);

    if (!payments) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Payments not found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Payments retrieved successfully',
      data: payments,
    };
  }

  @Get(':id')
  async findByID(@Param('id') id: number) {
    const payment = await this.paymentService.getPayment(id);

    if (!payment) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Payment not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Payment retrieved successfully',
      data: payment,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() paymentDto: PaymentDto) {
    const updatedPayment = await this.paymentService.updatePayment(
      id,
      paymentDto,
    );

    if (!updatedPayment) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Payment not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Payment updated successfully',
      data: updatedPayment,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.paymentService.deletePayment(id);

    if (!result.deleted) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Payment not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Payment deleted successfully',
    };
  }
}
