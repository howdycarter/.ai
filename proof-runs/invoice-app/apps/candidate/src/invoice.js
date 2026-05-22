function cents(value) {
  const normalized = String(value).trim();
  if (!/^-?\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`Invalid money value: ${value}`);
  }
  const sign = normalized.startsWith('-') ? -1 : 1;
  const [whole, fraction = ''] = normalized.replace('-', '').split('.');
  return sign * ((Number(whole) * 100) + Number(fraction.padEnd(2, '0')));
}

function money(centsValue) {
  const sign = centsValue < 0 ? '-' : '';
  const absolute = Math.abs(centsValue);
  return `${sign}$${(absolute / 100).toFixed(2)}`;
}

function createSampleInvoice() {
  return {
    id: 'inv-1007',
    clientName: 'Northstar Studio',
    invoiceNumber: 'INV-1007',
    dueDate: '2026-05-31',
    status: 'sent',
    taxRate: 0.0825,
    adjustmentCents: -1500,
    privateNotes: 'Do not share: client asked for a delayed payment reminder.',
    items: [
      { description: 'Design sprint', quantity: 3, rateCents: cents('125.00') },
      { description: 'Hosting setup', quantity: 1, rateCents: cents('80.25') },
    ],
  };
}

function calculateInvoice(invoice) {
  const subtotalCents = invoice.items.reduce((sum, item) => {
    return sum + Math.round(Number(item.quantity) * Number(item.rateCents));
  }, 0);
  const taxCents = Math.round(subtotalCents * Number(invoice.taxRate || 0));
  const adjustmentCents = Number(invoice.adjustmentCents || 0);
  const totalCents = subtotalCents + taxCents + adjustmentCents;
  return {
    subtotalCents,
    taxCents,
    adjustmentCents,
    totalCents,
    display: {
      subtotal: money(subtotalCents),
      tax: money(taxCents),
      adjustment: money(adjustmentCents),
      total: money(totalCents),
    },
  };
}

function invoiceStatus(invoice, today = '2026-05-22') {
  if (invoice.paidAt || invoice.status === 'paid') return 'paid';
  if (invoice.status === 'draft') return 'draft';
  if (invoice.dueDate < today) return 'overdue';
  return 'sent';
}

function groupInvoices(invoices, today = '2026-05-22') {
  return invoices.reduce((groups, invoice) => {
    const status = invoiceStatus(invoice, today);
    groups[status].push({ ...invoice, computedStatus: status });
    return groups;
  }, { draft: [], sent: [], paid: [], overdue: [] });
}

function validateInvoice(invoice) {
  const errors = [];
  if (!invoice.clientName) errors.push('Client name is required.');
  if (!invoice.invoiceNumber) errors.push('Invoice number is required.');
  if (!invoice.dueDate) errors.push('Due date is required.');
  if (!invoice.items?.length) errors.push('At least one line item is required.');
  for (const [index, item] of (invoice.items || []).entries()) {
    if (!item.description) errors.push(`Line ${index + 1} needs a description.`);
    if (Number(item.quantity) <= 0) errors.push(`Line ${index + 1} quantity must be greater than zero.`);
    if (Number(item.rateCents) < 0) errors.push(`Line ${index + 1} rate cannot be negative.`);
  }
  return errors;
}

function publicSummary(invoice) {
  const totals = calculateInvoice(invoice);
  return [
    `${invoice.invoiceNumber} for ${invoice.clientName}`,
    `Due ${invoice.dueDate}`,
    `Status: ${invoiceStatus(invoice)}`,
    `Subtotal: ${totals.display.subtotal}`,
    `Tax/adjustment: ${totals.display.tax} / ${totals.display.adjustment}`,
    `Total: ${totals.display.total}`,
    'Private notes excluded. Not a tax receipt.',
  ].join('\n');
}

function getUiStates() {
  return ['empty', 'saving', 'validation', 'error', 'populated'];
}

function realWorldReadinessNotes() {
  return [
    'Persistence: store clients, invoices, audit trail, and immutable invoice versions in a database.',
    'Payments: integrate a provider such as Stripe and reconcile paid status from webhooks, not manual toggles.',
    'Tax: confirm jurisdiction-specific tax treatment with accounting rules before using records for filing.',
    'Security: add authentication, authorization, backups, and export controls before real client data.',
  ];
}

function createStatusSamples() {
  return [
    { id: 'draft', clientName: 'Draft Co', status: 'draft', dueDate: '2026-06-01', paidAt: '' },
    { id: 'sent', clientName: 'Sent Co', status: 'sent', dueDate: '2026-06-01', paidAt: '' },
    { id: 'paid', clientName: 'Paid Co', status: 'sent', dueDate: '2026-04-01', paidAt: '2026-04-03' },
    { id: 'overdue', clientName: 'Late Co', status: 'sent', dueDate: '2026-04-01', paidAt: '' },
  ];
}

const api = {
  calculateInvoice,
  cents,
  createSampleInvoice,
  createStatusSamples,
  getUiStates,
  groupInvoices,
  invoiceStatus,
  money,
  publicSummary,
  realWorldReadinessNotes,
  validateInvoice,
};

if (typeof module !== 'undefined') {
  module.exports = api;
}
if (typeof window !== 'undefined') {
  window.invoiceProof = api;
}
