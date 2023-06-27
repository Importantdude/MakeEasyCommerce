import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerAddressDto, UpdateCustomerDto } from './dto/update-customer.dto';
import { DefaultOrderCustomerAddressDto, DefaultOrderCustomerDto, DefaultOrderCustomerAddressDetailsDto } from './dto/enum/enum-customer.dto';
import { GetAddressDetailsDto, GetCustomerAddressDto, GetCustomerDto, GetCustomerShortDto } from './dto/get-customer.dto';
import { AddressDetailsDto, AddressDto } from './dto/address/customer-address.dto';
import { Any, EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerAddressDetails } from './entities/customer-address-detailed.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { of } from 'rxjs';

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

      const partialCustomerData = await this.customerRepository.save(customer);

      return partialCustomerData;

      // INVESTIGATE
      // return await this.customerRepository
      //           .createQueryBuilder()
      //           .relation(Customer,'customer_address')
      //           .relation(CustomerAddress,'address_details')
      //           .of(customer)
      //           .add(customer)

    }
    
    return null;
  }

  async findAll(): Promise<GetCustomerDto[]> {
    return await this.customerRepository
    .createQueryBuilder('customer')
    .leftJoinAndSelect('customer.customer_address','customer_address')
    .leftJoinAndSelect('customer_address.address_details','address_details')
    .getMany()
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

  async update(customer_id: number, updateCustomerDto: UpdateCustomerDto): Promise<GetCustomerDto> {
    const partialEntityCustomer : UpdateCustomerDto = {
      id: customer_id,
      customer_address: null,
      ...updateCustomerDto
    }

    const customer : GetCustomerShortDto = await this.entityManager.preload(Customer, partialEntityCustomer);
    
    const address_updated = await this.updateCustomerAddress(customer_id, updateCustomerDto.customer_address);
    // console.log(res);
    try {
      return {
        customer_address: address_updated,
        ...await this.customerRepository.save(customer)
      }
    } catch (e) {
      return e.message;
    }
      
  }

  async updateCustomerAddress(customer_id: number, updateCustomerAddress: UpdateCustomerAddressDto[] ): Promise<GetCustomerAddressDto[]> {
    const addresses : GetCustomerAddressDto[] = [];
    
    try{
      for(const address of updateCustomerAddress){
        addresses.push(await this.entityManager.preload(CustomerAddress, address));
      }

      return await this.customerAddressRepository.save(addresses);

    } catch (e) {
      return e.message;
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
// const customer_address = await this.entityManager
//   .createQueryBuilder(CustomerAddress, 'customer_address')
//   .leftJoinAndSelect('customer_address.customer', 'customer')
//   .where( "customer_address.customer_id = :customer_id", { customer_id: customer_id } )
//   .getMany()
// for(let address of customer_address){
//   console.log(address.id);
//   console.log(updateCustomerAddress.filter( (customer_address) => customer_address.address_details.id == address.id ));
//   console.log(123);
//   address.address_details = updateCustomerAddress.filter( (customer_address) => customer_address.address_details.id == address.id ).shift().address_details
// }