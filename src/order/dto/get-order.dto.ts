// import { ApiProperty } from "@nestjs/swagger";
// import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
// import { CreateUserDto } from "src/user/dto/create-user.dto";

// export class CreateOrderDto {
//     @IsNotEmpty()
//     @IsString()
//     @ApiProperty()
//         order_type: string
//     @IsNotEmpty()
//     @ApiProperty({ type: () => CreateAddressDto })
// 	@ValidateNested()
// 		shipping_address: CreateAddressDto[];
//     @IsNotEmpty()
//     @ApiProperty({ type: () => CreateAddressDto })
//     @ValidateNested()
//         payment_address: CreateAddressDto[];
//     @IsNotEmpty()
//     @ApiProperty({ type: () => CreateUserDto })
//     @ValidateNested()
//         user: CreateUserDto[];
// }

// export class CreateAddressDto {
// 	@IsString()
//     @IsNotEmpty()
// 	@ApiProperty()
// 		firstName: string;
// 	@IsString()
//     @IsNotEmpty()
// 	@ApiProperty()
// 		lastName: string;
//     @IsString()
//     @IsNotEmpty()
//     @ApiProperty()
//         country: string;
// 	@IsString()
//     @IsNotEmpty()
// 	@ApiProperty()
// 		city: string;
// 	@IsString()
//     @IsNotEmpty()
// 	@ApiProperty()
// 		zipCode: string;
// 	@IsString()
//     @IsNotEmpty()
// 	@ApiProperty()
// 		streetName: string;
// 	@IsString()
//     @IsNotEmpty()
// 	@ApiProperty()
// 		houseNumber: string;
//     @IsOptional()
//     @IsString()
// 	@ApiProperty()
// 		phoneNumber: string;
//     @IsOptional()
//     @IsString()
//     @ApiProperty()
//         company: string;
// }
