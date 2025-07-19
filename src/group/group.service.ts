import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { Model } from 'mongoose';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(name: string): Promise<Group> {
    const existing = await this.groupModel.findOne({ name: name.trim() });
    if (existing) {
      throw new ConflictException('Group already exists');
    }
    return await this.groupModel.create({ name: name.trim() });
  }

  async findOrCreate(name: string): Promise<GroupDocument> {
    const groupName = name.trim();
    let group = await this.groupModel.findOne({ name: groupName });
    if (!group) {
      group = await this.groupModel.create({ name: groupName });
    }
    return group;
  }

  async findAll() {
    return await this.groupModel.find().lean();
  }
}
