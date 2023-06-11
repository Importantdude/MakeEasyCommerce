import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	IsString,
	IsOptional,
	ValidateNested,
	IsNumber,
	IsNotEmpty,
	IsEmail
} from 'class-validator';
import { CreateUserDto, UserDto } from './create-user.dto';

export class GetUserDto extends UserDto {
	@IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		user_id: number;
}

export class UserShortDto {
	@IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		user_id: number;
}

