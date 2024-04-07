import { DefaultApi } from "./api";
import { Configuration } from "./configuration";

//axios based client
const apiClient = new DefaultApi(new Configuration({
    basePath: process.env.REACT_APP_BE_URL
}));

export default apiClient; 