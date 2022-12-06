import { PrismaService } from '@/db/prisma/services/prisma.service';
import { AxiosService } from '@/util/axios/axios.service';
import { Injectable, Logger } from '@nestjs/common';
import { GetPlanetResultDto } from './planet.dto';

@Injectable()
export class PlanetService {
  private readonly logger = new Logger(PlanetService.name)
  private PlanetsExternalApiBaseUrl = 'https://swapi.dev/api/planets'

  constructor(
    private readonly axiosSerivce: AxiosService,
    private readonly prismaService: PrismaService,
  ) { }

  public async getPlanetsByName(name?: string) {
    // 1. search by exact name in db cache. if it's found, return that result
    // 2. if not found, search the planets external api with the name param 
    //    store the results in db and then return them

    return [new GetPlanetResultDto()]
  }
}
