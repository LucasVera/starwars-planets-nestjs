import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanetService } from './planet.service';
import { GetPlanetDto, GetPlanetsResponse } from './planet.dto';

@ApiTags('Planet')
@Controller('planet')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) { }

  @Get('/search')
  @ApiResponse({ status: HttpStatus.OK, type: GetPlanetsResponse })
  public async getPlanets(
    @Query('name') name?: string,
  ): Promise<GetPlanetsResponse> {
    try {
      const planets = await this.planetService.getPlanetsByName(name)
      return {
        data: planets,
      }
    }
    catch (ex) {

    }
  }
}
