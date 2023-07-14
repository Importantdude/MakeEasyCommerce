import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsNumber, IsNotEmpty } from 'class-validator';
import { AddressDto, DetailsDto } from './create-address.dto';

export class GetDetailsDto extends DetailsDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class GetAddressDto extends AddressDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class GetAddressDetailsDto extends GetAddressDto {
    @ApiProperty({ type: GetDetailsDto })
    @IsNotEmpty()
    @ValidateNested()
    details: GetDetailsDto;
}

export class GetDetailedAddressDto extends GetDetailsDto {
    @ApiProperty({ type: GetAddressDto })
    @ValidateNested()
    address: GetAddressDto;
}
