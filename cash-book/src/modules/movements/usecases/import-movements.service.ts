import { BadRequestException, Injectable } from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { Transform, Writable } from 'node:stream';

import { CreateMovements } from './create-movements.service';
import { CreateMovementDto } from '../../../shared/infra/http/dtos/create-movement.dto';

@Injectable()
export class ImportMovements {
  constructor(private createMovementsService: CreateMovements) {}

  async execute(authUserId: string, file: Express.Multer.File) {
    const splitedFileName = file.originalname.split('.');
    const fileExtension = splitedFileName[splitedFileName.length - 1];
    if (fileExtension !== 'tsv') {
      unlink(file.path);
      throw new BadRequestException('Invalid file type');
    }

    return new Promise<void>((resolve, reject) => {
      const saveMovements = (movements: CreateMovementDto[]) =>
        this.createMovementsService.execute(authUserId, { movements });
      const isArrayColumn = (columnName) => /^.+\/\d+$/g.test(columnName);
      let head: string[] = [];

      const parseTsv = new Transform({
        transform(chunk, enc, cb) {
          const data: string = chunk.toString();
          const rows = data.split('\r\n').map((row) => row.split('\t'));

          if (!head.length) {
            head = rows.shift();
          }

          const json = rows.map((row) => {
            const obj = {};

            head.forEach((column, i) => {
              const value = row[i].trim();
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
          const movements: CreateMovementDto[] = data
            .split('\n')
            .map(JSON.parse);

          saveMovements(movements)
            .then(() => cb(null))
            .catch((err) => cb(err));
        },
      });

      createReadStream(file.path)
        .pipe(parseTsv)
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
