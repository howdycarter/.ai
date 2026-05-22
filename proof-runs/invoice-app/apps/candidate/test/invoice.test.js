const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const {
  calculateInvoice,
  cents,
  createSampleInvoice,
  createStatusSamples,
  getUiStates,
  groupInvoices,
  publicSummary,
  realWorldReadinessNotes,
  validateInvoice,
} = require('../src/invoice');

describe('candidate invoice app', () => {
  it('calculates sample invoice totals with cent-safe values', () => {
    const totals = calculateInvoice(createSampleInvoice());

    assert.equal(cents('80.25'), 8025);
    assert.equal(totals.subtotalCents, 45525);
    assert.equal(totals.taxCents, 3756);
    assert.equal(totals.adjustmentCents, -1500);
    assert.equal(totals.totalCents, 47781);
    assert.equal(totals.display.total, '$477.81');
  });

  it('groups draft, sent, paid, and overdue invoices', () => {
    const groups = groupInvoices(createStatusSamples());

    assert.equal(groups.draft.length, 1);
    assert.equal(groups.sent.length, 1);
    assert.equal(groups.paid.length, 1);
    assert.equal(groups.overdue.length, 1);
  });

  it('validates required fields and line-item data', () => {
    const errors = validateInvoice({ clientName: '', invoiceNumber: '', dueDate: '', items: [] });

    assert.equal(errors.includes('Client name is required.'), true);
    assert.equal(errors.includes('Invoice number is required.'), true);
    assert.equal(errors.includes('Due date is required.'), true);
    assert.equal(errors.includes('At least one line item is required.'), true);
  });

  it('creates a public-safe summary without private notes', () => {
    const summary = publicSummary(createSampleInvoice());

    assert.match(summary, /Northstar Studio/);
    assert.match(summary, /INV-1007/);
    assert.match(summary, /Private notes excluded/);
    assert.doesNotMatch(summary, /privateNotes/);
    assert.doesNotMatch(summary, /Do not share/);
  });

  it('names UI states and real-world readiness caveats', () => {
    const states = getUiStates();
    const readiness = realWorldReadinessNotes().join(' ');

    assert.deepEqual(states, ['empty', 'saving', 'validation', 'error', 'populated']);
    assert.match(readiness, /Persistence/);
    assert.match(readiness, /Payments/);
    assert.match(readiness, /Tax/);
  });
});
