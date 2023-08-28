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

interface updateHomeParams {
    address? : string;
    price? : number;
    land_size? : number;
    city? : string;
    propertyType? : PropertyType;
    bedroom? : number;
    bathroom? : number;
}

export const homeSelect = {
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
        
        //Step:12: Get homes with filter
        const homes = await this.prismaService.home.findMany(
            {
                select: homeSelect,
                where: filter,
            },
            
        );

        if(!homes.length) throw new NotFoundException("No homes found");

        //Step:13: Map homes to homeResponseDto which will exclude unwanted fields
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

    async createHome( userId : number ,{address , price, land_size, city, propertyType, bedroom, bathroom, images } : createHomeParams){

        //Step:14: Create home and images and connect them
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
                user_id : userId // Step 1: Add user_id to home which comes from request
            }
        })


        // I can also connect home and images like this
        // const homeImages = images.map(image => ({...image, home_id: home.id})) 
        // await this.prismaService.image.createMany({
        //     data: homeImages,
        // })
        return new homeResponseDto(home);
    }

    //Step:14: Update home 
    async updateHome(id : number, body : updateHomeParams){

        const home = await this.prismaService.home.findUnique({where: {id}})

        if(!home) throw new NotFoundException("Home not found");

        const updatedHome = await this.prismaService.home.update({
            where: { id } ,
            data : body
        })

        return new homeResponseDto(updatedHome);
    }

    //Step:15: Complete CRUD with delete home
    async deleteHome(id : number ){
        await this.prismaService.image.deleteMany({where: {home_id: id}})

        await this.prismaService.home.delete({where: {id}})
    }

    async getRealtorByHomeId(home_id: number){
        const home = await this.prismaService.home.findUnique({
            where: {id: home_id},
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                }
            }                    
        })

        if(!home) throw new NotFoundException("Home not found");

        return home.user;
    }

    async inquireHome(home_id: number, message: string, user_id: number){
        const realtor = await this.getRealtorByHomeId(home_id);

        return await this.prismaService.message.create({
            data: {
                message,
                home_id,
                buyer_id: user_id,
                realtor_id: realtor.id,
            }
        })
    }

    async getHomeMessages(home_id: number){
        return this.prismaService.message.findMany({
            where:{ home_id },
            select: {
                message: true,
                buyer: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    }
                }
            }
        })
    }
}
