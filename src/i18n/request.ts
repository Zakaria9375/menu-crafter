import { getRequestConfig, GetRequestConfigParams, RequestConfig } from "next-intl/server";
import { Locale, routing } from "./routing";


const createRequestConfig = async ({requestLocale}: GetRequestConfigParams): Promise<RequestConfig> => {
	let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }
	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	};
};

export default getRequestConfig(createRequestConfig);
