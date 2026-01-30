import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';

export enum FileType {
  PHOTOS = 'photos',
  TRASH = 'trash',
}

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  create(
    file: Express.Multer.File,
    userId: number,
    parentId: number | null = null,
  ) {
    return this.prisma.file.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path,
        parentId: parentId,
        userId: userId, 
      },
    });
  }

  createFolder(createFolderDto: CreateFolderDto, userId: number) {
    return this.prisma.file.create({
      data: {
        filename: createFolderDto.name,
        originalName: createFolderDto.name,
        size: 0,
        mimetype: 'folder',
        path: '',
        isFolder: true,
        parentId: createFolderDto.parentId || null,
        userId: userId, 
      },
    });
  }

  findAll(userId: number, fileType: FileType, parentId?: number) {
    if (fileType === FileType.TRASH) {
      return this.prisma.file.findMany({
        where: {
          userId,
          deletedAt: { not: null },
        },
        orderBy: { updatedAt: 'desc' },
      });
    }

    return this.prisma.file.findMany({
      where: {
        userId,
        parentId: parentId || null,
        deletedAt: null,
      },
      orderBy: { isFolder: 'desc' },
    });
  }

  async remove(userId: number, ids: string) {
    const idsArray = ids.split(',').map((id) => Number(id));

    return this.prisma.file.updateMany({
      where: {
        id: { in: idsArray },
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
  async findOne(id: number, userId: number) {
    return this.prisma.file.findFirst({
      where: {
        id,
        userId,
      },
    });
  }
  async update(id: number, userId: number, newName: string) {
    return this.prisma.file.update({
      where: { id, userId }, 
      data: {
        originalName: newName,
        filename: newName, 
      },
    });
  }
}
