import { Column, Entity, Long, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'user_settings'
})
export class UserSettings {
    @PrimaryGeneratedColumn()
    index!: number;

    @Column({
        length: '32',
        nullable: false
    })
    id!: string;

    @Column({
        name: 'embed_color',
        nullable: true
    })
    embedColor?: number;
}