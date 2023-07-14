import { DetailsEntity } from './details.interface';

export interface AddressEntity {
    country: string;
    postal_code: string;
    address_type: number;
}

export interface AddressDetailsEntity extends AddressEntity {
    address: DetailsEntity[];
}
