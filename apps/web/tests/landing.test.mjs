import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  PRODUCTS_SOLD,
  USER_SEGMENTS,
  TRADE_MODEL_ITEMS,
  CRM_FEATURES,
  DELIVERY_FEATURES,
  PLATFORM_METRICS,
  UZBEKISTAN_REGIONS
} from '../src/features/landing/constants.ts';

describe('BunkerStroy Landing Page Architecture & Constants', () => {
  test('Platformada nimalar sotiladi (4 ta asosiy yo‘nalish)', () => {
    assert.strictEqual(PRODUCTS_SOLD.length, 4);
    const ids = PRODUCTS_SOLD.map((p) => p.id);
    assert.deepStrictEqual(ids, ['tashqi', 'ichki', 'tamirlash', 'uskunalar']);

    PRODUCTS_SOLD.forEach((cat) => {
      assert.ok(cat.title.length > 0);
      assert.ok(cat.badge.length > 0);
      assert.ok(cat.itemTags.length >= 4);
    });
  });

  test('Platformadan kimlar foydalanadi (3 ta ishtirokchi guruhi)', () => {
    assert.strictEqual(USER_SEGMENTS.length, 3);
    const ids = USER_SEGMENTS.map((s) => s.id);
    assert.deepStrictEqual(ids, ['zavodlar', 'marketlar', 'mijozlar']);

    USER_SEGMENTS.forEach((seg) => {
      assert.ok(seg.keyPoints.length >= 3);
      assert.ok(seg.targetAudience.length > 0);
    });
  });

  test('Savdo modeli (3 ta asosiy qoida va 50/50 escrow)', () => {
    assert.strictEqual(TRADE_MODEL_ITEMS.length, 3);
    assert.strictEqual(TRADE_MODEL_ITEMS[0].number, 1);
    assert.strictEqual(TRADE_MODEL_ITEMS[1].number, 2);
    assert.strictEqual(TRADE_MODEL_ITEMS[2].number, 3);

    // Rule 3 must be the 50/50 safe trade model
    assert.ok(TRADE_MODEL_ITEMS[2].title.includes('50%'));
    assert.ok(TRADE_MODEL_ITEMS[2].badgeText.includes('50/50'));
  });

  test('Onlayn va oflayn CRM tizimi (3 ta ustun)', () => {
    assert.strictEqual(CRM_FEATURES.length, 3);
    const ids = CRM_FEATURES.map((f) => f.id);
    assert.deepStrictEqual(ids, ['alohida-hisob', 'umumiy-hisob', 'monitoring']);
  });

  test('Yetkazib berish va 12 viloyat qamrovi', () => {
    assert.strictEqual(DELIVERY_FEATURES.length, 3);
    assert.ok(UZBEKISTAN_REGIONS.length >= 12);
  });

  test('Platforma rekvizitlari va admin aloqasi', () => {
    assert.strictEqual(PLATFORM_METRICS.adminPhone, '+998 95 082 1336');
    assert.strictEqual(PLATFORM_METRICS.adminPhoneRaw, '+998950821336');
    assert.strictEqual(PLATFORM_METRICS.domain, 'BunkerStroy.uz');
    assert.strictEqual(PLATFORM_METRICS.startDate, '07.11.2026');
  });

  test('Hech qanday "slayd" yoki "slide" so‘zi mavjud emasligi kafolati', () => {
    const rawJson = JSON.stringify({
      PRODUCTS_SOLD,
      USER_SEGMENTS,
      TRADE_MODEL_ITEMS,
      CRM_FEATURES,
      DELIVERY_FEATURES,
      PLATFORM_METRICS
    }).toLowerCase();

    assert.strictEqual(rawJson.includes('slayd'), false, 'Found "slayd" in constants JSON!');
    assert.strictEqual(rawJson.includes('slide'), false, 'Found "slide" in constants JSON!');
  });
});
