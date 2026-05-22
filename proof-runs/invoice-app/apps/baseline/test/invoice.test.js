const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const {
  calculateInvoice,
  createSampleInvoice,
  createStatusSamples,
  groupInvoices,
  money,
  publicSummary,
} = require('../src/invoice');

describe('baseline invoice app', () => {
  it('calculates sample invoice totals', () => {
    const totals = calculateInvoice(createSampleInvoice());

    assert.equal(totals.subtotalCents, 45525);
    assert.equal(totals.taxCents, 3756);
    assert.equal(totals.adjustmentCents, -1500);
    assert.equal(totals.totalCents, 47781);
    assert.equal(totals.displayTotal, '$477.81');
  });

  it('groups invoice statuses', () => {
    const groups = groupInvoices(createStatusSamples());

    assert.equal(groups.draft.length, 1);
    assert.equal(groups.sent.length, 1);
    assert.equal(groups.paid.length, 1);
    assert.equal(groups.overdue.length, 1);
  });

  it('creates a copyable summary', () => {
    const summary = publicSummary(createSampleInvoice());

    assert.match(summary, /Northstar Studio/);
    assert.match(summary, /INV-1007/);
    assert.match(summary, /privateNotes/);
  });

  it('formats cents as money', () => {
    assert.equal(money(12345), '$123.45');
  });
});
