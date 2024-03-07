import express from 'express';
import {attachMiddleware} from '../middleware';

const app = attachMiddleware(express());

export default app; 