import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from '../urls.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UrlEntity } from '../entities/url.entity';
import { HttpException } from '@nestjs/common';
import { mockUrlEntity } from '../__mock__/urls.mock';
import * as crypto from 'crypto';
import { nanoid } from 'nanoid';

describe('UrlsService', () => {
  let service: UrlsService;
  let urlsRepository: Repository<UrlEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(UrlEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    urlsRepository = module.get<Repository<UrlEntity>>(getRepositoryToken(UrlEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockDate = new Date('2024-12-28T15:57:38.763Z');
  
    beforeAll(() => {
      process.env.SHORT_URL_DOMAIN = 'short.ly';
      jest.spyOn(crypto, 'randomUUID').mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
      jest.spyOn(require('nanoid'), 'nanoid').mockReturnValue('123456');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it('should create a new URL', async () => {
      jest.spyOn(urlsRepository, 'save').mockResolvedValue(mockUrlEntity);
  
      const createUrlDto = { original_url: 'https://example.com' };
      const result = await service.create(createUrlDto, 'user123');
  
      expect(result).toEqual({
        ...mockUrlEntity,
        created_at: mockDate,
        updated_at: mockDate,
      });
  
      expect(urlsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174000',
          original_url: 'https://example.com',
          shortened_url_id: '123456',
          click_count: 0,
          user_id: 'user123',
          domain: 'short.ly',
        }),
      );
    });
  });
  

  describe('findAllByUserId', () => {
    it('should return all URLs for a user', async () => {
      jest.spyOn(urlsRepository, 'find').mockResolvedValue([mockUrlEntity]);

      const result = await service.findAllByUserId('user123');

      expect(result).toEqual([mockUrlEntity]);
    });
  });

  describe('findAndIncrementClicks', () => {
    it('should increment click count for a URL', async () => {
      jest.spyOn(urlsRepository, 'findOne').mockResolvedValue(mockUrlEntity);
      jest.spyOn(urlsRepository, 'update').mockResolvedValue(undefined);

      const result = await service.findAndIncrementClicks(mockUrlEntity.shortened_url_id);

      expect(urlsRepository.findOne).toHaveBeenCalledWith({
        where: { shortened_url_id: mockUrlEntity.shortened_url_id },
      });
      expect(urlsRepository.update).toHaveBeenCalled();
      expect(result.click_count).toBe(1);
    });

    it('should throw a 404 error if URL is not found', async () => {
      jest.spyOn(urlsRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findAndIncrementClicks('invalid_id'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw a 400 error if URL is deactivated', async () => {
      const deactivatedUrl = { ...mockUrlEntity, deleted_at: new Date() };
      jest.spyOn(urlsRepository, 'findOne').mockResolvedValue(deactivatedUrl);

      await expect(
        service.findAndIncrementClicks(mockUrlEntity.shortened_url_id),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findOneByIdAndUser', () => {
    it('should return a URL for a given ID and user', async () => {
      console.log(mockUrlEntity)
      jest.spyOn(urlsRepository, 'findOne').mockResolvedValue(mockUrlEntity);

      const result = await service.findOneByIdAndUser(mockUrlEntity.id, mockUrlEntity.user_id);

      expect(urlsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUrlEntity.id, user_id: mockUrlEntity.user_id },
      });
      expect(result).toEqual(mockUrlEntity);
    });

    it('should throw a 404 error if URL is not found', async () => {
      jest.spyOn(urlsRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOneByIdAndUser('invalid_id', 'user123'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw a 400 error if URL is deactivated', async () => {
      const deactivatedUrl = { ...mockUrlEntity, deleted_at: new Date() };
      jest.spyOn(urlsRepository, 'findOne').mockResolvedValue(deactivatedUrl);

      await expect(
        service.findOneByIdAndUser(mockUrlEntity.id, mockUrlEntity.user_id),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('removeByIdAndUser', () => {
    it('should mark a URL as deleted', async () => {
      jest.spyOn(urlsRepository, 'findOne').mockResolvedValue(mockUrlEntity);
      jest.spyOn(urlsRepository, 'update').mockResolvedValue(undefined);

      await service.removeByIdAndUser(mockUrlEntity.id, mockUrlEntity.user_id);

      expect(urlsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUrlEntity.id, user_id: mockUrlEntity.user_id },
      });
      expect(urlsRepository.update).toHaveBeenCalled();
    });

    it('should throw a 404 error if URL is not found', async () => {
      jest.spyOn(urlsRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.removeByIdAndUser('invalid_id', 'user123'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw a 400 error if URL is deactivated', async () => {
      const deactivatedUrl = { ...mockUrlEntity, deleted_at: new Date() };
      jest.spyOn(urlsRepository, 'findOne').mockResolvedValue(deactivatedUrl);

      await expect(
        service.removeByIdAndUser(mockUrlEntity.id, mockUrlEntity.user_id),
      ).rejects.toThrow(HttpException);
    });
  });
});
