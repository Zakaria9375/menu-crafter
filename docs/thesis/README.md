# Thesis Chapters - Menu Crafter Platform

> **Thesis Title**: Development of QR Menu Platform (Latvian: QR ēdienkartes platformas izstrāde)
>
> **Author**: Zakaria Ali
>
> **Institution**: Riga Technical University (RNU)
>
> **Degree**: BSc in Information Systems

---

## 📁 Folder Structure

This folder contains all thesis chapters written in Markdown format for easier editing and collaboration.

```
thesis/
├── README.md (this file)
├── abstract.md                 # Abstract (English & Latvian)
├── 00-introduction.md          # Introduction chapter
├── 01-literature-review.md     # Chapter 1: Literature Review
├── 02-system-analysis.md       # Chapter 2: System Analysis
├── 03-design-architecture.md   # Chapter 3: Design & Architecture
├── 04-implementation.md        # Chapter 4: Implementation
├── 05-testing-evaluation.md    # Chapter 5: Testing & Evaluation
├── 06-conclusions.md           # Conclusions
├── references.md               # Bibliography references
└── images/                     # Images and diagrams
```

---

## 📝 Writing Guidelines

### Markdown Tips

- Use `#` for chapter titles, `##` for sections, `###` for subsections
- Code blocks: Use triple backticks with language: \`\`\`typescript
- Citations: Use `[@author2023]` format (will be converted to LaTeX later)
- Images: `![Alt text](images/filename.png)`
- Tables: Use Markdown tables or paste from Excel

### Citation Format

When referencing sources, use this format:

- Book: `[@porter2008]`
- Article: `[@lapina2016]`
- Multiple: `[@friedman2006; @schmidt2014]`

### Code Examples

Include actual code from the Menu Crafter application:

- Authentication flows
- Middleware logic
- Database schemas
- API endpoints

---

## 🔄 Workflow

1. **Write in Markdown** (easier, faster, collaborative)
2. **Review and edit** (easier to track changes in Git)
3. **Convert to LaTeX** (when ready for final submission)
4. **Compile PDF** (using the RNU LaTeX template)

---

## 📊 Chapter Status

| Chapter | Status | Word Count | Last Updated |
|---------|--------|------------|--------------|
| Abstract | ✅ Complete | ~700 | Oct 15, 2025 |
| Introduction | ✅ Complete | ~1,000 | Oct 15, 2025 |
| Chapter 1 | ✅ Complete | ~2,000 | Oct 15, 2025 |
| Chapter 2 | ✅ Complete | ~2,500 | Oct 15, 2025 |
| Chapter 3 | ✅ Complete | ~3,000 | Oct 15, 2025 |
| Chapter 4 | ✅ Complete | ~3,500 | Oct 15, 2025 |
| Chapter 5 | ✅ Complete | ~2,800 | Oct 15, 2025 |
| Conclusions | ✅ Complete | ~2,500 | Oct 15, 2025 |

**Status Legend**: 📝 Draft | ✅ Complete | 🔄 In Review | ⏸️ Paused

**Total Word Count**: ~17,500+ words

---

## 🎯 Thesis Outline

### Introduction

- Relevance of the problem
- Aim of the study
- Research tasks
- Methods
- Thesis structure

### Chapter 1: Literature Review and Theoretical Background

- QR code technology in hospitality
- SaaS platforms and multi-tenancy
- Digital menu systems (existing solutions)
- Theoretical framework

### Chapter 2: System Analysis and Requirements

- Problem analysis
- Stakeholder analysis
- Functional requirements
- Non-functional requirements
- Comparison with existing solutions

### Chapter 3: System Design and Architecture

- System architecture
- Database design
- Multi-tenant architecture
- Authentication and authorization
- Middleware design
- UI/UX design

### Chapter 4: Implementation

- Technology stack
- Database implementation
- Authentication system
- Multi-tenant routing
- Admin dashboard
- Frontend components
- AI features (planned)

### Chapter 5: Testing and Evaluation

- Testing strategy
- Unit tests
- Integration tests
- User acceptance testing
- Performance evaluation
- Security assessment

### Conclusions

- Summary of results
- Contributions
- Limitations
- Future work

---

## 📚 Resources

### Application Documentation

- [Application Overview](../docs/APPLICATION_OVERVIEW.md)
- [Middleware Documentation](../docs/MIDDLEWARE_DOCUMENTATION.md)
- [Development Quick Start](../docs/DEVELOPMENT_QUICK_START.md)
- [AI Features Guide](../docs/AI_AUTOMATION_FEATURES.md)

### Source Code References

- Database Schema: `src/lib/db/schema.ts`
- Authentication: `src/lib/auth/index.ts`
- Middleware: `src/middleware.ts`
- Components: `src/components/`

---

## 🔗 Integration with LaTeX

When ready to compile the final thesis:

1. Convert Markdown to LaTeX using Pandoc or manually
2. Copy content to respective `.tex` files in `../msc_2025_zakaria_ali/b_chapters/`
3. Add proper LaTeX formatting (citations, figures, tables)
4. Compile using XeLaTeX

---

## 💾 Version Control

Remember to commit your progress regularly:

```bash
git add thesis/
git commit -m "Chapter X: [brief description]"
git push
```

**Mandatory**: Bi-weekly commits as per RNU requirements!

---

## 📧 Contact

For questions or guidance:

- Supervisor: [Name]
- Email: [Email]

---

**Last Updated**: October 15, 2025
