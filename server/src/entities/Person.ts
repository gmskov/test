import {BeforeInsert, Column, Entity, Index} from "typeorm";
import {BaseEntity} from "./BaseEntity";

@Entity()
@Index(["firstName", "lastName"], {unique: true})
export class Person extends BaseEntity {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        type: "date",
        nullable: true,
    })
    birthDate?: string | null;

    @BeforeInsert()
    // @BeforeUpdate()
    cleanupBirthDateValue() {
        console.log("******", this.birthDate);

        if (this.birthDate != null) {
            const parsed = /^([^T]+)T.*$/.exec(this.birthDate);
            if (parsed == null) {
                this.birthDate = null;
            }
            else {
                this.birthDate = parsed[1]!;
            }
        }
    }
}
