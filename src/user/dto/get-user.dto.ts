import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	IsString,
	IsOptional,
	ValidateNested,
	IsNumber,
	IsNotEmpty,
	IsEmail
} from 'class-validator';
import { UserDto } from './create-user.dto';

export class GetUserDto extends PartialType(UserDto) {
	@IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		user_id: number;
	@IsOptional()
	@IsString()
	@ApiProperty()
		phoneNumber: string;
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		city: string;
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		zipCode: string;
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		streetName: string;
	@IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		houseNumber: number;
    @IsOptional()
    @IsString()
    @ApiProperty()
        company: string;
    @IsOptional()
    @IsString()
    @ApiProperty()
        tax_id: string;
}

export class UserShortDto {
	@IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		user_id: number;
}

