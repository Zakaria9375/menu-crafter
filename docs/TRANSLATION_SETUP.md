# Auto-Translation Setup Guide

This guide explains how to set up automatic translation for your website content when adding new languages.

## Overview

The auto-translation feature allows you to:
- Automatically translate website content to any supported language
- Choose from multiple translation providers (Google, LibreTranslate, OpenAI)
- Translate all sections or specific sections only
- Review and edit auto-translated content before publishing

## Supported Translation Providers

### 1. Google Translate API (Recommended)
- **Pros**: Fast, accurate, free tier available (500k characters/month)
- **Cons**: Requires Google Cloud account
- **Best for**: Most users, production use

### 2. LibreTranslate (Free & Open Source)
- **Pros**: Completely free, no API key needed for public instance, can self-host
- **Cons**: Slower than Google, slightly lower quality
- **Best for**: Budget-conscious users, privacy-focused projects

### 3. OpenAI GPT
- **Pros**: Highest quality translations, context-aware
- **Cons**: Most expensive, slower
- **Best for**: Premium applications requiring best quality

## Setup Instructions

### Option 1: Google Translate API (Recommended)

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable the Translation API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Translation API"
   - Click "Enable"

3. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

4. **Add to Environment Variables**
   ```bash
   GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   ```

5. **Pricing**
   - Free tier: 500,000 characters per month
   - After free tier: $20 per 1 million characters
   - [Pricing details](https://cloud.google.com/translate/pricing)

### Option 2: LibreTranslate (Free)

1. **Using Public Instance** (Easiest)
   ```bash
   # No API key needed for basic use
   LIBRETRANSLATE_API_URL=https://libretranslate.com
   ```

2. **Self-Hosting** (For privacy/unlimited use)
   ```bash
   # Install Docker
   docker pull libretranslate/libretranslate

   # Run LibreTranslate
   docker run -d -p 5000:5000 libretranslate/libretranslate

   # Update .env
   LIBRETRANSLATE_API_URL=http://localhost:5000
   ```

3. **Premium Features** (Optional)
   - Get API key from [LibreTranslate.com](https://libretranslate.com/)
   - Adds higher rate limits and priority processing
   ```bash
   LIBRETRANSLATE_API_KEY=your_api_key
   ```

### Option 3: OpenAI GPT

1. **Get OpenAI API Key**
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Navigate to [API Keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"

2. **Add to Environment Variables**
   ```bash
   OPENAI_API_KEY=sk-...your_key_here
   ```

3. **Pricing**
   - GPT-3.5-turbo: ~$0.002 per 1000 tokens (very cheap)
   - GPT-4: ~$0.03 per 1000 tokens (higher quality)
   - [Pricing details](https://openai.com/pricing)

## How to Use

### In the Website Editor

1. **Navigate to Website Editor**
   - Go to your admin panel
   - Click on "Website" in the sidebar

2. **Switch to a Non-Primary Language**
   - In the Content tab, find the "Language" dropdown
   - Select a language other than your primary language (e.g., if primary is English, select Arabic, French, etc.)

3. **Click "Auto-Translate" Button**
   - You'll see an "Auto-Translate" button appear next to the language selector
   - Click it to open the translation dialog

4. **Choose Translation Provider**
   - Select your preferred provider:
     - **Google Translate**: Best balance of speed and quality
     - **LibreTranslate**: Free and privacy-focused
     - **OpenAI GPT**: Highest quality, context-aware

5. **Translate**
   - Click "Translate Now"
   - Wait for the translation to complete (usually 5-10 seconds)
   - The page will reload with the translated content

6. **Review and Edit**
   - Review the auto-translated content
   - Make any necessary manual adjustments
   - Click "Save Changes" to persist your edits

### Programmatic Usage

You can also use the translation functions in your code:

```typescript
import { autoTranslateWebsiteContent } from "@/lib/db/actions/translation";

// Translate all sections
const result = await autoTranslateWebsiteContent({
  tenantId: "your-tenant-id",
  targetLanguage: "fr", // French
  sourceLanguage: "en", // English
  provider: "google",
});

// Translate specific sections only
const result = await autoTranslateWebsiteContent({
  tenantId: "your-tenant-id",
  targetLanguage: "es", // Spanish
  sourceLanguage: "en",
  provider: "openai",
  sectionsToTranslate: ["hero", "about"], // Only translate these sections
});
```

## Supported Languages

The system supports 20+ languages:
- English (en)
- Arabic (ar)
- Chinese (zh)
- French (fr)
- German (de)
- Hindi (hi)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Portuguese (pt)
- Russian (ru)
- Spanish (es)
- Turkish (tr)
- Dutch (nl)
- Swedish (sv)
- Norwegian (no)
- Danish (da)
- Finnish (fi)
- Polish (pl)
- Czech (cs)

## Best Practices

### 1. Always Review Auto-Translations
- Machine translation is good but not perfect
- Review translations for:
  - Cultural appropriateness
  - Brand voice consistency
  - Technical accuracy
  - Proper nouns (names, brands)

### 2. Use Primary Language as Source
- Always translate from your primary language (usually English)
- This ensures consistency across all translations

### 3. Don't Overwrite Manual Edits
- The auto-translate feature will overwrite existing translations
- If you've made manual edits, they will be lost
- Consider translating section-by-section instead of all at once

### 4. Translation Quality by Provider

**For Marketing Content:**
- Best: OpenAI GPT (context-aware, natural)
- Good: Google Translate
- Acceptable: LibreTranslate

**For Technical Content:**
- Best: Google Translate (consistent terminology)
- Good: OpenAI GPT
- Acceptable: LibreTranslate

**For Large Volumes:**
- Best: Google Translate (fast, cost-effective)
- Acceptable: LibreTranslate (free but slower)
- Avoid: OpenAI (expensive for high volume)

### 5. Cost Management

**Free Options:**
- LibreTranslate public instance (rate limited)
- Self-hosted LibreTranslate (unlimited)
- Google Translate free tier (500k chars/month)

**Paid Options:**
- Google Translate: ~$0.02 per 1000 characters
- OpenAI GPT-3.5: ~$0.002 per 1000 tokens (~750 words)
- OpenAI GPT-4: ~$0.03 per 1000 tokens

**Estimated Costs:**
Typical restaurant website with ~5000 words of content:
- Google Translate: ~$0.10 per language
- OpenAI GPT-3.5: ~$0.013 per language
- OpenAI GPT-4: ~$0.20 per language
- LibreTranslate: Free

## Troubleshooting

### "Translation failed" error
1. Check that your API key is correctly set in `.env`
2. Verify the API service is accessible (not blocked by firewall)
3. Check your API quota/credits haven't been exceeded
4. Review the server logs for detailed error messages

### Translations are low quality
1. Try a different provider (OpenAI usually has best quality)
2. Review and manually edit the translations
3. Consider professional translation services for critical content

### Slow translation
1. LibreTranslate can be slow, especially public instance
2. Consider self-hosting LibreTranslate for better performance
3. Google Translate is typically fastest
4. Translate sections individually rather than all at once

### API quota exceeded
1. Check your usage on the provider's dashboard
2. Consider upgrading to a paid tier
3. Use LibreTranslate as a free alternative
4. Implement rate limiting in your application

## Security Considerations

1. **Never commit API keys**
   - Always use environment variables
   - Add `.env` to `.gitignore`
   - Use `.env.example` for documentation

2. **Protect sensitive content**
   - Translation APIs receive your content
   - For sensitive data, consider self-hosted LibreTranslate
   - Review provider's privacy policies

3. **Rate limiting**
   - Implement rate limiting to prevent abuse
   - Monitor API usage regularly
   - Set up billing alerts

## Advanced Features

### Custom Translation Logic

You can extend the translation system with custom logic:

```typescript
// src/lib/translation/custom-translator.ts
import { translateText } from "@/lib/translation/translator";

export async function translateWithCustomRules(
  text: string,
  targetLanguage: string
) {
  // Pre-processing
  let processedText = text;

  // Don't translate brand names
  const brandNames = ["YourBrand", "ProductName"];
  const placeholders = brandNames.map((name, i) => ({
    placeholder: `__BRAND_${i}__`,
    original: name,
  }));

  placeholders.forEach(({ placeholder, original }) => {
    processedText = processedText.replace(
      new RegExp(original, "gi"),
      placeholder
    );
  });

  // Translate
  const result = await translateText({
    text: processedText,
    targetLanguage,
  });

  // Post-processing - restore brand names
  let finalText = result.translatedText;
  placeholders.forEach(({ placeholder, original }) => {
    finalText = finalText.replace(
      new RegExp(placeholder, "gi"),
      original
    );
  });

  return finalText;
}
```

### Batch Translation

For translating multiple languages at once:

```typescript
async function translateToAllLanguages(
  tenantId: string,
  languages: string[]
) {
  const results = [];

  for (const lang of languages) {
    if (lang === "en") continue; // Skip primary language

    const result = await autoTranslateWebsiteContent({
      tenantId,
      targetLanguage: lang,
      sourceLanguage: "en",
    });

    results.push({ language: lang, result });
  }

  return results;
}
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for error details
3. Consult the translation provider's documentation
4. Open an issue on GitHub (if applicable)

## License

This translation integration is part of your application. Ensure you comply with the terms of service of your chosen translation provider.
