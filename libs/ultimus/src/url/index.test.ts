import { parseQueryString } from "./parseQueryString";
import { urlParse } from './urlParse';
import { urlStringify } from './urlStringify';

describe('parseQueryString', () => {
  it('should parse a single key-value pair', () => {
    const result = parseQueryString('key1=value1');
    expect(result).toEqual({ key1: 'value1' });
  });

  it('should handle empty values', () => {
    const result = parseQueryString('key1=');
    expect(result).toEqual({});
  });

  it('should handle special characters in key and value', () => {
    const result = parseQueryString('k%20ey1=v%20alue1');
    expect(result).toEqual({ 'k ey1': 'v alue1' });
  });

  it('should handle multiple key-value pairs', () => {
    const result = parseQueryString('key1=value1&key2=value2');
    expect(result).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should handle false value as empty string', () => {
    const result = parseQueryString('key1=false');
    expect(result).toEqual({ key1: false });
  });
});

describe('urlParse', () => {
  it('should return empty Url object when input is an empty string', () => {
    expect(urlParse('')).toEqual({
      path: [],
      params: {},
      host: ''
    });
  });

  it('should correctly parse a URL without protocol, hash, or query params', () => {
    expect(urlParse('www.example.com/test')).toEqual({
      path: ['www.example.com', 'test'],
      params: {},
      host: '',
    });
  });

  it('should correctly parse a URL with protocol, hash, and query params', () => {
    expect(urlParse('https://www.example.com/test?key1=value1&key2=value2#section')).toEqual({
      protocol: 'https',
      path: ['test'],
      params: { key1: 'value1', key2: 'value2' },
      host: 'www.example.com',
      hash: 'section'
    });
  });

  it('should correctly parse a URL with a host and path', () => {
    expect(urlParse('www.example.com/path1/path2')).toEqual({
      path: ['www.example.com', 'path1', 'path2'],
      params: {},
      host: ''
    });
  });
});


describe('urlStringify', () => {
  it('should return an empty string when r is null', () => {
    const result = urlStringify(null);
    expect(result).toEqual('');
  });

  it('should return an empty string when r does not have host, path, params, or hash', () => {
    const result = urlStringify({});
    expect(result).toEqual('');
  });

  it('should return the correctly formatted URL string when r has all properties', () => {
    const urlObject = {
      protocol: 'https',
      host: 'example.com',
      path: ['path', 'to', 'resource'],
      params: {
        key1: 'value1',
        key2: 'value2'
      },
      hash: 'section1'
    };
    const result = urlStringify(urlObject);
    expect(result).toEqual('https://example.com/path/to/resource?key1=value1&key2=value2#section1');
  });
});