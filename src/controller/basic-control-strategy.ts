import {
    ControlStateSnapshot,
    EnvironmentSnapshot,
    IControlStrategy,
    IProgram,
    Snapshot,
} from "./types";

export class BasicControlStrategy implements IControlStrategy {

    public calculateControlState(program: IProgram, currentState: Snapshot): ControlStateSnapshot {
        let boiler: boolean = false;
        let hwPump: boolean = false;
        const chPump: boolean = false;

        // If the temp is too low, keep trying to raise the temmperature.   If the temperature is over the minimum
        // already then keep the boiler on until it is over the maximum.  This histeresis avoids cycling on/offf around
        // the minimum temp
        if (currentState.environment.hwTemperature < program.minHWTemp ||
            (currentState.environment.hwTemperature < program.maxHWTemp && currentState.control.boiler)) {
            boiler = true;
            hwPump = true;
        }
        return new ControlStateSnapshot(boiler, hwPump, chPump);
    }
}
