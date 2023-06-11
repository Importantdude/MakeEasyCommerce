import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserAddressDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DefaultOrderUserDto } from './dto/enum/enum-user.dto';
import { GetUserDto } from './dto/get-user.dto';

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
      country: DefaultOrderUserDto.country.toString()
    };
  }

  async getDefaultUserAddress(): Promise<UserAddressDto>{
    return{
      country: DefaultOrderUserDto.country.toString(),
      city: DefaultOrderUserDto.city.toString(),
      zipCode: DefaultOrderUserDto.zipCode.toString(),
      streetName: DefaultOrderUserDto.streetName.toString(),
      houseNumber: Number(DefaultOrderUserDto.houseNumber),
      phoneNumber: DefaultOrderUserDto.phoneNumber.toString(),
      company: DefaultOrderUserDto.company.toString(),
      tax_id: DefaultOrderUserDto.tax_id.toString()
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
