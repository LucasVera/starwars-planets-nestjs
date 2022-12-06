import { ApiProperty } from "@nestjs/swagger";

export class GetPlanetsResponse {
  @ApiProperty({ type: () => [GetPlanetDto] })
  data: GetPlanetDto[]
}

export class GetPlanetDto {
  @ApiProperty({
    description: 'Local id of the planet',
    example: 24,
  })
  id: number

  @ApiProperty({
    description: 'Name of the planet',
    example: 'Tatooine',
  })
  name: string

  @ApiProperty({
    description: 'Diameter of the planet',
    example: '100',
  })
  diameter: string

  @ApiProperty({
    description: 'Gravity of the planet',
    example: '2',
  })
  gravity: string

  @ApiProperty({
    description: 'Type of terrain of the planet',
    example: '24',
  })
  terrain: string

  @ApiProperty({
    description: 'Created date and time of the planet',
    example: '24',
  })
  created: string

  @ApiProperty({
    description: 'Edited date and time of the planet',
    example: '24',
  })
  edited: string

  @ApiProperty({
    description: 'Planet deleted at timestamp',
    example: '24',
  })
  deletedAt?: string
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
