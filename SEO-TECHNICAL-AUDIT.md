# Technical SEO Audit — comedy.moscow
**Audit date**: 2026-05-15  
**Auditor**: Claude (automated)  
**Site**: https://comedy.moscow  
**Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS, SSR+ISR  
**Data source**: Womanstandup remote JSON + local fallback JSON  

---

## Technical Score: 60 / 100

| Category | Score | Status |
|---|---|---|
| Crawlability | 75/100 | Pass with issues |
| Indexability | 65/100 | Needs improvement |
| URL Structure | 55/100 | Needs improvement |
| Security | 70/100 | Needs improvement |
| Mobile Optimization | 90/100 | Pass |
| Core Web Vitals Readiness | 45/100 | Needs significant improvement |
| Structured Data | 80/100 | Pass with issues |
| JavaScript Rendering | 85/100 | Pass |
| IndexNow / Crawler Hints | 20/100 | Needs implementation |

---

## CRITICAL ISSUES (fix immediately)

### C1. WWW to non-WWW redirect chain is broken

**Current behavior**:
- `http://www.comedy.moscow` --301--> `https://www.comedy.moscow` **(200 OK -- duplicate domain!)**
- The www subdomain serves a full 200 response with canonical pointing to `https://comedy.moscow`

**Why it matters**: Search engines treat `www.comedy.moscow` and `comedy.moscow` as separate origins. Even though the canonical tag points to the non-www version, Google sometimes ignores canonicals. This splits link equity, confuses indexation, and creates a duplicate-site risk. Additionally, no `www.comedy.moscow` URLs appear in the sitemap, yet the domain is crawlable.

**Fix**: Update the nginx configuration to redirect `www.comedy.moscow` directly to `https://comedy.moscow` (the canonical domain):
```nginx
server {
    server_name www.comedy.moscow;
    return 301 https://comedy.moscow$request_uri;
}
```
Also add the non-www to www redirect for the HTTPS side:
```nginx
server {
    server_name www.comedy.moscow;
    listen 443 ssl;
    # ssl_certificate / ssl_certificate_key directives here
    return 301 https://comedy.moscow$request_uri;
}
```

### C2. Cache-Control prevents ALL caching (ISR is effectively disabled)

**Current behavior**: Every page returns:
```
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
```

**Root cause**: The homepage's `generateMetadata()` uses `searchParams: { date?: string }`. In Next.js 14, any page whose `generateMetadata` accesses `searchParams` is forced to dynamic rendering, which overrides the `export const revalidate = 300` ISR directive. The page is rendered fresh on every request with no CDN or browser caching.

**Why it matters**: This means:
- Zero CDN caching (Cloudflare/Fastly/etc cannot cache any response)
- Zero browser caching (every navigation re-fetches the full 419KB HTML payload)
- Poor TTFB for all users, especially mobile
- Increased server load
- Terrible for Core Web Vitals (LCP especially)

**Fix option A (recommended)**: Remove `searchParams` from `generateMetadata` and handle the date filter purely on the client side via CalendarWrapper. The canonical should always be the unfiltered homepage:
```typescript
// In app/page.tsx - remove searchParams from generateMetadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Стендап концерты в Москве — comedy.moscow',
    // ... rest stays the same, no searchParams access
  }
}
```
This restores ISR and the `Cache-Control: public, s-maxage=300, stale-while-revalidate=59` behavior.

**Fix option B**: If the date filter must remain SSR, add a `Cache-Control` header override in `next.config.mjs` for the homepage:
```javascript
async headers() {
  return [
    {
      source: '/',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
      ],
    },
    // ... existing headers
  ]
}
```
Note: this is a partial workaround. Option A is strongly preferred.

### C3. Noscript tracking pixels preloaded as LCP images

**Current behavior**: Three `<noscript>` pixel images are preloaded as critical images on every page:
```html
<link rel="preload" as="image" href="https://top-fwz1.mail.ru/counter?id=3764427;js=na"/>
<link rel="preload" as="image" href="https://mc.yandex.ru/watch/108210320"/>
<link rel="preload" as="image" href="https://mc.yandex.ru/watch/94359734"/>
```

**Why it matters**: These 1x1 tracking pixels are in `<noscript>` tags (only loaded when JavaScript is disabled). Preloading them as images wastes LCP budget, competes for bandwidth with the actual hero image, and adds unnecessary network requests. Google PageSpeed Insights will flag these as "preloaded resources not used within the first few seconds."

**Fix**: Remove the `<noscript>` image tags from the React component entirely, or at minimum remove the automatic preloading. Next.js auto-preloads any `<img>` inside `<noscript>` due to its preload scanner. The fix is to move these to a `<Script>` with `strategy="worker"` or inject them via a client component that only runs after hydration.

In `app/layout.tsx`, replace:
```tsx
<noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3764427;js=na" ... /></div></noscript>
```
With a client component that injects the noscript tag via `dangerouslySetInnerHTML` after mount, preventing the preload scanner from detecting it.

---

## HIGH PRIORITY

### H1. No Content-Security-Policy header

**Current behavior**: CSP header is completely absent from the security header config in `next.config.mjs`. The existing headers are:
- X-Content-Type-Options
- X-Frame-Options  
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security

**Why it matters**: Without CSP, the site is vulnerable to XSS attacks. Third-party scripts (Yandex Metrika, Mail.ru, Intickets, Yandex Dealer) run with full trust. This is both a security and SEO concern -- Google's ranking considers HTTPS and security posture.

**Fix**: Add a CSP header to `next.config.mjs`. Start with a report-only policy to identify violations before enforcing:
```javascript
{ key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://s3.intickets.ru https://mc.yandex.ru https://top-fwz1.mail.ru https://widget.afisha.yandex.ru; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://s3.intickets.ru; frame-src https://widget.afisha.yandex.ru; connect-src 'self' https://mc.yandex.ru https://top-fwz1.mail.ru;" }
```
After monitoring reports for 1-2 weeks and fixing violations, promote to enforcing CSP.

### H2. Sitemap missing <lastmod> dates on all 101 URLs

**Current behavior**: The sitemap contains `<loc>`, `<changefreq>`, and `<priority>` for all 101 URLs, but zero `<lastmod>` entries (confirmed: `grep -c '<lastmod>' sitemap.xml` returns `0`).

**Why it matters**: Google, Yandex, and Bing all use `<lastmod>` as a primary signal for recrawl priority. Without it, crawlers fall back to heuristics (which may be wrong) or treat all URLs with equal recrawl priority. For an event site where content freshness matters, this is particularly important. New events added to the sitemap may not be crawled promptly.

**Fix**: Add `lastModified` to every URL entry in `app/sitemap.ts`:
```typescript
// For event pages - use event creation date or the last data update
...events.map((e) => ({
  url: `${BASE}/events/${e.slug}`,
  lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.7,
})),
// For artist pages
...artists.map((a) => ({
  url: `${BASE}/artists/${a.slug}`,
  lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
  changeFrequency: 'monthly' as const,
  priority: 0.6,
})),
```
If the data source does not provide `updatedAt` timestamps, use the build timestamp as a fallback and prioritize adding update tracking to the data model.

### H3. Homepage HTML payload: 419KB

**Current behavior**: The homepage HTML response is 419,904 bytes (410KB). This is 4-5x larger than recommended for an above-the-fold render.

**Composition analysis** (approximate):
- Inline Yandex Metrika scripts (x2 counters): ~8KB
- VK Pixel (Mail.ru) inline script: ~3KB
- Yandex Dealer inline script: ~2KB  
- Organization + Website JSON-LD: ~2KB
- Breadcrumb + Event JSON-LD on event pages: ~3KB each
- Event card HTML (~30 events with full markup): ~180KB
- Image preload srcset URLs (long Next.js image optimization URLs): ~15KB
- CSS + JS chunk references: ~5KB
- Artist card HTML: ~20KB

**Why it matters**: A 419KB HTML payload means:
- Slow TTFB (server processing + network transfer)
- Delayed LCP (browser must parse 419KB before discovering critical resources)
- High bandwidth costs for mobile users
- Google's crawler may truncate >500KB pages

**Fix**: 
1. **Move analytics scripts to external files**: Instead of inline `<Script>` with `dangerouslySetInnerHTML`, use `src` attributes pointing to hosted script files.
2. **Paginate the homepage event list**: Show only 12-15 events by default with "Load more" for the rest. This alone would reduce HTML by ~60-80KB.
3. **Use `<link rel="preconnect">` instead of full preload URLs**: For origins like `s3.intickets.ru`, `mc.yandex.ru`, `widget.afisha.yandex.ru`, add preconnect hints rather than preloading specific resources.
4. **Lazy-load below-fold event cards**: Use `loading="lazy"` for event images and artist cards below the first viewport.

### H4. Event hero images use quality=100 (wasteful)

**Current behavior**: Preload hints on event pages show hero images with `q=100`:
```
/_next/image?url=...&w=3840&q=100 3840w
```

**Why it matters**: Quality=100 produces files 3-5x larger than quality=85 with imperceptible visual difference. Combined with 3840w breakpoints, this generates hero images that can be several megabytes. This directly harms LCP on event pages.

**Fix**: In the `EventHero` component, set `quality={85}` on the hero `<Image>` component. Even 85 produces excellent visual quality. For even better results, use `quality={80}` which is the sweet spot for web images.

### H5. Recurring events create near-duplicate content risk

**Current behavior**: The sitemap contains multiple events with near-identical titles and descriptions:
- `retro-stendap-1773991564823` and `retro-stendap-1773992471156` (both "Ретро Стендап")
- 7 instances of `bolshoy-devchachiy-stendap-*` (all "Большой девчачий стендап")
- 2 instances of `valeriya-yakovleva-*` (same artist, different dates)

**Why it matters**: Google may flag these as duplicate/thin content pages. The only differentiators are date, time, and venue. Pages with substantially similar content may be filtered from search results or consolidated, potentially hiding some event dates.

**Fix**: 
1. Add date-specific information to the description: "Ретро Стендап 15 мая в клубе X" vs "Ретро Стендап 28 мая в баре Y"
2. Ensure the venue name, lineup, and any special features are prominent and unique per event
3. Consider consolidating recurring events into a single page with multiple date listings, or using event series schema markup (`@type: EventSeries`)

### H6. Artist JSON-LD has empty/missing description fields

**Current behavior**: Some artist pages have `"description":""` in their structured data:
```json
{"@context":"https://schema.org","@type":"Person","name":"Найка Казиева","description":"","image":{...}}
```

**Why it matters**: Empty required/recommended schema fields can trigger warnings in Google Search Console's rich results reports. The `Person` schema type recommends `description` to be populated.

**Fix**: In the artist page, fall back to a generated description when `shortBio` and `bio` are both empty:
```typescript
const description = plainText(artist.shortBio || artist.bio || `${artist.name} — стендап-комик, участник концертов в Москве.`)
```

---

## MEDIUM PRIORITY

### M1. Robots.txt disallow + meta robots noindex conflict on /offer and /privacy

**Current behavior**:
- `robots.ts` disallows: `/api/`, `/offer`, `/privacy`
- `/offer` returns: `<meta name="robots" content="noindex, nofollow"/>`
- `/privacy` returns: `<meta name="robots" content="noindex, nofollow"/>`

**Why it matters**: Googlebot obeys `robots.txt` and will not crawl pages listed in `Disallow`. Since it cannot crawl the page, it cannot see the `noindex` meta tag. If the URL is discovered via an external link, Google may index it anyway (since it can't read the noindex directive). The correct pattern is:

1. **Remove from robots.txt** so the page can be crawled
2. **Keep the meta noindex** so the page is crawled but not indexed
3. Or: keep both, but understand that the meta robots is redundant for compliant crawlers

**Fix**: Remove `/offer` and `/privacy` from `robots.ts` disallow rules. Keep the `noindex` meta tags on the pages themselves. This way:
- Crawlers will access the pages
- Crawlers will see the noindex directive
- Pages will not be indexed

### M2. Event URL slugs contain Unix timestamps

**Current behavior**: All event URLs include a 13-digit Unix millisecond timestamp suffix:
```
/events/adam-berezov-solnyy-kontsert-1776276608258
/events/oleg-shcherbak-solnyy-kontsert-5-iyunya-1776274982930-1776274982930
```

**Why it matters**: 
- Timestamps make URLs longer and harder to read/share
- They provide no semantic value to users
- In the case of the oleg-shcherbak URL, the timestamp appears twice (`-1776274982930-1776274982930`) -- likely a bug in slug generation
- While not a direct ranking factor, clean URLs improve CTR in search results (users see the URL in SERPs)
- Timestamps make URLs predictable -- a competitor could enumerate events

**Fix**: If timestamps are needed for uniqueness (same artist may have multiple events), use a shorter unique identifier. Better: use a date-based slug:
```
/events/adam-berezov-solnyy-kontsert-2026-05-15
```
And handle collisions by appending a short hash only when needed:
```
/events/adam-berezov-solnyy-kontsert-2026-05-15-a3f2
```
The doubled-timestamp bug should be fixed immediately regardless.

### M3. Protocol-relative URL for external CSS

**Current behavior**: The Intickets CSS is loaded via a protocol-relative URL in `app/layout.tsx`:
```html
<link rel="stylesheet" href="//s3.intickets.ru/intickets.min.css" />
```

**Why it matters**: Protocol-relative URLs (`//`) are considered an anti-pattern since 2014. While browsers resolve them correctly, they can cause issues with certain crawlers and security scanners. Always use explicit `https://`.

**Fix**: Change to `https://s3.intickets.ru/intickets.min.css`.

### M4. No ETag or Last-Modified response headers

**Current behavior**: Server responses lack `ETag` and `Last-Modified` headers. This means:
- Browsers cannot perform conditional GET requests (If-None-Match / If-Modified-Since)
- Every page visit re-downloads the full HTML payload even when content is unchanged
- Crawlers cannot efficiently check for content updates

**Fix**: Next.js with ISR usually handles this automatically. Once the Cache-Control issue (C2) is fixed and ISR is properly functioning, Next.js will add `ETag` headers for statically generated pages. For dynamic pages, consider adding a `Last-Modified` header middleware.

### M5. Homepage OG image generated dynamically without dimensions

**Current behavior**: 
```html
<meta property="og:image" content="https://comedy.moscow/opengraph-image?dfa9ae01b38f13ff"/>
```
No `og:image:width` or `og:image:height` meta tags.

**Why it matters**: Social platforms (Facebook, Twitter, Telegram, VK) use image dimensions to determine layout. Without explicit dimensions, platforms may delay rendering, show incorrect aspect ratios, or skip the image entirely. Twitter requires `summary_large_image` with minimum 300x157 dimensions.

**Fix**: Add explicit dimensions to the homepage metadata:
```typescript
openGraph: {
  // ... existing
  images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'Стендап концерты в Москве' }],
}
```

---

## LOW PRIORITY

### L1. Artist pages use `force-static` with dynamic data dependency

**Current behavior**: `app/artists/[slug]/page.tsx` declares:
```typescript
export const dynamic = 'force-static'
```
But calls `getAllEvents()` which accesses potentially remote data. This creates a contradiction -- the page is built statically at deploy time but reads from a dynamic data source that may change.

**Impact**: Artist pages won't update with new events until the next build unless ISR is configured. Since `dynamic = 'force-static'` disables ISR, artist pages will become stale.

**Fix**: Either:
- Remove `force-static` and use `revalidate` for ISR, or
- Keep `force-static` but also add `generateStaticParams` to pre-build all known artist pages (already done), understanding that new artists require a redeploy

### L2. Thin content on artist pages without bio

**Current behavior**: Artists with empty `shortBio` and `bio` fields produce pages with no meaningful text content beyond the artist name and a list of events. A page like `/artists/nayka-kazieva` has `"description":""` in both the meta description and the JSON-LD.

**Impact**: Google may consider these as soft-404 or thin content pages, potentially deindexing them.

**Fix**: Add a fallback description or consider excluding artists with no bio from the sitemap until their profiles are populated.

### L3. IndexNow protocol not implemented

**Current behavior**: No IndexNow key or endpoint configured. IndexNow is supported by Bing, Yandex, and Naver -- all relevant for .moscow domain targeting Russian audience.

**Fix**: 
1. Generate an IndexNow key and serve it at `https://comedy.moscow/{key}.txt`
2. Submit URLs to IndexNow when new events are added: `POST https://api.indexnow.org/indexnow`
3. Add the key location to robots.txt: `IndexNow: https://comedy.moscow/{key}.txt`

### L4. Analytics `<noscript>` images trigger unnecessary preconnects

**Current behavior**: The preload scanner in Next.js detects `<img>` tags (even in `<noscript>`) and adds `<link rel="preload" as="image">` hints for them. This preloads three 1x1 tracking pixels on every page load.

**Fix**: Already partially addressed in C3. After removing the noscript images, the preload hints will disappear automatically.

---

## WHAT IS WORKING WELL

1. **HTTPS everywhere**: HTTP to HTTPS 301 redirect works correctly for the canonical domain.
2. **Trailing slash canonicalization**: Next.js correctly redirects `/events/` --308--> `/events`.
3. **404 handling**: Non-existent pages return proper 404 status with a custom not-found page.
4. **Structured data quality (event pages)**: Event JSON-LD includes Event, BreadcrumbList, AggregateRating, Review, Offer schemas -- comprehensive and well-formed.
5. **Meta tags**: Title, description, robots, canonical, OG, and Twitter cards are present on all pages.
6. **RSS feeds**: `/rss.xml` and `/feed.xml` endpoints available, linked via `<link rel="alternate">`.
7. **Viewport meta tag**: Present and correctly configured.
8. **Font loading**: `next/font/google` with Cyrillic subsets, woff2 format, `font-display` handled by Next.js.
9. **Image optimization**: `next/image` used throughout with responsive srcset, WebP format, device sizes configured.
10. **SSR + ISR**: All critical content is server-rendered, no client-side data fetching for SEO content.
11. **Date-filtered pages noindexed**: `?date=` parameter correctly triggers `noindex, follow` -- good practice.
12. **Internal linking**: 40+ internal links on homepage connecting to events and artists pages.
13. **Security headers exist**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy all present.
14. **Sitemap includes all page types**: Main pages (5), events (34), artists (62) all represented.
15. **Robots.txt has sitemap reference**: Clean and correctly formatted.

---

## SUMMARY TABLE

| # | Issue | Priority | Effort | Impact |
|---|---|---|---|---|
| C1 | WWW redirect chain broken | Critical | Low (nginx config) | High (duplicate site) |
| C2 | Cache-Control disables ISR | Critical | Medium (refactor) | High (TTFB, LCP, CDN) |
| C3 | Noscript pixels preloaded | Critical | Low (refactor) | Medium (LCP budget) |
| H1 | No CSP header | High | Medium (test then enforce) | High (security) |
| H2 | Sitemap missing lastmod | High | Low (add field) | Medium (crawl freshness) |
| H3 | 419KB HTML payload | High | High (restructure) | High (TTFB, LCP, mobile) |
| H4 | Hero images quality=100 | High | Low (change prop) | Medium (LCP on event pages) |
| H5 | Near-duplicate event pages | High | Medium (unique content) | Medium (index bloat) |
| H6 | Artist JSON-LD empty desc | High | Low (fallback text) | Low (schema warnings) |
| M1 | robots.txt + noindex conflict | Medium | Low (remove disallow) | Low (index hygiene) |
| M2 | Timestamps in URL slugs | Medium | High (slug migration) | Medium (UX, CTR) |
| M3 | Protocol-relative CSS URL | Medium | Low (change one char) | Low (best practice) |
| M4 | No ETag/Last-Modified | Medium | Low (fix C2 first) | Low (conditional requests) |
| M5 | OG image missing dims | Medium | Low (add width/height) | Low (social previews) |
| L1 | force-static + dynamic data | Low | Low (add revalidate) | Low (content staleness) |
| L2 | Thin artist pages | Low | Medium (add content) | Low (soft-404 risk) |
| L3 | No IndexNow | Low | Low (add endpoint) | Low (Bing/Yandex speed) |
| L4 | Noscript pixel preconnects | Low | Low (fix with C3) | Low (bandwidth waste) |

---

## RECOMMENDED FIX ORDER

### Sprint 1 (this week)
1. Fix C1: nginx www redirect (15 minutes)
2. Fix C3: remove noscript image preloads (30 minutes)
3. Fix H4: set quality=85 on hero images (5 minutes)
4. Fix H2: add lastmod to sitemap (30 minutes)
5. Fix M3: protocol-relative URL to explicit https (2 minutes)

### Sprint 2 (next week)
6. Fix C2: refactor homepage metadata to restore ISR (2-4 hours)
7. Fix H1: implement CSP report-only + monitor (2 hours setup + ongoing)
8. Fix M1: remove /offer, /privacy from robots.txt disallow (5 minutes)
9. Fix M5: add OG image dimensions (10 minutes)

### Backlog
10. H3: paginate homepage event list, defer analytics
11. H5: add unique content to recurring event pages
12. H6: add fallback descriptions for empty artist bios
13. M2: migrate to clean URL slugs (requires redirect map)
14. L1-L4: low-priority improvements

---

## NOTES FOR FUTURE AUDITS

- **INP monitoring**: All interactive elements (BuyButton, StickyBuyBar, CalendarWrapper, GalleryLightbox) are client components. Monitor INP via CrUX/PageSpeed Insights for the `/events/[slug]` pages which have the most interactive elements. The StickyBuyBar with Framer Motion animations may contribute to INP on low-end mobile devices.
- **CLS monitoring**: The text content in event descriptions uses `dangerouslySetInnerHTML` which can cause CLS if images or embeds in the HTML lack explicit dimensions. Similarly, the HeroSlider on the homepage uses Framer Motion entrance animations -- ensure `aspect-ratio` is set on the slider container.
- **Hreflang**: No hreflang tags are currently present. If the site expands to multiple languages or targets different Russian-speaking regions, hreflang should be added.
- **Mobile usability**: Tailwind responsive classes are used. Touch targets on BuyButton and share buttons should be checked for minimum 48x48px sizing (Google's threshold). The StickyBuyBar on mobile should be tested for covering content.
- **Crawler budget**: With 101 URLs in sitemap and 419KB pages, crawl budget should be fine for a site this size. However, if the site grows to 500+ events, consider paginating sitemaps.
