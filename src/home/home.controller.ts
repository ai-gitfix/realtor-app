import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { HomeService } from './home.service';
import { homeCreateDto, homeResponseDto, homeUpdateDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';
import { User, userInfo } from 'src/user/decorators/user.decorator';

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
        @Body() body: homeCreateDto,
        @User() user: userInfo
    ){
        console.log(user);
        return this.homeService.createHome(user.id, body);
    }

    @Put(":id")
    updateHome(
        @Param("id") id: number,
        @Body() body: homeUpdateDto
    ){
        return this.homeService.updateHome(id, body);
    }

    @Delete(":id")
    deleteHome(
        @Param("id", ParseIntPipe) id: number
    ){
        return this.homeService.deleteHome(id);
    }
}
