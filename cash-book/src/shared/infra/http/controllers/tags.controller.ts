import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { AuthUser, CurrentUser } from '../../../auth/current-user';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { UpdateTagDto } from '../dtos/update-tag.dto';

import { CreateTag } from '../../../../modules/tags/useCases/create-tag.service';
import { FindAllTags } from '../../../../modules/tags/useCases/find-all-tags.service';
import { FindAllTagNamesFromUser } from '../../../../modules/tags/useCases/find-all-tag-names-from-user.service';
import { FindTagById } from '../../../../modules/tags/useCases/find-tag-by-id.service';
import { UpdateTag } from '../../../../modules/tags/useCases/update-tag.service';
import { DeleteTag } from '../../../../modules/tags/useCases/delete-tag.service';
import { TagViewModel } from '../view-models/tag-view-model';

@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagService: CreateTag,
    private readonly findAllTagsService: FindAllTags,
    private readonly findAllTagNamesFromUserService: FindAllTagNamesFromUser,
    private readonly findTagByIdService: FindTagById,
    private readonly updateTagService: UpdateTag,
    private readonly deleteTagService: DeleteTag,
  ) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    const tag = await this.createTagService.execute(createTagDto.name);

    return TagViewModel.toHTTP(tag);
  }

  @Get()
  async findAll() {
    const tags = await this.findAllTagsService.execute();

    return tags.map(TagViewModel.toHTTP);
  }

  @Get('names')
  async findAllTagNamesFromUser(@CurrentUser() user: AuthUser) {
    return this.findAllTagNamesFromUserService.execute(user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tag = await this.findTagByIdService.execute(id);

    return TagViewModel.toHTTP(tag);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const tag = await this.updateTagService.execute(id, updateTagDto.name);

    return TagViewModel.toHTTP(tag);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteTagService.execute(id);
  }
}
