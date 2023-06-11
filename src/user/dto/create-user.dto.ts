import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	IsString,
	IsOptional,
	ValidateNested,
	IsNumber,
	IsNotEmpty,
	IsEmail
} from 'class-validator';

export class UserDto {
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		firstName: string;
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		lastName: string;
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
		email: string;
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
		country: string;
}

export class CreateUserDto extends PartialType(UserDto) {
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


