"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
require("reflect-metadata");
var controller_settings_1 = require("./controller-settings");
var environment_settings_1 = require("./environment-settings");
var types_1 = require("../../../src/controller/types");
var utils_1 = require("../../../src/common/utils");
var basic_control_strategy_1 = require("../../../src/controller/basic-control-strategy");
var clock_1 = require("../../../src/controller/clock");
var controller_1 = require("../../../src/controller/controller");
var boiler_1 = require("../../../src/controller/devices/boiler");
var ch_pump_1 = require("../../../src/controller/devices/ch-pump");
var hw_pump_1 = require("../../../src/controller/devices/hw-pump");
var environment_1 = require("../../../src/controller/environment");
var override_manager_1 = require("../../../src/controller/override-manager");
var program_1 = require("../../../src/controller/program");
var program_manager_1 = require("../../../src/controller/program-manager");
var program_store_1 = require("../../../src/controller/program-store");
var system_1 = require("../../../src/controller/system");
var override_api_1 = require("../../../src/server/api/override-api");
var program_api_1 = require("../../../src/server/api/program-api");
var program_config_api_1 = require("../../../src/server/api/program-config-api");
var status_api_1 = require("../../../src/server/api/status-api");
var app_1 = require("../../../src/server/app");
exports.container = new inversify_1.Container();
exports.container.bind(types_1.INJECTABLES.SlotsPerDay).toConstantValue(10);
exports.container.bind(types_1.INJECTABLES.App).to(app_1.App).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.Controller).to(controller_1.Controller).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.ControlStrategy).to(basic_control_strategy_1.BasicControlStrategy).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.ControllerSettings).to(controller_settings_1.ControllerSettings).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.Environment).to(environment_1.Environment).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.EnvironmentSettings).to(environment_settings_1.EnvironmentSettings).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.ProgramStore).to(program_store_1.ProgramStore).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.ProgramManager).to(program_manager_1.ProgramManager).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.Clock).to(clock_1.Clock).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.System).to(system_1.System).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.OverrideManager).to(override_manager_1.OverrideManager).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.Boiler).to(boiler_1.Boiler).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.CHPump).to(ch_pump_1.CHPump).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.HWPump).to(hw_pump_1.HWPump).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.Utils).to(utils_1.Utils).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.ProgramConfigApi).to(program_config_api_1.ProgramConfigApi).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.ProgramApi).to(program_api_1.ProgramApi).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.StatusApi).to(status_api_1.StatusApi).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.OverrideApi).to(override_api_1.OverrideApi).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.Program).to(program_1.Program);
exports.container.bind(types_1.INJECTABLES.ProgramFactory)
    .toFactory(function (context) {
    return function () {
        return context.container.get(types_1.INJECTABLES.Program);
    };
});