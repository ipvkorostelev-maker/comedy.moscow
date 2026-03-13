# CLAUDE.md

Ты senior full-stack developer, frontend architect и UI/UX engineer.

Задача:
создать современный production-ready сайт по двум страницам-референсам, которые есть в проекте.

Важно:
- не копировать код референсов
- использовать их как визуальный и UX-ориентир
- сохранить общую атмосферу, композицию, стиль блоков и подачу контента

Сайт должен выглядеть как гибрид:
Apple TV
Netflix
современные event платформы.


## Стек

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Node.js API routes

## Ограничения

- без базы данных
- все данные хранить в JSON-файлах
- сайт должен легко редактироваться без БД
- код должен быть чистым, модульным и переиспользуемым

## Формат данных

Создать папку `/data` и использовать JSON-файлы:
- events.json
- artists.json
- pages.json
- venues.json

## Что нужно построить

- главная страница
- каталог событий
- страница события
- каталог артистов
- страница артиста
- при необходимости страница города

## UI/UX требования

- современный cinematic / premium интерфейс
- адаптивность mobile-first
- аккуратные hover-эффекты
- плавные анимации
- хорошая читаемость
- сильная визуальная иерархия
- переиспользуемые секции и карточки

## SEO

Добавить:
- metadata
- OpenGraph
- Twitter cards
- JSON-LD schema
- canonical
- breadcrumbs

## Производительность

- использовать Next Image
- lazy loading
- server components там, где уместно
- минимизировать клиентский JS
- добиться высокого Lighthouse score

## Админ-логика

Без полноценной БД.
Можно сделать простую JSON-admin логику через API routes для чтения/обновления данных.

## Стиль работы

Перед генерацией кода:
1. сначала проанализируй референсы
2. предложи архитектуру проекта
3. предложи структуру папок
4. перечисли страницы и компоненты
5. только потом начинай писать код

Всегда думай как senior engineer:
- избегай дублирования
- выноси общую логику
- соблюдай чистую структуру проекта
- делай проект готовым к расширению проекта как senior software architect
потом начинай писать код

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## atic HTML mockups for a standup concert event/ticketing page ("Смешно" afisha). No build step, no dependencies — open files directly in a browser.

## Files

- `standup-concert-page.html` — original mockup
- `standup-concert-page_2.html` — second iteration (content identical, kept for comparison)

## Architecture

Each file is a single self-contained HTML page with:
- **CSS custom properties** at `:root` for the design token system (colors: `--bg`, `--red`, `--gold`, etc.; fonts: Playfair Display for headings, DM Sans for body)
- **Sections** (top to bottom): fixed nav → fullscreen hero with float card → main content grid (about + sticky sidebar) → tickets (3 tiers) → photo gallery → reviews → horizontal-scroll similar events → sticky buy bar
- **JS** (inline, ~10 lines): scroll-triggered sticky bar visibility + wishlist heart toggle
- **Responsive** breakpoint at 
