import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService } from './home.service';
import { PropertyType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';


const mockUser = {
  id: 40,
  name: "Mutti",
  email: "m@hotmail.com",
  phone: "0505 050 05 05",
}

const mockCreateHome = {
  id: 4,
  address: "Kızılay",
  price: 20000,
  land_size: 90,
  city: "Ankara",
  propertyType: PropertyType.CONDO,
  numberOfBedrooms: 2,
  numberOfBathrooms: 1,
  images: [
    {
      url: "img1"
    },
    {
      url: "img2"
    }
  ]
}

describe('HomeController', () => {
  let controller: HomeController;
  let homeService : HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [{
        provide: HomeService,
        useValue: {
          getHomes: jest.fn().mockReturnValue([]),
          getRealtorByHomeId : jest.fn().mockReturnValue(mockUser),
          updateHome: jest.fn().mockReturnValue(mockCreateHome)
        }
      },PrismaService ]
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService)
  });


  describe("Get Homes", () =>{


    it("it should create filter correctly",async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);

      jest.spyOn(homeService, "getHomes").mockImplementation(mockGetHomes)

      await controller.getHomes("Ankara", undefined , 15000  );

      expect(mockGetHomes).toBeCalledWith({
        city: "Ankara",
        price : {
          lte: 15000
        }
      })

    })

  })


  describe("Update Home", () => {
    const  userParams = {
      id: 55,
      name: "mutti",
      iat: 1235,
      exp: 125
  }

    it("should throw unauthorized error because of the realtor user mismatch", async () => { 
      expect(controller.updateHome(5 , { address : "Istanbul" }, userParams)).rejects.toThrow(UnauthorizedException)

    })

    it("should update the home", async () => { 
      const mockUpdateHome = jest.fn().mockReturnValue(mockCreateHome);

      jest.spyOn(homeService, "updateHome").mockImplementation(mockUpdateHome)

      await controller.updateHome( 5 , { address : "Istanbul"}, {...userParams, id: 40})

      // expect(mockUpdateHome).toBeCalled();
      expect(mockUpdateHome).toBeCalledWith( 5 ,{ address : "Istanbul" })

    }) 

  })
});
