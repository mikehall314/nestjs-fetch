import { Inject, Injectable } from '@nestjs/common';
import { FETCH_MODULE_OPTIONS } from './fetch.constants';
import { FetchModuleOptions } from './fetch-module.interface';
import buildFullPath from './helpers/buildFullPath';

@Injectable()
export class FetchService {
	constructor(
		@Inject(FETCH_MODULE_OPTIONS)
		private readonly defaults: FetchModuleOptions = {},
	) {}

	request(request: Request): Promise<Response> {
		return fetch(request);
	}

	private createRequest(
		url: URL | string,
		options: FetchModuleOptions,
	): Request {
		const { baseUrl, ...init } = { ...this.defaults, ...options };
		return new Request(buildFullPath(baseUrl, url), init);
	}

	get(url: URL | string, options: FetchModuleOptions = {}): Promise<Response> {
		const request = this.createRequest(url, { ...options, method: 'GET' });
		return this.request(request);
	}

	head(url: URL | string, options: FetchModuleOptions = {}): Promise<Response> {
		const request = this.createRequest(url, { ...options, method: 'HEAD' });
		return this.request(request);
	}

	delete(
		url: URL | string,
		options: FetchModuleOptions = {},
	): Promise<Response> {
		const request = this.createRequest(url, { ...options, method: 'DELETE' });
		return this.request(request);
	}

	patch(
		url: URL | string,
		options: FetchModuleOptions = {},
	): Promise<Response> {
		const request = this.createRequest(url, { ...options, method: 'PATCH' });
		return this.request(request);
	}

	put(url: URL | string, options: FetchModuleOptions = {}): Promise<Response> {
		const request = this.createRequest(url, { ...options, method: 'PUT' });
		return this.request(request);
	}

	post(url: URL | string, options: FetchModuleOptions = {}): Promise<Response> {
		const request = this.createRequest(url, { ...options, method: 'POST' });
		return this.request(request);
	}
}
