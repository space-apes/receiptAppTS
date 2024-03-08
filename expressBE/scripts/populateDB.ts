import {getDBPool, populateDB} from './sqlPopulationUtils';

async function main(){

    const dbPool = await getDBPool();
    await populateDB(dbPool);
}

main();





