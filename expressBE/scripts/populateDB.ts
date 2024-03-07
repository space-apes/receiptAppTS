import {getDBPool, populateDB} from './sqlPopulationUtils';

async function main(){
    const dbPool = await getDBPool();

    populateDB(dbPool);
}

main();





