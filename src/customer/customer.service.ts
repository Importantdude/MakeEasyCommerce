import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerAddressDto, UpdateCustomerDto } from './dto/update-customer.dto';
import { DefaultOrderCustomerAddressDto, DefaultOrderCustomerDto, DefaultOrderCustomerAddressDetailsDto } from './dto/enum/enum-customer.dto';
import { GetCustomerAddressDto, GetCustomerAddressShortDto, GetCustomerDto, GetCustomerShortDto } from './dto/get-customer.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerAddressDetails } from './entities/customer-address-detailed.entity';
import { CustomerAddress } from './entities/customer-address.entity';

@Injectable()
export class CustomerService {

	constructor(
		@InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
		@InjectRepository(CustomerAddress)
		private readonly customerAddressRepository: Repository<CustomerAddress>,
		@InjectRepository(CustomerAddressDetails)
    private readonly customerAddressDetailsRepository: Repository<CustomerAddressDetails>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager
	) {}

  // Requires to rebuild approach for saving entity 
  // from multiple calls ".save" to QueryBuilder
  // Reference inside create function
  async create(createCustomerDto: CreateCustomerDto): Promise<GetCustomerDto> {
    // const alreadyExists = await this.findOneBy(createCustomerDto.email, '', '');

    // if(alreadyExists.email != null){
    //   return alreadyExists;
    // }

    if(createCustomerDto.email){
      const customer = new Customer();
      const addressRes = [];

      customer.first_name = createCustomerDto.first_name;
      customer.last_name = createCustomerDto.last_name;
      customer.email = createCustomerDto.email;
      customer.store_id = createCustomerDto.store_id;
      
      if(createCustomerDto.customer_address){

        for(const address of createCustomerDto.customer_address){
          const customerAddress = new CustomerAddress();
          const customerAddressDetails = new CustomerAddressDetails()
          let details: CustomerAddressDetails;

          customerAddress.country = address.country;
          customerAddress.postal_code = address.postal_code;
          customerAddress.address_type = address.address_type;

          if(address.address_details){
            customerAddressDetails.phone_number = address.address_details.phone_number;
            customerAddressDetails.city = address.address_details.city;
            customerAddressDetails.street_name = address.address_details.street_name;
            customerAddressDetails.house_number = address.address_details.house_number;
            customerAddressDetails.company = address.address_details.company;
            customerAddressDetails.tax_id = address.address_details.tax_id;
            details = await this.customerAddressDetailsRepository.save(customerAddressDetails); 
          }
          customerAddress.address_details = details;
      
          addressRes.push(await this.customerAddressRepository.save(customerAddress));
        }

        customer.customer_address = addressRes;
        return await this.customerRepository.save(customer);
      }

      return await this.customerRepository.save(customer);
    }
    
    return null;
  }

  async findOneShort(id: number): Promise<GetCustomerShortDto> {
    return this.entityManager.findOneOrFail(Customer, {
      where: { id: id }
    })
  }

  async findOne(id: number): Promise<GetCustomerDto> {
    return await this.entityManager
      .createQueryBuilder(Customer, 'customer')
      .where('customer.id = :id', { id: id })
      .leftJoinAndSelect('customer.customer_address', 'customer_address')
      .leftJoinAndSelect('customer_address.address_details', 'address_details')
      .getOneOrFail()
  }

  async findAllCustomers(): Promise<GetCustomerShortDto[]> {
    return await this.customerRepository
    .createQueryBuilder()
    // .leftJoinAndSelect('customer.customer_address','customer_address')
    .getMany()

  }

  async findAllDetailedCustomers(): Promise<GetCustomerDto[]> {
    return await this.customerRepository
    .createQueryBuilder('customer')
    .leftJoinAndSelect('customer.customer_address','customer_address')
    .leftJoinAndSelect('customer_address.address_details','address_details')
    .getMany()
  }

  async findOneAddressShort(id: number): Promise<GetCustomerAddressShortDto> {
    return await this.entityManager
      .createQueryBuilder(CustomerAddress, 'customer_address')
      .where('customer_address.id =:id', { id: id })
      .getOneOrFail()
  }
  
  async findOneAddressDetailed(id: number): Promise<GetCustomerAddressDto> {
    return await this.entityManager
      .createQueryBuilder(CustomerAddress, 'customer_address')
      .where('customer_address.id =:id', { id: id })
      .leftJoinAndSelect('customer_address.address_details', 'address_details')
      .getOneOrFail()
  }

  async findAllAddresses(): Promise<GetCustomerAddressShortDto[]> {
    return await this.customerAddressRepository
    .createQueryBuilder('customer_address')
    .getMany()
  }
  
  async findAllDetailedAddresses(): Promise<GetCustomerAddressDto[]> {
    return await this.customerAddressRepository
    .createQueryBuilder('customer_address')
    .leftJoinAndSelect('customer_address.address_details','address_details')
    .getMany()
  }

  async update(customer_id: number, updateCustomerDto: UpdateCustomerDto): Promise<GetCustomerDto> {
    const partialEntityCustomer : UpdateCustomerDto = {
      id: customer_id,
      customer_address: null,
      ...updateCustomerDto
    }

    const addressbefore = await this.updateCustomerAddress(updateCustomerDto.customer_address);
    const customer : GetCustomerShortDto = await this.entityManager.preload(Customer, partialEntityCustomer);
    console.log('customer');
    console.log(customer);
    console.log('addressbefore');
    console.log(addressbefore);

    // const addressafter = await this.updateCustomerAddress(updateCustomerDto.customer_address);
    // const address_updated = await this.updateCustomerAddress(updateCustomerDto.customer_address);

    try {
      return {
        customer_address: await this.updateCustomerAddress(updateCustomerDto.customer_address),
        ...await this.customerRepository.save(customer)
      }
    } catch (e) {
      return e.message;
    }
      
  }

  async updateCustomerAddress(updateCustomerAddress: UpdateCustomerAddressDto[] ): Promise<GetCustomerAddressDto[]> {
    const addresses : GetCustomerAddressDto[] = [];

    try{
      for(const address of updateCustomerAddress){
        // addresses.push(await this.entityManager.preload(CustomerAddress, address));
        addresses.push((await this.customerAddressRepository.update(address.id, address)).raw)
      }

      return addresses;
      // return (await this.customerAddressRepository.update(address_id, addresses)).raw;

    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  // For future development related to 
  // Query Builder which purpose will be
  // To combine all existing request into 1
  // P.S. as much as possible
  // Think about mutations and aggregations
  async findOneBy(search_criteria: string, search_param: string, search_relation: string): Promise<GetCustomerDto> {
    return null;
  }

  async getDefaultCustomer(): Promise<GetCustomerDto> {
    return {
      id: Number(DefaultOrderCustomerDto.id), 
      first_name: DefaultOrderCustomerDto.first_name.toString().toString(), 
      last_name: DefaultOrderCustomerDto.last_name.toString(), 
      email: DefaultOrderCustomerDto.email.toString(),
      store_id: Number(DefaultOrderCustomerDto.store_id),
      customer_address: [
        {
          id: Number(DefaultOrderCustomerAddressDto.id),
          country: DefaultOrderCustomerAddressDto.country.toString(),
          postal_code: DefaultOrderCustomerAddressDto.postal_code.toString(),
          address_type: Number(DefaultOrderCustomerAddressDto.address_type),
          address_details: {
            id: Number(DefaultOrderCustomerAddressDetailsDto.id),
            city: DefaultOrderCustomerAddressDetailsDto.city.toString(),
            street_name: DefaultOrderCustomerAddressDetailsDto.street_name.toString(),
            house_number: DefaultOrderCustomerAddressDetailsDto.house_number.toString(),
            phone_number: DefaultOrderCustomerAddressDetailsDto.phone_number.toString(),
            company: DefaultOrderCustomerAddressDetailsDto.company.toString(),
            tax_id: DefaultOrderCustomerAddressDetailsDto.tax_id.toString()
          }
        }
      ]
    };
  }

  async getDefaultCustomerAddress(): Promise<GetCustomerAddressDto>{
    return {
      id: Number(DefaultOrderCustomerAddressDto.id),
      country: DefaultOrderCustomerAddressDto.country.toString(),
      postal_code: DefaultOrderCustomerAddressDto.postal_code.toString(),
      address_type: Number(DefaultOrderCustomerAddressDto.address_type),
      address_details: {
        id: Number(DefaultOrderCustomerAddressDetailsDto.id),
        city: DefaultOrderCustomerAddressDetailsDto.city.toString(),
        street_name: DefaultOrderCustomerAddressDetailsDto.street_name.toString(),
        house_number: DefaultOrderCustomerAddressDetailsDto.house_number.toString(),
        phone_number: DefaultOrderCustomerAddressDetailsDto.phone_number.toString(),
        company: DefaultOrderCustomerAddressDetailsDto.company.toString(),
        tax_id: DefaultOrderCustomerAddressDetailsDto.tax_id.toString()
      }
    }
  }

}
