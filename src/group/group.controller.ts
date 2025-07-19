import { Body, Controller, Get, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './schemas/group.schema';
import { CreateGroupDto } from './dtos/create-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupService.create(createGroupDto.name);
  }

  @Get()
  async getAllGroups() {
    return await this.groupService.findAll();
  }
}
