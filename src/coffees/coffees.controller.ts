import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeesService: CoffeesService) {}

    @Get()
    findAll(@Query() filter) {
        // const { limit, offset } = filter;
        
        return this.coffeesService.findAll()
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
