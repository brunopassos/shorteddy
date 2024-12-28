import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { UrlsController } from '../urls.controller';
import { UrlsService } from '../urls.service';
import { CreateUrlDto } from '../dto/create-url.dto';
import { mockUrlEntity } from '../__mock__/urls.mock';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('UrlsController', () => {
  let controller: UrlsController;
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: {
            create: jest.fn(),
            findAndIncrementClicks: jest.fn(),
            findAllByUserId: jest.fn(),
            findOneByIdAndUser: jest.fn(),
            updateByIdAndUser: jest.fn(),
            removeByIdAndUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: 'OptionalAuthGuard',
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new URL', async () => {
      const urlDto: CreateUrlDto = { original_url: 'https://example.com' };
      const userId = 'user123';

      jest.spyOn(service, 'create').mockResolvedValue(mockUrlEntity);

      const result = await controller.create(urlDto, { user: { sub: userId } });

      expect(service.create).toHaveBeenCalledWith(urlDto, userId);
      expect(result).toEqual(mockUrlEntity);
    });

    it('should handle unauthenticated user', async () => {
      const urlDto: CreateUrlDto = { original_url: 'https://example.com' };

      jest.spyOn(service, 'create').mockResolvedValue(mockUrlEntity);

      const result = await controller.create(urlDto, {});

      expect(service.create).toHaveBeenCalledWith(urlDto, null);
      expect(result).toEqual(mockUrlEntity);
    });
  });

  describe('redirectToOriginalUrl', () => {
    it('should redirect to the original URL', async () => {
      const shortenedUrlId = '123456';
      const res = { redirect: jest.fn() };

      jest.spyOn(service, 'findAndIncrementClicks').mockResolvedValue(mockUrlEntity);

      await controller.redirectToOriginalUrl(shortenedUrlId, res as any);

      expect(service.findAndIncrementClicks).toHaveBeenCalledWith(shortenedUrlId);
      expect(res.redirect).toHaveBeenCalledWith(mockUrlEntity.original_url);
    });

    it('should throw a 404 error if URL not found', async () => {
      const shortenedUrlId = 'invalid';
      const res = { redirect: jest.fn() };

      jest.spyOn(service, 'findAndIncrementClicks').mockRejectedValue(new HttpException('Not Found', 404));

      await expect(controller.redirectToOriginalUrl(shortenedUrlId, res as any)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all URLs for a user', async () => {
      const userId = 'user123';

      jest.spyOn(service, 'findAllByUserId').mockResolvedValue([mockUrlEntity]);

      const result = await controller.findAll({ user: { sub: userId } });

      expect(service.findAllByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockUrlEntity]);
    });
  });

  describe('findOne', () => {
    it('should return a single URL by ID', async () => {
      const userId = 'user123';
      const urlId = 'urlId123';

      jest.spyOn(service, 'findOneByIdAndUser').mockResolvedValue(mockUrlEntity);

      const result = await controller.findOne(urlId, { user: { sub: userId } });

      expect(service.findOneByIdAndUser).toHaveBeenCalledWith(urlId, userId);
      expect(result).toEqual(mockUrlEntity);
    });
  });

  describe('update', () => {
    it('should update a URL', async () => {
      const userId = 'user123';
      const urlId = 'urlId123';
      const urlDto: CreateUrlDto = { original_url: 'https://example.com/updated' };

      jest.spyOn(service, 'updateByIdAndUser').mockResolvedValue(mockUrlEntity);

      const result = await controller.update(urlId, urlDto, { user: { sub: userId } });

      expect(service.updateByIdAndUser).toHaveBeenCalledWith(urlId, urlDto, userId);
      expect(result).toEqual(mockUrlEntity);
    });
  });

  describe('remove', () => {
    it('should remove a URL', async () => {
      const userId = 'user123';
      const urlId = 'urlId123';

      jest.spyOn(service, 'removeByIdAndUser').mockResolvedValue(undefined);

      await controller.remove(urlId, { user: { sub: userId } });

      expect(service.removeByIdAndUser).toHaveBeenCalledWith(urlId, userId);
    });
  });
});
