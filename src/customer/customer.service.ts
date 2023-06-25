import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { DefaultOrderCustomerAddressDto, DefaultOrderCustomerDto, DefaultOrderCustomerAddressDetailsDto } from './dto/enum/enum-customer.dto';
import { GetAddressDetailsDto, GetCustomerAddressDto, GetCustomerDto } from './dto/get-customer.dto';
import { AddressDetailsDto, AddressDto } from './dto/address/customer-address.dto';
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
        // createCustomerDto.customer_address.map( async (address) => {
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
        console.log(addressRes);
        customer.customer_address = addressRes;
        return await this.customerRepository.save(customer);

      }

      const partialCustomerData = await this.customerRepository.save(customer);

      console.log(addressRes);
      return {
        id: partialCustomerData.id,
        first_name: partialCustomerData.first_name,
        last_name: partialCustomerData.last_name,
        email: partialCustomerData.email,
        store_id: partialCustomerData.store_id,
        customer_address: null
      }
    }
    
    return null;

  }

  async findAll(): Promise<GetCustomerDto[]> {
    return this.entityManager.find(Customer, {
      relations: ['customer_address','customer_address.address_details']
    })
  }

  async findOne(id: number): Promise<GetCustomerDto> {
    return this.entityManager.findOneOrFail(Customer, {
      where: { id: id },
      relations: ['customer_address','customer_address.address_details']
    })
  }

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

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
