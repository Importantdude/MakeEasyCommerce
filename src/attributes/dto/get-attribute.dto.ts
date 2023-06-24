import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

// Plan 
// There should be smth like Attribute tree for easier management 
// There should be a default list of attributes that customer will NOT be able to manage from Front End
// Could be that I'll realize it via migrations that will run during project build
// Final Thoughts
// Let's say there will be btn in Admin "Product Attribute" -> "Visibility settings" -> "In_Stock?, "Visible_In"(search,catalog,not-visible)
// Customer still should be able to add another attributes alongside with other options on any tree level !!!

// Re-do it
export class GetAttributeDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
        attribute_group_id: number;
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
        attribute_id: number;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        attribute_value: string;
}

export class GetProductAttributesCollection {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
        attribute_id: number;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        attribute_code: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        attribute_value: string;
}
