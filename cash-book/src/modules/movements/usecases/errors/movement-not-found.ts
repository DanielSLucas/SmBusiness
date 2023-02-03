import { NotFoundException } from '@nestjs/common';

export class MovementNotFound extends NotFoundException {
  constructor() {
    super('Movement not found.');
  }
}
