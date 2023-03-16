import {BaseEntity} from "./BaseEntity";
import {JoinColumn, OneToOne} from "typeorm";
import {Person} from "./Person";

export abstract class PersonExtension extends BaseEntity {
    @OneToOne(() => Person, {nullable: false, cascade: ["insert", "update"]})
    @JoinColumn()
    person: Person;
}
