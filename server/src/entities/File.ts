import {Column, Entity, OneToMany} from "typeorm";
import {BaseEntity} from "./BaseEntity";
import {Invoice} from "./Invoice";

@Entity()
export class File extends BaseEntity {

    @OneToMany(() => Invoice, (invoice) => invoice.file)
    invoice: Invoice;

    @Column({nullable: false})
    fileName: string;

    @Column({
        type: "bytea",
        nullable: false,
    })
    data: string

    @Column()
    size: number;
}
