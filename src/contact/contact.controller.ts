import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dtos/create-contact.dto';
import { Contact } from './schemas/contact.schema';
import { FilterContactDto } from './dtos/filter-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return (await this.contactService.create(createContactDto)).toObject();
  }

  @Get()
  async findAll(@Query() filter: FilterContactDto) {
    return await this.contactService.getFilteredContacts(filter);
  }

  @Get(':id')
  async getContactById(@Param('id') id: string) {
    return this.contactService.getContactById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.contactService.delete(id);
  }
}
