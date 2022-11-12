import { DynamicModule, Module, Provider } from '@nestjs/common';
import { FETCH_MODULE_OPTIONS } from './fetch.constants';
import { FetchService } from './fetch.service';
import type {
  FetchModuleAsyncOptions,
  FetchModuleOptions,
  FetchModuleOptionsFactory,
} from './fetch-module.interface';

@Module({
  providers: [
    FetchService,
    {
      provide: FETCH_MODULE_OPTIONS,
      useValue: {},
    },
  ],
  exports: [FetchService],
})
export class FetchModule {
  static register(options: FetchModuleOptions = {}): DynamicModule {
    return {
      module: FetchModule,
      providers: [
        FetchService,
        {
          provide: FETCH_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static registerAsync(options: FetchModuleAsyncOptions): DynamicModule {
    return {
      module: FetchModule,
      imports: options.imports,
      providers: [
        FetchService,
        ...this.createAsyncProviders(options),
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(
    options: FetchModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      { provide: options.useClass, useClass: options.useClass },
    ];
  }

  private static createAsyncOptionsProvider(
    options: FetchModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FETCH_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: FETCH_MODULE_OPTIONS,
      useFactory: (factory: FetchModuleOptionsFactory) =>
        factory.createFetchOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
