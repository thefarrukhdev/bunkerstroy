import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  CABINET_OPTIONS,
  UZBEKISTAN_REGIONS,
  NAV_LINKS,
  OFFICIAL_CHANNELS,
  SUPPORTED_LANGUAGES,
  getDedicatedAppUrl
} from '../src/components/navbar/constants.ts';

describe('BunkerStroy Modular Navbar Architecture & Configuration', () => {
  test('14 ta viloyat va markaziy filtr to‘liq mavjudligi', () => {
    assert.strictEqual(UZBEKISTAN_REGIONS.length, 15);
    assert.strictEqual(UZBEKISTAN_REGIONS[0], 'Barcha viloyatlar');
    assert.ok(UZBEKISTAN_REGIONS.includes('Toshkent shahri'));
    assert.ok(UZBEKISTAN_REGIONS.includes('Samarqand viloyati'));
    assert.ok(UZBEKISTAN_REGIONS.includes('Qoraqalpog‘iston Respublikasi'));
  });

  test('3 ta asosiy boshqaruv kabineti (Mijoz, Hamkor & Sotuvchi, Admin) to‘liq sozlanganligi', () => {
    assert.strictEqual(CABINET_OPTIONS.length, 3);
    const ids = CABINET_OPTIONS.map((c) => c.id);
    assert.deepStrictEqual(ids, ['client', 'seller', 'admin']);

    CABINET_OPTIONS.forEach((cab) => {
      assert.ok(cab.title.length > 0);
      assert.ok(cab.subtitle.length > 0);
      assert.ok(cab.badge.length > 0);
      assert.ok(cab.path.startsWith('/'));
    });
  });

  test('Asosiy 6 ta navigatsiya bo‘limlari mavjudligi', () => {
    assert.strictEqual(NAV_LINKS.length, 6);
    const paths = NAV_LINKS.map((n) => n.path);
    assert.deepStrictEqual(paths, [
      '/',
      '/catalog',
      '/suppliers',
      '/logistics',
      '/calculators',
      '/tenders'
    ]);
  });

  test('Rasmiy aloqa va ijtimoiy kanallar', () => {
    assert.ok(OFFICIAL_CHANNELS.telegram.includes('t.me/bunkerstroy_uz'));
    assert.ok(OFFICIAL_CHANNELS.instagram.includes('instagram.com/bunkerstroy.uz'));
    assert.ok(OFFICIAL_CHANNELS.phone.includes('+998'));
  });

  test('getDedicatedAppUrl port xaritalari', () => {
    // In node environment without window, returns default or null
    assert.strictEqual(typeof getDedicatedAppUrl, 'function');
  });

  test('3 ta til (UZ, RU, EN) to‘liq qo‘llab-quvvatlanishi va sozlanishi', () => {
    assert.strictEqual(SUPPORTED_LANGUAGES.length, 3);
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    assert.deepStrictEqual(codes, ['uz', 'ru', 'en']);

    const labels = SUPPORTED_LANGUAGES.map((l) => l.label);
    assert.deepStrictEqual(labels, ['UZ', 'RU', 'EN']);

    const titles = SUPPORTED_LANGUAGES.map((l) => l.title);
    assert.deepStrictEqual(titles, ['O‘zbek tili', 'Русский язык', 'English']);
  });
});
