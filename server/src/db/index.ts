import {DataSource, EntityTarget, ObjectLiteral, Repository} from "typeorm";
import {Person} from "../entities/Person";
import {EmployeeProfile} from "../entities/EmployeeProfile";
import {EmployeeSalary} from "../entities/EmployeeSalary";
import {Invoice} from "../entities/Invoice";
import {File} from "../entities/File";
import {User} from "../entities/User";
import {GProUser} from "../entities/GProUser";
import {Password} from "../entities/Password";

const dataSource = new DataSource({
    type: "postgres",
    host: "167.71.39.235",
    username: "postgres",
    password: "postgres",
    database: "gbar_test",
    entities: [
        Person,
        EmployeeProfile,
        EmployeeSalary,
        Invoice,
        File,
        User,
        GProUser,
        Password
    ],
    // logging: true,
    synchronize: true,
    // dateStrings: ["date"],
    // supportBigNumbers: true,
});

export const dsPromise = dataSource.initialize();

export async function getRepository<T extends ObjectLiteral>(target: EntityTarget<T>): Promise<Repository<T>> {
    const ds = await dsPromise;
    return ds.getRepository(target);
}
