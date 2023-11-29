import {GlobalDataContextType} from '../types';
import { createContext } from "react";


const GlobalContext = createContext<GlobalDataContextType>({} as GlobalDataContextType);

export default GlobalContext; 
