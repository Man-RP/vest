import runCreateRef from '../../../../../testUtils/runCreateRef';

import VestTest from 'VestTest';
import addTestToState from 'addTestToState';
import context from 'ctx';
import { setPending } from 'pending';
import { usePending, useTestObjects } from 'stateHooks';
import * as testStatuses from 'testStatuses';

const fieldName = 'unicycle';
const statement = 'I am Root.';

let stateRef;

it.ctx = (str, cb) => it(str, () => context.run({ stateRef }, cb));

describe('VestTest', () => {
  let testObject;

  beforeEach(() => {
    testObject = VestTest({
      fieldName,
      statement,
      testFn: jest.fn(),
    });
  });

  test('TestObject constructor', () => {
    expect(testObject).toMatchSnapshot();
  });

  it('Should have a unique id', () => {
    Array.from({ length: 100 }, () =>
      VestTest({ fieldName, statement, testFn: jest.fn() })
    ).reduce((existing, { id }) => {
      expect(existing[id]).toBeUndefined();
      existing[id] = true;
      return existing;
    }, {});
  });

  describe('testObject.warn', () => {
    it('Should set `.isWarning` to true', () => {
      expect(testObject.isWarning).toBe(false);
      testObject.warn();
      expect(testObject.isWarning).toBe(true);
      expect(testObject).toMatchSnapshot();
    });
  });

  describe('testObject.fail', () => {
    beforeEach(() => {
      jest.resetModules();

      const VestTest = require('VestTest');
      testObject = VestTest({
        fieldName,
        statement,
        testFn: jest.fn(),
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('Should set this.status to FAILED', () => {
      expect(testObject.status).not.toBe(testStatuses.FAILED);
      testObject.fail();
      expect(testObject.status).toBe(testStatuses.FAILED);
    });
  });

  describe('testobject.valueOf', () => {
    test('When `failed` is false', () => {
      expect(testObject.status).not.toBe(testStatuses.FAILED);
      expect(testObject.valueOf()).toBe(true);
    });

    test('When `failed` is true', () => {
      testObject.status = testStatuses.FAILED;
      expect(testObject.valueOf()).toBe(false);
    });
  });

  describe('testObject.cancel', () => {
    beforeEach(() => {
      stateRef = runCreateRef();

      context.run({ stateRef }, () => {
        addTestToState(testObject);
      });
    });
    it.ctx('Should remove a testObject from the state', () => {
      const [testObjects] = useTestObjects();
      expect(testObjects).toEqual(expect.arrayContaining([testObject]));
      testObject.cancel();
      expect(testObjects).toEqual(expect.not.arrayContaining([testObject]));
    });

    it.ctx('Should remove a testObject from the pending state', () => {
      setPending(testObject);
      {
        const [{ pending }] = usePending();
        expect(pending).toEqual(expect.arrayContaining([testObject]));
      }
      testObject.cancel();
      {
        const [{ pending }] = usePending();
        expect(pending).toEqual(expect.not.arrayContaining([testObject]));
      }
    });

    it.ctx('Should remove a testObject from the lagging state', () => {
      const [, setPending] = usePending();
      setPending(state => ({ ...state, lagging: [testObject] }));
      {
        const [{ lagging }] = usePending();
        expect(lagging).toEqual(expect.arrayContaining([testObject]));
      }
      testObject.cancel();
      {
        const [{ lagging }] = usePending();
        expect(lagging).toEqual(expect.not.arrayContaining([testObject]));
      }
    });
  });
});
