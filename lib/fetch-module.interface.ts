import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export interface FetchModuleOptions extends RequestInit {
  baseUrl?: URL | string;
}

export interface FetchModuleOptionsFactory {
  createFetchOptions(): Promise<FetchModuleOptions> | FetchModuleOptions;
}

export interface FetchModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FetchModuleOptionsFactory>;
  useClass?: Type<FetchModuleOptionsFactory>;
  useFactory?: (
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => Promise<FetchModuleOptions> | FetchModuleOptions;
  inject?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  extraProviders?: Provider[];
}
