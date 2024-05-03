import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { PaginationDto } from '../common/dto/pagination.dto';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/guards';
import { AddTokenInterceptor } from 'src/common/interceptors/add-token.interceptor';
import { Roles } from 'src/auth/decorators';



@UseInterceptors(AddTokenInterceptor)
@Controller('products')
export class ProductsController {
  
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards( AuthGuard )
  @Roles('ADMIN', 'OWNER')
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send('create_product', createProductDto)
      .pipe(
        catchError( error => {throw new RpcException(error)})
      )
  }

  @UseGuards( AuthGuard )
  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto){
    return this.client.send('find_all_products', paginationDto)
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }

  @UseGuards( AuthGuard )
  @Get(':id')
  async findOneProduct(@Param('id', ParseIntPipe) id: number){
    return this.client.send('find_one_product', {id})
      .pipe(
        catchError( error => {throw new RpcException(error)})
      )
  }

  @UseGuards( AuthGuard )
  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number){
    return this.client.send('delete_product', {id})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }

  @UseGuards( AuthGuard )
  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductDto: UpdateProductDto){
    return this.client.send('update_product', {id, ...updateProductDto})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }
}
