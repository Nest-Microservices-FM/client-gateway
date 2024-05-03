import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config/services';
import { AuthGuard } from 'src/auth/guards';
import { AddTokenInterceptor } from 'src/common/interceptors/add-token.interceptor';
import { Roles } from 'src/auth/decorators';

@UseInterceptors(AddTokenInterceptor)
@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}



  @UseGuards( AuthGuard )
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() request  
  ) {
    const userId = request.user.id;
    const data = {
      userId: userId,
      ...createOrderDto,
    }
    return this.client.send('create_order', data)
      .pipe(
        catchError( error => {throw new RpcException(error)})
      )
  }

  @UseGuards( AuthGuard )
  @Roles('ADMIN', 'OWNER')
  @Get()
  findAll(@Query() orderPaginationDto:OrderPaginationDto) {
    return this.client.send('find_all_orders', orderPaginationDto)
      .pipe(
        catchError( error => {throw new RpcException(error)})
      )
  }

  @UseGuards( AuthGuard )
  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('find_one_order', {id})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }

  @UseGuards( AuthGuard )
  @Get(':status')
  findAllByStatus(
    @Param('status') status: StatusDto,
    @Query() paginationDto: PaginationDto) {
    return this.client.send('find_one_order_status', {...paginationDto, status:status})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }


  @UseGuards( AuthGuard )
  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() statusDto: StatusDto
  ){
    return this.client.send('change_order_status', {id, ...statusDto})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }

}
