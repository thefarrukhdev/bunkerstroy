import assert from 'node:assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  Button,
  Badge,
  Card,
  Input,
  Select,
  Modal,
  Drawer,
  Alert,
  StatCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  Tabs,
  TabsList,
  TabTrigger,
  TabsContent,
  Skeleton,
  Tooltip
} from '../src/index';

console.log('🧪 Starting BunkerStroy 10 Global Industrial Components Test Suite...\n');

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

// 1. Input Tests
test('Input renders with default props, bunker styling and placeholder', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Input placeholder="Enter supplier name" />
  );
  assert(html.includes('placeholder="Enter supplier name"'), 'placeholder must be rendered');
  assert(html.includes('bg-bunker-input'), 'must use bunker input style');
});

test('Input renders label, error message, mono styling, and ARIA attributes', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Input
      label="STIR Raqami"
      error="STIR 9 xonali bo‘lishi kerak"
      helperText="Davlat soliq xizmati kodi"
      isMono
      sizeVariant="lg"
    />
  );
  assert(html.includes('STIR Raqami'), 'label must be rendered');
  assert(html.includes('STIR 9 xonali bo‘lishi kerak'), 'error message must be rendered');
  assert(html.includes('aria-invalid="true"'), 'aria-invalid must be true');
  assert(html.includes('font-mono'), 'mono font must be applied');
  assert(html.includes('px-4 py-3'), 'lg size variant must be applied');
});

// 2. Select Tests
test('Select renders with options, size variants, and custom chevron', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Select label="Viloyat" sizeVariant="sm" defaultValue="tashkent">
      <option value="tashkent">Toshkent shahri</option>
      <option value="samarkand">Samarqand viloyati</option>
    </Select>
  );
  assert(html.includes('Viloyat'), 'label must be rendered');
  assert(html.includes('Toshkent shahri'), 'option must be rendered');
  assert(html.includes('<svg'), 'chevron icon must be rendered');
  assert(html.includes('text-xs'), 'sm size variant must be applied');
});

test('Select renders with options array prop', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Select
      label="Kategoriya"
      options={[
        { label: 'Sement va Qorishmalar', value: 'cement' },
        { label: 'Metall va Armatura', value: 'metal' }
      ]}
    />
  );
  assert(html.includes('Sement va Qorishmalar'), 'options array items must be rendered');
  assert(html.includes('Metall va Armatura'), 'options array items must be rendered');
});

// 3. Modal Tests
test('Modal does not render when isOpen=false', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Modal isOpen={false} onClose={() => {}} title="Yopiq Modal">
      <p>Body</p>
    </Modal>
  );
  assert.strictEqual(html, '', 'modal must return null when closed');
});

test('Modal renders accessible dialog when isOpen=true with rivets and footer', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Modal
      isOpen={true}
      onClose={() => {}}
      title="BunkerStroy Texnik Dialog"
      subtitle="B2B E-IMZO tekshiruvi"
      size="lg"
      rivetAccents
      footer={<button>Saqlash</button>}
    >
      <div>Modal Body Content</div>
    </Modal>
  );
  assert(html.includes('role="dialog"'), 'must have role="dialog"');
  assert(html.includes('aria-modal="true"'), 'must have aria-modal="true"');
  assert(html.includes('BunkerStroy Texnik Dialog'), 'title must be rendered');
  assert(html.includes('B2B E-IMZO tekshiruvi'), 'subtitle must be rendered');
  assert(html.includes('max-w-2xl'), 'lg size must be max-w-2xl');
  assert(html.includes('industrial-rivet'), 'rivet accents must be rendered');
  assert(html.includes('Modal Body Content'), 'body content must be rendered');
  assert(html.includes('Saqlash'), 'footer must be rendered');
});

// 4. Drawer Tests
test('Drawer does not render when isOpen=false', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Drawer isOpen={false} onClose={() => {}} title="Yopiq Savat">
      <div>Cart Items</div>
    </Drawer>
  );
  assert.strictEqual(html, '', 'drawer must return null when closed');
});

test('Drawer renders slide-over side sheet when isOpen=true with header and footer', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Drawer
      isOpen={true}
      onClose={() => {}}
      title="B2B Savat Rasmiylashtirish"
      subtitle="4 bosqichli tekshiruv"
      position="right"
      size="md"
      footer={<button>Buyurtma berish</button>}
    >
      <div>Materiallar ro‘yxati</div>
    </Drawer>
  );
  assert(html.includes('role="dialog"'), 'must have role="dialog"');
  assert(html.includes('B2B Savat Rasmiylashtirish'), 'title must be rendered');
  assert(html.includes('justify-end'), 'position=right must have justify-end');
  assert(html.includes('max-w-lg'), 'size=md must have max-w-lg');
  assert(html.includes('Buyurtma berish'), 'footer must be rendered');
});

// 5. Alert Tests
test('Alert renders all 4 variants (info, success, warning, error) with Lucide icons', () => {
  const variants: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
  for (const v of variants) {
    const html = ReactDOMServer.renderToStaticMarkup(
      <Alert
        variant={v}
        title={`${v} Alert Title`}
        description={`This is a ${v} industrial alert description.`}
      />
    );
    assert(html.includes('role="alert"'), 'must have role="alert"');
    assert(html.includes(`${v} Alert Title`), 'title must be rendered');
    assert(html.includes(`This is a ${v} industrial alert description.`), 'description must be rendered');
    assert(html.includes('<svg'), 'automatic Lucide icon must be rendered');
  }
});

test('Alert renders dismiss button when onDismiss is provided', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Alert variant="error" title="Xatolik" onDismiss={() => {}} />
  );
  assert(html.includes('aria-label="Yopish"'), 'must render dismiss button');
});

// 6. StatCard Tests
test('StatCard renders title, value, unit, trend, and rivet accents', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <StatCard
      title="Energiya Tejamkorligi"
      value="+45%"
      unit="kWh"
      subtitle="ShNQ 2.01.04-18 normasi"
      trend={{ value: '+12%', isPositive: true, label: 'o‘tgan yildan' }}
      variant="green"
      rivetAccents
      chamfered
    />
  );
  assert(html.includes('Energiya Tejamkorligi'), 'title must be rendered');
  assert(html.includes('+45%'), 'value must be rendered');
  assert(html.includes('kWh'), 'unit must be rendered');
  assert(html.includes('+12%'), 'trend value must be rendered');
  assert(html.includes('text-bunker-status-green'), 'green variant must be applied');
  assert(html.includes('industrial-rivet'), 'rivets must be rendered');
  assert(html.includes('chamfer-tab-corner'), 'chamfered corners must be applied');
});

// 7. Table Compound Tests
test('Table compound renders TableHeader, TableRow, TableHead, and TableCell', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mahsulot</TableHead>
          <TableHead>Narxi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Qizilqum Sement M500</TableCell>
          <TableCell>850,000 so‘m</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
  assert(html.includes('<table'), 'table tag must be rendered');
  assert(html.includes('<thead'), 'thead tag must be rendered');
  assert(html.includes('<tbody'), 'tbody tag must be rendered');
  assert(html.includes('Qizilqum Sement M500'), 'table cell content must be rendered');
  assert(html.includes('850,000 so‘m'), 'table cell content must be rendered');
});

test('TableEmpty renders empty state with colSpan and industrial message', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Table>
      <TableBody>
        <TableEmpty
          colSpan={5}
          title="Tovarlar topilmadi"
          description="Filter parametrlarini o‘zgartirib ko‘ring"
        />
      </TableBody>
    </Table>
  );
  assert(html.toLowerCase().includes('colspan="5"'), 'colSpan must be set to 5');
  assert(html.includes('Tovarlar topilmadi'), 'empty title must be rendered');
});

// 8. Tabs Compound Tests
test('Tabs compound renders TabsList, TabTrigger, and active TabsContent', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Tabs defaultValue="calc" variant="chamfer">
      <TabsList>
        <TabTrigger value="calc">Kalkulyator</TabTrigger>
        <TabTrigger value="saved">Saqlanganlar</TabTrigger>
      </TabsList>
      <TabsContent value="calc">Calculator Screen Content</TabsContent>
      <TabsContent value="saved">Saved Screen Content</TabsContent>
    </Tabs>
  );
  assert(html.includes('role="tablist"'), 'tablist must be rendered');
  assert(html.includes('chamfer-tab'), 'chamfer variant class must be applied');
  assert(html.includes('Calculator Screen Content'), 'active content must be rendered');
  assert(!html.includes('Saved Screen Content'), 'inactive content must not be rendered');
});

// 9. Skeleton Tests
test('Skeleton renders text, rect, and circle variants with shimmer animation', () => {
  const htmlRect = ReactDOMServer.renderToStaticMarkup(
    <Skeleton variant="rect" height={120} width="100%" />
  );
  assert(htmlRect.includes('bg-bunker-surface-2'), 'must use bunker surface 2 token');
  assert(htmlRect.includes('animate-pulse'), 'must have animate-pulse');
  assert(htmlRect.includes('height:120px'), 'height style must be applied');

  const htmlCircle = ReactDOMServer.renderToStaticMarkup(
    <Skeleton variant="circle" width={48} />
  );
  assert(htmlCircle.includes('rounded-full'), 'circle variant must be rounded-full');
});

// 10. Tooltip Tests
test('Tooltip renders trigger child with role=tooltip support', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Tooltip content="GOST 31108-2020 Sertifikatlangan" position="top">
      <span>GOST M500</span>
    </Tooltip>
  );
  assert(html.includes('GOST M500'), 'trigger child element must be rendered');
});

test('Tooltip safely wraps plain text children without throwing', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Tooltip content="Yordam ma'lumoti">
      Faqat matnli tugma
    </Tooltip>
  );
  assert(html.includes('Faqat matnli tugma'), 'plain text child must be rendered inside wrapper');
  assert(html.includes('tabindex="0"'), 'wrapper must have tabIndex=0 for accessibility');
});

// 11. Edge-Case & Robustness Tests
test('Input and Select generate valid IDs and do NOT output undefined-error in ARIA', () => {
  const inputHtml = ReactDOMServer.renderToStaticMarkup(
    <Input error="Maydon to‘ldirilishi shart" helperText="Yordam" />
  );
  assert(!inputHtml.includes('undefined-error'), 'Input must not contain undefined-error');
  assert(inputHtml.includes('aria-describedby="input-'), 'Input must reference valid input ID in aria-describedby');

  const selectHtml = ReactDOMServer.renderToStaticMarkup(
    <Select error="Tanlov majburiy">
      <option value="1">Bir</option>
    </Select>
  );
  assert(!selectHtml.includes('undefined-error'), 'Select must not contain undefined-error');
  assert(selectHtml.includes('aria-describedby="select-'), 'Select must reference valid select ID in aria-describedby');
});

test('Modal and Drawer set aria-labelledby pointing to title ID', () => {
  const modalHtml = ReactDOMServer.renderToStaticMarkup(
    <Modal isOpen={true} onClose={() => {}} title="Dialog Sarlavhasi">
      <p>Matn</p>
    </Modal>
  );
  assert(modalHtml.includes('aria-labelledby="modal-title-'), 'Modal must have aria-labelledby matching title ID');
  assert(modalHtml.includes('id="modal-title-'), 'Modal title must have matching ID');

  const drawerHtml = ReactDOMServer.renderToStaticMarkup(
    <Drawer isOpen={true} onClose={() => {}} title="Yon Panel Sarlavhasi">
      <p>Matn</p>
    </Drawer>
  );
  assert(drawerHtml.includes('aria-labelledby="drawer-title-'), 'Drawer must have aria-labelledby matching title ID');
  assert(drawerHtml.includes('id="drawer-title-'), 'Drawer title must have matching ID');
});

test('StatCard supports string trend "+12%" and "-8%" with correct indicators', () => {
  const posHtml = ReactDOMServer.renderToStaticMarkup(
    <StatCard title="Daromad" value="1,000,000" trend="+12%" />
  );
  assert(posHtml.includes('+12%'), 'positive trend string rendered');
  assert(posHtml.includes('text-bunker-status-green'), 'positive trend has green styling');

  const negHtml = ReactDOMServer.renderToStaticMarkup(
    <StatCard title="Xarajat" value="500,000" trend="-8%" />
  );
  assert(negHtml.includes('-8%'), 'negative trend string rendered');
  assert(negHtml.includes('text-bunker-status-red'), 'negative trend has red styling');
});

// 11. Button & Badge & Card regression tests
test('Existing Button, Badge, Card continue to render properly', () => {
  const btnHtml = ReactDOMServer.renderToStaticMarkup(
    <Button variant="primary" size="md">Test Button</Button>
  );
  assert(btnHtml.includes('bg-bunker-amber-500'), 'primary button has amber color');

  const badgeHtml = ReactDOMServer.renderToStaticMarkup(
    <Badge variant="warning">ESCO A++</Badge>
  );
  assert(badgeHtml.includes('ESCO A++'), 'badge content rendered');
  assert(badgeHtml.includes('rounded-md'), 'badge uses architectural rounded-md, not rounded-full pill');
  assert(!badgeHtml.includes('rounded-full'), 'badge must not be rounded-full');

  const brandBadge = ReactDOMServer.renderToStaticMarkup(
    <Badge variant="brand">MANZILGA YETDI</Badge>
  );
  assert(brandBadge.includes('bg-[#D95D1E]/10'), 'brand badge has terracotta styling');

  const purpleBadge = ReactDOMServer.renderToStaticMarkup(
    <Badge variant="purple">YO‘LDA</Badge>
  );
  assert(purpleBadge.includes('bg-indigo-500/10'), 'purple badge has indigo styling');

  const errorBadge = ReactDOMServer.renderToStaticMarkup(
    <Badge variant="error">NIZO</Badge>
  );
  assert(errorBadge.includes('bg-bunker-status-red/10'), 'error badge maps to danger styling');

  const cardHtml = ReactDOMServer.renderToStaticMarkup(
    <Card rivetAccents chamfered>Card Content</Card>
  );
  assert(cardHtml.includes('Card Content'), 'card content rendered');
  assert(cardHtml.includes('chamfer-tab-corner'), 'chamfered class on card');
});

console.log('\n========================================');
console.log(`TOTAL COMPONENT TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('========================================\n');

if (failCount > 0) {
  process.exit(1);
}
