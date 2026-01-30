import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ example: 'My Documents', description: 'Folder name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Parent Folder ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
