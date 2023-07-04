import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerAddressDto, UpdateCustomerDto } from './dto/update-customer.dto';
import { DefaultOrderCustomerAddressDto, DefaultOrderCustomerDto, DefaultOrderCustomerAddressDetailsDto } from './dto/enum/enum-customer.dto';
import { GetAddressCustomerDto, GetCustomerAddressDto, GetCustomerAddressShortDto, GetCustomerDto, GetCustomerShortDto } from './dto/get-customer.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerAddressDetails } from './entities/customer-address-detailed.entity';
import { CustomerAddress } from './entities/customer-address.entity';

@Injectable()
export class CustomerService {

	constructor(
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
            details = await this.entityManager.save(CustomerAddressDetails, customerAddressDetails);
            // details = await this.customerAddressDetailsRepository.save(customerAddressDetails); 
          }
          customerAddress.address_details = details;
      
          addressRes.push(await this.entityManager.save(CustomerAddress, customerAddress))
          // addressRes.push(await this.customerAddressRepository.save(customerAddress));
        }

        customer.customer_address = addressRes;
        return await this.entityManager.save(Customer, customer);
        // return await this.customerRepository.save(customer);
      }

      return await this.entityManager.save(Customer, customer);
      // return await this.customerRepository.save(customer);
    }
    
    return null;
  }

  // Customer
  async findOneShort(id: number): Promise<GetCustomerShortDto> {
    try{
      return await this.entityManager.findOneOrFail(Customer, {
        where: { id: id }
      });
    }catch(e){
      return e.message;
    }
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
    return await this.entityManager
    .createQueryBuilder(Customer, 'customer')
    // .leftJoinAndSelect('customer.customer_address','customer_address')
    .getMany()

  }

  async findAllDetailedCustomers(): Promise<GetCustomerDto[]> {
    return await this.entityManager
    .createQueryBuilder(Customer, 'customer')
    .leftJoinAndSelect('customer.customer_address','customer_address')
    .leftJoinAndSelect('customer_address.address_details','address_details')
    .getMany()
  }

  // Address
  // Maybe I'll export it to another file
  // Maybe
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
    return await this.entityManager
    .createQueryBuilder(CustomerAddress, 'customer_address')
    .getMany()
  }
  
  async findAllDetailedAddresses(): Promise<GetCustomerAddressDto[]> {
    return await this.entityManager
    .createQueryBuilder(CustomerAddress, 'customer_address')
    .leftJoinAndSelect('customer_address.address_details','address_details')
    .getMany()
  }

  // Update Customer
  async update(customer_id: number, updateCustomerDto: UpdateCustomerDto): Promise<GetCustomerDto> {
    const partialEntityCustomer : UpdateCustomerDto = {
      id: customer_id,
      customer_address: null,
      ...updateCustomerDto
    }

    const customer : GetCustomerShortDto = await this.entityManager.preload(Customer, partialEntityCustomer);

    try {
      if(this.entityManager.hasId(customer)){
        return {
          customer_address: await this.updateCustomerAddress(updateCustomerDto.customer_address),
          ...await this.entityManager.save(Customer, customer)
        }  
      }
    } catch (e) {
      return e.message;
    }
      
  }

  // Update Address and it's details
  async updateCustomerAddress(updateCustomerAddress: UpdateCustomerAddressDto[] ): Promise<GetCustomerAddressDto[]> {
    const addresses : GetCustomerAddressDto[] = [];

    try{
      for(const address of updateCustomerAddress){
        addresses.push((await this.entityManager.update(CustomerAddress, address.id, address)).raw)
      }

      return addresses;

    } catch (e) {
      return e.message;
    }
  }

  // Remove Customer
  async remove(id: number) {
    const customer: GetCustomerDto = await this.findOne(id);

    try{

      const customer_address: GetAddressCustomerDto[] = this.generateReversingCustomerAddress(customer);
      const removed_customer = (await this.entityManager.delete(Customer, customer.id)).affected;

      if(removed_customer < 1){
        return 'Something went wrong';
      }

      const removed_details = await this.deleteCustomerAddresses(customer_address);

      if(removed_details < 1){
        return 'Customer was successfully removed';
      }

      return {
        customer_id: id, 
        message: 'Customer was successfully removed including data related to it'
      };

    }catch(e){
      return e.message;
    }
  }

  // Remove Customer
  async removeAddress(id: number) {
    try{
      return (await this.entityManager.delete(CustomerAddressDetails, id)).affected
    }catch(e){
      return e.message;
    }
  }

  // Delete Many Addresses and it's details
  async deleteCustomerAddresses(getCustomerAddressDto: GetCustomerAddressDto[] ): Promise<number> {
    let affected = 0;
    try{
      for(const address of getCustomerAddressDto){
        affected += (await this.entityManager.delete(CustomerAddressDetails, address.address_details.id)).affected
      }

      return affected;

    } catch(e) {
      return e.message;
    }
  }

  // For future development related to 
  // Query Builder which purpose will be
  // To combine all existing request into 1
  // P.S. as much as possible
  // Think about mutations and aggregations
  async findOneBy(search_criteria: string, search_param: string, search_relation: string): Promise<GetCustomerDto> {
    return null;
  }

  // Gets DEFAULT DATA for entity
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

  // Basically inverts relation Customer -> Address 
  // to Address -> Customer
  private generateReversingCustomerAddress(customer: GetCustomerDto){
    const generated: GetAddressCustomerDto[] = customer.customer_address.map( (address) => {
      if(address.address_details.id != null){
        return {
          customer: customer,
          address_details: address.address_details,
          ...address
        }
      }
    })

    return generated;    
  }
}
