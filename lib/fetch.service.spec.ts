import { Test } from '@nestjs/testing';
import { FETCH_MODULE_OPTIONS } from './fetch.constants';
import { FetchService } from './fetch.service';

describe('FetchService', () => {
  let service: FetchService;
  let fetch: jest.SpyInstance;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        FetchService,
        {
          provide: FETCH_MODULE_OPTIONS,
          useValue: { keepalive: true },
        },
      ],
    }).compile();

    service = app.get(FetchService);
    fetch = jest.spyOn(service, 'request');
  });

  beforeEach(() => fetch.mockResolvedValue(new Response('', { status: 200 })));

  afterEach(() => jest.resetAllMocks());

  afterAll(() => jest.restoreAllMocks());

  describe('.get()', () => {
    it('should use a GET request', async () => {
      expect.assertions(1);

      await service.get('https://example.com/');

      expect(fetch).toBeCalledWith(expect.objectContaining({ method: 'GET' }));
    });

    it('should fetch an absolute URL', async () => {
      expect.assertions(1);

      await service.get('https://example.com/');

      expect(fetch).toBeCalledWith(
        expect.objectContaining({ url: 'https://example.com/' }),
      );
    });

    it('should resolve a relative URL', async () => {
      expect.assertions(1);

      await service.get('/foo', { baseUrl: 'https://example.com/' });

      expect(fetch).toBeCalledWith(
        expect.objectContaining({ url: 'https://example.com/foo' }),
      );
    });

    it('should override baseUrl with absolute URL', async () => {
      expect.assertions(1);

      await service.get('https://example.com/', {
        baseUrl: 'https://example.org/',
      });

      expect(fetch).toBeCalledWith(
        expect.objectContaining({ url: 'https://example.com/' }),
      );
    });

    it('should pass options to request', async () => {
      expect.assertions(1);

      await service.get('https://example.com/', {
        cache: 'no-store',
      });

      expect(fetch).toBeCalledWith(
        expect.objectContaining({ cache: 'no-store' }),
      );
    });

    it('should pass headers to request', async () => {
      expect.assertions(1);

      await service.get('https://example.com/', {
        headers: new Headers({ 'x-test': 'foobar' }),
      });

      const [request] = fetch.mock.lastCall;
      expect(request.headers.get('x-test')).toBe('foobar');
    });

    it('should merge default options', async () => {
      expect.assertions(1);

      await service.get('https://example.com/', {
        cache: 'no-store',
      });

      expect(fetch).toBeCalledWith(
        expect.objectContaining({ cache: 'no-store', keepalive: true }),
      );
    });

    it('should override default options', async () => {
      expect.assertions(1);

      await service.get('https://example.com/', {
        cache: 'no-store',
        keepalive: false,
      });

      expect(fetch).toBeCalledWith(
        expect.objectContaining({ cache: 'no-store', keepalive: false }),
      );
    });

    it('should not override method', async () => {
      expect.assertions(1);

      await service.get('https://example.com/', { method: 'POST' });

      expect(fetch).toBeCalledWith(expect.objectContaining({ method: 'GET' }));
    });

    it('should accept a URL object', async () => {
      expect.assertions(1);

      await service.get(new URL('https://example.com/'));

      expect(fetch).toBeCalledWith(
        expect.objectContaining({ url: 'https://example.com/' }),
      );
    });
  });

  describe('.head()', () => {
    it('should use a HEAD request', async () => {
      expect.assertions(1);

      await service.head('https://example.com/');

      expect(fetch).toBeCalledWith(expect.objectContaining({ method: 'HEAD' }));
    });
  });

  describe('.post()', () => {
    it('should use a POST request', async () => {
      expect.assertions(1);

      await service.post('https://example.com/');

      expect(fetch).toBeCalledWith(expect.objectContaining({ method: 'POST' }));
    });
  });

  describe('.put()', () => {
    it('should use a PUT request', async () => {
      expect.assertions(1);

      await service.put('https://example.com/');

      expect(fetch).toBeCalledWith(expect.objectContaining({ method: 'PUT' }));
    });
  });

  describe('.patch()', () => {
    it('should use a PATCH request', async () => {
      expect.assertions(1);

      await service.patch('https://example.com/');

      expect(fetch).toBeCalledWith(
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
  });

  describe('.delete()', () => {
    it('should use a DELETE request', async () => {
      expect.assertions(1);

      await service.delete('https://example.com/');

      expect(fetch).toBeCalledWith(
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
