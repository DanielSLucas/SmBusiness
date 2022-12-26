import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  create({ name }: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        name: name.toUpperCase(),
      },
    });
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  findOne(id: string) {
    return this.prisma.tag.findUnique({
      where: {
        id,
      },
    });
  }

  upsert({ name }: UpdateTagDto) {
    const data = {
      name: name.toUpperCase(),
    };

    return this.prisma.tag.upsert({
      create: data,
      update: data,
      where: {
        name: data.name,
      },
    });
  }

  update(id: string, { name }: UpdateTagDto) {
    return this.prisma.tag.update({
      where: {
        id,
      },
      data: {
        name: name.toUpperCase(),
      },
    });
  }

  remove(id: string) {
    return this.prisma.tag.delete({
      where: {
        id,
      },
    });
  }
}
