import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

import {User} from "./User";

@Entity()
export class GProUser {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({type: "timestamptz"})
    created_at: Date;

    @UpdateDateColumn({type: "timestamptz"})
    updated_at: Date;

    @OneToOne(
        () => User,
        (user) => user.gpro_user,
        {eager: true}
    )
    @JoinColumn({name: "user_id"})
    user: User;

    @Column()
    @Index({unique: true})
    login: string;

    @Column({nullable: true})
    first_name?: string;

    @Column({nullable: true})
    last_name?: string;

    @Column({nullable: true})
    phone?: string;

    @Column({nullable: true})
    email?: string;

    @Column({nullable: true})
    photo?: string;

    @Column()
    laravel_session: string;
}
