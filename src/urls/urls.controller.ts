import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';
import { OptionalAuthGuard } from 'src/auth/optional-auth/optional-auth.guard';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @UseGuards(OptionalAuthGuard)
  create(@Body() createUrlDto: CreateUrlDto, @Req() req: any) {
    const userId = req.user?.sub || null;
    return this.urlsService.create(createUrlDto, userId);
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
  findAll(@Req() req: any) {
    const userId = req.user?.sub;
    return this.urlsService.findAllByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  indOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub;
    return this.urlsService.findOneByIdAndUser(id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: CreateUrlDto, @Req() req: any) {
    const userId = req.user?.sub;
    return this.urlsService.updateByIdAndUser(id, updateUrlDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub;
    this.urlsService.removeByIdAndUser(id, userId);
  }
}
