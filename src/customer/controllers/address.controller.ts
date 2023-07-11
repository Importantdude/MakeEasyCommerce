import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    Post,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { CreateAddressDto } from '../dto/address/create-address.dto';
import {
    GetAddressDetailsDto,
    GetAddressDto,
} from '../dto/address/get-address.dto';
import { AddressService } from '../services/address.service';
import { UpdateAddressDetailsDto } from '../dto/address/update-address.dto';
// import { UpdateAddressDto } from './dto/update-customer.dto';

@ApiTags('Address')
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Post('new')
    @ApiOperation({
        summary: 'Create Address',
        description: 'Create (specifically) address and details entities',
    })
    @ApiBody({
        type: CreateAddressDto,
        description: 'Create Address with details',
        required: true,
    })
    async create(
        @Body() createAddressDto: CreateAddressDto,
    ): Promise<GetAddressDetailsDto> {
        return await this.addressService.create({
            createAddressDto: createAddressDto,
        });
    }

    // This one in future MUST have option
    // filter by page number and amount on page
    // Most likely this will be separate route
    // But this I'll keep for fun (Once I'll generate 1 million baskets) hehe
    @Get('get/all')
    @ApiOperation({
        summary: 'Find All Addresses',
        description: 'Get specifically data all addresses, good luck!',
    })
    @ApiOkResponse({
        description: 'All Addresses',
        type: [GetAddressDto],
    })
    async findAllAddresses(): Promise<GetAddressDto[]> {
        return await this.addressService.findAll();
    }

    // This one in future MUST have option
    // filter by page number and amount on page
    // Most likely this will be separate route
    // But this I'll keep for fun (Once I'll generate 1 million baskets) hehe
    @Get('get/details/all')
    @ApiOperation({
        summary: 'Find All Addresses and its details',
        description: 'Get data of all addresses and its details, good luck!',
    })
    @ApiOkResponse({
        description: 'All Addresses and details',
        type: [GetAddressDetailsDto],
    })
    async findAllAddressDetails(): Promise<GetAddressDetailsDto[]> {
        return await this.addressService.findAllAddressesDetails();
    }

    // Missing proper response body
    // I'm to laze to do that when I'm typing this...
    @Patch('update/:id')
    @ApiOperation({
        summary: 'Update Address&details by ID',
        description: 'Update address data and its details by id',
    })
    @ApiBody({
        type: UpdateAddressDetailsDto,
        description: 'Address details',
        required: true,
    })
    async updateCustomer(
        @Param('id') id: string,
        @Body() updateAddressDetailsDto: UpdateAddressDetailsDto,
    ): Promise<any> {
        return await this.addressService.update({
            id: +id,
            updateAddressDto: updateAddressDetailsDto,
        });
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete Address by ID',
        description: 'Delete address data and its details by id',
    })
    async removeBasket(@Param('id') id: string): Promise<number> {
        return await this.addressService.remove({ id: +id });
    }
}
