# AI Figma Design Prompt - Menu Crafter

## Copy this prompt to use with AI Figma tools (v0, Galileo AI, Uizard, etc.)

---

## Design Request for Menu Crafter Application

**Project Description:**
Design a comprehensive UI/UX system for Menu Crafter, a modern SaaS platform that enables restaurants to create QR code menus and custom websites. The application consists of two main design systems:

### 1. Main Application Design (menucrafter.com)

Create a professional, clean, and conversion-focused design for the main SaaS platform including:

**Landing Page:**

- Modern hero section with a large hero image of a restaurant setting
- Feature cards with icons (QR code, website, analytics, team management)
- Pricing table with 3 tiers (Starter, Professional, Enterprise)
- Testimonial section
- Prominent CTAs for "Get Started" and "View Demo"

**Authentication Pages:**

- Centered card-based layout with modern form design
- Social login buttons (Google)
- Clean typography
- Subtle shadows
- Background with a restaurant-themed gradient or pattern

**Onboarding Flow:**

- Multi-step form wizard with progress indicator
- Welcoming illustrations
- Form fields for business name, phone, address, and subdomain selection with real-time availability check

**Dashboard/Profile:**

- Modern admin panel with sidebar navigation
- User avatar dropdown
- Membership cards showing all associated restaurants
- Clean settings interface

**Admin Dashboard:**

- Analytics-focused layout with metric cards (total views, QR scans, menu items, active users)
- Charts for trends
- Recent activity feed
- Quick action buttons

**Color Scheme for Main App:**

- Primary: Professional teal/blue (#0EA5E9 or similar)
- Secondary: Warm orange/amber for CTAs (#F59E0B)
- Background: Clean white/light gray (#F9FAFB)
- Text: Dark gray (#1F2937)
- Accents: Success green, warning yellow, error red

### 2. Restaurant Website Templates (tenant subdomains)

Design 5 distinct restaurant website templates that can be customized per tenant:

**Template 1 - "Modern Minimal":**

- Clean white background with elegant serif headings
- Full-width hero image with overlay text
- Grid-based menu layout with high-quality food photos
- Floating navigation bar
- Perfect for: Upscale dining, cafes, modern bistros

**Template 2 - "Bold & Vibrant":**

- Colorful sections with energetic gradients
- Large product cards with bright accent colors
- Animated elements on scroll
- Playful typography
- Perfect for: Fast food, dessert shops, food trucks

**Template 3 - "Rustic Elegance":**

- Warm earth tones (browns, beiges, burnt orange)
- Textured backgrounds (wood, paper)
- Classic serif fonts
- Vintage-style ornamental dividers
- Perfect for: Italian restaurants, steakhouses, traditional cuisine

**Template 4 - "Asian Fusion":**

- Clean minimalist design with strategic use of red/black/white
- Vertical text elements
- Zen-inspired spacing
- Subtle pattern overlays (bamboo, waves)
- Perfect for: Japanese, Chinese, Thai, Korean restaurants

**Template 5 - "Mediterranean Fresh":**

- Light and airy with blues and whites
- Coastal-inspired imagery
- Fresh, modern sans-serif fonts
- Lots of white space
- Perfect for: Greek, seafood, healthy eating, Mediterranean restaurants

**Common Elements Across All Restaurant Templates:**

- Mobile-first responsive design
- Digital menu section with categories (Appetizers, Mains, Desserts, Beverages)
- Menu items with photos, descriptions, dietary icons (vegan, gluten-free, spicy), and prices
- "About Us" section with restaurant story and chef photo
- Location map with Google Maps integration
- Opening hours display
- Contact section with phone, email, and social media links
- Photo gallery of dishes and restaurant ambiance
- Reservation button (prominent CTA)
- Floating WhatsApp/call button
- Footer with additional links

### Design Style Guidelines

- Mobile screens: 375px width (iPhone), tablet: 768px, desktop: 1440px
- Use modern UI components: cards, modals, dropdowns, tabs, accordions
- Implement smooth transitions and micro-interactions
- Include empty states, loading states, and error states
- Use real food photography placeholders (high quality)
- Ensure WCAG AA accessibility standards
- Implement proper spacing (4px, 8px, 16px, 24px, 32px system)
- Use modern shadows for depth (subtle elevation)

### Menu Management Feature (Critical)

Design a comprehensive menu management interface with two distinct input methods:

#### Option 1: Smart Menu Upload (AI-Powered Extraction)

Design an intuitive upload interface that allows users to:

- **Drag-and-drop zone** with clear visual feedback
- Support multiple file formats:
  - Images (JPG, PNG, PDF) - Photo of existing menu
  - PDF documents - Digital menu PDFs
  - Excel/CSV files - Structured menu data
- **Upload flow:**
  1. Drag/drop or click to upload area
  2. File preview with thumbnail
  3. Processing indicator (animated)
  4. AI extraction preview with editable fields
  5. Confirm or edit extracted data
  6. Import to menu

**Design Elements:**

- Large drag-drop area with dashed border
- File type icons (image, PDF, Excel)
- Upload progress bar
- Preview card showing extracted items
- "AI Detected" badges on extracted fields
- Edit buttons for each field
- Bulk approve/edit actions
- Success animation when import completes

**AI Extraction Preview Screen:**

- Split view: Original file on left, extracted data on right
- Editable table with menu items
- Columns: Item Name, Description, Price, Category, Dietary Info
- Checkbox to select/deselect items
- "Looks good" vs "Let me edit" buttons
- Confidence indicators (high/medium/low accuracy)

#### Option 2: Manual Menu Creation

Design a powerful manual editing interface:

**Create Menu Item:**

- Modal or slide-over panel
- Form fields:
  - Item name (large, prominent)
  - Description (rich text editor with formatting)
  - Price (with currency selector)
  - Category dropdown (with "Add new" option)
  - Image upload (drag-drop with crop/resize)
  - Dietary tags (vegan, gluten-free, spicy, etc.) - multiselect chips
  - Allergen warnings - checkboxes
  - Availability toggle (in stock / out of stock)
  - Custom fields option

**Menu Item Management:**

- Table view with sortable columns
- Grid view with images
- List view for quick editing
- Inline editing capability
- Bulk actions (delete, categorize, toggle availability)
- Search and filter by category, dietary tags, price range
- Drag-and-drop reordering
- Duplicate item option
- Archive vs Delete

**Category Management:**

- Sidebar or top tabs for categories
- Add/edit/delete categories
- Drag to reorder categories
- Category icons/emojis
- Collapse/expand categories
- Item count per category

**Menu Preview Mode:**

- Toggle between edit mode and preview mode
- See menu as customers will see it
- Select template preview
- Mobile vs desktop preview
- Share preview link

**Design Requirements:**

- Clean, uncluttered interface
- Clear distinction between upload mode and manual mode
- Smooth transitions between modes
- Real-time preview of changes
- Undo/redo functionality
- Auto-save indicators
- Keyboard shortcuts support
- Responsive design for tablet use

### Website Builder & Template Customization

Design a visual website builder that allows restaurant owners to customize their public-facing website:

**Template Gallery:**

- Grid of 5 template options with preview thumbnails
- Hover to see template demo
- "Preview" and "Use This Template" buttons
- Template comparison view
- Filter by style (modern, traditional, colorful, minimal)

**Visual Editor Interface:**

**Main Canvas:**

- Live preview of website in center
- Responsive mode toggles (mobile/tablet/desktop)
- Zoom controls
- Section highlighting on hover
- Click to edit any section

**Left Sidebar - Sections:**

- List of all page sections (Hero, About, Menu, Gallery, Contact)
- Drag-and-drop to reorder
- Toggle visibility (show/hide)
- Add new sections
- Delete sections
- Duplicate sections

**Right Sidebar - Properties Panel:**

When editing a section, show:

- **Content Tab:**
  - Text editor for headings/paragraphs
  - Image uploader with crop tool
  - Button text and link editor
  - Icon selector
- **Style Tab:**
  - Background color/image
  - Text color
  - Spacing (padding, margin) with sliders
  - Border radius
  - Shadow effects
- **Layout Tab:**
  - Alignment options
  - Column layout (1, 2, 3 columns)
  - Full-width toggle
  - Container width

**Top Toolbar:**

- Save button with auto-save indicator
- Publish button (primary action)
- Preview link (share with others)
- Undo/Redo buttons
- Version history dropdown
- Mobile/Tablet/Desktop view toggles
- Template selector dropdown

**Color Scheme Manager:**

- Color palette picker
- Brand color extraction from logo
- Pre-made color schemes
- Custom color inputs (hex codes)
- Apply to entire site
- Color accessibility checker

**Typography Manager:**

- Google Fonts browser
- Font pairing suggestions
- Heading font selector
- Body font selector
- Font size sliders
- Line height controls

**Media Library:**

- Grid of uploaded images
- Upload new images (drag-drop)
- Image categories (food, ambiance, team)
- Search images
- Delete/replace options
- Image optimization status
- Used/unused indicators

**Logo & Branding:**

- Logo upload area
- Logo position (left, center, right)
- Logo size slider
- Favicon generator
- Brand color extraction

**Navigation Menu Editor:**

- Add/remove menu items
- Rename links
- Reorder with drag-drop
- Set external/internal links
- Mobile menu style selector

**Footer Customization:**

- Column layout
- Social media icons
- Contact information
- Copyright text
- Legal links

**Publish Flow:**

- Preview changes before publishing
- Publish confirmation modal
- SEO checklist (meta title, description, image)
- Publishing progress
- Success message with live link
- Share on social media option

**Design Requirements for Website Builder:**

- Visual, no-code interface
- Real-time preview
- Intuitive drag-and-drop
- Mobile-first approach
- Fast performance
- Beautiful default templates
- Professional customization options
- Accessibility compliance

### Specific Screens to Design

**Main Application:**

1. Landing page (desktop + mobile)
2. Login page
3. Register page
4. Onboarding form (3 steps)
5. User profile page
6. Admin dashboard
7. Menu management interface - Upload mode
8. Menu management interface - Manual edit mode
9. Menu AI extraction preview screen
10. Website template gallery
11. Website builder - Visual editor with live preview
12. Website builder - Color scheme manager
13. Website builder - Section properties panel
14. Website builder - Media library
15. QR code generator screen
16. Team management page
17. Settings page

**Restaurant Templates (for each of 5 templates):**

1. Homepage with hero and featured dishes
2. Full menu page with all categories
3. Individual menu item detail page
4. About us page
5. Contact page
6. Mobile menu view (optimized for QR code menu viewing)

###

 Additional Components Library

- Buttons (primary, secondary, text, icon)
- Form inputs (text, email, password, select, textarea)
- Cards (menu items, feature cards, stat cards)
- Navigation bars (main app, restaurant sites)
- Modals and dialogs
- Toasts and notifications
- Loading spinners
- Icons set (Lucide or similar)

### Output Requirements

- Organize in Figma with clear page structure
- Create a design system with reusable components
- Use auto-layout for responsive components
- Include desktop, tablet, and mobile views
- Provide style guide page with colors, typography, spacing
- Include interactive prototype with basic click-through flows
- Use realistic content (no lorem ipsum for final designs)
- Include both light mode designs (dark mode optional for main app)

This design system should feel premium, modern, and professional while being accessible and user-friendly for restaurant owners with varying technical expertise.

---

## Additional Context

**Application Type:** SaaS Platform  
**Industry:** Food & Beverage Technology  
**Target Users:** Restaurant owners, cafe managers, food truck operators  
**Key Differentiator:** Multi-tenant subdomain-based architecture where each restaurant gets their own branded website  
**Technical Stack:** Next.js, Tailwind CSS (for implementation reference)  

**Design Inspiration:**

- Look at: Toast POS, Square for Restaurants, Wix Restaurants, BentoBox
- Modern SaaS aesthetic with restaurant industry warmth
- Balance between professional dashboard and inviting restaurant websites

---

## Quick Prompt Variations

### For Landing Page Only

"Design a modern SaaS landing page for Menu Crafter, a QR menu and restaurant website builder. Include hero section with restaurant image, feature cards showing QR code generation, website creation, and analytics. Use teal/blue primary color, include pricing section with 3 tiers, and prominent CTAs. Make it clean, professional, and conversion-focused."

### For Restaurant Website Template

"Design a modern restaurant website template with full-width hero image, digital menu section with food photos and prices, about section, location map, and contact form. Style: [Choose: Modern Minimal/Bold Vibrant/Rustic Elegance/Asian Fusion/Mediterranean Fresh]. Make it mobile-responsive and optimized for QR code menu viewing."

### For Admin Dashboard

"Design a restaurant management admin dashboard showing analytics metrics (QR scans, menu views, total items), charts for trends, sidebar navigation, and recent activity feed. Use clean, modern SaaS design with teal primary color. Include menu management, QR generator, and team sections."

---

## File Naming Convention

When saving designs, use this structure:

- `menucrafter-landing-desktop.fig`
- `menucrafter-auth-mobile.fig`
- `template-modern-minimal-home.fig`
- `template-asian-fusion-menu.fig`
- `components-buttons.fig`
- `style-guide.fig`

---

**Pro Tip:** Start with the landing page and one restaurant template to establish the design language, then expand to other screens and templates.
