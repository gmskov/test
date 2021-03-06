import {DataSource} from "typeorm";
import {Person} from "../entities/Person";
import {EmployeeProfile} from "../entities/EmployeeProfile";
import {EmployeeSalary} from "../entities/EmployeeSalary";
import {Invoice} from "../entities/Invoice";
import {File} from "../entities/File";
import {User} from "../entities/User";
import {GProUser} from "../entities/GProUser";
import {Password} from "../entities/Password";
import config from "../config";
import {isProduction} from "../core/utils";
import path from "path";

const dataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
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
  migrationsTableName: "migrations",
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  logging: !isProduction(),
  synchronize: false,
});
export default dataSource;
