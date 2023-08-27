import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, ValidationPipe, UnauthorizedException, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { homeCreateDto, homeResponseDto, homeUpdateDto, inquireDto } from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, userInfo } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from 'src/guards/auth.guard';

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

    //Step 21: Add userType authorization to createHome() method with nestjs guards
    @Roles(UserType.ADMIN, UserType.REALTOR)
    @Post()
    createHome(
        @Body() body: homeCreateDto,
        //Step:16: Add @User() decorator to createHome() method it will create a home with that user id if it is realtor or admin
        @User() user: userInfo
    ){
        // console.log(user);
        // return this.homeService.createHome(user.id, body);
        return "created"
    }

    @Roles(UserType.ADMIN, UserType.REALTOR)
    @Put(":id")
    async updateHome(
        @Param("id") id: number,
        @Body() body: homeUpdateDto,
        @User() user: userInfo
    ){
        //Step 19 : Add authorization to updateHome() method
        const realtor = await this.homeService.getRealtorByHomeId(id);
        if(user.id !== realtor.id){
            throw new UnauthorizedException("You are not authorized to update this home");
        }

        return this.homeService.updateHome(id, body);
    }

    @Roles(UserType.ADMIN, UserType.REALTOR)
    @Delete(":id")
    async deleteHome(
        @Param("id", ParseIntPipe) id: number,
        @User() user: userInfo
    ){
        //Step 20 : Add authorization to deleteHome() method
        const realtor = await this.homeService.getRealtorByHomeId(id);
        if(user.id !== realtor.id){
            throw new UnauthorizedException("You are not authorized to delete this home");
        }
        return this.homeService.deleteHome(id);
    }

    // Step 23: Sending message to realtor from buyer with inquireHome() service method
    @Roles(UserType.BUYER)
    @Post("/inquire/:id")
    async inquireHome(
        @Param("id", ParseIntPipe) id: number,
        @Body() {message}: inquireDto, //message is destructured from body
        @User() user: userInfo
    ){
        return this.homeService.inquireHome(id, message, user.id);
    }

    // Step 24: Realtor can view messages for her home with getMessages() service method
    @Roles(UserType.REALTOR)
    @Get("/:id/messages")
    async getMessages(
        @Param("id", ParseIntPipe) home_id: number,
        @User() user: userInfo
    ){
        const realtor = await this.homeService.getRealtorByHomeId(home_id);
        if(user.id !== realtor.id){
            throw new UnauthorizedException("You are not authorized to view messages for this home");
        }

        return this.homeService.getHomeMessages(home_id);
    }

}
