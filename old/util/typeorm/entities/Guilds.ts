import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Guilds {
    @PrimaryGeneratedColumn()
    index: Number;
    @Column({ 
        unique: true, 
        type: "varchar", 
        length: 18,
        nullable: false
    })
    id: string;
    @Column({ 
        name: "mod_log", 
        type: "varchar", 
        length: 18,
        nullable: true
    })
    modLog: string;
}