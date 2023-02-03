import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { Movement } from '../../../../../modules/movements/entities/movement.entity';
import {
  Balance,
  Filters,
  FindAllReturn,
  MovementColumns,
  MovementsGroupBy,
  MovementsRepository,
  Order,
  SummaryFilters,
  SummaryItem,
} from '../../../../../modules/movements/repositories/movements.repository';
import { PrismaMovementMapper } from '../mappers/movement.mapper';
import { HttpMovement } from '../../../http/view-models/movement-view-model';

@Injectable()
export class PrismaMovementsRepository implements MovementsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Movement): Promise<Movement> {
    const movement = await this.prisma.movement.create({
      data: {
        ...PrismaMovementMapper.toPrisma(data),
        tags: {
          createMany: {
            data: data.tags.map((tag) => ({ tagId: tag.id })),
          },
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return PrismaMovementMapper.toDomain(
      movement,
      movement.tags.map((mvTags) => mvTags.tag),
    );
  }

  async createMany(data: Movement[]): Promise<Movement[]> {
    const movements = await this.prisma.$transaction([
      ...data.map((movement) => {
        return this.prisma.movement.create({
          data: {
            ...PrismaMovementMapper.toPrisma(movement),
            tags: {
              createMany: {
                data: movement.tags.map((tag) => ({ tagId: tag.id })),
              },
            },
          },
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        });
      }),
    ]);

    return movements.map((movement) =>
      PrismaMovementMapper.toDomain(
        movement,
        movement.tags.map((mvTags) => mvTags.tag),
      ),
    );
  }

  async findAll(
    authUserId: string,
    filters?: Partial<Filters>,
  ): Promise<FindAllReturn> {
    const { page } = filters;

    const columns = {
      [MovementColumns.ID]: Prisma.sql`mv.id`,
      [MovementColumns.DATE]: Prisma.sql`mv.date`,
      [MovementColumns.DESCRIPTION]: Prisma.sql`mv.description`,
      [MovementColumns.AMOUNT]: Prisma.sql`mv.amount`,
      [MovementColumns.TYPE]: Prisma.sql`mv.type`,
    };

    const perPage = filters.perPage || 10;

    const orderBy = columns[filters.orderBy] || null;
    const order =
      {
        [Order.ASC]: Prisma.sql`ASC`,
        [Order.DESC]: Prisma.sql`DESC`,
      }[filters.order] || Prisma.sql`ASC`;

    const withoutPaginationQuery = Prisma.sql`
      ${this.findAllQuery(authUserId, filters)} ${
      orderBy
        ? Prisma.sql`ORDER BY ${orderBy} ${order}`
        : Prisma.sql`ORDER BY mv.id ASC`
    }
    `;

    const query = Prisma.sql`${withoutPaginationQuery} ${
      page && page > 0
        ? Prisma.sql`LIMIT ${Number(perPage)} OFFSET ${Number(
            perPage * (page - 1),
          )}`
        : Prisma.empty
    }`;

    const data: HttpMovement[] = await this.prisma.$queryRaw(query);

    const [{ total }]: {
      total: number;
    }[] = await this.prisma.$queryRaw(
      Prisma.sql`SELECT COUNT(mvts.id)::int as total FROM (${withoutPaginationQuery}) as mvts`,
    );

    const pagination = {
      ...(page && page > 0
        ? {
            isPaginated: true,
            hasPrev: page > 1,
            hasNext: total - perPage * page > 0,
          }
        : {
            isPaginated: false,
          }),
      totalCount: total,
    };

    return {
      pagination,
      data,
    };
  }

  async findOne(id: number): Promise<Movement | null> {
    const raw = await this.prisma.movement.findUnique({
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

    if (!raw) return null;

    return PrismaMovementMapper.toDomain(
      raw,
      raw.tags.map((mvTag) => mvTag.tag),
    );
  }

  async findAllUniqueMovements(authUserId: string): Promise<Movement[]> {
    const movements = await this.prisma.movement.findMany({
      distinct: ['description'],
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
      where: {
        authUserId,
      },
    });

    return movements.map((movement) =>
      PrismaMovementMapper.toDomain(
        movement,
        movement.tags.map((mvTg) => mvTg.tag),
      ),
    );
  }

  async update(id: number, data: Partial<Movement>): Promise<Movement> {
    const raw = await this.prisma.movement.update({
      where: {
        id,
      },
      data: {
        ...PrismaMovementMapper.toPrisma(data),
        tags: {
          deleteMany: {
            movementId: id,
          },
          createMany: {
            data: data.tags.map((tag) => ({ tagId: tag.id })),
          },
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return PrismaMovementMapper.toDomain(
      raw,
      raw.tags.map((mvTag) => mvTag.tag),
    );
  }

  async remove(id: number): Promise<Movement> {
    const raw = await this.prisma.movement.delete({
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

    return PrismaMovementMapper.toDomain(
      raw,
      raw.tags.map((mvTag) => mvTag.tag),
    );
  }

  async balance(
    authUserId: string,
    filters?: Partial<Filters>,
  ): Promise<Balance> {
    const query = Prisma.sql`SELECT 
      sum(CASE WHEN mv.type = 'INCOME' THEN mv.amount ELSE 0 END) as "income",
      sum(CASE WHEN mv.type = 'OUTCOME' THEN mv.amount ELSE 0 END) as "outcome",
      sum(CASE WHEN mv.type = 'OUTCOME' THEN (mv.amount * -1) ELSE mv.amount END) "total"
      FROM (${this.findAllQuery(authUserId, filters)}) mv      
    `;

    return (await this.prisma.$queryRaw(query))[0];
  }

  async summary(
    authUserId: string,
    filters?: SummaryFilters,
  ): Promise<SummaryItem[]> {
    const { groupBy, description, date, startDate, endDate, tags } = filters;

    let groupByColumnSelect, groupByColumn, orderBy;
    const joins = [];
    if (groupBy === MovementsGroupBy.TAGS) {
      groupByColumn = Prisma.sql`tg.name`;
      groupByColumnSelect = Prisma.sql`tg.name as "group"`;

      joins.push(Prisma.sql`INNER JOIN movements_tags mvtg ON mvtg.movement_id=mv.id
      INNER JOIN tags tg ON tg.id=mvtg.tag_id`);

      orderBy = Prisma.sql`ORDER BY "group" ASC`;
    } else {
      const day = Prisma.sql`extract(day from mv.date)`;
      const month = Prisma.sql`extract(month from mv.date)`;
      const year = Prisma.sql`extract(year from mv.date)`;

      groupByColumn = {
        [MovementsGroupBy.DAY]: Prisma.sql`concat(${day}, '/', ${month}, '/', ${year})`,
        [MovementsGroupBy.MONTH]: Prisma.sql`concat(${month}, '/', ${year})`,
        [MovementsGroupBy.YEAR]: year,
      }[groupBy];

      groupByColumnSelect = Prisma.sql`${groupByColumn} as "group"`;

      joins.push(Prisma.empty);

      orderBy = {
        [MovementsGroupBy.DAY]: Prisma.sql`ORDER BY
          (string_to_array(${groupByColumn}, '/'))[3]::int ASC,
          (string_to_array(${groupByColumn}, '/'))[2]::int ASC,
          (string_to_array(${groupByColumn}, '/'))[1]::int ASC`,
        [MovementsGroupBy.MONTH]: Prisma.sql`ORDER BY
          (string_to_array(${groupByColumn}, '/'))[2]::int ASC,
          (string_to_array(${groupByColumn}, '/'))[1]::int ASC`,
        [MovementsGroupBy.YEAR]: Prisma.sql`ORDER BY 
          (${groupByColumn})::int ASC`,
      }[groupBy];
    }

    let descriptionWhere = Prisma.empty;
    if (description) {
      const stringContainingDescription = Prisma.sql`'%' || ${description} || '%'`;
      descriptionWhere = Prisma.sql`AND mv.description ILIKE ${stringContainingDescription}`;
    }

    let dateWhere = Prisma.empty;
    if (date) {
      dateWhere = Prisma.sql`AND mv.date = ${new Date(date)}`;
    } else if (startDate && endDate) {
      dateWhere = Prisma.sql`AND mv.date >= ${new Date(
        startDate,
      )} AND mv.date <= ${new Date(endDate)}`;
    } else if (startDate) {
      dateWhere = Prisma.sql`AND mv.date >= ${new Date(startDate)}`;
    } else if (endDate) {
      dateWhere = Prisma.sql`AND mv.date <= ${new Date(endDate)}`;
    }

    const tagsWhere = [];
    if (tags) {
      const tagQueries = tags.split(';');

      const movementTagNames = Prisma.sql`(select array_agg(tg.name) as mv_tags, mvtg.movement_id as mv_id from movements_tags mvtg inner join tags tg on tg.id = mvtg.tag_id group by mv_id)`;

      joins.push(
        Prisma.sql`\n\tINNER JOIN ${movementTagNames} as mvtgs ON mvtgs.mv_id=mv.id`,
      );

      for (const tagQuery of tagQueries) {
        const addTagFilter = (tagNames: string[]) => {
          const queryConnective = !tagsWhere.length
            ? Prisma.sql`AND (`
            : Prisma.sql` OR`;

          tagsWhere.push(
            Prisma.sql`${queryConnective} mvtgs.mv_tags @> ARRAY[${Prisma.join(
              tagNames,
            )}]`,
          );
        };

        if (tagQuery.includes('&')) {
          const tagNames = tagQuery.split('&');

          addTagFilter(tagNames);
        } else if (tagQuery.includes('|')) {
          const tagNames = tagQuery.split('|');

          for (const tagName of tagNames) {
            addTagFilter([tagName]);
          }
        } else {
          const tagName = tagQuery;
          addTagFilter([tagName]);
        }
      }
      tagsWhere.push(Prisma.sql` )`);
    }

    const query = Prisma.sql`
      SELECT
        ${groupByColumnSelect},
        sum(CASE WHEN mv.type = 'INCOME' THEN mv.amount ELSE 0 END) as "income",
        sum(CASE WHEN mv.type = 'OUTCOME' THEN mv.amount ELSE 0 END) as "outcome",
        sum(CASE WHEN mv.type = 'OUTCOME' THEN (mv.amount * -1) ELSE mv.amount END) "total"
      FROM movements mv
      ${joins.length ? Prisma.join(joins, '') : Prisma.empty}
      WHERE auth_user_id = ${authUserId} ${descriptionWhere} ${dateWhere} ${
      tagsWhere.length ? Prisma.join(tagsWhere, '') : Prisma.empty
    }
      GROUP BY ${groupByColumn}
      ${orderBy}
    `;

    return this.prisma.$queryRaw(query);
  }

  async maxTagsPerMovement(authUserId: string): Promise<number> {
    const [{ max_tags: maxTags }]: { max_tags: number }[] = await this.prisma
      .$queryRaw`
        select
          max(array_length((
          select
            array_agg(mt.tag_id)
          from
            movements_tags mt
          where
            mt.movement_id = m.id), 1))::int as max_tags
        from
          movements m
        where
          m.auth_user_id = ${authUserId}
      `;

    return maxTags;
  }

  private findAllQuery(authUserId: string, filters?: Partial<Filters>) {
    const { date, description, startDate, endDate, tags } = filters;

    let descriptionWhere = Prisma.empty;
    if (description) {
      const stringContainingDescription = Prisma.sql`'%' || ${description} || '%'`;
      descriptionWhere = Prisma.sql`AND mv.description ILIKE ${stringContainingDescription}`;
    }

    let dateWhere = Prisma.empty;
    if (date) {
      dateWhere = Prisma.sql`AND mv.date = ${new Date(date)}`;
    } else if (startDate && endDate) {
      dateWhere = Prisma.sql`AND mv.date >= ${new Date(
        startDate,
      )} AND mv.date <= ${new Date(endDate)}`;
    } else if (startDate) {
      dateWhere = Prisma.sql`AND mv.date >= ${new Date(startDate)}`;
    } else if (endDate) {
      dateWhere = Prisma.sql`AND mv.date <= ${new Date(endDate)}`;
    }

    const movementTagNames = Prisma.sql`(
      SELECT 
        ARRAY_AGG(tg.name) AS mv_tags        
      FROM movements_tags mvtg 
      INNER JOIN tags tg ON tg.id = mvtg.tag_id
      WHERE mvtg.movement_id = mv.id      
    )`;

    const tagsWhere = [];
    if (tags) {
      const tagQueries = tags.split(';');

      for (const tagQuery of tagQueries) {
        const addTagFilter = (tagNames: string[]) => {
          const queryConnective = !tagsWhere.length
            ? Prisma.sql`AND (`
            : Prisma.sql` OR`;

          tagsWhere.push(
            Prisma.sql`${queryConnective} ${movementTagNames} @> ARRAY[${Prisma.join(
              tagNames,
            )}]`,
          );
        };

        if (tagQuery.includes('&')) {
          const tagNames = tagQuery.split('&');

          addTagFilter(tagNames);
        } else if (tagQuery.includes('|')) {
          const tagNames = tagQuery.split('|');

          for (const tagName of tagNames) {
            addTagFilter([tagName]);
          }
        } else {
          const tagName = tagQuery;
          addTagFilter([tagName]);
        }
      }
      tagsWhere.push(Prisma.sql` )`);
    }

    const columns = {
      [MovementColumns.ID]: Prisma.sql`mv.id`,
      [MovementColumns.DATE]: Prisma.sql`mv.date`,
      [MovementColumns.DESCRIPTION]: Prisma.sql`mv.description`,
      [MovementColumns.AMOUNT]: Prisma.sql`mv.amount`,
      [MovementColumns.TYPE]: Prisma.sql`mv.type`,
    };

    const distinct =
      filters.distinct &&
      (filters.orderBy ? filters.orderBy === filters.distinct : true)
        ? Prisma.sql`DISTINCT ON (${columns[filters.distinct]})`
        : Prisma.empty;

    return Prisma.sql`
      SELECT ${distinct}
        mv.id AS id,
        mv.date AS date,
        mv.description AS description,
        mv.amount AS amount,
        mv.type AS type,
        ${movementTagNames} as tags
      FROM movements mv
      WHERE auth_user_id = ${authUserId} ${descriptionWhere} ${dateWhere} ${
      tagsWhere.length ? Prisma.join(tagsWhere, '') : Prisma.empty
    }`;
  }
}
