import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { GetProductAttributesCollection } from "src/attributes/dto/get-attribute.dto";
import { ProductDto } from "./create-product.dto";

// 
// This one requires all standard attributes that maintains product
// Like date, author, meta, description, no clue for now, most of them supposed to be trivial
// So therefore ...
// 
export class GetProductDto extends PartialType(ProductDto) {
    @IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		product_id: number;
    // @IsNotEmpty()
    // @ApiProperty({ type: () => GetProductEavCollection })
    // @ValidateNested()
    //     product_eav_collection: GetProductEavCollection[];
    // @IsOptional()
    // @ApiProperty({ type: () => GetProductVariantsShort })
    // @ValidateNested()
    //     product_variants: GetProductVariantsShort[];
    // here, you are welcome one day
}

export class GetProductAvailability {
    @IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		product_id: number;
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
        is_visible: boolean;    
    @IsNotEmpty()
    @ApiProperty({ type: () => GetFilteredProductEAVCollection })
	@ValidateNested()
		visibility: GetFilteredProductEAVCollection[];
}

export class GetProductBasketDto {
    @IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		product_id: number;
    @IsNotEmpty()
    @IsDecimal()
    @ApiProperty()
		total_price: number;
}
// 
// Goal is to keep this easily adoptive for easier management
// Logic Should be to retrieve product attributes collection
// 
// In This case ->
// 
// I assume that when before request each instance will have 
// Id of Attributes Group that is attached to product instance
// 
// Would be great to filter in groups
// Define where u r located in tree and make it as start point 
// Smth like eav_collection_group_ids
// 
export class GetFilteredProductEAVCollection {
    @IsArray()
    @IsNumber()
    @ApiProperty()
        product_variant_ids: number[]
    @IsArray()
    @IsNumber()
	@ApiProperty()
        eav_collection_group_ids: number[]; // I assume it supposed to be defined here
    @IsNotEmpty()
    @ApiProperty({ type: () => GetProductAttributesCollection })
    @ValidateNested()
        variant_options: GetProductAttributesCollection[];
}

export class GetProductEavCollection {
    @IsNotEmpty()
    @ApiProperty({ type: () => GetProductAttributesCollection })
    @ValidateNested()
        attributes_collection: GetProductAttributesCollection[];
}

export class GetProductVariantsShort {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
        product_id: number;
    @IsNotEmpty()
    @ApiProperty()
        product_variants_ids: number[];     
}