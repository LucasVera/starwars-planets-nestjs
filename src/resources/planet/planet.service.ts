import { PrismaService } from '@/db/prisma/services/prisma.service';
import { AxiosService } from '@/util/axios/axios.service';
import { NotFoundException } from '@/util/exceptions/notFound.exception';
import { Injectable, Logger } from '@nestjs/common';
import { Planet } from '@prisma/client';
import { GetPlanetDto, GetPlanetsResponse, SwapiPlanet, SwapiSearchPlanetsResponse } from './planet.dto';

@Injectable()
export class PlanetService {
  private readonly logger = new Logger(PlanetService.name)
  private planetsExternalApiBaseUrl = 'https://swapi.dev/api/planets'

  constructor(
    private readonly axiosService: AxiosService,
    private readonly prismaService: PrismaService,
  ) { }

  /**
   * Gets planets by name. First it looks into the db. If it finds an exact name match,
   * then that planet gets returned. If not, it looks into the swapi planets api searching
   * for that name. Then, it formats and returns the results
   * @param name (string) - Name to filter the planets by
   * @param nextPageNum (number) - Page to query (in case of pagination)
   * @returns PlanetsResponse with pagination info and the results
   */
  public async getPlanetsByName(name: string, nextPageNum?: number): Promise<GetPlanetsResponse> {
    // 1. search by exact name in db cache. if it's found, return that result
    // 2. if not found, search the planets external api with the name param 
    //    store the results in db and then return them
    // 3. if results of api are more than 10, show "next page"

    const dbPlanet = await this.prismaService.planet.findFirst({
      where: { name }
    })
    if (dbPlanet?.name === name) {
      this.logger.debug(`Returning planet from db. id: ${dbPlanet.id}, name: ${dbPlanet.name}`)
      return {
        data: this.dbPlanetsToDto([dbPlanet]),
        total: 1,
        currentPageSize: 1,
        nextPage: null,
      }
    }

    let url = `${this.planetsExternalApiBaseUrl}?search=${name}`
    if (nextPageNum) url += `&page=${nextPageNum}`

    const { data: {
      count,
      next,
      results: swapiPlanets,
    } } = await this.axiosService.get<SwapiSearchPlanetsResponse>(url)
    if (!Array.isArray(swapiPlanets) || swapiPlanets.length <= 0) {
      this.logger.debug(`No planet found for name: ${name}.`)
      return {
        data: [],
        total: 0,
        currentPageSize: 0,
        nextPage: null,
      }
    }

    // Upsert to prevent re-creation of the same planets (unique field to check: name)
    const promises = this.swapiPlanetsToDbPlanets(swapiPlanets).map(planet => this.prismaService.planet.upsert({
      where: { name: planet.name },
      create: planet,
      update: { ...planet, deletedAt: null }, // when soft-delete, reset the "deleteAt" in case there is one
    }))

    const createdPlanets = await Promise.all(promises)

    let nextPage = null
    if (next) nextPage = Number(next.slice(-1))

    this.logger.debug(`Created or updated ${createdPlanets.length} planets in db for search name: ${name}`)

    return {
      data: this.dbPlanetsToDto(createdPlanets),
      total: count,
      currentPageSize: createdPlanets.length,
      nextPage,
    }
  }

  /**
   * Finds a planet by id. If not found, throws an error
   * @param id (number) - Id of the planet
   * @returns Planet
   */
  public async getPlanetById(id: number): Promise<GetPlanetDto> {
    const planet = await this.prismaService.planet.findFirst({ where: { id } })
    if (!planet || !planet.id) throw new NotFoundException()

    this.logger.debug(`Found planet in db with id ${id}`)
    return this.dbPlanetsToDto([planet])[0]
  }

  /**
   * Soft-deletes a planet by id. Instead of deleting, it updates the property "deletedAt"
   * And treats it as deleted for the purposes of querying. but it remains in the database
   * If planet with that id is not found, throws an error
   * @param id (number) - Id of the planet
   * @returns Planet
   */
  public async deletePlanetById(id: number): Promise<Planet> {
    // check if planet is found
    await this.getPlanetById(id);

    const deletedPlanet = await this.prismaService.planet.delete({
      where: { id }
    })

    this.logger.debug(`Deleted planet in db with id ${id}`)
    return deletedPlanet
  }

  private dbPlanetsToDto = (dbPlanets: Planet[]): GetPlanetDto[] => dbPlanets.map(({
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

  private swapiPlanetsToDbPlanets = (swapiPlanets: SwapiPlanet[]): Planet[] => swapiPlanets.map(({
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
