import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type} from 'class-transformer';
import { IsArray, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Validate, ValidateNested } from 'class-validator';

export class homeResponseDto {
    id: number;
    address :string;        
    price : number;          
    land_size : number;     
    city : string;   
    propertyType: PropertyType;
    image: string;

    @Exclude()
    bedroom : number;
    @Expose({name: 'numberOfBedrooms'})
    numberOfBedrooms(){
        return this.bedroom;
    }
    @Exclude()
    bathroom : number;
    @Expose({name: 'numberOfBathrooms'})
    numberOfBathrooms(){
        return this.bathroom;
    }

    @Exclude()
    listed_date: Date;
    @Exclude()
    created_at: Date;
    @Exclude()
    updated_at: Date;
    @Exclude()
    user_id: number;

    constructor(partial: Partial<homeResponseDto>) {
        Object.assign(this, partial);
    }
}

class Image {
    @IsString()
    @IsNotEmpty()
    url: string;
}

export class homeCreateDto {

    @IsString()
    @IsNotEmpty()
    address :string; 
    
    @IsNumber()
    @IsPositive()
    price : number;

    @IsNumber()
    @IsPositive()     
    land_size : number;  

    @IsString()
    @IsNotEmpty()
    city : string;  
    
    @IsEnum(PropertyType)
    propertyType: PropertyType;

    @IsNumber()
    @IsPositive()  
    bedroom : number;

    @IsNumber()
    @IsPositive()  
    bathroom : number;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Image)
    images: Image[];
}