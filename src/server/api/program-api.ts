import * as Debug from "debug";
import { Router } from "express";
import { inject, injectable } from "inversify";

import { IApi, INJECTABLES, IProgram, IProgramManager } from "../../controller/types";

const debug = Debug("app");
const dump = Debug("dump");

@injectable()
export class ProgramApi implements IApi {
    @inject(INJECTABLES.ProgramManager)
    private programManager: IProgramManager;

    public addRoutes(router: Router): void {

        router.get("/program", (req, res, next) => {
            debug("GET: program");

            try {
                const programs: any[] = [];

                // make a list of program data to return
                this.programManager.listPrograms().forEach((p) => {
                    programs.push(p.toStorable());
                });

                const result = { programs };

                if (dump.enabled) {
                    // TO DO: dump the response to file here
                }

                res.json(result);

            } catch (e) {
                res.status(500).send("could not process this request " + e);
            }
        });

        router.get("/program/:program_id", (req, res, next) => {
            debug("GET: program:program_id");

            res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
            res.header("Expires", "-1");
            res.header("Pragma", "no-cache");

            const programId: string = req.params.program_id;

            try {
                const program: IProgram = this.programManager.getProgram(programId);

                if (program) {
                    res.json({
                        program: program.toStorable(),
                    });
                } else {
                    res.status(404).send("program not found");
                }

            } catch (e) {
                res.status(500).send("could not process this request " + e);
            }
        });

        router.post("/program", (req, res, next) => {
            debug("POST: program");

            // TO DO: implement the changes

            // TO DO: return the new program

            res.status(500).send("Not implemented yet. ");
        });

        router.put("/program/:program_id", (req, res, next) => {
            debug("PUT: program");

            // TO DO: implement the changes

            res.status(500).send("Not implemented yet. ");
        });

        router.post("/program/:program_id", (req, res, next) => {
            debug("POST: program");

            // TO DO: implement the changes

            res.status(500).send("Not implemented yet. ");
        });

        router.delete("/program/:program_id", (req, res, next) => {
            debug("DELETE: program");

            // TO DO: implement the changes

            res.status(500).send("Not implemented yet. ");
        });
    }
}
