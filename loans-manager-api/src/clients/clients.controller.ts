import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { ClientService } from './clients.service';
import { ClientDto } from '../dto/client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private clientService: ClientService) {}

  @Post()
  async create(@Body() clientDto: ClientDto) {
    
    const client = await this.clientService.createClient(clientDto);
    
    if (client['message']) {
      return { statusCode: HttpStatus.BAD_REQUEST, message: client['message'] };
    }

    if (!client) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Client not created',
      };
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Client created successfully',
      data: client,
    };
  }

  @Get()
  async findAll() {

    const clients = await this.clientService.getClients();

    if (clients.length == 0) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Clients not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Clients retrieved successfully',
      data: clients,
    };
  }
  
  @Get(':userId')
  async findUserClients(@Param('userId') userId: number) {

    const clients = await this.clientService.getUserClients(userId);

    if (clients.length == 0) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Clients not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Clients retrieved successfully',
      data: clients,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() clientDto: ClientDto) {
  
    const updatedClient = await this.clientService.updateClient(id, clientDto);
  
    if (!updatedClient) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Client not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Client updated successfully',
      data: updatedClient,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    
    const result = await this.clientService.deleteClient(id);
    
    if (!result.deleted) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Client not found' };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Client deleted successfully',
    };
  }
}
