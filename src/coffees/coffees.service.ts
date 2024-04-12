import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';
import { RECOMMEND_COFFEE_EVENT, RECOMMEND_COFFEE_TYPE } from 'src/common/constants/event';

@Injectable()
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,

        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,

        private readonly dataSource: DataSource
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

    async recommendCoffee(id: number) {
        const coffee = await this.findOne(id);

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            coffee.recommendations++;

            const recommendEvent = new Event();

            recommendEvent.name = RECOMMEND_COFFEE_EVENT;
            recommendEvent.type = RECOMMEND_COFFEE_TYPE;
            recommendEvent.payload = { coffeeId: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        } catch (error) {
            console.log("❗ ~ file: coffees.service.ts:107 ~ CoffeesService ~ recommendCoffee ~ error:", error)
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
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
