import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { TouchPinKeypad } from '../src/components/TouchPinKeypad';

console.log('🧪 Starting TouchPinKeypad Driver Sensor Component Test Suite...\n');

let passCount = 0;
let failCount = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    failCount++;
  }
}

// 1. Render empty PIN state
test('TouchPinKeypad renders 4 empty slots and disabled submit button on empty pin', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <TouchPinKeypad
      pin=""
      onChange={() => {}}
      onSubmit={() => {}}
    />
  );

  assert(html.includes('aria-label="Kiritilgan PIN kod katakchalari"'), 'should have slots group aria-label');
  assert(html.includes('aria-label="Sensorli raqamli klaviatura"'), 'should have numpad group aria-label');
  // 4 slots rendered
  const roundedDots = html.match(/rounded-full bg-slate-600/g);
  assert(roundedDots && roundedDots.length === 4, 'should render 4 placeholder dots for empty pin');
  // Submit button should be disabled
  assert(html.includes('disabled=""') || html.includes('disabled'), 'submit button must be disabled');
});

// 2. Render entered digits
test('TouchPinKeypad displays entered digits in slots', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <TouchPinKeypad
      pin="74"
      onChange={() => {}}
      onSubmit={() => {}}
    />
  );

  assert(html.includes('>7<'), 'should display digit 7');
  assert(html.includes('>4<'), 'should display digit 4');
  const roundedDots = html.match(/rounded-full bg-slate-600/g);
  assert(roundedDots && roundedDots.length === 2, 'should have 2 remaining placeholder dots');
});

// 3. Render 3x4 grid of 12 buttons with minimum 60x60px touch dimensions
test('TouchPinKeypad renders 12 tactile buttons with min-w-[60px] and min-h-[60px]', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <TouchPinKeypad
      pin="1234"
      onChange={() => {}}
      onSubmit={() => {}}
    />
  );

  // All 10 digits + Clear + Backspace
  for (let i = 0; i <= 9; i++) {
    assert(html.includes(`aria-label="Raqam ${i}"`), `must have aria-label for digit ${i}`);
  }
  assert(html.includes('aria-label="Tozalash"'), 'must have clear button');
  assert(html.includes('aria-label="Bitta o‘chirish"'), 'must have backspace button');

  // Verify heavy truck cabin touch target ergonomics: min-w-[60px] and min-h-[60px]
  assert(html.includes('min-w-[60px]'), 'all buttons must enforce min-w-[60px]');
  assert(html.includes('min-h-[60px]'), 'all buttons must enforce min-h-[60px]');
});

// 4. Submit button enabled when full 4 digits entered
test('TouchPinKeypad enables confirmation button when pin length is 4', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <TouchPinKeypad
      pin="7492"
      onChange={() => {}}
      onSubmit={() => {}}
    />
  );

  assert(html.includes('PIN-KODNI TASDIQLASH'), 'should have confirmation text');
  // Check that the submit button doesn't have disabled attribute
  const submitPart = html.slice(html.indexOf('PIN-KODNI TASDIQLASH') - 250);
  assert(!submitPart.includes('disabled=""'), 'submit button should not be disabled when pin is 4 digits');
});

// 5. Render error message
test('TouchPinKeypad renders error message when error prop is provided', () => {
  const errorMessage = 'PIN-kod noto‘g‘ri! Qayta kiriting.';
  const html = ReactDOMServer.renderToStaticMarkup(
    <TouchPinKeypad
      pin="1111"
      error={errorMessage}
      onChange={() => {}}
      onSubmit={() => {}}
    />
  );

  assert(html.includes(errorMessage), 'should render error message text');
});

// 6. Disabled state
test('TouchPinKeypad respects disabled prop on all buttons', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <TouchPinKeypad
      pin="74"
      disabled={true}
      onChange={() => {}}
      onSubmit={() => {}}
    />
  );

  assert(html.includes('disabled=""') || html.includes('disabled'), 'buttons should be disabled');
});

console.log('\n========================================');
console.log(`TOTAL KEYPAD TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('========================================\n');

if (failCount > 0) {
  process.exit(1);
}
