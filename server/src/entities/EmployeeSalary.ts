import {BaseEntity} from "./BaseEntity";
import {EmployeeProfile} from "./EmployeeProfile";
import {Column, Entity, ManyToOne} from "typeorm";

export enum SalaryBaseUnit {
    Hour = 'hour',
    Month = 'month',
}

@Entity()
export class EmployeeSalary extends BaseEntity {
    @ManyToOne(() => EmployeeProfile, {nullable: false})
    employee: EmployeeProfile;

    @Column({
        type: "date",
        nullable: false,
    })
    dateEffective: string;

    @Column({
        type: "enum",
        enum: SalaryBaseUnit,
        nullable: false,
    })
    baseUnit: SalaryBaseUnit;

    @Column({
        type: "decimal",
        nullable: false,
    })
    rate: number;

    @Column({
        default: false,
        nullable: false
    })
    net: boolean;
}
