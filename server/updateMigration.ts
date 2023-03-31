import {Migration, MigrationExecutor} from "typeorm";
import {CommandUtils} from "typeorm/commands/CommandUtils";
import * as path from "path";
import {TableColumn} from "typeorm/schema-builder/table/TableColumn";
import * as fs from "fs";

const DATASOURCE_FILE_PATH = "./src/db/dataSource.ts";
const MIGRATION_FILES_PATH = "./src/migrations";
const MIGRATION_FILE_PREFIX = "migration"
const TMP_FOLDER_PATH = "./src/tmp";

class GBarMigration extends Migration {
  code: string | null
}

class AppMigrationExecutor extends MigrationExecutor {
  private migrationQueryRunner = this.queryRunner || this.connection.createQueryRunner();
  private migrationTableName = this.connection.options.migrationsTableName

  async getAllExecutedMigrations(): Promise<GBarMigration[]> {
    if (!this.migrationTableName) return []

    const { schema } = this.connection.driver;
    const database = this.connection.driver.database;

    const migrationsTable = this.connection.driver.buildTableName(this.migrationTableName, schema, database);
    return await this.connection.manager
    .createQueryBuilder(this.migrationQueryRunner)
    .select()
    .orderBy(this.connection.driver.escape("id"), "DESC")
    .from(migrationsTable, this.migrationTableName)
    .getRawMany();
  }

  async addMigrationColumn(name: string): Promise<void> {
    if (!this.migrationTableName) return

    const isColumnExist = await this.migrationQueryRunner.hasColumn(this.migrationTableName, name)

    if (!isColumnExist) {
      const migrationCodeColumn = {
        name,
        type: "bytea",
        isNullable: true,
        default: null
      } as TableColumn
      await this.migrationQueryRunner.addColumn(this.migrationTableName, migrationCodeColumn)
    }
  }

  async saveFileToExecutedMigration(migrations: GBarMigration[]) {
    const notUpdatedMigration = migrations.filter(it => it.code == null)
    if (notUpdatedMigration.length) {
      for (const it of notUpdatedMigration) {
        const path = `${MIGRATION_FILES_PATH}/${it.timestamp}-${MIGRATION_FILE_PREFIX}.ts`

        if (fs.existsSync(path)) {
          const migrationData = fs.readFileSync(path, "utf8");
          await this.migrationQueryRunner.query(`UPDATE ${this.migrationTableName} SET "code" = $1 WHERE "id" = ${it.id}`, [Buffer.from(migrationData, "binary")])
        }
      }
    }
  }

  async revertMigration(migrations: GBarMigration[]) {
    const revertMigrationList: GBarMigration[] = []

    for (const it of migrations) {
      const path = `${MIGRATION_FILES_PATH}/${it.timestamp}-${MIGRATION_FILE_PREFIX}.ts`

      if (fs.existsSync(path)) { break; }
      revertMigrationList.push(it)
    }

    if(revertMigrationList.length) {
      if (!fs.existsSync(TMP_FOLDER_PATH)) fs.mkdirSync(TMP_FOLDER_PATH);

      for (const it of revertMigrationList) {
        const path = `${TMP_FOLDER_PATH}/${it.timestamp}-${MIGRATION_FILE_PREFIX}.ts`

        if (it.code) {
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


      for (const it of revertMigrationList) {
        const path = `${TMP_FOLDER_PATH}/${it.timestamp}-${MIGRATION_FILE_PREFIX}.ts`
        if (fs.existsSync(path)) {
          await this.undoLastMigration()
        }
      }

      fs.rmSync(TMP_FOLDER_PATH, { recursive: true, force: true });
    }
  }
}

(async () => {
  const dataSource = await CommandUtils.loadDataSource(path.resolve(process.cwd(), DATASOURCE_FILE_PATH));
  dataSource.setOptions({
    subscribers: [],
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    logging: ["query", "error", "schema"]
  });
  await dataSource.initialize();

  const migrationExecutor = new AppMigrationExecutor(dataSource);
  await migrationExecutor.addMigrationColumn("code");
  const executedMigrations = await migrationExecutor.getAllExecutedMigrations();
  await migrationExecutor.saveFileToExecutedMigration(executedMigrations);
  await dataSource.destroy()
  await migrationExecutor.revertMigration(executedMigrations);
})()
