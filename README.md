# nestjs-fetch

A lightweight NestJS wrapper around the native `fetch()` API.

The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is
awesome, but until recently we have needed a library to use it with Node. As of
Node 18, Fetch is available by default (based on the `undici` library). Hurrah!
This library wraps a small API around native `fetch()` so it can be used in
NestJS instead of `@nestjs/axios`.

Note: This is not a drop-in replacement for `@nestjs/axios` or the `HttpModule`.
It has a completely different API.

## Installation

```bash
npm install nestjs-fetch
```

### Usage

Import the `FetchModule` in your application module.

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FetchModule } from 'nestjs-fetch';

@Module({
	imports: [FetchModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
```

The `FetchService` is now available as a provider in your application.

```ts
import { Injectable } from '@nestjs/common';
import { FetchService } from 'nestjs-fetch';

@Injectable()
export class AppService {
	constructor(private readonly fetch: FetchService) {}

	async getExample(): Promise<string> {
		const response = await this.fetch.get('http://example.com/');
		return response.text();
	}
}
```

### API

The public API presents six helper methods for making HTTP requests. The first
argument to each method is a URL (either a `URL` object or a string); the second
argument is an optional list of configuration options.

Each of these helpers returns a `Response` object.
[This `Response` object](https://developer.mozilla.org/en-US/docs/Web/API/Response)
is documented over on MDN. You will probably want to await `response.json()` or
`response.text()` to retrieve the body content.

```ts
interface FetchService {
	get(url: URL | string, options?: FetchModuleOptions): Promise<Response>;
	head(url: URL | string, options?: FetchModuleOptions): Promise<Response>;
	post(url: URL | string, options?: FetchModuleOptions): Promise<Response>;
	put(url: URL | string, options?: FetchModuleOptions): Promise<Response>;
	patch(url: URL | string, options?: FetchModuleOptions): Promise<Response>;
	delete(url: URL | string, options?: FetchModuleOptions): Promise<Response>;
}
```

`FetchModuleOptions` includes all the
[options you can send to a `Request` object](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request),
plus one additional option: `baseUrl`. If you supply a relative URL as the
argument to the `FetchService` then it will be resolved against the `baseUrl`.

### Configuration with Nest

Set up as a provider in your app module:

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FetchModule } from 'nestjs-fetch';

@Module({
	imports: [FetchModule.register({ baseUrl: 'http://example.com' })],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
```

Async set up is also supported.

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FetchModule } from 'nestjs-fetch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		FetchModule.registerAsync({
			inject: [ConfigService],
			useFactory(config: ConfigService) {
				return { keepalive: config.get('ENABLE_KEEPALIVE') };
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
```

## Requirements

- A version of Node with native `fetch()`; `>=17.5` with `fetch()` flagged on,
  or `>=18.0` which has `fetch()` enabled by default.
- NestJS >= 8.x

## License

This project is [MIT licensed](LICENSE).
