import { Container, interfaces } from "inversify";
import * as path from "path";
import "reflect-metadata";

import {
    // the injectable interfaces
    IApi,
    IClock,
    IControllable,
    IController,
    IControllerSettings,
    IControlStrategy,
    IDigitalOutput,
    IEnvironment,
    IEnvironmentSettings,
    INJECTABLES,
    IOverrideManager,
    IProgram,
    IProgramManager,
    IProgramStore,
    ISwitchable,
    ILogger,
} from "../../../src/controller/types";

import { Utils } from "../../../src/common/utils";

import { BasicControlStrategy } from "../../../src/controller/basic-control-strategy";
import { Clock } from "../../../src/controller/clock";
import { Controller } from "../../../src/controller/controller";
import { Boiler } from "../../../src/controller/devices/boiler";
import { CHPump } from "../../../src/controller/devices/ch-pump";
import { HWPump } from "../../../src/controller/devices/hw-pump";
import { Environment } from "../../../src/controller/environment";
import { OverrideManager } from "../../../src/controller/override-manager";
import { Program } from "../../../src/controller/program";
import { ProgramManager } from "../../../src/controller/program-manager";
import { ProgramStore } from "../../../src/controller/program-store";
import { System } from "../../../src/controller/system";
import { OneWireApi } from "../../../src/server/api/one-wire-api";
import { OverrideApi } from "../../../src/server/api/override-api";
import { ProgramApi } from "../../../src/server/api/program-api";
import { ProgramConfigApi } from "../../../src/server/api/program-config-api";
import { StatusApi } from "../../../src/server/api/status-api";
import { App } from "../../../src/server/app";
import { TestingInjectables, IClean } from "../../common/injectables-test";
import { Clean } from "../../common/clean";
import { SensorApi } from "../../../src/server/api/sensor-api";
import { LoggerApi } from "../../../src/server/api/logger-api";
import { Logger } from "../../../src/logger/logger";
import { ControllerSettings } from "../../../src/controller/controller-settings";
import { EnvironmentSettings } from "../../../src/controller/environment-settings";
import { SensorConfigApi } from "../../../src/server/api/sensor-config-api";

export const container = new Container();

// testing modules
container.bind<IClean>(TestingInjectables.Clean).to(Clean).inSingletonScope();

// constants
container.bind<number>(INJECTABLES.SlotsPerDay).toConstantValue(10);
container.bind<string>(INJECTABLES.AppRootDir).toConstantValue(path.join(__dirname, "data"));
container.bind<string>(INJECTABLES.GpioRootDir).toConstantValue(path.join(__dirname, "data", "gpio"));
container.bind<string>(INJECTABLES.OneWireDir).toConstantValue(path.join(__dirname, "data", "1wire"));
// singletons
container.bind<App>(INJECTABLES.App).to(App).inSingletonScope();
container.bind<IController>(INJECTABLES.Controller).to(Controller).inSingletonScope();
container.bind<IControlStrategy>(INJECTABLES.ControlStrategy).to(BasicControlStrategy).inSingletonScope();
container.bind<IControllerSettings>(INJECTABLES.ControllerSettings).to(ControllerSettings).inSingletonScope();
container.bind<IEnvironment>(INJECTABLES.Environment).to(Environment).inSingletonScope();
container.bind<IEnvironmentSettings>(INJECTABLES.EnvironmentSettings).to(EnvironmentSettings).inSingletonScope();
container.bind<IProgramStore>(INJECTABLES.ProgramStore).to(ProgramStore).inSingletonScope();
container.bind<IProgramManager>(INJECTABLES.ProgramManager).to(ProgramManager).inSingletonScope();
container.bind<IClock>(INJECTABLES.Clock).to(Clock).inSingletonScope();
container.bind<IControllable>(INJECTABLES.System).to(System).inSingletonScope();
container.bind<IOverrideManager>(INJECTABLES.OverrideManager).to(OverrideManager).inSingletonScope();
container.bind<ISwitchable>(INJECTABLES.Boiler).to(Boiler).inSingletonScope();
container.bind<ISwitchable>(INJECTABLES.CHPump).to(CHPump).inSingletonScope();
container.bind<ISwitchable>(INJECTABLES.HWPump).to(HWPump).inSingletonScope();
container.bind<Utils>(INJECTABLES.Utils).to(Utils).inSingletonScope();
container.bind<ILogger>(INJECTABLES.Logger).to(Logger).inSingletonScope();

// server config
container.bind<IApi>(INJECTABLES.ProgramConfigApi).to(ProgramConfigApi).inSingletonScope();
container.bind<IApi>(INJECTABLES.ProgramApi).to(ProgramApi).inSingletonScope();
container.bind<IApi>(INJECTABLES.StatusApi).to(StatusApi).inSingletonScope();
container.bind<IApi>(INJECTABLES.OverrideApi).to(OverrideApi).inSingletonScope();
container.bind<IApi>(INJECTABLES.SensorApi).to(SensorApi).inSingletonScope();
container.bind<IApi>(INJECTABLES.LogApi).to(LoggerApi).inSingletonScope();
container.bind<IApi>(INJECTABLES.OneWireApi).to(OneWireApi).inSingletonScope();
container.bind<IApi>(INJECTABLES.SensorConfigApi).to(SensorConfigApi).inSingletonScope();

// discrete instances
container.bind<IProgram>(INJECTABLES.Program).to(Program);

// factory methods
container.bind<interfaces.Factory<IProgram>>(INJECTABLES.ProgramFactory)
    .toFactory<IProgram>((context: interfaces.Context) => {
        return () => {
            return context.container.get<IProgram>(INJECTABLES.Program);
        };
    });
