import { ApiProperty } from "@nestjs/swagger";

export class GetPlanetsResponse {
  @ApiProperty({ type: () => [GetPlanetResultDto] })
  data: GetPlanetResultDto[]
}

export class GetPlanetDto {
  @ApiProperty({
    description: 'Name of the planet to search',
    example: 'tatooine',
  })
  name: string
}

export class GetPlanetResultDto {
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
}
