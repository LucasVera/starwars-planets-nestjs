import { PrismaService } from '@/db/prisma/services/prisma.service';
import { AxiosService } from '@/util/axios/axios.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanetService } from './planet.service';

describe('PlanetService', () => {
  let service: PlanetService;
  let moduleRef: TestingModule

  const swapiPlanetsMock = {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
      {
        "name": "Dantooine",
        "rotation_period": "25",
        "orbital_period": "378",
        "diameter": "9830",
        "climate": "temperate",
        "gravity": "1 standard",
        "terrain": "oceans, savannas, mountains, grasslands",
        "surface_water": "unknown",
        "population": "1000",
        "residents": [],
        "films": [],
        "created": "2014-12-10T17:23:29.896000Z",
        "edited": "2014-12-20T20:58:18.461000Z",
        "url": "https://swapi.dev/api/planets/25/"
      }
    ]
  }

  const dbPlanetMock = {
    id: 1,
    name: 'Naboo',
    diameter: '12120',
    gravity: '1 standard',
    terrain: 'grassy hills, swamps, forests, mountains',
    created: '2014-12-10T11:52:31.066000Z',
    edited: '2014-12-20T20:58:18.430000Z',
    deletedAt: null
  }

  const [swapiPlanetMock] = swapiPlanetsMock.results

  const createdPlanetMock = {
    id: 1,
    name: swapiPlanetMock.name,
    diameter: swapiPlanetMock.diameter,
    gravity: swapiPlanetMock.gravity,
    terrain: swapiPlanetMock.terrain,
    created: swapiPlanetMock.created,
    edited: swapiPlanetMock.edited,
    deletedAt: null
  }

  beforeEach(async () => {
    class AxiosServiceMock {
      get(path: string, reqParams: any): Promise<any> {
        return Promise.resolve({ data: swapiPlanetsMock })
      }
    }

    class PrismaServiceMock {
      planet = {
        upsert() {
          return Promise.resolve(createdPlanetMock)
        },
        findFirst() {
          return Promise.resolve(dbPlanetMock)
        },
      }
    }

    moduleRef = await Test.createTestingModule({
      providers: [
        PlanetService,
        { provide: AxiosService, useClass: AxiosServiceMock },
        { provide: PrismaService, useClass: PrismaServiceMock },
      ],
    }).compile();

    service = moduleRef.get<PlanetService>(PlanetService);
  });

  const skipProp = (propName, skipArray) => skipArray.some(prop => prop === propName)

  const assertPlanetValues = (planet, planetMock, skipArray = []) => {
    !skipProp('id', skipArray) && expect(planet).toHaveProperty('id', planetMock.id)
    !skipProp('name', skipArray) && expect(planet).toHaveProperty('name', planetMock.name)
    !skipProp('diameter', skipArray) && expect(planet).toHaveProperty('diameter', planetMock.diameter)
    !skipProp('gravity', skipArray) && expect(planet).toHaveProperty('gravity', planetMock.gravity)
    !skipProp('terrain', skipArray) && expect(planet).toHaveProperty('terrain', planetMock.terrain)
    !skipProp('created', skipArray) && expect(planet).toHaveProperty('created', planetMock.created)
    !skipProp('edited', skipArray) && expect(planet).toHaveProperty('edited', planetMock.edited)
    !skipProp('deletedAt', skipArray) && expect(planet).toHaveProperty('deletedAt', planetMock.deletedAt)
  }

  const assertPlanetResultFormat = (result) => {
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('total', 1)
    expect(result).toHaveProperty('currentPageSize', 1)
    expect(Array.isArray(result.data)).toBeTruthy()
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return planet when exact name is in db with correct schema', async () => {
    // using AAA pattern - arrange, act, assert
    const name = dbPlanetMock.name

    const planets = await service.getPlanetsByName(name)

    expect(planets).toBeTruthy()
    assertPlanetResultFormat(planets)

    const [planet] = planets.data
    assertPlanetValues(planet, dbPlanetMock)
  })

  it('Should return swapi planets when not found in db', async () => {
    const name = dbPlanetMock.name
    jest
      .spyOn(moduleRef.get<PrismaService>(PrismaService).planet, 'findFirst')
      .mockImplementation(() => null)

    const planets = await service.getPlanetsByName(name)

    expect(planets).toBeTruthy()
    assertPlanetResultFormat(planets)
    assertPlanetValues(planets.data[0], swapiPlanetMock, ['id', 'deletedAt'])
  })
});
