#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const appDir = path.resolve(process.argv[2] || '.');
const outIndex = process.argv.indexOf('--out');
const outPath = outIndex >= 0 ? path.resolve(appDir, process.argv[outIndex + 1]) : null;
const app = require(path.join(appDir, 'src', 'invoice.js'));

function expectedTotals(invoice) {
  const subtotalCents = invoice.items.reduce((sum, item) => {
    return sum + Math.round(Number(item.quantity) * Number(item.rateCents));
  }, 0);
  const taxCents = Math.round(subtotalCents * Number(invoice.taxRate || 0));
  const adjustmentCents = Number(invoice.adjustmentCents || 0);
  return {
    subtotalCents,
    taxCents,
    adjustmentCents,
    totalCents: subtotalCents + taxCents + adjustmentCents,
  };
}

function statusSamples() {
  if (typeof app.createStatusSamples === 'function') {
    return app.createStatusSamples();
  }
  return [
    { id: 'draft', status: 'draft', dueDate: '2026-06-01', paidAt: '' },
    { id: 'sent', status: 'sent', dueDate: '2026-06-01', paidAt: '' },
    { id: 'paid', status: 'sent', dueDate: '2026-04-01', paidAt: '2026-04-03' },
    { id: 'overdue', status: 'sent', dueDate: '2026-04-01', paidAt: '' },
  ];
}

function check(name, passed, evidence) {
  return {
    name,
    status: passed ? 'pass' : 'fail',
    evidence,
  };
}

function evaluate() {
  const invoice = app.createSampleInvoice();
  const totals = app.calculateInvoice(invoice);
  const expected = expectedTotals(invoice);
  const groups = app.groupInvoices(statusSamples(), '2026-05-22');
  const states = typeof app.getUiStates === 'function' ? app.getUiStates() : [];
  const summary = typeof app.publicSummary === 'function' ? app.publicSummary(invoice) : '';
  const readiness = typeof app.realWorldReadinessNotes === 'function' ? app.realWorldReadinessNotes() : [];

  const results = [
    check(
      'A1 create invoice with client, invoice number, due date, and line item',
      Boolean(invoice.clientName && invoice.invoiceNumber && invoice.dueDate && invoice.items?.length),
      { clientName: invoice.clientName, invoiceNumber: invoice.invoiceNumber, dueDate: invoice.dueDate, itemCount: invoice.items?.length || 0 },
    ),
    check(
      'A2 calculate subtotal, tax/adjustment, and total without rounding surprises',
      totals.subtotalCents === expected.subtotalCents
        && totals.taxCents === expected.taxCents
        && totals.adjustmentCents === expected.adjustmentCents
        && totals.totalCents === expected.totalCents
        && Number.isInteger(totals.totalCents),
      { expected, actual: totals },
    ),
    check(
      'A3 separate draft, sent, paid, and overdue invoices',
      ['draft', 'sent', 'paid', 'overdue'].every((state) => Array.isArray(groups[state]) && groups[state].length >= 1),
      Object.fromEntries(['draft', 'sent', 'paid', 'overdue'].map((state) => [state, groups[state]?.length || 0])),
    ),
    check(
      'A4 include empty, loading/saving, validation, and error states',
      states.includes('empty')
        && (states.includes('loading') || states.includes('saving'))
        && states.includes('validation')
        && states.includes('error'),
      { states },
    ),
    check(
      'A5 export or copy a public-safe invoice summary',
      typeof summary === 'string'
        && summary.includes(invoice.clientName)
        && summary.includes(invoice.invoiceNumber)
        && !summary.includes('privateNotes')
        && !summary.includes('internal')
        && !summary.includes('Do not share'),
      { summary },
    ),
    check(
      'A6 explain what is needed before real payments or tax records',
      Array.isArray(readiness)
        && readiness.length >= 3
        && readiness.join(' ').toLowerCase().includes('payment')
        && readiness.join(' ').toLowerCase().includes('tax')
        && readiness.join(' ').toLowerCase().includes('persistence'),
      { readiness },
    ),
  ];

  const passed = results.filter((result) => result.status === 'pass').length;
  return {
    app: path.basename(appDir),
    checkedAt: new Date().toISOString(),
    passed,
    total: results.length,
    status: passed === results.length ? 'pass' : 'fail',
    results,
  };
}

const report = evaluate();
if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
}

for (const result of report.results) {
  console.log(`${result.status.toUpperCase()} ${result.name}`);
}
console.log(`Acceptance: ${report.passed}/${report.total}`);

process.exitCode = report.status === 'pass' ? 0 : 1;
