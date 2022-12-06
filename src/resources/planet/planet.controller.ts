import { Controller } from '@nestjs/common';
import { PlanetService } from './planet.service';

@Controller('planet')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}
}
