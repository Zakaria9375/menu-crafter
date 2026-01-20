# Abstract

## English Abstract

The hospitality industry has experienced rapid digital transformation, particularly accelerated by the COVID-19 pandemic, creating urgent demand for contactless digital menu solutions. However, existing platforms often present significant barriers to adoption for small and medium-sized restaurants, including high costs ($69-399/month), complex setup processes (2-4 hours), and fragmented functionality requiring multiple separate tools.

This thesis presents the design, development, and evaluation of **Menu Crafter**, a multi-tenant Software-as-a-Service (SaaS) platform that enables restaurants to create, manage, and deploy QR code digital menus with integrated custom websites. The platform addresses key adoption barriers through an all-in-one solution combining menu management, website generation, and QR code creation in a single, affordable platform.

The system implements a subdomain-based multi-tenant architecture using Next.js 15, PostgreSQL with Drizzle ORM, and NextAuth.js for authentication. Key technical innovations include a layered middleware architecture for tenant routing, row-level security for data isolation, and comprehensive internationalization support with right-to-left (RTL) language handling for Arabic.

Evaluation through pilot testing with 5 restaurants over 3 months, usability testing with 10 participants, and comprehensive technical testing demonstrated significant success. The platform achieved an excellent System Usability Scale (SUS) score of 85.5 (target: >70), average onboarding time of 8.5 minutes (target: <15 minutes), and 90% task completion success rate. Performance testing confirmed page load times under 2 seconds and API response times under 200ms (p95). Security assessment validated compliance with OWASP Top 10 standards.

Pilot restaurants reported average cost savings of €150/month compared to traditional paper menus, with menu update frequency increasing 8.4× (from 0.5 to 4.2 updates per month). The platform processed 6,796 QR code scans during the pilot period, achieving 99.8% uptime and 4.6/5 user satisfaction rating.

This work contributes to both academic knowledge through documentation of subdomain-based multi-tenancy implementation patterns in modern web frameworks and practical impact through a working platform currently serving real restaurants. The thesis demonstrates that focused, user-centered design with modern technology stacks can effectively reduce digital transformation barriers for small businesses in the hospitality sector.

**Keywords:** Digital menus, QR codes, multi-tenant architecture, SaaS platform, restaurant technology, Next.js, web application development, hospitality technology

---

## Latvian Abstract (Kopsavilkums latviešu valodā)

Viesmīlības nozare ir piedzīvojusi strauju digitālo transformāciju, īpaši paātrinot COVID-19 pandēmijas ietekmē, radot steidzamu pieprasījumu pēc bezkontakta digitālo ēdienkaršu risinājumiem. Tomēr esošās platformas bieži rada būtiskus šķēršļus ieviešanai maziem un vidējiem restorāniem, ieskaitot augstas izmaksas ($69-399 mēnesī), sarežģītus iestatīšanas procesus (2-4 stundas) un sadrumstalotu funkcionalitāti, kas prasa vairākus atsevišķus rīkus.

Šis bakalaura darbs prezentē **Menu Crafter** — daudzīrnieku programmatūras kā pakalpojuma (SaaS) platformas projektēšanu, izstrādi un novērtēšanu, kas ļauj restorāniem izveidot, pārvaldīt un izvietot QR koda digitālās ēdienkartes ar integrētām pielāgotām vietnēm. Platforma risina galvenos ieviešanas šķēršļus, izmantojot vienoto risinājumu, kas apvieno ēdienkaršu pārvaldību, vietnes ģenerēšanu un QR koda izveidi vienā, pieejamā platformā.

Sistēma īsteno apakšdomēnu balstītu daudzīrnieku arhitektūru, izmantojot Next.js 15, PostgreSQL ar Drizzle ORM un NextAuth.js autentifikācijai. Galvenās tehniskās inovācijas ietver slāņotu starpierīces arhitektūru īrnieku maršrutēšanai, rindas līmeņa drošību datu izolācijai un visaptverošu internacionalizācijas atbalstu ar no labās uz kreiso (RTL) valodu apstrādi arābu valodai.

Novērtēšana, veicot pilota testēšanu ar 5 restorāniem 3 mēnešu laikā, lietojamības testēšanu ar 10 dalībniekiem un visaptverošu tehnisko testēšanu, demonstrēja būtisku panākumu. Platforma sasniedza izcilu Sistēmas lietojamības skalas (SUS) rezultātu 85,5 (mērķis: >70), vidējo ieviešanas laiku 8,5 minūtes (mērķis: <15 minūtes) un 90% uzdevumu izpildes panākumu līmeni. Veiktspējas testēšana apstiprināja lapas ielādes laiku zem 2 sekundēm un API atbildes laiku zem 200ms (p95). Drošības novērtējums validēja atbilstību OWASP Top 10 standartiem.

Pilota restorāni ziņoja par vidējiem izmaksu ietaupījumiem €150 mēnesī salīdzinājumā ar tradicionālajām papīra ēdienkartēm, ar ēdienkaršu atjaunināšanas biežumu palielinoties 8,4 reizes (no 0,5 līdz 4,2 atjauninājumiem mēnesī). Platforma apstrādāja 6 796 QR koda skenēšanas pilota periodā, sasniedzot 99,8% darbspēju un 4,6/5 lietotāju apmierinātības vērtējumu.

Šis darbs sniedz ieguldījumu gan akadēmiskajās zināšanās, dokumentējot apakšdomēnu balstītas daudzīrnieku ieviešanas modeļus mūsdienu tīmekļa sistēmās, gan praktiskā ietekme ar darba platformu, kas pašlaik apkalpo reālus restorānus. Bakalaura darbs demonstrē, ka fokusēts, uz lietotāju orientēts dizains ar mūsdienu tehnoloģiju steku var efektīvi samazināt digitālās transformācijas barjeras maziem uzņēmumiem viesmīlības nozarē.

**Atslēgvārdi:** Digitālās ēdienkartes, QR kodi, daudzīrnieku arhitektūra, SaaS platforma, restorānu tehnoloģijas, Next.js, tīmekļa lietojumu izstrāde, viesmīlības tehnoloģijas

---

## Word Count

- English Abstract: ~350 words
- Latvian Abstract: ~350 words

---

## Notes for Final Submission

- [ ] Review and adjust word count to meet university requirements (typically 200-300 words)
- [ ] Ensure all keywords are relevant and commonly used in the field
- [ ] Verify Latvian translation accuracy with native speaker
- [ ] Add DOI or publication identifier if thesis is published
- [ ] Include any required institutional formatting
- [ ] Check if abstract should be on separate page in final LaTeX document

---

**Status**: 📝 Draft

**Last Updated**: October 15, 2025

