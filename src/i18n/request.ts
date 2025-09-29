import { getRequestConfig, GetRequestConfigParams, RequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";


const createRequestConfig = async ({requestLocale}: GetRequestConfigParams): Promise<RequestConfig> => {
	const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;	
	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	};
};

export default getRequestConfig(createRequestConfig);
