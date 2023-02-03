import { Movement } from '../entities/movement.entity';
import { Tag } from '../../tags/entities/tag.entity';

export interface MovementTag {
  id: string;
  movement: Movement;
  tag: Tag;
}

export abstract class MovementTagsRepository {
  abstract findManyByTagIds(tagIds: string[]): Promise<MovementTag[]>;
  abstract deleteManyByMovementId(movementId: number): Promise<void>;
}
