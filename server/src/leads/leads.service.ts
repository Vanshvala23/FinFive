import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead-schema';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(@InjectModel(Lead.name) private model: Model<LeadDocument>) {}

  create(dto: CreateLeadDto, userId: string) {
    return this.model.create({ ...dto, assignedTo: userId });
  }

  findAll(query: any = {}) {
    const filter: any = {};

    if (query.status) filter.status = query.status;

    // Search across the fields that actually exist on the schema
    if (query.search) {
      filter.$or = [
        { firstName: new RegExp(query.search, 'i') },
        { lastName:  new RegExp(query.search, 'i') },
        { email:     new RegExp(query.search, 'i') },
        { service:   new RegExp(query.search, 'i') },
      ];
    }

    return this.model
      .find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).populate('assignedTo', 'name email');
    if (!doc) throw new NotFoundException('Lead not found');
    return doc;
  }

  async update(id: string, dto: Partial<CreateLeadDto>) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!doc) throw new NotFoundException('Lead not found');
    return doc;
  }

  async remove(id: string) {
    await this.model.findByIdAndDelete(id);
    return { message: 'Lead deleted' };
  }

  async getStats() {
    return this.model.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  }
}