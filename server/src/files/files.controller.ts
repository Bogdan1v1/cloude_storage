import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Get,
  UseGuards,
  Query,
  Delete,
  Request,
  Body,
} from '@nestjs/common';
import { FilesService, FileType } from './files.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Param, NotFoundException } from '@nestjs/common';
import { Patch } from '@nestjs/common';

@Controller('files')
@ApiTags('Files')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @ApiQuery({ name: 'type', enum: FileType, required: false })
  @ApiQuery({ name: 'parentId', required: false })
  findAll(
    @Request() req: ExpressRequest & { user: { id: number } },
    @Query('type') fileType: FileType = FileType.PHOTOS,
    @Query('parentId') parentId?: string,
  ) {
    const parsedParentId = parentId ? Number(parentId) : undefined;
    return this.filesService.findAll(req.user.id, fileType, parsedParentId);
  }
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: { id: number } },
  ) {
    const file = await this.filesService.findOne(+id, req.user.id);
    if (!file) {
      throw new NotFoundException('Файл або папку не знайдено');
    }
    return file;
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiQuery({ name: 'parentId', required: false })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
    @Query('parentId') parentId: string,
    @Request() req: ExpressRequest & { user: { id: number } },
  ) {
    const parsedParentId = parentId ? Number(parentId) : null;
    return this.filesService.create(file, req.user.id, parsedParentId);
  }

  @Post('folder')
  @ApiConsumes('application/json')
  createFolder(
    @Body() createFolderDto: CreateFolderDto,
    @Request() req: ExpressRequest & { user: { id: number } },
  ) {
    return this.filesService.createFolder(createFolderDto, req.user.id);
  }

  @Delete()
  @ApiQuery({ name: 'ids', type: String })
  remove(
    @Request() req: ExpressRequest & { user: { id: number } },
    @Query('ids') ids: string,
  ) {
    return this.filesService.remove(req.user.id, ids);
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { originalName: string }, 
    @Request() req: ExpressRequest & { user: { id: number } },
  ) {
    return this.filesService.update(+id, req.user.id, body.originalName);
  }
}
