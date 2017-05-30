import sinon from 'sinon';
import { expect } from 'chai';
import childProcessPromise from 'child-process-promise';
import BPromise from 'bluebird';

const brctl = require('../dist');

describe('bridge basic operations', () => {
  let execStub;

  before(() => {
    // Lets create a stub arround exec operation
    execStub = sinon.stub(childProcessPromise, 'exec');
  });

  it('can create a bridge', (done) => {
    // On success both stderr and stdout are empty...
    execStub.returns(BPromise.resolve({ stdout: '', stderr: '' }));

    brctl.createBridge('testBridge')
      .then((result) => {
        expect(result).to.be.equal(null);
        done(null);
      })
      .catch(err => done(err));
  });

  it('handle errors from brctl', (done) => {
    // Tipical error: No permissions...
    execStub.returns(BPromise.resolve({ stdout: '', stderr: 'SIOCSIFFLAGS: Operation not permitted' }));

    brctl.createBridge('testBridge')
      .then((result) => {
        done('It has resolved with ', result);
      })
      .catch((err) => {
        expect(err).to.not.be.equal(null);
        done();
      });
  });
  it('can add ifaces to a bridge', (done) => {
    // On success both stderr and stdout are empty...
    execStub.returns(BPromise.resolve({ stdout: '', stderr: '' }));

    brctl.addIfaceToBridge('eth0', 'testBridge')
      .then((result) => {
        expect(result).to.be.equal(null);
        done(null);
      })
      .catch(err => done(err));
  });
  it('can create a enable a bridge', (done) => {
    // On success both stderr and stdout are empty...
    execStub.returns(BPromise.resolve({ stdout: '', stderr: '' }));

    brctl.enableBridge('testBridge')
      .then((result) => {
        expect(result).to.be.equal(null);
        done(null);
      })
      .catch(err => done(err));
  });
  it('can create a disable a bridge', (done) => {
    // On success both stderr and stdout are empty...
    execStub.returns(BPromise.resolve({ stdout: '', stderr: '' }));

    brctl.enableBridge('testBridge')
      .then((result) => {
        expect(result).to.be.equal(null);
        done(null);
      })
      .catch(err => done(err));
  });
  it('can delete a bridge', (done) => {
    // On success both stderr and stdout are empty...
    execStub.returns(BPromise.resolve({ stdout: '', stderr: '' }));

    brctl.deleteBridge('testBridge')
      .then((result) => {
        expect(result).to.be.equal(null);
        done(null);
      })
      .catch(err => done(err));
  });
});
