import {getDBPool, dropTables} from './sqlPopulationUtils';


async function main(){

    const dbPool = await getDBPool();
    await dropTables(dbPool);
}

main();





