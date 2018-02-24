import { Router } from "express";
import { IApi } from "../../controller/types";
export declare class OverrideApi implements IApi {
    private controller;
    private utils;
    addRoutes(router: Router): void;
}