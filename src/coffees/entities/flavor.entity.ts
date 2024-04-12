import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coffee } from "./coffee.entity";

@Entity()
export class Flavor {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    name: string;

    @ManyToMany(
        () => Coffee,
        (coffee) => coffee.flavors
    )
    coffees: Coffee[]
}
