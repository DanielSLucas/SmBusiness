import { Injectable } from '@nestjs/common';
import { Readable, Transform } from 'node:stream';
import { resolve as pathResolve } from 'node:path';
import { createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';

import { tempFolder } from '../../../shared/config/multer.config';
import { HttpMovement } from '../../../shared/infra/http/view-models/movement-view-model';

import { FindAllMovementsDto } from '../../../shared/infra/http/dtos/find-all-movement.dto';
import { MovementsRepository } from '../repositories/movements.repository';

@Injectable()
export class ExportMovements {
  constructor(private movementsRepository: MovementsRepository) {}

  async execute(authUserId: string, filters: FindAllMovementsDto) {
    return new Promise(async (resolve, reject) => {
      const getMovements = async (pg, perPg) => {
        const response = await this.movementsRepository.findAll(authUserId, {
          ...filters,
          page: pg,
          perPage: perPg,
        });

        return response.data;
      };

      let page = 1;
      const perPage = 100;

      const readMovements = new Readable({
        async read() {
          while (true) {
            const movements = await getMovements(page, perPage);

            if (movements.length) {
              const data = JSON.stringify(movements);

              page++;
              this.push(data);
            } else {
              break;
            }
          }

          this.push(null);
        },
      });

      const maxTags = await this.movementsRepository.maxTagsPerMovement(
        authUserId,
      );

      let head: (keyof HttpMovement)[] = [];

      const parseToTsv = new Transform({
        transform(chunk, enc, cb) {
          try {
            const movements: HttpMovement[] = JSON.parse(chunk);
            const data = [];

            if (!head.length) {
              const tagsColumns = Array.from({
                length: maxTags,
              }).map((_, i) => `tags/${i}` as keyof HttpMovement);
              head = ['date', 'description', 'type', 'amount', ...tagsColumns];
              data.push(head.join('\t'));
            } else {
              data.push('');
            }

            const rows = movements
              .map((movement) => {
                const str = [];

                for (const column of head) {
                  if (column.includes('tags')) {
                    const [columnName, index] = column.split('/');
                    const value = movement[columnName][index];
                    if (value) str.push(value);
                  } else if (column === 'date') {
                    str.push(
                      (movement[column] as unknown as string).split('T')[0],
                    );
                  } else {
                    str.push(movement[column]);
                  }
                }

                return str.join('\t');
              })
              .join('\n');

            data.push(rows);

            cb(null, data.join('\n'));
          } catch (error) {
            cb(error);
          }
        },
      });

      const fileName = `${Date.now()}_export.tsv`;
      const filePath = pathResolve(tempFolder, fileName);
      const fileExpirationTime = 1000 * 60 * 5;

      readMovements
        .pipe(parseToTsv)
        .pipe(createWriteStream(filePath))
        .on('error', (err) => reject(err))
        .on('close', () => {
          setTimeout(() => {
            unlink(filePath).catch((err) => console.log(err));
          }, fileExpirationTime);

          resolve({
            fileName,
            downloadPath: `/files/${fileName}`,
            expiresAt: new Date(Date.now() + fileExpirationTime).toISOString(),
          });
        });
    });
  }
}
