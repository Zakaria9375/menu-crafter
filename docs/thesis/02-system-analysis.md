# Chapter 2: System Analysis and Requirements

> **Chapter Goal**: Analyze the problem domain, identify stakeholders, and specify system requirements

---

## 2.1 Problem Domain Analysis

### 2.1.1 Current State of Restaurant Digitalization

**Traditional Approach:**

- Paper menus printed periodically
- Manual updates require reprinting (cost: $200-500 per update)
- No analytics on customer preferences
- Language barriers for international customers
- Environmental waste

**COVID-19 Impact:**

- Sudden need for contactless solutions
- Health regulations requiring single-use or digital menus
- Accelerated digital transformation (5-year timeline compressed to 6 months)

**Post-Pandemic Reality:**

- Customer expectations changed permanently
- 73% of diners prefer digital menus [@hospitalitytech2023]
- Restaurants must adapt or lose competitive edge

### 2.1.2 Pain Points

**For Restaurant Owners:**

1. **Cost**: Existing solutions $69-399/month beyond budget
2. **Complexity**: Technical setup requires IT knowledge
3. **Time**: 2-4 hours to configure platforms
4. **Inflexibility**: Can't easily customize branding
5. **Fragmentation**: Need multiple tools (menu, website, QR, analytics)
6. **Language barriers**: Manual translation expensive ($0.10-0.15 per word)

**For Customers:**

1. **Poor UX**: Many digital menus are PDFs (hard to read on mobile)
2. **Slow loading**: Heavy images, unoptimized
3. **No filtering**: Can't filter by dietary restrictions
4. **Language issues**: Not available in native language
5. **Inaccessibility**: Not screen-reader friendly

### 2.1.3 Market Opportunity

**Target Market Size:**

- Restaurants worldwide: ~15 million [@worldbank2023]
- Small-medium restaurants (1-5 locations): ~12 million (80%)
- Addressable market: Restaurants with internet access ~8 million

**Market Segments:**

1. **Primary**: Independent restaurants, 1-3 locations
2. **Secondary**: Cafes, bars, bakeries
3. **Tertiary**: Food trucks, pop-ups, catering

**Geographic Focus:**

- Phase 1: Latvia, Estonia, Lithuania (home market)
- Phase 2: EU countries
- Phase 3: Global expansion

---

## 2.2 Stakeholder Analysis

### 2.2.1 Primary Stakeholders

#### Restaurant Owners

**Needs:**

- Affordable pricing (<$50/month)
- Easy setup (no IT knowledge required)
- Brand customization
- Update menu anytime, anywhere

**Goals:**

- Increase revenue through better presentation
- Save money on printing costs
- Improve customer experience
- Gain insights from analytics

**Pain Points:**

- Limited budget
- Limited time (busy running restaurant)
- Fear of technology complexity
- Concerned about vendor lock-in

#### Restaurant Staff

**Needs:**

- Simple interface to update availability
- Quick to learn (high turnover in hospitality)
- Mobile-friendly (update from phone)

**Goals:**

- Reduce customer questions about menu
- Update sold-out items quickly
- Manage daily specials easily

### 2.2.2 Secondary Stakeholders

#### Customers (Diners)

**Needs:**

- Fast-loading menus
- Clear photos of dishes
- Filter by dietary preferences (vegetarian, halal, gluten-free)
- Multiple languages

**Goals:**

- Make informed dining decisions
- Easy ordering process
- Understand ingredients and allergens

#### Platform Administrators (Us)

**Needs:**

- Scalable infrastructure
- Monitoring and analytics
- Easy tenant management
- Security and compliance

**Goals:**

- Provide 99.9% uptime
- Keep infrastructure costs <$5 per tenant
- Automate operations
- Scale to 10,000+ tenants

---

## 2.3 Functional Requirements

### 2.3.1 User Management

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| FR-1.1 | User registration with email/password | Must Have | ✅ Complete |
| FR-1.2 | OAuth login (Google) | Must Have | ✅ Complete |
| FR-1.3 | Password reset via email | Must Have | ✅ Complete |
| FR-1.4 | User profile management | Must Have | ✅ Complete |
| FR-1.5 | Multi-factor authentication (2FA) | Should Have | 📝 Planned |
| FR-1.6 | SSO for enterprise | Could Have | 📝 Future |

### 2.3.2 Tenant (Restaurant) Management

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| FR-2.1 | Create new tenant (restaurant) | Must Have | ✅ Complete |
| FR-2.2 | Onboarding wizard | Must Have | ✅ Complete |
| FR-2.3 | Subdomain assignment (e.g., `bella-italia.menucrafter.com`) | Must Have | ✅ Complete |
| FR-2.4 | Custom domain support (e.g., `menu.restaurant.com`) | Should Have | 📝 Planned |
| FR-2.5 | Business information management | Must Have | ✅ Complete |
| FR-2.6 | Logo upload and branding | Must Have | 🔄 In Progress |
| FR-2.7 | Operating hours configuration | Should Have | 🔄 In Progress |
| FR-2.8 | Social media links | Should Have | ✅ Complete |
| FR-2.9 | Multi-location management | Could Have | 📝 Future |

### 2.3.3 Team & Access Control

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| FR-3.1 | Role-based access control (OWNER, ADMIN, STAFF, MEMBER) | Must Have | ✅ Complete |
| FR-3.2 | Invite team members via email | Must Have | 📝 Planned |
| FR-3.3 | Manage member permissions | Must Have | 📝 Planned |
| FR-3.4 | Audit log of member actions | Should Have | 📝 Future |

### 2.3.4 Menu Management

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| FR-4.1 | Create/edit/delete menu categories | Must Have | 📝 In Dev |
| FR-4.2 | Create/edit/delete menu items | Must Have | 📝 In Dev |
| FR-4.3 | Upload item images | Must Have | 📝 In Dev |
| FR-4.4 | Set item prices (multi-currency) | Must Have | 📝 In Dev |
| FR-4.5 | Mark items available/unavailable | Must Have | 📝 In Dev |
| FR-4.6 | Dietary tags (vegan, gluten-free, halal, etc.) | Must Have | 📝 In Dev |
| FR-4.7 | Item descriptions (rich text) | Should Have | 📝 In Dev |
| FR-4.8 | Drag-and-drop ordering | Should Have | 📝 Planned |
| FR-4.9 | Duplicate items/categories | Should Have | 📝 Planned |
| FR-4.10 | Import menu from image (AI) | Should Have | 📝 Planned |
| FR-4.11 | Import from CSV/Excel | Could Have | 📝 Future |

### 2.3.5 Multi-Language Support

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| FR-5.1 | UI in English and Arabic | Must Have | ✅ Complete |
| FR-5.2 | Menu item translations | Must Have | 📝 In Dev |
| FR-5.3 | Auto-translate menu items (AI) | Should Have | 📝 Planned |
| FR-5.4 | Language switching for customers | Must Have | 📝 In Dev |
| FR-5.5 | Support additional languages (French, Spanish, German, etc.) | Should Have | 📝 Future |

### 2.3.6 QR Code Generation

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| FR-6.1 | Generate QR code for restaurant menu | Must Have | 📝 Planned |
| FR-6.2 | Customize QR code (colors, logo) | Should Have | 📝 Planned |
| FR-6.3 | Download QR in multiple formats (PNG, SVG, PDF) | Must Have | 📝 Planned |
| FR-6.4 | Generate table-specific QR codes | Should Have | 📝 Future |
| FR-6.5 | Analytics on QR scans | Should Have | 📝 Future |

### 2.3.7 Restaurant Website

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| FR-7.1 | Public restaurant website on subdomain | Must Have | ✅ Complete |
| FR-7.2 | Display menu on website | Must Have | 📝 In Dev |
| FR-7.3 | Choose from website templates | Should Have | 📝 Planned |
| FR-7.4 | Customize colors and fonts | Should Have | 📝 Planned |
| FR-7.5 | About us page editor | Should Have | 📝 Planned |
| FR-7.6 | Contact information page | Must Have | 📝 In Dev |
| FR-7.7 | Google Maps integration | Should Have | 📝 Planned |
| FR-7.8 | Gallery for photos | Should Have | 📝 Future |

### 2.3.8 Analytics Dashboard

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| FR-8.1 | View menu view count | Should Have | 📝 Planned |
| FR-8.2 | QR scan tracking | Should Have | 📝 Planned |
| FR-8.3 | Popular items report | Should Have | 📝 Future |
| FR-8.4 | Customer demographics | Could Have | 📝 Future |
| FR-8.5 | Export analytics data | Could Have | 📝 Future |

---

## 2.4 Non-Functional Requirements

### 2.4.1 Performance Requirements

| Req ID | Requirement | Target | Status |
|--------|-------------|--------|--------|
| NFR-1.1 | Page load time (initial) | <2 seconds | 🔄 Testing |
| NFR-1.2 | API response time (p95) | <200ms | 🔄 Testing |
| NFR-1.3 | Menu display time on mobile | <1 second | 📝 Planned |
| NFR-1.4 | Support 100 concurrent tenants | 100+ | ✅ Capable |
| NFR-1.5 | Support 1000 concurrent users | 1000+ | 📝 Load test |
| NFR-1.6 | Database query time (p95) | <50ms | 🔄 Optimizing |

### 2.4.2 Scalability Requirements

| Req ID | Requirement | Target |
|--------|-------------|--------|
| NFR-2.1 | Support up to 10,000 tenants | Phase 1: 100, Phase 2: 1000, Phase 3: 10,000 |
| NFR-2.2 | Support up to 100,000 menu items | Tested with 10,000 |
| NFR-2.3 | Handle traffic spikes (5x normal) | Auto-scaling on Vercel |
| NFR-2.4 | Database storage growth | Scalable PostgreSQL |

### 2.4.3 Security Requirements

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| NFR-3.1 | HTTPS encryption (TLS 1.3) | Must Have | ✅ Complete |
| NFR-3.2 | Password hashing (bcrypt) | Must Have | ✅ Complete |
| NFR-3.3 | SQL injection prevention | Must Have | ✅ Complete (ORM) |
| NFR-3.4 | XSS protection | Must Have | ✅ Complete |
| NFR-3.5 | CSRF protection | Must Have | ✅ Complete |
| NFR-3.6 | Rate limiting | Should Have | 📝 Planned |
| NFR-3.7 | Data backup (daily) | Must Have | ✅ Complete |
| NFR-3.8 | GDPR compliance | Must Have | 🔄 In Progress |
| NFR-3.9 | Tenant data isolation | Must Have | ✅ Complete |
| NFR-3.10 | Penetration testing | Should Have | 📝 Planned |

### 2.4.4 Usability Requirements

| Req ID | Requirement | Target |
|--------|-------------|--------|
| NFR-4.1 | System Usability Scale (SUS) score | >70 (above average) |
| NFR-4.2 | Onboarding completion time | <15 minutes for 80% of users |
| NFR-4.3 | Mobile-responsive design | 100% of pages |
| NFR-4.4 | Accessibility (WCAG 2.1 Level AA) | All public pages |
| NFR-4.5 | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |

### 2.4.5 Reliability Requirements

| Req ID | Requirement | Target |
|--------|-------------|--------|
| NFR-5.1 | System uptime | 99.9% (8.76 hours downtime/year) |
| NFR-5.2 | Mean time to recovery (MTTR) | <30 minutes |
| NFR-5.3 | Data durability | 99.999999999% (11 nines) |
| NFR-5.4 | Backup retention | 30 days |

### 2.4.6 Maintainability Requirements

| Req ID | Requirement | Target |
|--------|-------------|--------|
| NFR-6.1 | Code documentation | >80% functions documented |
| NFR-6.2 | Test coverage | >70% code coverage |
| NFR-6.3 | Deployment time | <10 minutes |
| NFR-6.4 | Rollback capability | <5 minutes |

---

## 2.5 Use Case Analysis

### 2.5.1 Use Case: Restaurant Onboarding

**Actor**: New Restaurant Owner

**Preconditions**: User has registered account

**Main Flow:**

1. User clicks "Create Restaurant"
2. System displays onboarding wizard
3. User enters restaurant name, phone, address
4. User chooses subdomain slug (e.g., "bella-italia")
5. System validates slug availability
6. System creates tenant and membership
7. User redirected to dashboard

**Postconditions**: Restaurant created, subdomain active

**Alternative Flows:**

- 5a. Slug taken → System suggests alternatives
- 4a. User provides invalid characters → System shows error

**Time**: <5 minutes

### 2.5.2 Use Case: Add Menu Item

**Actor**: Restaurant Admin

**Preconditions**: User authenticated, has ADMIN or OWNER role

**Main Flow:**

1. User navigates to Menu Management
2. User clicks "Add Item"
3. User enters name, description, price
4. User uploads photo
5. User selects category
6. User adds dietary tags
7. User clicks "Save"
8. System validates input
9. System saves item to database
10. System displays success message

**Postconditions**: Menu item created, visible on public menu

**Time**: <2 minutes per item

### 2.5.3 Use Case: Generate QR Code

**Actor**: Restaurant Owner

**Preconditions**: Restaurant has at least one menu item

**Main Flow:**

1. User navigates to QR Codes page
2. System displays current QR code
3. User customizes colors/size
4. User clicks "Download"
5. System generates QR code image
6. Browser downloads file

**Postconditions**: QR code downloaded, ready to print

**Time**: <1 minute

---

## 2.6 System Constraints

### 2.6.1 Technical Constraints

1. **Platform**: Web-based (no native mobile apps initially)
2. **Database**: PostgreSQL (chosen for multi-tenancy features)
3. **Hosting**: Vercel (serverless, auto-scaling)
4. **Browser Support**: Modern browsers only (no IE11)
5. **Image Size**: Max 10MB per upload
6. **API Rate Limit**: 100 requests/minute per user

### 2.6.2 Business Constraints

1. **Budget**: Development by one person (thesis project)
2. **Timeline**: 6 months development
3. **Free Tier**: Must offer free plan to attract users
4. **Pricing**: Paid tier <$50/month to be competitive

### 2.6.3 Legal Constraints

1. **GDPR**: Must comply with EU data protection
2. **Privacy**: Clear privacy policy required
3. **Terms**: Terms of service required
4. **Data Ownership**: Restaurants own their data

---

## 2.7 Comparison with Existing Solutions

### 2.7.1 Detailed Feature Comparison

| Feature | Menu Crafter | MenuDrive | TouchBistro | Wix |
|---------|--------------|-----------|-------------|-----|
| **Pricing (monthly)** | $0-49 | $29-99 | $69-399 | $16-29 |
| **Setup Time** | <15 min | ~30 min | 2-4 hours | 1-2 hours |
| **QR Menu** | ✅ | ✅ | ✅ | ⚠️ Manual |
| **Custom Website** | ✅ Auto | ❌ | ❌ | ✅ Manual |
| **Subdomain** | ✅ Auto | ❌ | ❌ | ✅ Paid |
| **Multi-language** | ✅ AI-powered | ⚠️ Manual | ❌ | ✅ Manual |
| **Team Management** | ✅ | ⚠️ Limited | ✅ | ⚠️ Limited |
| **Analytics** | ✅ Basic | ✅ Advanced | ✅ Advanced | ⚠️ Limited |
| **Menu Import (AI)** | ✅ Planned | ❌ | ❌ | ❌ |
| **API Access** | ✅ Planned | ❌ | ✅ Paid | ✅ Paid |
| **Open Source** | 🔄 Planned | ❌ | ❌ | ❌ |

### 2.7.2 Competitive Advantages

**Menu Crafter's Unique Selling Points:**

1. **All-in-one**: Menu + Website + QR in single platform
2. **Affordable**: Competitive pricing with free tier
3. **Fast setup**: <15 minutes vs 2-4 hours
4. **AI-powered**: Menu import, auto-translation
5. **Developer-friendly**: API access, potential open-source

### 2.7.3 Competitive Disadvantages

**Where We're Behind:**

1. **No POS integration** (TouchBistro has this)
2. **No payment processing** (requires third-party)
3. **Limited analytics** (competitors have advanced)
4. **Brand new** (no established reputation)

**Mitigation Strategy:**

- Focus on core features first
- Partner with payment providers
- Build analytics over time
- Offer exceptional support

---

## 2.8 Chapter Summary

This chapter:

1. **Analyzed problem domain** (§2.1): Identified pain points for restaurants and customers
2. **Identified stakeholders** (§2.2): Restaurant owners, staff, customers, administrators
3. **Specified functional requirements** (§2.3): 40+ specific features across 8 categories
4. **Defined non-functional requirements** (§2.4): Performance, security, usability, reliability
5. **Documented use cases** (§2.5): Key workflows with time estimates
6. **Listed constraints** (§2.6): Technical, business, and legal limitations
7. **Compared with competitors** (§2.7): Feature matrix and competitive positioning

**Key Takeaways:**

- Clear target market: Small-medium restaurants
- Must-have features: Menu management, QR codes, subdomain, multi-language
- Performance target: <2s page load, 99.9% uptime
- Competitive advantage: All-in-one platform with AI features

**Next Chapter**: Chapter 3 will present the system architecture and design decisions to meet these requirements.

---

**Word Count**: ~2,500

**Status**: 📝 Draft

**Last Updated**: October 15, 2025
