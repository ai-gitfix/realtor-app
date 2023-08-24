import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { homeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface filterParams {
    city?: string,
    price?: {
        gte?: number,
        lte?: number,
    }
    propertyType?: PropertyType,
}

interface createHomeParams {
    address :string;
    price : number;
    land_size : number;
    city : string;
    propertyType: PropertyType;
    bedroom : number;
    bathroom : number;
    images: {url: string}[];
}

const homeSelect = {
    id: true,
    address :true,
    price : true,
    land_size : true,
    city : true,
    propertyType: true,
    bedroom : true,
    bathroom : true,
    images: {
        select: {
            url: true,
        },
        take:1,
    }
}


@Injectable()
export class HomeService {
    
    constructor(private readonly prismaService: PrismaService){}

    async getHomes(filter : filterParams) : Promise<homeResponseDto[]>{
        const homes = await this.prismaService.home.findMany(
            {
                select: homeSelect,
                where: filter,
            },
            
        );

        if(!homes.length) throw new NotFoundException("No homes found");

        return homes.map(home => {
            const image = home.images[0].url;
            delete home.images;
            return new homeResponseDto({...home,  image})
        })
    }


    async getHome( id: number ){
        const home = await this.prismaService.home.findUnique(
            {
                select: homeSelect,
                where: {id},
            },
        )

        if(!home) throw new NotFoundException("Home not found");

        const image = home.images[0].url;
        delete home.images;
        return new homeResponseDto({...home,  image})
    }

    async createHome( {address , price,land_size,city,propertyType,bedroom,bathroom,images } : createHomeParams){


        const home = await this.prismaService.home.create({
            data: {
                address,
                price,
                land_size,
                city,
                propertyType,
                bedroom,
                bathroom,
                images: { create: images },
                user_id : 5
            }
        })


        // I can also connect home and images like this
        // const homeImages = images.map(image => ({...image, home_id: home.id})) 
        // await this.prismaService.image.createMany({
        //     data: homeImages,
        // })

        return new homeResponseDto(home);
    }

    updateHome(){}

    deleteHome(){}
}
