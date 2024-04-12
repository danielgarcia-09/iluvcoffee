import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeesService: CoffeesService) {}

    @Get()
    findAll(@Query() filter: PaginationQueryDto) {
        const { limit, offset } = filter;
        
        return this.coffeesService.findAll({skip: offset, take: limit})
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.coffeesService.findOne(id);
    }

    @Post()
    create(@Body() payload: CreateCoffeeDto) {
        return this.coffeesService.create(payload)
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() payload: UpdateCoffeeDto) {
        return this.coffeesService.update(id, payload)
    }

    @Delete(':id')
    remove(@Param('id') id: number ) {
        return this.coffeesService.remove(id);
    }
}
