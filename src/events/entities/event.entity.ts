import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(['name', 'type'])
@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    // @Index()
    @Column()
    name: string;

    @Column({ type: 'jsonb', nullable: true})
    payload: Record<string, unknown>;
}
