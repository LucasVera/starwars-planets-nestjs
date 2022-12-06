import { Controller, Get, HttpStatus, Logger, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanetService } from './planet.service';
import { GetPlanetsResponse } from './planet.dto';

@ApiTags('Planet')
@Controller('planet')
export class PlanetController {
  private readonly logger = new Logger(PlanetController.name)
  constructor(private readonly planetService: PlanetService) { }

  @Get('/search')
  @ApiResponse({ status: HttpStatus.OK, type: GetPlanetsResponse })
  @ApiQuery({
    name: 'name',
    type: String,
    allowEmptyValue: false,
    description: 'Name of the planet to search'
  })
  @ApiQuery({
    name: 'nextPage',
    type: Number,
    allowEmptyValue: false,
    required: false,
    description: 'Next page number to query results',
  })
  public async getPlanets(
    @Query('name') name: string,
    @Query('nextPage') nextPage?: number,
  ): Promise<GetPlanetsResponse> {
    try {
      const planetsResult = await this.planetService.getPlanetsByName(name, nextPage)
      return planetsResult
    }
    catch (ex) {
      console.log(ex)
      this.logger.error('Error searching planets by name.', ex)
    }
  }
}
