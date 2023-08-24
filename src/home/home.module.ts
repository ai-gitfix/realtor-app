import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [HomeService, {
    provide: "APP_INTERCEPTOR",
    useClass: ClassSerializerInterceptor
  }]
  ,
  controllers: [HomeController],
  imports: [PrismaModule],
})
export class HomeModule {}
