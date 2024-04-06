import {Configuration} from './configuration'
import { DefaultApi} from "./api"

describe('ApiClient service', ()=>{
    describe('GET user by Id ', ()=>{
        describe('when passed valid id', ()=>{
            it('should respond with the userId ', async ()=>{
                const defaultApi = new DefaultApi(new Configuration({
                    basePath: 'http://127.0.0.1:4000',
                }));

                let res = await defaultApi.apiUsersUserIdGet(1);

                expect(res.status).toBe(200);
                expect(res.data).toHaveProperty('email');

            });
        })
    })
})