import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DefaultOrderUserDto } from './dto/enum/enum-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { CreateAddressDto } from 'src/order/dto/create-order.dto';

@Injectable()
export class UserService {
  create(CreateUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async getDefaultUser(): Promise<GetUserDto> {
    return {
      user_id: Number(DefaultOrderUserDto.user_id), 
      firstName: DefaultOrderUserDto.firstName.toString().toString(), 
      lastName: DefaultOrderUserDto.lastName.toString(), 
      email: DefaultOrderUserDto.email.toString(), 
      country: DefaultOrderUserDto.country.toString(), 
      phoneNumber: DefaultOrderUserDto.phoneNumber.toString(), 
      city: DefaultOrderUserDto.city.toString(), 
      zipCode: DefaultOrderUserDto.zipCode.toString(), 
      streetName: DefaultOrderUserDto.streetName.toString(), 
      houseNumber: Number(DefaultOrderUserDto.houseNumber), 
      company: DefaultOrderUserDto.company.toString(), 
      tax_id: DefaultOrderUserDto.tax_id.toString(), 
    };
  }

  async getDefaultUserAddress(): Promise<CreateAddressDto>{
    const user = await this.getDefaultUser();
    
    return{
      user: [
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            country: user.country
        }
      ],
      city: user.city,
      zipCode: user.zipCode,
      streetName: user.streetName,
      houseNumber: user.houseNumber,
      phoneNumber: user.phoneNumber,
      company: user.company,
      tax_id: user.tax_id
      
    }
  }  
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
