import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { LoanService } from './loans.service';
import { LoanDto } from '../dto/loan.dto';

@Controller('loans')
export class LoansController {
  constructor(private loanService: LoanService) {}

  @Post()
  async create(@Body() loanDto: LoanDto) {
    const loan = await this.loanService.createLoan(loanDto);
 
    if (!loan) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Loan not created',
      };
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Loan created successfully',
      data: loan,
    };
  }

  @Get()
  async findAll() {
    const loans = await this.loanService.getLoans();

    if (!loans) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Loans not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Loans retrieved successfully',
      data: loans,
    };
  }

  @Get('statistics/:userId')
  async statistics(@Param('userId') userId: number) {
    return await this.loanService.getStatistics(userId);
  }

  @Get(':clientId')
  async findByClientID(@Param('clientId') clientId: number) {
    const loans = await this.loanService.getClientLoans(clientId);

    if (!loans || loans.length === 0) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Loan not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Loan retrieved successfully',
      data: loans,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() loanDto: LoanDto) {
    const updatedLoan = await this.loanService.updateLoan(id, loanDto);

    if (!updatedLoan) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Loan not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Loan updated successfully',
      data: updatedLoan,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.loanService.deleteLoan(id);

    if (!result.deleted) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Loan not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Loan deleted successfully',
    };
  }
}
