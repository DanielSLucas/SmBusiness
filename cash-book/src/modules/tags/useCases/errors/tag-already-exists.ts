import { BadRequestException } from '@nestjs/common';

export class TagAlreadyExists extends BadRequestException {
  constructor() {
    super('A tag with this name already exists.');
  }
}
