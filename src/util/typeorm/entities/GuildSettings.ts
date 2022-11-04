import { Column, Entity, Long, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "guild_settings",
})
export class GuildSettings {
    @PrimaryGeneratedColumn()
    index!: number;

    @Column({ length: '32', unique: true })
    id!: string;

    @Column({ name: 'mod_log', length: '32' })
    modlogChannel?: string;
}