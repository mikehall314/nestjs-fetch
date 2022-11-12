# nestjs-fetch

A thin wrapper around native `fetch()` for use with NestJS.

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
    FetchModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
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

- A version of Node with native `fetch()` - `17.5` with `fetch()` flagged on, or
  `18.0` which has it by default.
- NestJS >= 8.x

## License

This project is [MIT licensed](LICENSE).
