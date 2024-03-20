import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
        {
            id: 1,
            name: 'Shipwreck Roast',
            brand: 'Buddy Brew',
            flavors: ['chocolate', 'vanilla']
        }
    ];

    //* (GET) http:localhost:3000/coffees
    findAll() {
        return this.coffees;
    }

    //* (GET) http:localhost:3000/coffees/1
    findOne(id: number) {
        const coffee =  this.coffees.find(item => item.id === id)

        if(!coffee) {
            throw new NotFoundException(`Coffee ${id} doesn't exist`)
        }

        return coffee;
    }

    //* (POST) http:localhost:3000/coffees
    create(coffee: Partial<Coffee>) {
        this.coffees.push({...coffee, id: this.coffees.length + 1} as Coffee);

        return coffee;
    }

    //* (PATCH | PUT) http:localhost:3000/coffees/1
    update(id: number, updatedCoffee: Partial<Coffee>) {
        const coffeeIndex = this.findIndex(id);

        if (coffeeIndex >= 0) {
            this.coffees[coffeeIndex] = {
                ...this.coffees[coffeeIndex],
                ...updatedCoffee
            };

            return true
        }

        return false
    }

    //* (DELETE) http:localhost:3000/coffees/1
    remove(id: number) {
        const coffeeIndex = this.findIndex(id);

        if (coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1);

            return true
        }

        return false
    }

    private findIndex(id: string | number) {
        return this.coffees.findIndex(coffee => coffee.id === +id);
    }
}
