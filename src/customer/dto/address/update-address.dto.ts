import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional,
    ValidateNested,
    IsNumber,
    IsNotEmpty,
} from 'class-validator';
import { AddressDto, DetailsDto } from './create-address.dto';

export class UpdateDetailsDto extends DetailsDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    id: number;
}

export class UpdateAddressDto extends AddressDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    id: number;
}

export class UpdateAddressDetailsDto extends UpdateAddressDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    id: number;
    @ApiProperty({ type: UpdateDetailsDto })
    @IsNotEmpty()
    @ValidateNested()
    details: UpdateDetailsDto;
}
