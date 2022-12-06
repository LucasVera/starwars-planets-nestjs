import { ApiProperty } from "@nestjs/swagger";

export class GetPlanetsResponse {
  @ApiProperty({ type: () => [GetPlanetDto] })
  data: GetPlanetDto[]
  total: number
  currentPageSize: number
  nextPage: number | null
}

export class GetPlanetDto {
  @ApiProperty({
    description: 'Local id of the planet',
    example: 24,
  })
  id: number

  @ApiProperty({
    description: 'Name of the planet',
    example: 'Dantooine',
  })
  name: string

  @ApiProperty({
    description: 'Diameter of the planet',
    example: '9830',
  })
  diameter: string

  @ApiProperty({
    description: 'Gravity of the planet',
    example: '1 standard',
  })
  gravity: string

  @ApiProperty({
    description: 'Type of terrain of the planet',
    example: 'oceans, savannas, mountains, grasslands',
  })
  terrain: string

  @ApiProperty({
    description: 'Created date and time of the planet',
    example: '2014-12-10T17:23:29.896000Z',
  })
  created: string

  @ApiProperty({
    description: 'Edited date and time of the planet',
    example: '2014-12-10T17:23:29.896000Z',
  })
  edited: string

  @ApiProperty({
    description: 'Planet deleted at timestamp. null if planet has not been deleted',
    example: 'null',
  })
  deletedAt?: string
}

export class GetPlanetResponse {
  @ApiProperty({ type: () => GetPlanetDto })
  data: GetPlanetDto
}

export interface SwapiSearchPlanetsResponse {
  count: number
  next: string | null,
  previous: string | null,
  results: SwapiPlanet[]
}

export class SwapiPlanet {
  name: string
  rotation_period: string
  orbital_period: string
  diameter: string
  climate: string
  gravity: string
  terrain: string
  surface_water: string
  population: string
  residents: [string]
  films: [string]
  created: string
  edited: string
  url: string
}
