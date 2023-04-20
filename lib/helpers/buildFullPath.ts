import combineURLs from './combineURLs';
import isAbsoluteURL from './isAbsoluteURL';

export default function buildFullPath(baseURL, requestedURL) {
	if (baseURL && !isAbsoluteURL(requestedURL)) {
		return combineURLs(baseURL, requestedURL);
	}
	return requestedURL;
}
