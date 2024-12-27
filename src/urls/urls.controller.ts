import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get(':shortenedUrlId')
  redirectToOriginalUrl(
    @Param('shortenedUrlId') shortenedUrlId: string,
    @Res() res: Response
  ){
    const url = this.urlsService.findAndIncrementClicks(shortenedUrlId)
    return res.redirect(url.original_url)
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: CreateUrlDto) {
    return this.urlsService.update(id, updateUrlDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlsService.remove(id);
  }
}
