import { Test, TestingModule } from '@nestjs/testing';
import { HomeService, homeSelect } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';

const mockGetHomes = [
  {
      id: 1,
      address: "Yenimahalle",
      price: 16000,
      land_size: 90,
      city: "Ankara",
      propertyType: PropertyType.RESIDENTAL,
      numberOfBedrooms: 3,
      numberOfBathrooms: 1,
      images: [
        {
          url: "img1"
        }
      ]

  },
  {
      id: 2,
      address: "Etimesgut",
      price: 10000,
      land_size: 100,
      city: "Ankara",
      propertyType: PropertyType.RESIDENTAL,
      numberOfBedrooms: 2,
      numberOfBathrooms: 1,
      images: [
        {
          url: "img1"
        }
      ]
  },
  {
      id: 3,
      address: "Yenimahalle",
      price: 26000,
      land_size: 130,
      city: "Ankara",
      propertyType: PropertyType.CONDO,
      numberOfBedrooms: 4,
      numberOfBathrooms: 2,
      images: [
        {
          url: "img1"
        }
      ]
  },
  {
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
        }
      ]
  },
]

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


describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [HomeService, 
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
              create: jest.fn().mockReturnValue(mockCreateHome)
            }
          }
        }
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });


  describe('getHomes', () => {
    const filterParams = {
      city: "Ankara",
      price: {
          gte: 10000,
      }
    }


    it('should return an array of homes', async () => {
      const mockGetHomesService = jest.fn().mockReturnValue(mockGetHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockGetHomesService);

      await service.getHomes(filterParams);
      expect(mockGetHomesService).toBeCalledWith(
        {
          select: homeSelect,
          where: filterParams,
        },
      )
    });

    it("should throw an error", async () => {
      const mockGetHomesService = jest.fn().mockReturnValue([]);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockGetHomesService);

      expect(service.getHomes(filterParams)).rejects.toThrowError(NotFoundException);
  
    })
  })

  describe("Create Home", () =>{
    const homeParams ={
      address: "Kızılay",
      price: 20000,
      land_size: 90,
      city: "Ankara",
      propertyType: PropertyType.CONDO,
      bedroom: 2,
      bathroom: 1,
      images: [
        {
          url: "img1"
        }
      ]
    }


    it("Should create a new home", async () => {
      const mockCreateHomeService = jest.fn().mockReturnValue(mockCreateHome);

      jest
      .spyOn(prismaService.home, 'create')
      .mockImplementation(mockCreateHomeService);
  
  
      await service.createHome(5, homeParams)

      expect(mockCreateHomeService).toBeCalledWith({
        data:{
          address: "Kızılay",
          price: 20000,
          land_size: 90,
          city: "Ankara",
          propertyType: PropertyType.CONDO,
          bedroom: 2,
          bathroom: 1,
          images: { create : [
            {
              url: "img1"
            }
          ]},
          user_id: 5
        }
      })

    })


  })
});
