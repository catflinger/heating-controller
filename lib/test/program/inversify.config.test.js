"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var types_1 = require("../../src/controller/types");
var program_1 = require("../../src/controller/program");
var mock_controller_settings_1 = require("../common/mock-controller-settings");
exports.container = new inversify_1.Container();
exports.container.bind(types_1.INJECTABLES.SlotsPerDay).toConstantValue(10);
exports.container.bind(types_1.INJECTABLES.Program).to(program_1.Program).inSingletonScope();
exports.container.bind(types_1.INJECTABLES.ControllerSettings).to(mock_controller_settings_1.MockControllerSettings).inSingletonScope();