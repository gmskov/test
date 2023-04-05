import {Column, DataSource, Entity, Migration, MigrationExecutor, PrimaryColumn} from "typeorm";
import {CommandUtils} from "typeorm/commands/CommandUtils";
import {TableColumn} from "typeorm/schema-builder/table/TableColumn";
import {execSync} from "child_process";
import * as path from "path";
import * as fs from "fs";

const DATASOURCE_FILE_PATH = "./src/db/dataSource.ts";
const MIGRATION_FILES_PATH = "./src/migrations";
const TMP_FOLDER_PATH = "./src/tmp";
const MIGRATION_CODE_COLUMN = {
  name: "code",
  type: "bytea",
  isNullable: true,
  default: null
} as TableColumn

interface GBarMigration extends Migration {
  code: string | null
}

class AppMigrationExecutor extends MigrationExecutor {
  private migrationQueryRunner = this.queryRunner || this.connection.createQueryRunner();
  readonly migrationTableName;

  constructor (dataSource: DataSource, migrationsTableName: string) {
    super(dataSource);
    this.migrationTableName = migrationsTableName;
  }

  async ensureMigrationCodeColumn(): Promise<void> {
    const columnExists = await this.migrationQueryRunner.hasColumn(this.migrationTableName, MIGRATION_CODE_COLUMN.name)

    if (!columnExists) {
      await this.migrationQueryRunner.addColumn(this.migrationTableName, MIGRATION_CODE_COLUMN)
    }
  }

  async storeExecutedMigrationCode(migrations: GBarMigration[]): Promise<void> {
    const notUpdatedMigration = migrations.filter(it => it.code == null)

    if (notUpdatedMigration.length) {
      for (const it of notUpdatedMigration) {
        const fileName = this.getMigrationFileName(it);
        const path = `${MIGRATION_FILES_PATH}/${fileName}.ts`

        if (fs.existsSync(path)) {
          const migrationCode = fs.readFileSync(path, "utf8");
          await this.connection.createQueryRunner().query(`UPDATE ${this.migrationTableName} SET "code" = $1 WHERE "id" = $2`, [Buffer.from(migrationCode, "binary"), it.id])
        } else {
          throw new Error("Migration file not found")
        }
      }
    }
  }

  async revertMigration(migrations: GBarMigration[]) {
    const revertMigrationList: GBarMigration[] = []

    for (const it of migrations) {
      const fileName = this.getMigrationFileName(it);
      const path = `${MIGRATION_FILES_PATH}/${fileName}.ts`

      // Break on first existing migration file
      if (fs.existsSync(path)) {
        break;
      }
      revertMigrationList.push(it)
    }

    if(revertMigrationList.length) {
      if (!fs.existsSync(TMP_FOLDER_PATH)) fs.mkdirSync(TMP_FOLDER_PATH);

      for (const it of revertMigrationList) {
        const fileName = this.getMigrationFileName(it);
        const path = `${TMP_FOLDER_PATH}/${fileName}.ts`

        if (it.code != null) {
          await fs.writeFile(path, it.code, "binary", () => {})
        }
      }

      const dataSource = await CommandUtils.loadDataSource(path.resolve(process.cwd(), DATASOURCE_FILE_PATH));
      dataSource.setOptions({
        subscribers: [],
        synchronize: false,
        migrationsRun: false,
        dropSchema: false,
        logging: ["query", "error", "schema"],
        migrations: [`${TMP_FOLDER_PATH}/*.ts`],
      });
      await dataSource.initialize();

      for (const _it of revertMigrationList) {
        await this.undoLastMigration()
      }

      fs.rmSync(TMP_FOLDER_PATH, { recursive: true, force: true });
      await dataSource.destroy()
    }
  }

  getMigrationFileName(migration: Migration) {
    const name = migration.name.replace(migration.timestamp.toString(), "");
    return `${migration.timestamp}-${name}`
  }
}

(async () => {
  const dataSource = await CommandUtils.loadDataSource(path.resolve(process.cwd(), DATASOURCE_FILE_PATH));
  const {migrationsTableName = "migrations", entities} = dataSource.options;
  const MigrationClass = createMigrationClass(migrationsTableName)

  dataSource.setOptions({
    subscribers: [],
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    logging: ["query", "error", "schema"],
    entities: [
      ...entities as any[],
      MigrationClass,
    ]
  });
  await dataSource.initialize();

  const migrationExecutor = new AppMigrationExecutor(dataSource, migrationsTableName);
  await migrationExecutor.ensureMigrationCodeColumn();
  const executedMigrations = await dataSource.getRepository(MigrationClass).find({
    order: {
      id: 'DESC',
    },
  });
  await dataSource.destroy()
  await migrationExecutor.revertMigration(executedMigrations);
  execSync(`npx typeorm-ts-node-esm migration:run -d ./src/db/dataSource.ts`,   {stdio: 'inherit'})
  await dataSource.initialize();
  const updatedExecutedMigrations = await dataSource.getRepository(MigrationClass).find();
  await migrationExecutor.storeExecutedMigrationCode(updatedExecutedMigrations);
})()

function createMigrationClass(migrationsTableName: string) {
  @Entity({name: migrationsTableName})
  class CustomMigration implements GBarMigration {
    @PrimaryColumn({type: "integer"})
    id: number | undefined;

    @Column()
    name: string;

    @Column()
    timestamp: number;

    @Column()
    code: string;

  }
  return CustomMigration
}
