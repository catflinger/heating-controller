import { ControllerSnapshot } from "./controller-snapshot";
import { ControlStateSnapshot } from "./controlstate-snapshot";
import { DeviceStateSnapshot } from "./devicestate-snapshot";
import { EnvironmentSnapshot } from "./environment-snapshot";
import { OverrideSnapshot } from "./override-snapshot";
import { ProgramSnapshot } from "./program-snapshot";
import { ISnapshot } from "./snapshot";

export class SummarySnapshot implements ISnapshot<SummarySnapshot> {
    private _control: ControlStateSnapshot;
    private _environment: EnvironmentSnapshot;
    private _device: DeviceStateSnapshot;
    private _controller: ControllerSnapshot;

    constructor(control: ControlStateSnapshot,
                environment: EnvironmentSnapshot,
                device: DeviceStateSnapshot,
                controller: ControllerSnapshot) {

        this._control = control;
        this._environment = environment;
        this._device = device;
        this._controller = controller;
    }

    public get control(): ControlStateSnapshot {
        return this._control;
    }

    public get environment(): EnvironmentSnapshot {
        return this._environment;
    }

    public get device(): DeviceStateSnapshot {
        return this._device;
    }

    public get controller(): ControllerSnapshot {
        return this._controller;
    }

    public clone(): SummarySnapshot {
        return new SummarySnapshot(
            this._control.clone(),
            this._environment.clone(),
            this._device.clone(),
            this._controller.clone(),
        );
    }

    public toStorable(): any {
        return {
            control: this._control.toStorable(),
            controller: this._controller.toStorable(),
            device: this._device.toStorable(),
            environment: this._environment.toStorable(),
        };
    }

    public toJson(): string {
        return JSON.stringify(this.toStorable());
    }
}