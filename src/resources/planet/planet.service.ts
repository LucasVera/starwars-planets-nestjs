import { PrismaService } from '@/db/prisma/services/prisma.service';
import { AxiosService } from '@/util/axios/axios.service';
import { Injectable, Logger } from '@nestjs/common';
import { Planets } from '@prisma/client';
import { GetPlanetDto, SwapiPlanet, SwapiSearchPlanetsResponse } from './planet.dto';

@Injectable()
export class PlanetService {
  private readonly logger = new Logger(PlanetService.name)
  private planetsExternalApiBaseUrl = 'https://swapi.dev/api/planets'

  constructor(
    private readonly axiosService: AxiosService,
    private readonly prismaService: PrismaService,
  ) { }

  public async getPlanetsByName(name: string) {
    // 1. search by exact name in db cache. if it's found, return that result
    // 2. if not found, search the planets external api with the name param 
    //    store the results in db and then return them

    const dbPlanet = await this.prismaService.planets.findFirst({
      where: { name }
    })
    if (dbPlanet?.name === name) {
      return this.dbPlanetsToDto([dbPlanet])
    }

    const url = `${this.planetsExternalApiBaseUrl}?search=${name}`
    const { data: {
      count,
      next,
      previous,
      results: swapiPlanets,
    } } = await this.axiosService.get<SwapiSearchPlanetsResponse>(url)

    if (!Array.isArray(swapiPlanets) || swapiPlanets.length <= 0) return []

    // Upsert to prevent re-creation of the same planets (unique field to check: name)
    const promises = this.swapiPlanetsToDbPlanets(swapiPlanets).map(planet => this.prismaService.planets.upsert({
      where: { name: planet.name },
      create: planet,
      update: planet,
    }))

    const createdPlanets = await Promise.all(promises)

    return this.dbPlanetsToDto(createdPlanets)
  }

  private dbPlanetsToDto = (dbPlanets: Planets[]): GetPlanetDto[] => dbPlanets.map(({
    id,
    name,
    diameter,
    gravity,
    terrain,
    created,
    edited,
    deletedAt,
  }) => ({
    id,
    name,
    diameter,
    gravity,
    terrain,
    created,
    edited,
    deletedAt,
  }))

  private swapiPlanetsToDbPlanets = (swapiPlanets: SwapiPlanet[]): Planets[] => swapiPlanets.map(({
    name,
    diameter,
    gravity,
    terrain,
    created,
    edited,
  }) => ({
    id: undefined,
    name,
    diameter,
    gravity,
    terrain,
    created,
    edited,
    deletedAt: undefined,
  }))
}
