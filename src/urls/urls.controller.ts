import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req, UsePipes } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { OptionalAuthGuard } from '../auth/optional-auth/optional-auth.guard';
import { UrlValidationPipe } from '../pipes/url-validation.pipe';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @UseGuards(OptionalAuthGuard)
  @UsePipes(UrlValidationPipe)
  async create(@Body() createUrlDto: CreateUrlDto, @Req() req: any) {
    const userId = req.user?.sub || null;
    return await this.urlsService.create(createUrlDto, userId);
  }

  @Get(':shortenedUrlId')
  async redirectToOriginalUrl(
    @Param('shortenedUrlId') shortenedUrlId: string,
    @Res() res: Response
  ){
    const url = await this.urlsService.findAndIncrementClicks(shortenedUrlId)
    return res.redirect(url.original_url)
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.sub;
    return await this.urlsService.findAllByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub;
    return await this.urlsService.findOneByIdAndUser(id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UsePipes(UrlValidationPipe)
  async update(@Param('id') id: string, @Body() updateUrlDto: CreateUrlDto, @Req() req: any) {
    const userId = req.user?.sub;
    return await this.urlsService.updateByIdAndUser(id, updateUrlDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub;
    await this.urlsService.removeByIdAndUser(id, userId);
  }
}
