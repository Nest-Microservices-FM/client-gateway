import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
// import { ORDER_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config/services';


@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}


  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({ cmd: 'create_order'}, createOrderDto)
      .pipe(
        catchError( error => {throw new RpcException(error)})
      )
  }

  @Get()
  findAll(@Query() orderPaginationDto:OrderPaginationDto) {
    return this.client.send({ cmd: 'find_all_orders'}, orderPaginationDto)
      .pipe(
        catchError( error => {throw new RpcException(error)})
      )
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'find_one_order'}, {id})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }


  @Get(':status')
  findAllByStatus(
    @Param('status') status: StatusDto,
    @Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_one_order_status'}, {...paginationDto, status:StatusDto})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }



  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() statusDto: StatusDto
  ){
    return this.client.send({cmd: 'change_order_status'}, {id, ...statusDto})
    .pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }

}
