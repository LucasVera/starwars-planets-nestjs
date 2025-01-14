import { Controller, Delete, Get, HttpStatus, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanetService } from './planet.service';
import { GetPlanetsResponse } from './planet.dto';
import { AuthGuard } from '@/guards/auth.guard';
import { ValidIdParamGuard } from '@/guards/validIdParam.guard';

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
      this.logger.error('Error searching planets by name.', ex)
    }
  }

  @Get('/:id')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    description: 'Id of the planet to fetch. If not found, the return is a 404 with a not found message',
    type: String,
  })
  @UseGuards(AuthGuard)
  @UseGuards(ValidIdParamGuard)
  public async getPlanet(
    @Param('id') id: number,
  ) {
    const planet = await this.planetService.getPlanetById(id)
    return planet
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    description: 'Id of the planet to delete. If planet is not found, the return is a 404 with a not found message',
    type: String,
  })
  @UseGuards(AuthGuard)
  @UseGuards(ValidIdParamGuard)
  public async deletePlanet(
    @Param('id') id: number,
  ) {
    const planet = await this.planetService.deletePlanetById(id)
    return planet
  }
}
