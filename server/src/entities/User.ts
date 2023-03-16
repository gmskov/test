import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {type GProUser} from "./GProUser";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({type: "timestamptz"})
    created_at: Date;

    @UpdateDateColumn({type: "timestamptz"})
    updated_at: Date;

    @DeleteDateColumn({type: "timestamptz"})
    deleted_at: Date;

    @Column()
    @Index({unique: true})
    login: string;

    @OneToOne("GProUser", "user_id")
    gpro_user: GProUser;

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
}
