import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { TagsRepository } from '../../../../../modules/tags/repositories/tags.repository';
import { PrismaTagMapper } from '../mappers/tag.mapper';

@Injectable()
export class PrismaTagsRepository implements TagsRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    const raw = await this.prisma.tag.create({
      data: {
        name,
      },
    });

    return PrismaTagMapper.toDomain(raw);
  }

  async findAll() {
    const rawTags = await this.prisma.tag.findMany();

    return rawTags.map(PrismaTagMapper.toDomain);
  }

  async findAllTagNamesFromUser(authUserId: string) {
    return this.prisma.$queryRaw`
      SELECT DISTINCT ON (t.name)
        t.id,
        t.name
      FROM
        movements m
      INNER JOIN movements_tags mt ON
        mt.movement_id = m.id
      INNER JOIN tags t ON
        mt.tag_id = t.id
      WHERE
        m.auth_user_id = ${authUserId}
    ` as Promise<{ id: string; name: string }[]>;
  }

  async findOne(id: string) {
    const raw = await this.prisma.tag.findUnique({
      where: {
        id,
      },
    });

    if (!raw) return null;

    return PrismaTagMapper.toDomain(raw);
  }

  async findOneByName(name: string) {
    const raw = await this.prisma.tag.findUnique({
      where: {
        name,
      },
    });

    if (!raw) return null;

    return PrismaTagMapper.toDomain(raw);
  }

  async upsert(name: string) {
    const data = {
      name,
    };

    const raw = await this.prisma.tag.upsert({
      create: data,
      update: data,
      where: {
        name: data.name,
      },
    });

    return PrismaTagMapper.toDomain(raw);
  }

  async update(id: string, name: string) {
    const raw = await this.prisma.tag.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return PrismaTagMapper.toDomain(raw);
  }

  async remove(id: string) {
    const raw = await this.prisma.tag.delete({
      where: {
        id,
      },
    });

    return PrismaTagMapper.toDomain(raw);
  }
}
