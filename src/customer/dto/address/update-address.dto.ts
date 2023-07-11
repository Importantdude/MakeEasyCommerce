import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
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
    @ApiProperty({ type: UpdateDetailsDto })
    @ValidateNested()
    details: UpdateDetailsDto;
}
