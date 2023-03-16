import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Password {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    user_id: string;

    @OneToOne(() => User)
    @JoinColumn({name: "user_id"})
    user: User;

    @Column()
    hash: string;

    @Column()
    salt: string;
}
