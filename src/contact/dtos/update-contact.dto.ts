// src/contact/dto/update-contact.dto.ts

import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  groupName?: string;
}
