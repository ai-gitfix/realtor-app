import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { HomeService } from './home.service';
import { homeCreateDto, homeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {

    constructor(private readonly homeService: HomeService) {}

    @Get()
    getHomes(
        @Query("city") city?: string,
        @Query("minPrice") minPrice?: number,
        @Query("maxPrice") maxPrice?: number,
        @Query("propertyType") propertyType?: PropertyType,
    ): Promise<homeResponseDto[]>{

        //Step:11: Add filter to getHomes() method
        const filter = {
            ...(city && {city}),
            ...(minPrice && {price: {gte: minPrice}}),
            ...(maxPrice && {price: {lte: maxPrice}}),
            ...(propertyType && {propertyType}),
        }

        return this.homeService.getHomes(filter);
    }

    @Get(":id")
    getHome(
        @Param("id") id: number
    ){
        return this.homeService.getHome(id);
    }

    @Post()
    createHome(
        @Body() body: homeCreateDto
    ){
        return this.homeService.createHome(body);

    }

    @Put(":id")
    updateHome(){
        return this.homeService.updateHome();
    }

    @Delete(":id")
    deleteHome(){
        return this.homeService.deleteHome();
    }
}
