import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {execSync} from "child_process";

yargs(hideBin(process.argv)).command("* [name]", "", () => {}, (argv) => {
  const migrationName = (argv.name != null) ? argv.name : "migration";
  execSync(`npx typeorm-ts-node-esm migration:generate ./src/migrations/${migrationName} -d ./src/db/dataSource.ts`,   {stdio: 'inherit'})
}).argv;
