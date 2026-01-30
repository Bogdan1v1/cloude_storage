import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password (min 6 characters)',
  })
  @Length(6, 32, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full Name',
    required: false,
  })
  fullName?: string;
}
