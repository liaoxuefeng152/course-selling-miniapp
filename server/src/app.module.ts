import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UsersModule } from './modules/users/users.module';
import { InstructorModule } from './modules/instructor/instructor.module';
import { CourseModule } from './modules/courses/course.module';
import { LiveModule } from './modules/live/live.module';
import { PlatformModule } from './modules/platform/platform.module';

@Module({
  imports: [
    UsersModule,
    InstructorModule,
    CourseModule,
    LiveModule,
    PlatformModule,
  ],
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
