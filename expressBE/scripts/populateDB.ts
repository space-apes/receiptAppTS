import {getDBPool, populateDB} from './populationUtils';

async function main(){
    const dbPool = await getDBPool();

    populateDB(dbPool);
}

main();





