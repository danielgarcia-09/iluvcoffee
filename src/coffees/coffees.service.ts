import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,

        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
    ) { }

    //* (GET) http:localhost:3000/coffees
    findAll(filter?: FindManyOptions<Coffee>) {
        return this.coffeeRepository.find({ ...filter, relations: { flavors: true } });
    }

    //* (GET) http:localhost:3000/coffees/1
    async findOne(id: number) {
        const coffee = await this.coffeeRepository.findOne({ 
            where: { id }, 
            relations: { flavors: true }
        })

        if (!coffee) {
            throw new NotFoundException(`Coffee ${id} doesn't exist`)
        }

        return coffee;
    }

    //* (POST) http:localhost:3000/coffees
    async create(coffee: CreateCoffeeDto) {
        
        const flavors = await Promise.all(
            coffee.flavors?.map(name => this.preloadFlavorByName(name))
        )
        
        const newCoffee = this.coffeeRepository.create({
            ...coffee,
            flavors
        });

        return this.coffeeRepository.save(newCoffee);
    }

    //* (PATCH | PUT) http:localhost:3000/coffees/1
    async update(id: number, updatedCoffee: UpdateCoffeeDto) {
        const flavors = updatedCoffee.flavors && 
        (await Promise.all(
            updatedCoffee.flavors.map(name => this.preloadFlavorByName(name))
        ));
        
        const coffee = await this.coffeeRepository.preload({
            id,
            ...updatedCoffee,
            flavors
        })

        if (!coffee) {
            throw new NotFoundException(`Coffee ${id} doesn't exist`)
        }
 
        return this.coffeeRepository.save(coffee);
    }

    //* (DELETE) http:localhost:3000/coffees/1
    async remove(id: number) {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({
            where: { name }
        })

        if(existingFlavor) {
            return existingFlavor;
        }

        return this.flavorRepository.create({ name });
    }
}
