import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { TagsService } from 'src/tags/tags.service';
import {
  CreateMovementDto,
  CreateMovementsDto,
} from './dtos/create-movement.dto';
import { FindAllMovementsDto } from './dtos/find-all-movement.dto';
import { UpdateMovementDto } from './dtos/update-movement.dto';

@Injectable()
export class MovementsService {
  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService,
  ) {}

  async create(
    authUserId: string,
    data: CreateMovementDto | CreateMovementsDto,
  ) {
    if (!Reflect.has(data, 'movements') || data instanceof CreateMovementDto) {
      return this.createOne(authUserId, data as CreateMovementDto);
    } else {
      return this.createMany(authUserId, data.movements);
    }
  }

  async createOne(authUserId: string, data: CreateMovementDto) {
    const { tags, ...createMovementDto } = data;
    const date = new Date(createMovementDto.date);

    const upsertedTags = await Promise.all(
      tags.map((tag) => this.tagsService.upsert({ name: tag.toUpperCase() })),
    );

    const movement = await this.prisma.movement.create({
      data: {
        ...createMovementDto,
        date,
        amount: new Prisma.Decimal(createMovementDto.amount),
        authUserId,
        tags: {
          createMany: {
            data: upsertedTags.map((tag) => ({ tagId: tag.id })),
          },
        },
      },
      include: {
        tags: true,
      },
    });

    return movement;
  }

  async createMany(authUserId: string, data: CreateMovementDto[]) {
    const upsertedTags = await Promise.all(
      data.map(({ tags }) =>
        Promise.all(
          tags.map((tag) =>
            this.tagsService.upsert({ name: tag.toUpperCase() }),
          ),
        ),
      ),
    );

    const createMovementDtos = data.map((dto, i) => {
      const date = new Date(dto.date);

      return {
        ...dto,
        date,
        amount: new Prisma.Decimal(dto.amount),
        authUserId,
        tags: {
          createMany: {
            data: upsertedTags[i].map((tag) => ({ tagId: tag.id })),
          },
        },
      };
    });

    const movements = this.prisma.$transaction([
      ...createMovementDtos.map((dto) => {
        return this.prisma.movement.create({
          data: dto,
          include: {
            tags: true,
          },
        });
      }),
    ]);

    return movements;
  }

  findAll(authUserId: string, options?: Partial<FindAllMovementsDto>) {
    const { page, date, description, startDate, endDate, orderBy, tags } =
      options;

    const where = { authUserId };

    if (description) {
      Object.assign(where, {
        description: { contains: description, mode: 'insensitive' },
      });
    }

    if (date) {
      Object.assign(where, { date: new Date(date) });
    } else if (startDate && endDate) {
      Object.assign(where, {
        date: { gte: new Date(startDate), lte: new Date(endDate) },
      });
    } else if (startDate) {
      Object.assign(where, { date: { gte: new Date(startDate) } });
    } else if (endDate) {
      Object.assign(where, { date: { lte: new Date(endDate) } });
    }

    const otherOptions = {
      orderBy: {
        date: Prisma.SortOrder.asc,
      },
    };

    if (orderBy) {
      Object.assign(otherOptions, {
        orderBy: { [options.orderBy]: options.order },
      });
    }

    if (page) {
      const perPage = +options.perPage ?? 10;
      Object.assign(otherOptions, {
        take: perPage,
        skip: perPage * (page - 1),
      });
    }

    if (tags) {
      Object.assign(where, {
        tags: {
          some: {
            OR: tags.split(';').map((tag) => ({ tag: { name: tag } })),
          },
        },
      });
    }

    return this.prisma.movement.findMany({
      where,
      include: {
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      ...otherOptions,
    });
  }

  findOne(id: number) {
    return this.prisma.movement.findUnique({
      where: {
        id,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async update(id: number, { tags, ...updateMovementDto }: UpdateMovementDto) {
    const upsertedTags = await Promise.all(
      tags.map((tag) => this.tagsService.upsert({ name: tag.toUpperCase() })),
    );

    return this.prisma.movement.update({
      where: {
        id,
      },
      data: {
        ...updateMovementDto,
        tags: {
          deleteMany: {
            movementId: id,
          },
          createMany: {
            data: upsertedTags.map((tag) => ({ tagId: tag.id })),
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.movement.delete({
      where: {
        id,
      },
    });
  }

  balance(authUserId: string) {
    return this.prisma.$queryRaw`
      SELECT         
        sum(CASE WHEN mv.type = 'INCOME' THEN mv.amount ELSE 0 END) as "income",
        sum(CASE WHEN mv.type = 'OUTCOME' THEN mv.amount ELSE 0 END) as "outcome",
        sum(CASE WHEN mv.type = 'OUTCOME' THEN (mv.amount * -1) ELSE mv.amount END) "total"
      FROM movements mv 
      WHERE auth_user_id = ${authUserId}      
    `;
  }

  summary(authUserId: string) {
    return this.prisma.$queryRaw`
      SELECT
        extract(month from mv.date) as "month",
        tg.name as "tag",
        sum(CASE WHEN mv.type = 'INCOME' THEN mv.amount ELSE 0 END) as "income",
        sum(CASE WHEN mv.type = 'OUTCOME' THEN mv.amount ELSE 0 END) as "outcome",
        sum(CASE WHEN mv.type = 'OUTCOME' THEN (mv.amount * -1) ELSE mv.amount END) "total"
      FROM movements mv 
      INNER JOIN movements_tags mvtg ON mvtg.movement_id=mv.id
      INNER JOIN tags tg ON tg.id=mvtg.tag_id
      WHERE auth_user_id = ${authUserId}
      GROUP BY "month", "tag"
    `;

    return this.prisma.$queryRaw`
      SELECT 
        extract(month from mv.date) as "month",
        sum(CASE WHEN mv.type = 'INCOME' THEN mv.amount ELSE 0 END) as "income",
        sum(CASE WHEN mv.type = 'OUTCOME' THEN (mv.amount * -1) ELSE 0 END) as "outcome",
        sum(mv.amount) "total"
      FROM movements mv 
      WHERE auth_user_id = ${authUserId}
      GROUP BY "month"
    `;
  }
}
