import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateUrlDto } from 'src/urls/dto/create-url.dto';

@Injectable()
export class UrlValidationPipe implements PipeTransform {
  transform(value: CreateUrlDto) {
    if (!this.isValidUrl(value.original_url)) {
      throw new BadRequestException('The URL provided is not valid. http://example.com or http://example.com/path/to/resource');
    }

    return value;
  }

  private isValidUrl(url: string): boolean {
    const urlRegex = /^(https?:\/\/)?([\w\d\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
    return urlRegex.test(url);
  }
}
