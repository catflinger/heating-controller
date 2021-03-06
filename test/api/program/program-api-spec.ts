import * as mocha from 'mocha';
var chai = require('chai');
// import * as chai from 'chai';

import { container } from "./inversify.config";
import { App } from '../../../src/server/app';
import { INJECTABLES, IControllerSettings } from '../../../src/controller/types';
import { IClean, TestingInjectables } from "../../common/injectables-test";

container.get<IClean>(TestingInjectables.Clean).clean({});

chai.use(require("chai-http"));
const expect = chai.expect;

let settings = container.get<IControllerSettings>(INJECTABLES.ControllerSettings);


const app = container.get<App>(INJECTABLES.App).start();

describe('Pogram API', () => {

  it('should be json', () => {
    return chai.request(app).get('/api/program')
    .then((res: any) => {
      expect(res.type).to.eql('application/json');
    });
  });

  it('should contain program data', () => {
    return chai.request(app).get('/api/program')
    .then((res: any) => {
        expect(res.status).to.equal(200);
        expect(res.body.items).not.to.be.undefined;
        expect(Array.isArray(res.body.items)).to.be.true;
        expect(res.body.items.length).to.equal(1);
    });
  });

});
