import {getDBPool, dropTables} from './populationUtils';

//CAN SET YOUR TABLES HERE
const tablesToDrop: string[] = [
    "users",
    "transactions",
    "transactionsItems"
];

async function main(){
    const dbPool = await getDBPool();

    dropTables(tablesToDrop, dbPool);
}

main();





