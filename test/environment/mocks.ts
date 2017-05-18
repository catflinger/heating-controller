import { injectable } from "inversify";
import {IEnvironmentSettings, INJECTABLES } from "../../src/controller/types";

@injectable()
export class MockEnvironmentSettings implements IEnvironmentSettings {
    oneWireDirectory: string = __dirname + "/data";


}