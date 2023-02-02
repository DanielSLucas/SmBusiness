import { NotFoundException } from '@nestjs/common';

export class TagNotFound extends NotFoundException {
  constructor() {
    super('Tag not found.');
  }
}
