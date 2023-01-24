import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { TagsService } from 'src/tags/tags.service';
import { Transform, Writable } from 'stream';

import {
  CreateMovementDto,
  CreateMovementsDto,
} from './dtos/create-movement.dto';
import {
  FindAllMovementsDto,
  MovementColumns,
  Order,
} from './dtos/find-all-movement.dto';
import {
  MovementsGroupBy,
  SummaryOptionsDto,
} from './dtos/summary-options.dto';
import { UpdateMovementDto } from './dtos/update-movement.dto';
import { Movement, MovementType } from './entities/movement.entity';

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
        type: createMovementDto.type.toUpperCase() as MovementType,
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
        type: dto.type.toUpperCase() as MovementType,
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

  async findAll(authUserId: string, options?: Partial<FindAllMovementsDto>) {
    const {
      page,
      date,
      description,
      startDate,
      endDate,
      orderBy,
      tags,
      distinct,
    } = options;

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

    if (distinct) {
      Object.assign(otherOptions, {
        distinct: distinct.split(';') as (keyof Movement)[],
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

  async findOne(id: number) {
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

  async remove(id: number) {
    return this.prisma.movement.delete({
      where: {
        id,
      },
    });
  }

  async balance(authUserId: string, options?: Partial<FindAllMovementsDto>) {
    const { date, description, startDate, endDate, tags } = options;

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
      options.distinct &&
      (options.orderBy ? options.orderBy === options.distinct : true)
        ? Prisma.sql`DISTINCT ON (${columns[options.distinct]})`
        : Prisma.empty;

    const withoutPaginationQuery = Prisma.sql`
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

    const query = Prisma.sql`SELECT 
      sum(CASE WHEN mv.type = 'INCOME' THEN mv.amount ELSE 0 END) as "income",
      sum(CASE WHEN mv.type = 'OUTCOME' THEN mv.amount ELSE 0 END) as "outcome",
      sum(CASE WHEN mv.type = 'OUTCOME' THEN (mv.amount * -1) ELSE mv.amount END) "total"
      FROM (${withoutPaginationQuery}) mv      
    `;

    return (await this.prisma.$queryRaw(query))[0];
  }

  async find(authUserId: string, options?: Partial<FindAllMovementsDto>) {
    const { page, date, description, startDate, endDate, tags } = options;

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
      options.distinct &&
      (options.orderBy ? options.orderBy === options.distinct : true)
        ? Prisma.sql`DISTINCT ON (${columns[options.distinct]})`
        : Prisma.empty;

    const perPage = options.perPage || 10;

    const orderBy = columns[options.orderBy] || null;
    const order =
      {
        [Order.ASC]: Prisma.sql`ASC`,
        [Order.DESC]: Prisma.sql`DESC`,
      }[options.order] || Prisma.sql`ASC`;

    const withoutPaginationQuery = Prisma.sql`
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
    } ${
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

    console.log(query.values);
    console.log(query.sql);
    const data = await this.prisma.$queryRaw(query);

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

  async summary(authUserId: string, options: SummaryOptionsDto) {
    const { groupBy, description, date, startDate, endDate, tags } = options;

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

  async import(authUserId: string, file: Express.Multer.File) {
    if (file.mimetype !== 'text/csv') {
      unlink(file.path);
      throw new BadRequestException('Invalid file type');
    }

    return new Promise<void>((resolve, reject) => {
      const saveMovements = (movements) =>
        this.createMany(authUserId, movements);
      const isArrayColumn = (columnName) => /^.+\/\d+$/g.test(columnName);
      let head: string[] = [];

      const parseCsv = new Transform({
        transform(chunk, enc, cb) {
          const data: string = chunk.toString();
          const rows = data.split('\r\n').map((row) => row.split(','));

          if (!head.length) {
            head = rows.shift();
          }

          const json = rows.map((row) => {
            const obj = {};

            head.forEach((column, i) => {
              const value = row[i];
              if (!value) return;

              if (isArrayColumn(column)) {
                const [columnName] = column.split('/');
                if (obj[columnName]?.length) {
                  Object.assign(obj, {
                    [columnName]: [...obj[columnName], value],
                  });
                } else {
                  Object.assign(obj, { [columnName]: [value] });
                }
              } else {
                Object.assign(obj, { [column]: value });
              }
            });

            return JSON.stringify(obj);
          });

          cb(null, json.join('\n'));
        },
      });

      const createMovements = new Writable({
        write(chunk, enc, cb) {
          const data = chunk.toString();
          const movements = data.split('\n').map(JSON.parse);

          saveMovements(movements)
            .then(() => cb(null))
            .catch((err) => cb(err));
        },
      });

      createReadStream(file.path)
        .pipe(parseCsv)
        .pipe(createMovements)
        .on('error', (err) => reject(err))
        .on('close', () => {
          unlink(file.path)
            .then(() => resolve())
            .catch((err) => reject(err));
        });
    });
  }
}
