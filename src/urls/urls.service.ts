import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from './entities/url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlsService {
  
  constructor(
      @InjectRepository(UrlEntity)
      private readonly urlsRepository: Repository<UrlEntity>
    ){}

  private domain: string = process.env.SHORT_URL_DOMAIN

  async create(createUrlDto: CreateUrlDto, userId?: string): Promise<UrlEntity> {

    const now = new Date()
    
    const newShortenedUrl: UrlEntity = {
      id: randomUUID(),
      original_url: createUrlDto.original_url,
      shortened_url_id: `${nanoid(6)}`,
      click_count: 0,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      user_id: userId,
      domain: this.domain
    }

    await this.urlsRepository.save(newShortenedUrl)

    return newShortenedUrl
      
  }

  async findAllByUserId(userId: string): Promise<UrlEntity[]> {
    const urls = await this.urlsRepository.find({
      where: {
        deleted_at: null,
        user_id: userId,
      },
    });

    return urls
  }

  async findAndIncrementClicks(shortenedUrlId: string): Promise<UrlEntity> {
    const foundUrl = await this.urlsRepository.findOne({
      where:{
        shortened_url_id: shortenedUrlId
      }
    })

    if(!foundUrl){
      throw new HttpException(`Url not found`, HttpStatus.NOT_FOUND)
    }

    if(foundUrl.deleted_at){
      throw new HttpException('Url is deactivated', HttpStatus.BAD_REQUEST)
    } 

    foundUrl.click_count += 1

    await this.urlsRepository.update(foundUrl.id, foundUrl)

    return foundUrl
  }
  
  async findOneByIdAndUser(id: string, userId: string): Promise<UrlEntity> {
    const foundUrl = await this.urlsRepository.findOne({
      where: {
        id,
        user_id: userId,
      },
    });
    
    if (!foundUrl) {
      throw new HttpException('Url not found or you are not the owner', HttpStatus.NOT_FOUND);
    }
  
    if (foundUrl.deleted_at) {
      throw new HttpException('Url is deactivated', HttpStatus.BAD_REQUEST);
    }
    
    return foundUrl;
  }

  async updateByIdAndUser(id: string, updateUrlDto: CreateUrlDto, userId: string): Promise<UrlEntity> {
    const foundUrl = await this.urlsRepository.findOne({
      where: {
        id,
        user_id: userId,
      },
    });

  
    if (!foundUrl) {
      throw new HttpException('Url not found or you are not the owner', HttpStatus.NOT_FOUND);
    }
  
    if (foundUrl.deleted_at) {
      throw new HttpException('Url is deactivated', HttpStatus.BAD_REQUEST);
    }
  
    const now = new Date()

    foundUrl.updated_at = now
    foundUrl.original_url = updateUrlDto.original_url

    await this.urlsRepository.update(id, foundUrl)
  
    return foundUrl;
  }
  

  async removeByIdAndUser(id: string, userId: string): Promise<void> {
    const foundUrl = await this.urlsRepository.findOne({
      where: {
        id,
        user_id: userId,
      },
    });
  
    if (!foundUrl) {
      throw new HttpException('Url not found or you are not the owner', HttpStatus.NOT_FOUND);
    }
  
    if (foundUrl.deleted_at) {
      throw new HttpException('Url is deactivated', HttpStatus.BAD_REQUEST);
    }
  
    const now = new Date()
  
    foundUrl.deleted_at = now;

    await this.urlsRepository.update(id, foundUrl)
  }  
}
