export enum DefaultOrderCustomerDto {
    id = 1,
    first_name = 'MEC_Name',
    last_name = 'MEC_Surname',
    email = 'test@mec.com',
    store_id = 1,
}

export enum DefaultOrderCustomerAddressDto {
    id = 1,
    country = 'Netherlands',
    postal_code = 'AA-1234',
    address_type = 1,
}

export enum DefaultOrderCustomerAddressDetailsDto {
    id = 1,
    city = 'Amsterdam',
    street_name = 'some street',
    house_number = '102',
    phone_number = '+000 1234567',
    company = 'SIA SomeCompany',
    tax_id = '12110098765',
}
