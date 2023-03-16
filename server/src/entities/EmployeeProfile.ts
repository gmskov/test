import {Column, Entity} from "typeorm";
import {IsEmail, IsPhoneNumber} from "class-validator";
import {PersonExtension} from "./PersonExtension";

@Entity()
export class EmployeeProfile extends PersonExtension {
    @Column({
        type: "varchar",
        length: 14,
        nullable: true,
    })
    taxId: string;

    @Column({nullable: true})
    address: string;

    @Column({nullable: true})
    @IsPhoneNumber()
    phone: string;

    @Column({nullable: true})
    @IsEmail()
    email: string;
}
