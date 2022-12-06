import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { AxiosService } from '@/util/axios/axios.service';
import { PrismaService } from '@/db/prisma/services/prisma.service';

@Module({
  imports: [
  ],
  controllers: [PlanetController],
  providers: [PlanetService, AxiosService, PrismaService]
})
export class PlanetModule { }
