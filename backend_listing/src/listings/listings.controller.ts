import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Put,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/updatelisting.dto';
import { AuthGuard } from '@nestjs/passport';
import { SparePartsService } from 'src/SpareParts/spare-parts.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';


@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly sparePartsService: SparePartsService,
  ) {
    // Ensure uploads directories exist
    const uploadDirs = ['./uploads/listings', './uploads/registration', './uploads/verification'];
    uploadDirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('images', 6, {
    storage: diskStorage({
      destination: './uploads/listings',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return { imageUrls: [] };
    }
    const imageUrls = files.map(file => `/uploads/listings/${file.filename}`);
    return { imageUrls };
  }

  @Post('upload-registration-image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/registration',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  async uploadRegistrationImage(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: `/uploads/registration/${file.filename}` };
  }

  @Post('upload-verification-doc')
  @UseInterceptors(FileInterceptor('document', {
    storage: diskStorage({
      destination: './uploads/verification',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new Error('Only PDF files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  }))
  async uploadVerificationDoc(@UploadedFile() file: Express.Multer.File) {
    return { documentUrl: `/uploads/verification/${file.filename}` };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createListingDto: CreateListingDto,
    @Request() req: any,
  ) {

    return this.listingsService.create({ ...createListingDto, });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    return this.listingsService.findOne(id);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.listingsService.findByUserId(userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListingDto: UpdateListingDto,
    @Request() req: any,
  ) {
    return this.listingsService.update(id, { ...updateListingDto, });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    return this.listingsService.remove(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListingDto: UpdateListingDto,
    @Request() req: any,
  ) {
    return this.listingsService.partialUpdate(id, { ...updateListingDto, });
  }

  @Get(':id/spare-parts')
  async findSparePartsForListing(@Param('id') id: number) {
    // Fetch the listing by ID
    const listing = await this.listingsService.findOne(id);

    // Extract make and model from the listing
    const { make, model } = listing;

    // Query spare parts where keywords include the make or model
    return this.sparePartsService.findByMakeOrModelInKeywords(make, model);
  }

  // @Get()
  // async searchListings(@Query() dto: SearchListingsDto) {
  //   return this.listingsService.findMany(dto);
  // }
}
