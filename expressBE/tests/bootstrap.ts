import {dropTables, populateDB, getDBPool} from '../scripts/sqlPopulationUtils';

/* global setup for tests.
   remove all tables in test database 
   create tables and populate with test data.
*/
const bootStrap = async () => {
        let dbPool = await getDBPool();
        await dropTables(dbPool);
        dbPool = await getDBPool();
        await populateDB(dbPool);

};

export default bootStrap;
