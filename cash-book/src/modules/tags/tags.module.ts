import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../shared/infra/database/database.module';

import { CreateTag } from './useCases/create-tag.service';
import { DeleteTag } from './useCases/delete-tag.service';
import { FindAllTagNamesFromUser } from './useCases/find-all-tag-names-from-user.service';
import { FindAllTags } from './useCases/find-all-tags.service';
import { FindTagById } from './useCases/find-tag-by-id.service';
import { UpdateTag } from './useCases/update-tag.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateTag,
    FindTagById,
    FindAllTagNamesFromUser,
    FindAllTags,
    UpdateTag,
    DeleteTag,
  ],
  exports: [
    CreateTag,
    FindTagById,
    FindAllTagNamesFromUser,
    FindAllTags,
    UpdateTag,
    DeleteTag,
  ],
})
export class TagsModule {}
