import { PrismaService } from '@/db/prisma/services/prisma.service';
import { AxiosService } from '@/util/axios/axios.service';
import { Injectable, Logger } from '@nestjs/common';
import { Planets } from '@prisma/client';
import { GetPlanetDto, GetPlanetsResponse, SwapiPlanet, SwapiSearchPlanetsResponse } from './planet.dto';

@Injectable()
export class PlanetService {
  private readonly logger = new Logger(PlanetService.name)
  private planetsExternalApiBaseUrl = 'https://swapi.dev/api/planets'

  constructor(
    private readonly axiosService: AxiosService,
    private readonly prismaService: PrismaService,
  ) { }

  public async getPlanetsByName(name: string, nextPageNum?: number): Promise<GetPlanetsResponse> {
    // 1. search by exact name in db cache. if it's found, return that result
    // 2. if not found, search the planets external api with the name param 
    //    store the results in db and then return them
    // 3. if results of api are more than 10, show "next page"

    const dbPlanet = await this.prismaService.planets.findFirst({
      where: { name }
    })
    if (dbPlanet?.name === name) {
      return {
        data: this.dbPlanetsToDto([dbPlanet]),
        total: 1,
        currentPageSize: 1,
        nextPage: null,
      }
      // return this.dbPlanetsToDto([dbPlanet])
    }

    let url = `${this.planetsExternalApiBaseUrl}?search=${name}`
    if (nextPageNum) url += `&page=${nextPageNum}`

    const { data: {
      count,
      next,
      results: swapiPlanets,
    } } = await this.axiosService.get<SwapiSearchPlanetsResponse>(url)

    if (!Array.isArray(swapiPlanets) || swapiPlanets.length <= 0) return {
      data: [],
      total: 0,
      currentPageSize: 0,
      nextPage: null,
    }

    // Upsert to prevent re-creation of the same planets (unique field to check: name)
    const promises = this.swapiPlanetsToDbPlanets(swapiPlanets).map(planet => this.prismaService.planets.upsert({
      where: { name: planet.name },
      create: planet,
      update: planet,
    }))

    const createdPlanets = await Promise.all(promises)

    let nextPage = null
    if (next) nextPage = Number(next.slice(-1))

    return {
      data: this.dbPlanetsToDto(createdPlanets),
      total: count,
      currentPageSize: createdPlanets.length,
      nextPage,
    }
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
