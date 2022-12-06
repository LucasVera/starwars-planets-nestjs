import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { PlanetModule } from './resources/planet/planet.module';

@Module({
  imports: [CoreModule, PlanetModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
