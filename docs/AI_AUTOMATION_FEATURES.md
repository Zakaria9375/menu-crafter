# AI Automation Features Guide

> **Last Updated:** October 14, 2025
> 
> **Purpose:** Implementation guide for AI-powered features: automated translation and menu image-to-data conversion.

---

## Table of Contents

1. [Automated Translation System](#automated-translation-system)
2. [Menu Image to Data Conversion](#menu-image-to-data-conversion)
3. [Implementation Recommendations](#implementation-recommendations)
4. [Cost Analysis](#cost-analysis)
5. [Implementation Roadmap](#implementation-roadmap)

---

## Automated Translation System

### Overview

Automatically translate menu items (names, descriptions, categories) from one language to multiple languages with context-aware AI.

### Use Cases

1. **Bulk Translation**: Translate entire menu when adding new language
2. **Real-time Translation**: Auto-translate as restaurant adds new items
3. **Translation Suggestions**: Suggest translations, let user edit before saving
4. **UI + Content**: Translate both interface (next-intl) and menu content

---

### Solution Comparison

| Service | Best For | Pros | Cons | Cost (est.) |
|---------|----------|------|------|-------------|
| **OpenAI GPT-4** | Context-aware, culinary terms | Excellent quality, understands food context, can preserve cultural nuances | More expensive, slower | ~$0.03/1K tokens (~$0.10 per menu item) |
| **Google Cloud Translation** | High volume, many languages | Fast, cheap, 130+ languages, good quality | Less context-aware | ~$20/1M chars (~$0.01 per menu item) |
| **DeepL API** | European languages, quality | Best quality for EU languages, very natural | Limited languages (31), more expensive | ~$25/1M chars (~$0.015 per menu item) |
| **Azure Translator** | Enterprise, reliability | Good quality, 100+ languages, enterprise SLA | Medium cost | ~$10/1M chars (~$0.007 per menu item) |
| **LibreTranslate** | Privacy, self-hosted | Free, open source, private | Lower quality, need to host | Free (hosting costs) |

---

### Recommended: OpenAI GPT-4 + Google Translate Hybrid

**Strategy:**
1. Use **GPT-4 for initial translation** (context-aware, high quality)
2. Cache translations in database
3. Use **Google Translate as fallback** for cost-sensitive operations

**Why GPT-4 for Food:**
- Understands culinary terms ("al dente", "sous vide")
- Preserves cultural context (doesn't translate "Paella" to "rice dish")
- Can adapt tone (formal vs casual)
- Handles ingredients vs dish names differently

---

### Implementation: GPT-4 Translation

#### Step 1: Install Dependencies

```bash
npm install openai
```

#### Step 2: Create Translation Action

```typescript
// src/lib/ai/translation.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type TranslationRequest = {
  text: string;
  from: string; // 'en'
  to: string; // 'ar'
  context?: 'dish-name' | 'description' | 'category' | 'ingredient';
};

export async function translateWithGPT4(request: TranslationRequest) {
  const { text, from, to, context = 'dish-name' } = request;

  const systemPrompt = getSystemPrompt(context, from, to);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cheaper, faster, still excellent
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.3, // Low temperature for consistency
      max_tokens: 200,
    });

    return {
      success: true,
      translation: response.choices[0].message.content?.trim() || '',
      tokensUsed: response.usage?.total_tokens || 0,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      error: 'Translation failed',
    };
  }
}

function getSystemPrompt(
  context: string,
  fromLang: string,
  toLang: string
): string {
  const basePrompt = `You are a professional culinary translator specializing in restaurant menus. Translate the following ${context} from ${fromLang} to ${toLang}.`;

  const contextRules = {
    'dish-name': `
Rules:
- Keep proper nouns and iconic dish names untranslated (e.g., "Paella", "Sushi", "Croissant")
- Translate descriptive parts only
- Preserve capitalization style
- Keep it concise
- Use native culinary terminology when it exists
Example: "Grilled Salmon with Lemon" → "سلمون مشوي مع الليمون"
`,
    'description': `
Rules:
- Translate naturally and appetizingly
- Use culinary terms familiar to native speakers
- Maintain the tone (formal/casual)
- Keep cultural food references
- Be descriptive and enticing
`,
    'category': `
Rules:
- Use standard restaurant category names
- Keep it short and clear
- Use plural forms where appropriate
Example: "Main Courses" → "الأطباق الرئيسية"
`,
    'ingredient': `
Rules:
- Use precise culinary terminology
- Don't translate ingredient names that are commonly known by their original name
Example: "Mozzarella" stays "Mozzarella" in most languages
`,
  };

  return basePrompt + (contextRules[context] || '');
}
```

#### Step 3: Bulk Translation Action

```typescript
// src/lib/ai/bulk-translate.ts

import { translateWithGPT4 } from './translation';
import { db } from '@/lib/db';
import { menuItems, menuItemTranslations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function bulkTranslateMenu(
  tenantId: string,
  targetLanguage: string
) {
  try {
    // Get all menu items for tenant
    const items = await db.query.menuItems.findMany({
      where: eq(menuItems.tenantId, tenantId),
    });

    let translated = 0;
    let failed = 0;
    const results = [];

    for (const item of items) {
      try {
        // Translate name
        const nameResult = await translateWithGPT4({
          text: item.name,
          from: 'en', // or detect source language
          to: targetLanguage,
          context: 'dish-name',
        });

        // Translate description
        const descResult = await translateWithGPT4({
          text: item.description || '',
          from: 'en',
          to: targetLanguage,
          context: 'description',
        });

        if (nameResult.success && descResult.success) {
          // Save translation to database
          await db.insert(menuItemTranslations).values({
            menuItemId: item.id,
            locale: targetLanguage,
            name: nameResult.translation,
            description: descResult.translation,
          });

          translated++;
          results.push({
            itemId: item.id,
            status: 'success',
            name: nameResult.translation,
          });
        } else {
          failed++;
          results.push({
            itemId: item.id,
            status: 'failed',
          });
        }

        // Rate limiting: wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        failed++;
        results.push({
          itemId: item.id,
          status: 'error',
          error: error.message,
        });
      }
    }

    return {
      success: true,
      translated,
      failed,
      total: items.length,
      results,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Bulk translation failed',
    };
  }
}
```

#### Step 4: Database Schema for Translations

```typescript
// Add to src/lib/db/schema.ts

export const menuItemTranslations = pgTable('menu_item_translations', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  menuItemId: text('menuItemId')
    .notNull()
    .references(() => menuItems.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(), // 'en', 'ar', 'fr', etc.
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  uniqueItemLocale: unique().on(table.menuItemId, table.locale),
}));

// Relations
export const menuItemTranslationsRelations = relations(
  menuItemTranslations,
  ({ one }) => ({
    menuItem: one(menuItems, {
      fields: [menuItemTranslations.menuItemId],
      references: [menuItems.id],
    }),
  })
);

export const menuItemsRelations = relations(menuItems, ({ many, one }) => ({
  translations: many(menuItemTranslations),
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
}));
```

#### Step 5: Translation Center UI

```typescript
// src/app/[locale]/[tenant]/admin/translation-center/page.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Languages, Loader2, Check } from 'lucide-react';
import { bulkTranslateMenu } from '@/lib/ai/bulk-translate';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
];

export default function TranslationCenter() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  const handleBulkTranslate = async () => {
    if (!selectedLanguage) return;

    setIsTranslating(true);
    try {
      const result = await bulkTranslateMenu('tenant-id', selectedLanguage);
      setProgress(result);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Translation Center</h1>
        <p className="text-muted-foreground">
          Automatically translate your menu to multiple languages using AI
        </p>
      </div>

      {/* Language Status */}
      <Card>
        <CardHeader>
          <CardTitle>Available Languages</CardTitle>
          <CardDescription>Current translation status for your menu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </div>
                <Badge variant="outline">
                  <Check className="mr-1 h-3 w-3" /> Active
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Translation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Bulk Translation
          </CardTitle>
          <CardDescription>
            Translate your entire menu to a new language with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Target Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleBulkTranslate}
              disabled={!selectedLanguage || isTranslating}
              className="gap-2"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4" />
                  Translate Menu
                </>
              )}
            </Button>
          </div>

          {progress && (
            <div className="rounded-lg bg-muted p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Translated:</span>
                  <span className="font-medium text-green-600">{progress.translated}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Failed:</span>
                  <span className="font-medium text-red-600">{progress.failed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span className="font-medium">{progress.total}</span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <strong>Note:</strong> AI translations are high-quality but should be reviewed by
            a native speaker before publishing. You can edit translations after generation.
          </div>
        </CardContent>
      </Card>

      {/* Individual Translation Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Translations</CardTitle>
          <CardDescription>Review and edit individual menu item translations</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add translation editor grid here */}
          <p className="text-sm text-muted-foreground">
            Select a language to view and edit translations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Alternative: Google Cloud Translation (Low Cost)

```typescript
// src/lib/ai/google-translate.ts

import { Translate } from '@google-cloud/translate/build/src/v2';

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

export async function translateWithGoogle(
  text: string,
  targetLang: string
): Promise<string> {
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (error) {
    throw new Error('Translation failed');
  }
}

// Bulk translate
export async function bulkTranslateGoogle(
  texts: string[],
  targetLang: string
): Promise<string[]> {
  const [translations] = await translate.translate(texts, targetLang);
  return Array.isArray(translations) ? translations : [translations];
}
```

---

## Menu Image to Data Conversion

### Overview

Convert menu images (photos, PDFs, screenshots) to structured data using AI vision models.

### Use Cases

1. **Onboarding**: Restaurant uploads existing menu image, auto-populate database
2. **Quick Import**: Take photo of paper menu, instant digitization
3. **Competitor Analysis**: Scan competitor menus for pricing research
4. **Menu Updates**: Photo of handwritten daily specials → structured data

---

### Solution Comparison

| Service | Best For | Pros | Cons | Cost |
|---------|----------|------|------|------|
| **GPT-4 Vision** | Best accuracy, complex layouts | Excellent OCR + structuring, handles handwriting, understands context | Most expensive | ~$0.01-0.02 per image |
| **Claude 3 Vision** | High quality, cheaper | Very good accuracy, cheaper than GPT-4V | Slightly less accurate for complex layouts | ~$0.008-0.015 per image |
| **Google Cloud Vision** | High volume, separate OCR/parsing | Fast, cheap OCR, good for printed text | Need separate parsing step | ~$1.50/1K images |
| **Azure Computer Vision** | Enterprise, forms | Good for structured forms, enterprise support | Less flexible for creative layouts | ~$1/1K images |
| **Tesseract + GPT** | Budget option | Free OCR, cheap parsing | Lower OCR quality | ~$0.003 per image |

---

### Recommended: GPT-4 Vision (Best for Restaurant Menus)

**Why GPT-4 Vision:**
- Handles complex layouts (columns, decorative fonts, images)
- Understands menu structure automatically
- Extracts prices in various formats ($12, 12.00, €12,50)
- Handles multiple languages
- Can identify dietary tags from icons/symbols
- One-step solution (OCR + parsing in single call)

---

### Implementation: GPT-4 Vision Menu Extractor

#### Step 1: Create Menu Extractor

```typescript
// src/lib/ai/menu-extractor.ts

import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema for extracted menu data
export const ExtractedMenuItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  category: z.string().optional(),
  dietary: z.array(z.string()).optional(), // ['vegetarian', 'gluten-free']
});

export const ExtractedMenuSchema = z.object({
  restaurantName: z.string().optional(),
  categories: z.array(
    z.object({
      name: z.string(),
      items: z.array(ExtractedMenuItemSchema),
    })
  ),
});

export type ExtractedMenu = z.infer<typeof ExtractedMenuSchema>;
export type ExtractedMenuItem = z.infer<typeof ExtractedMenuItemSchema>;

export async function extractMenuFromImage(
  imageUrl: string
): Promise<ExtractedMenu> {
  const systemPrompt = `You are an expert at extracting structured data from restaurant menu images.

Extract all menu items from the provided menu image and structure them as JSON.

Requirements:
1. Group items by category (Appetizers, Mains, Desserts, Drinks, etc.)
2. Extract item name, description (if present), and price
3. Identify dietary indicators (🌱 vegetarian, GF gluten-free, 🌶️ spicy, etc.)
4. Handle various price formats ($12, $12.00, 12.00, €12, etc.)
5. If multiple currencies, convert to USD
6. If prices are ranges (10-15), use the average
7. Preserve original language if not English

Return ONLY valid JSON matching this structure:
{
  "restaurantName": "Optional name if visible",
  "categories": [
    {
      "name": "Category Name",
      "items": [
        {
          "name": "Dish Name",
          "description": "Optional description",
          "price": 12.99,
          "dietary": ["vegetarian", "gluten-free"]
        }
      ]
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Best vision model
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high', // High detail for better OCR
              },
            },
            {
              type: 'text',
              text: 'Extract all menu items from this image and return structured JSON.',
            },
          ],
        },
      ],
      temperature: 0.1, // Low temp for consistency
      max_tokens: 4000,
      response_format: { type: 'json_object' }, // Force JSON output
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }

    // Parse and validate
    const parsed = JSON.parse(content);
    const validated = ExtractedMenuSchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error('Menu extraction error:', error);
    throw new Error('Failed to extract menu from image');
  }
}
```

#### Step 2: Create Import Action

```typescript
// src/lib/db/actions/import-menu.ts

import { extractMenuFromImage } from '@/lib/ai/menu-extractor';
import { db } from '@/lib/db';
import { categories, menuItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function importMenuFromImage(
  tenantId: string,
  imageUrl: string
) {
  try {
    // Extract menu data from image
    const extracted = await extractMenuFromImage(imageUrl);

    const importedItems = [];

    // Process each category
    for (const category of extracted.categories) {
      // Create or find category
      let categoryId: string;
      const existingCategory = await db.query.categories.findFirst({
        where: eq(categories.name, category.name),
      });

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const [newCategory] = await db
          .insert(categories)
          .values({
            tenantId,
            name: category.name,
            slug: category.name.toLowerCase().replace(/\s+/g, '-'),
          })
          .returning();
        categoryId = newCategory.id;
      }

      // Create menu items
      for (const item of category.items) {
        const [newItem] = await db
          .insert(menuItems)
          .values({
            tenantId,
            categoryId,
            name: item.name,
            description: item.description || '',
            price: item.price || 0,
            available: true,
          })
          .returning();

        importedItems.push(newItem);

        // TODO: Handle dietary tags (create many-to-many relationships)
      }
    }

    return {
      success: true,
      imported: importedItems.length,
      categories: extracted.categories.length,
      items: importedItems,
    };
  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      error: 'Failed to import menu',
    };
  }
}
```

#### Step 3: Upload & Import UI

```typescript
// src/app/[locale]/[tenant]/admin/menu/import/page.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';
import { importMenuFromImage } from '@/lib/db/actions/import-menu';
import Image from 'next/image';

export default function MenuImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      // 1. Upload image to storage (Vercel Blob, Azure, etc.)
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const { url } = await uploadRes.json();

      // 2. Extract and import menu
      const importResult = await importMenuFromImage('tenant-id', url);
      setResult(importResult);
    } catch (error) {
      console.error('Import failed:', error);
      setResult({ success: false, error: 'Import failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Import Menu from Image</h1>
        <p className="text-muted-foreground">
          Upload a photo of your menu and we'll automatically extract all items
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Menu Image</CardTitle>
            <CardDescription>
              Supports JPG, PNG, PDF. Works with printed menus, handwritten specials, or
              menu boards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8">
              <label className="flex cursor-pointer flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {preview && (
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                <Image src={preview} alt="Menu preview" fill className="object-contain" />
              </div>
            )}

            <Button
              onClick={handleImport}
              disabled={!selectedFile || isProcessing}
              className="w-full gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import Menu
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
            <CardDescription>Review extracted items before saving</CardDescription>
          </CardHeader>
          <CardContent>
            {!result && (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                Upload an image to see results
              </div>
            )}

            {result?.success && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Successfully imported!</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-medium">{result.categories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Menu Items:</span>
                    <span className="font-medium">{result.imported}</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <a href="/menu">View Menu</a>
                </Button>
              </div>
            )}

            {result?.success === false && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{result.error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Best Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✅ Use clear, well-lit photos</li>
            <li>✅ Ensure text is readable and not blurry</li>
            <li>✅ Capture the entire menu in frame</li>
            <li>✅ Avoid shadows and glare</li>
            <li>⚠️ Review imported items before publishing</li>
            <li>⚠️ AI may misread handwriting or decorative fonts</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Implementation Recommendations

### Phase 1: MVP (Week 1)

**Translation:**
1. ✅ Implement GPT-4o-mini translation for single items
2. ✅ Add translation button to menu item form
3. ✅ Store translations in database

**Menu Import:**
1. ✅ Basic image upload
2. ✅ GPT-4 Vision extraction
3. ✅ Manual review before import

### Phase 2: Production (Week 2-3)

**Translation:**
1. ✅ Bulk translation with progress tracking
2. ✅ Translation memory (cache common phrases)
3. ✅ Google Translate fallback for cost savings
4. ✅ Translation quality scoring
5. ✅ Manual edit interface

**Menu Import:**
1. ✅ PDF support
2. ✅ Multi-page menu handling
3. ✅ Confidence scores for each field
4. ✅ Batch import (multiple images)
5. ✅ Import history and rollback

### Phase 3: Advanced (Week 4+)

**Translation:**
1. ✅ Neural translation memory (learn from edits)
2. ✅ Glossary management (brand terms, special dishes)
3. ✅ Auto-translate on item creation
4. ✅ Translation workflow (request → review → approve)
5. ✅ A/B testing translations

**Menu Import:**
1. ✅ Live camera capture (mobile)
2. ✅ Competitor menu analysis
3. ✅ Price comparison
4. ✅ Dietary tag auto-detection from icons
5. ✅ Menu trend analysis

---

## Cost Analysis

### Translation Costs (1000 menu items)

| Service | Cost per Item | 1K Items | 10K Items |
|---------|---------------|----------|-----------|
| GPT-4o-mini | $0.10 | $100 | $1,000 |
| Google Translate | $0.01 | $10 | $100 |
| DeepL | $0.015 | $15 | $150 |
| Azure | $0.007 | $7 | $70 |

**Hybrid Strategy (Recommended):**
- Use GPT-4o-mini for first translation: $100/1K items
- Cache all translations in database: $0 ongoing
- Use Google Translate for fallback: $10/1K items
- **Total: ~$110/1K items one-time cost**

### Menu Import Costs (per image)

| Service | Cost per Image | 100 Images | 1K Images |
|---------|----------------|------------|-----------|
| GPT-4 Vision | $0.015 | $1.50 | $15 |
| Claude Vision | $0.010 | $1.00 | $10 |
| Google Vision + GPT parsing | $0.005 | $0.50 | $5 |

**Recommendation:**
- Use GPT-4 Vision for best accuracy
- Most restaurants import once (onboarding)
- **Cost: ~$0.015 per menu import**

---

## Implementation Roadmap

### Week 1: Translation MVP
- [ ] Set up OpenAI API
- [ ] Implement basic translation function
- [ ] Add translation to menu item form
- [ ] Create database schema for translations
- [ ] Test with English → Arabic translation

**Deliverable:** Single-item translation working

### Week 2: Bulk Translation
- [ ] Build bulk translation action
- [ ] Create Translation Center UI
- [ ] Add progress tracking
- [ ] Implement rate limiting
- [ ] Add translation cache

**Deliverable:** Bulk translate entire menu

### Week 3: Menu Import MVP
- [ ] Set up GPT-4 Vision API
- [ ] Implement image extraction
- [ ] Create import action
- [ ] Build upload UI
- [ ] Test with sample menus

**Deliverable:** Import menu from image

### Week 4: Polish & Production
- [ ] Add error handling
- [ ] Implement retry logic
- [ ] Add translation editing UI
- [ ] Create import preview
- [ ] Add analytics tracking
- [ ] Write documentation

**Deliverable:** Production-ready features

---

## Environment Variables

```bash
# .env.local

# OpenAI (for translation + menu extraction)
OPENAI_API_KEY=sk-...

# Google Cloud Translation (optional fallback)
GOOGLE_TRANSLATE_API_KEY=...

# Azure Translator (optional)
AZURE_TRANSLATOR_KEY=...
AZURE_TRANSLATOR_REGION=...

# DeepL (optional)
DEEPL_API_KEY=...
```

---

## API Rate Limits

| Service | Requests/min | Tokens/min |
|---------|--------------|------------|
| OpenAI GPT-4o-mini | 500 | 200K |
| OpenAI GPT-4 Vision | 500 | 150K |
| Google Translate | 1000 | - |
| DeepL | 300 | - |

**Handling:**
- Implement queue system for bulk operations
- Add retry logic with exponential backoff
- Show progress to user
- Cache aggressively

---

## Security Considerations

1. **API Key Protection**
   - Store in environment variables
   - Never expose to client
   - Rotate regularly

2. **Input Validation**
   - Sanitize user input
   - Validate image formats
   - Limit file sizes (max 10MB)

3. **Rate Limiting**
   - Limit translations per tenant per day
   - Prevent abuse

4. **Data Privacy**
   - Don't send customer data to AI services
   - Only menu content
   - Check AI provider terms

---

## Testing Strategy

### Translation Testing
```typescript
// tests/translation.test.ts

describe('Translation', () => {
  it('should translate dish name correctly', async () => {
    const result = await translateWithGPT4({
      text: 'Grilled Salmon',
      from: 'en',
      to: 'ar',
      context: 'dish-name',
    });
    expect(result.success).toBe(true);
    expect(result.translation).toContain('سلمون');
  });

  it('should preserve proper nouns', async () => {
    const result = await translateWithGPT4({
      text: 'Margherita Pizza',
      from: 'en',
      to: 'ar',
      context: 'dish-name',
    });
    expect(result.translation).toContain('Margherita');
  });
});
```

### Menu Extraction Testing
```typescript
// tests/menu-extraction.test.ts

describe('Menu Extraction', () => {
  it('should extract items from menu image', async () => {
    const result = await extractMenuFromImage('test-menu.jpg');
    expect(result.categories.length).toBeGreaterThan(0);
    expect(result.categories[0].items.length).toBeGreaterThan(0);
  });

  it('should parse prices correctly', async () => {
    const result = await extractMenuFromImage('test-menu.jpg');
    const firstItem = result.categories[0].items[0];
    expect(typeof firstItem.price).toBe('number');
    expect(firstItem.price).toBeGreaterThan(0);
  });
});
```

---

## Success Metrics

### Translation Feature
- Translation accuracy: >95% (manual review sample)
- User edit rate: <20% of translations
- Time saved: 90% reduction vs manual translation
- Languages supported: 8+

### Menu Import Feature
- Extraction accuracy: >90%
- Import success rate: >85%
- Time saved: 95% reduction vs manual entry
- Customer satisfaction: 4.5+/5

---

## Next Steps

1. **Choose Your Priority:**
   - Translation: Enables multi-language immediately
   - Menu Import: Reduces onboarding friction

2. **Start Small:**
   - Build MVP with single language pair
   - Test with 5-10 real restaurants
   - Iterate based on feedback

3. **Scale Up:**
   - Add more languages
   - Improve accuracy
   - Add advanced features

---

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GPT-4 Vision Guide](https://platform.openai.com/docs/guides/vision)
- [Google Cloud Translation](https://cloud.google.com/translate/docs)
- [DeepL API](https://www.deepl.com/pro-api)

---

**Questions or need help implementing?** Let me know which feature you want to start with!

