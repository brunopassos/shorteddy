import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUrlDto, UrlDto } from './dto/create-url.dto';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlsService {

  private urls: UrlDto[] = []
  private domain: string = process.env.SHORT_URL_DOMAIN

  create(createUrlDto: CreateUrlDto): UrlDto {

    const now = new Date().toISOString()
    
    const newShortenedUrl: UrlDto = {
      id: randomUUID(),
      original_url: createUrlDto.original_url,
      shortened_url_id: `${nanoid(6)}`,
      click_cout: 0,
      created_at: now,
      updated_at: now,
      deleted_at: null
    }

    this.urls.push(newShortenedUrl)

    return newShortenedUrl
      
  }

  findAll() {
    return this.urls.filter(url => url.deleted_at === null);
  }


  findOne(id: string) {
    const foundUrl = this.urls.find((url) => url.id === id)
    
    if(!foundUrl){
      throw new HttpException(`Url not found`, HttpStatus.NOT_FOUND)
    }

    if(foundUrl.deleted_at){
      throw new HttpException('Url is deactivated', HttpStatus.BAD_REQUEST)
    }
    
    return foundUrl
  }

  update(id: string, updateUrlDto: CreateUrlDto) {

    const foundUrlIndex = this.urls.findIndex((url) => url.id === id)

    if(foundUrlIndex === -1){
      throw new HttpException(`Url not found`, HttpStatus.NOT_FOUND)
    }

    if(this.urls[foundUrlIndex].deleted_at){
      throw new HttpException('Url is deactivated', HttpStatus.BAD_REQUEST)
    }

    const now = new Date().toISOString()

    const updatedUrl: UrlDto = {
      id: this.urls[foundUrlIndex].id,
      click_cout: this.urls[foundUrlIndex].click_cout,
      created_at: this.urls[foundUrlIndex].created_at,
      updated_at: now,
      deleted_at: this.urls[foundUrlIndex].deleted_at,
      original_url: updateUrlDto.original_url,
      shortened_url_id: this.urls[foundUrlIndex].shortened_url_id,
    }

    this.urls.splice(foundUrlIndex, 1, updatedUrl)

    return updatedUrl
  }

  remove(id: string) {
    const foundUrlIndex = this.urls.findIndex((url) => url.id === id)

    if(foundUrlIndex === -1){
      throw new HttpException(`Url not found`, HttpStatus.NOT_FOUND)
    }

    if(this.urls[foundUrlIndex].deleted_at){
      throw new HttpException('Url is deactivated', HttpStatus.BAD_REQUEST)
    }

    const now = new Date().toISOString()

    this.urls[foundUrlIndex].deleted_at = now
  }
}
