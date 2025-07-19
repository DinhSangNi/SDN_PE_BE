import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { Model, Types } from 'mongoose';
import { GroupService } from '../group/group.service';
import { CreateContactDto } from './dtos/create-contact.dto';
import { GroupDocument } from 'src/group/schemas/group.schema';
import { FilterContactDto } from './dtos/filter-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    private readonly groupService: GroupService,
  ) {}

  async create(dto: CreateContactDto): Promise<ContactDocument> {
    const { name, email, phone, groupName } = dto;

    if (!name || !email) {
      throw new BadRequestException('Name and email are required');
    }

    let group: GroupDocument | null = null;
    if (groupName) {
      group = await this.groupService.findOrCreate(groupName);
    }

    const contact = new this.contactModel({
      name,
      email,
      phone,
      group: {
        _id: group?._id,
      },
    });

    return await contact.save();
  }

  async getContactById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid contact ID');
    }

    const contact = await this.contactModel
      .findById(id)
      .populate('group')
      .exec();

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact.toObject();
  }

  async getFilteredContacts(filter: FilterContactDto) {
    const { groupId, sort = 'asc', page = 1, limit = 10, search } = filter;

    const query: any = {};

    if (groupId) {
      query.group = new Types.ObjectId(groupId);
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.contactModel
        .find(query)
        .sort({ name: sort === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .populate('group')
        .exec(),
      this.contactModel.countDocuments(query),
    ]);

    return {
      data: data.map((contact) => contact.toObject()),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        group: {
          name: dto.group,
        },
      },
      {
        new: true,
      },
    );

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  // DELETE
  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.contactModel.deleteOne({ _id: id });
    return { deleted: result.deletedCount === 1 };
  }
}
