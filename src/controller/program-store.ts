import * as fs from "fs";
import { inject, injectable } from "inversify";
import * as path from "path";

import { IClock, IControllerSettings, INJECTABLES, IProgram, IProgramStore, ProgramConfig, ProgramMode } from "./types";

@injectable()
export class ProgramStore implements IProgramStore {
    private _ext: string = ".json";

    constructor(
        @inject(INJECTABLES.ControllerSettings) private settings: IControllerSettings,
        @inject(INJECTABLES.ProgramFactory) private programFactory: () => IProgram) { }

    public init(): void {
        // check if config exists
        if (!fs.existsSync(this.configPath)) {
            throw new Error("Cannot find program store configuration file at " + this.configPath);
        }
    }

    public reset(): void {
        // clear the config
        if (this.configPath && fs.existsSync(this.configPath)) {
            fs.unlinkSync(this.configPath);
        }

        // delete all json files in the program store
        const files: string[] = fs.readdirSync(path.join(this.settings.programStoreDir, "programs"));
        files.forEach((f: string) => {
            if (f.endsWith(this._ext)) {
                fs.unlinkSync(path.join(this.settings.programStoreDir, "programs", f));
            }
        });
    }

    public getConfig(): ProgramConfig {
        // read the stored config data
        const data: any = JSON.parse(fs.readFileSync(this.configPath, "utf8"));

        // validate it
        if (!data.activeProgramIds.saturdayId ||
            !data.activeProgramIds.sundayId ||
            !data.activeProgramIds.weekdayId) {
            throw new Error("Invalid program config " + JSON.stringify(data));
        }
        // return the result
        const result = new ProgramConfig();
        result.activeProgramIds[ProgramMode.Saturday] = data.activeProgramIds.saturdayId;
        result.activeProgramIds[ProgramMode.Sunday] = data.activeProgramIds.sundayId;
        result.activeProgramIds[ProgramMode.Weekday] = data.activeProgramIds.weekdayId;

        return result;
    }

    public getPrograms(): IProgram[] {
        const result: IProgram[] = [];
        const files: string[] = fs.readdirSync(path.join(this.settings.programStoreDir, "programs"));

        // get a list of all json files in the program store
        files.forEach((f: string) => {
            if (f.endsWith(this._ext)) {
                const id = f.substr(0, f.length - this._ext.length);
                const program = this.programFactory();
                program.loadFromJson(
                    fs.readFileSync(this.makeProgramPath(id), "utf-8"));
                result.push(program);
            }
        });

        return result;
    }

    public saveConfig(config: ProgramConfig): void {
        const data: any = {
            activeProgramIds: {
                saturdayId: config.activeProgramIds[ProgramMode.Saturday],
                sundayId: config.activeProgramIds[ProgramMode.Sunday],
                weekdayId: config.activeProgramIds[ProgramMode.Weekday],
            },
        };
        fs.writeFileSync(this.configPath, JSON.stringify(data));
    }

    public savePrograms(programs: IProgram[]): void {
        // remove any existing programs
        fs.readdirSync(path.join(this.settings.programStoreDir, "programs"))
            .forEach((f: string) => {
                if (f.endsWith(this._ext)) {
                    fs.unlink(path.join(this.settings.programStoreDir, f));
                }
            });

        // write the updated programs
        programs.forEach((p) => {
            fs.writeFileSync(this.makeProgramPath(p.id), p.toJson());
        });
    }

    private makeProgramPath(id: string): string {
        return path.join(this.settings.programStoreDir, "programs", id + this._ext);
    }

    private get configPath(): string {
        return path.join(this.settings.programStoreDir, "programs.json");
    }
}