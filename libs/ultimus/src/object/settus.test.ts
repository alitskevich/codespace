import { settus } from './settus';

describe('settus function', () => {
  it('should set a value for a single level key', () => {
    const obj = { key1: 'value1', key2: 'value2' };
    settus(obj, 'key1', 'new value');
    expect(obj.key1).toBe('new value');
  });

  it('should set a value for a nested key', () => {
    const obj = {
      level1: {
        level2: {
          key: 'value'
        }
      }
    };
    settus(obj, 'level1.level2.key', 'new value');
    expect(obj.level1.level2.key).toBe('new value');
  });

  it('should set a value for a nested key that doesn\'t exist', () => {
    const obj: any = { level1: {} };
    settus(obj, 'level1.level2.key', 'new value');
    expect(obj.level1.level2.key).toBe('new value');
  });
});