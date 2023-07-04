export enum DefaultOrderTypeDto {
    GENERAL_ORDER = 1,
    FREE_ORDER = 2,
    BUSINESS_ORDER = 3,
    GROUPED_ORDER = 4,
    TEST_ORDER = 5,
}

export enum DefaultOrderDto {
    order_id = 1,
    order_type = 'FREE_ORDER',
    basket_id = 1,
}
