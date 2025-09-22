import { getRequestConfig, GetRequestConfigParams, RequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";


const locales = ["en", "ar"];

const createRequestConfig = async ({locale = "en"}: GetRequestConfigParams): Promise<RequestConfig> => {
	if (!locales.includes(locale as string)) {
		notFound();
	}
	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	};
};

export default getRequestConfig(createRequestConfig);
