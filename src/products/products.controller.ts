import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { PaginationDto } from '../common/dto/pagination.dto';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('products')
export class ProductsController {
  
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product'}, {createProductDto})
      .pipe(
        catchError( error => {throw new RpcException(error)})
      )
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto){
    return this.client.send('find_all_products', paginationDto)
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }

  @Get(':id')
  async findOneProduct(@Param('id', ParseIntPipe) id: number){
    return this.client.send({ cmd: 'find_one_product'}, {id})
      .pipe(
        catchError( error => {throw new RpcException(error)})
      )
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number){
    return this.client.send({ cmd: 'delete_product'}, {id})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductDto: UpdateProductDto){
    return this.client.send({ cmd: 'update_product'}, {id, ...updateProductDto})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }
}
