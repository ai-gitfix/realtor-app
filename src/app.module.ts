import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [AppService,
    { provide: 'APP_INTERCEPTOR', useClass: UserInterceptor },
    { provide: 'APP_GUARD', useClass: AuthGuard }, //Step 22: Add AuthGuard to providers array in app.module.ts file because we are controlling the user in every request and if we dont want to validate anything it will already return true and be validated anyway
  ],
})
export class AppModule {}
