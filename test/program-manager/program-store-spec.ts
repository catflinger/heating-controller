
import { IControllerSettings, IProgram, IProgramStore, ProgramConfig, INJECTABLES, ProgramMode } from "../../src/controller/types";
import { Program } from "../../src/controller/program";
import { ProgramStore } from "../../src/controller/program-store";
import { container } from "./inversify.config.test";
import * as fs from "fs";
import * as Path from "path";

import * as chai from "chai";
import "mocha";

const expect = chai.expect;

let settings: IControllerSettings = container.get<IControllerSettings>(INJECTABLES.ControllerSettings);

let slotsPerDay = container.get<number>(INJECTABLES.SlotsPerDay);

const minHWTemp = 40;
const maxHWTemp = 50;

function getProgramPath(id: string): string {
    return Path.join(settings.programStoreDir, "programs", id + ".json");
}

let latestFilePath: string = Path.join(settings.programStoreDir, "programs.json");
let programsDir: string = Path.join(settings.programStoreDir, "programs");

let lastProgramId: string = null;
let programStore: IProgramStore;
let programFactory: () => IProgram = container.get<() => IProgram>(INJECTABLES.ProgramFactory);

function removeProgramFile(id: string) {
    let path: string = getProgramPath(id);
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

// delete any saved program info
if (fs.existsSync(latestFilePath)) {
    fs.unlinkSync(latestFilePath);
}

// delete any program files
let files: string[] = fs.readdirSync(programsDir);
files.forEach((f) => {
    fs.unlinkSync(Path.join(programsDir, f));
});

describe("program-store", () => {

    describe("bootstrap", () => {

        it("should fail to load without cofig", () => {
            expect(() => { container.get<IProgramStore>(INJECTABLES.ProgramStore) }).to.throw;
        });

        it("should load with existing config", () => {
            // add some default config
            const program: IProgram = programFactory();

            const defaultConfig = {
                activeProgramIds: {
                    saturdayId: program.id,
                    sundayId: program.id,
                    weekdayId: program.id,
                }
            };
            fs.writeFileSync(latestFilePath, JSON.stringify(defaultConfig), "utf-8");
            fs.writeFileSync(Path.join(programsDir, program.id + ".json"), program.toJson(), "utf-8");

            programStore = container.get<IProgramStore>(INJECTABLES.ProgramStore);

            expect(programStore).not.to.be.undefined;

            let config: ProgramConfig = programStore.getConfig();

            // expect the default config to be loaded
            expect(config).not.to.be.undefined;
            expect(config.activeProgramIds.length).to.equal(3);

            expect(config.activeProgramIds[0]).to.equal(program.id);
            expect(config.activeProgramIds[1]).to.equal(program.id);
            expect(config.activeProgramIds[2]).to.equal(program.id);

            let programs: IProgram[] = programStore.getPrograms();

            //one programs should be loaded
            expect(programs).not.to.be.undefined;
            expect(programs.length).to.equal(1);
        });

        it("should add a new program", () => {
            // create a new program
            let programs = programStore.getPrograms();
            const newProgram: IProgram = programFactory();
            programs.push(newProgram);

            programStore.savePrograms(programs);

            programs = programStore.getPrograms();

            //two programs should be loaded
            expect(programs).not.to.be.undefined;
            expect(programs.length).to.equal(2);

            const result = programs.find((p) => p.id === newProgram.id);

            expect(result.id.length).to.be.greaterThan(0);
        });

    });

    describe("reset", () => {
        it("should remove all config and programs", () => {
            programStore.reset();

            expect(fs.existsSync(latestFilePath)).to.be.false;
            expect(() => {
                fs.readdirSync(programsDir).forEach((f) => {
                    if (f.endsWith(".json")) {
                        throw new Error();
                    }
                });
            }).not.to.throw;
        });
    });


});