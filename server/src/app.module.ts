import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './modules/users/users.module';
import { InstructorModule } from './modules/instructor/instructor.module';
import { CourseModule } from './modules/courses/course.module';
import { LiveModule } from './modules/live/live.module';
import { PlatformModule } from './modules/platform/platform.module';
import { OrderModule } from './modules/orders/order.module';
import { StudyModule } from './modules/study/study.module';
import { FavoriteModule } from './modules/favorites/favorite.module';

@Module({
  imports: [
    UsersModule,
    InstructorModule,
    CourseModule,
    LiveModule,
    PlatformModule,
    OrderModule,
    StudyModule,
    FavoriteModule,
  ],
  controllers: [
    AppController,
    AuthController,
  ],
  providers: [
    AppService,
    AuthService,
  ],
})
export class AppModule {}
