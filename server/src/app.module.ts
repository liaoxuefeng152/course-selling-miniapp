import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    CourseController,
    OrderController
  ],
  providers: [
    AppService,
    AuthService,
    CourseService,
    OrderService
  ],
})
export class AppModule {}
