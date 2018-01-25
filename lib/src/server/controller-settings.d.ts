import { IControllerSettings } from "../controller/types";
export declare class ControllerSettings implements IControllerSettings {
    readonly programStore: string;
    readonly slotsPerDay: number;
    readonly boilerPin: number;
    readonly hwPumpPin: number;
    readonly chPumpPin: number;
    readonly maxOverrideDuration: number;
}