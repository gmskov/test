import {Column, Entity, ManyToOne} from 'typeorm'
import {BaseEntity} from "./BaseEntity";
import {File} from "./File";

@Entity()
export class Invoice extends BaseEntity {
    @ManyToOne(() => File, {nullable: false})
    file: File;

    @Column({ type: "date" })
    invoiceDate: string;

    @Column({type: "decimal", precision: 10, scale: 2})
    amount: number;

    @Column()
    description: string;

    @Column({nullable: true})
    note?: string;

    @Column({nullable: true})
    test?: string;
}
