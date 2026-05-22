function cents(value) {
  return Math.round(Number(value) * 100);
}

function money(centsValue) {
  return `$${(centsValue / 100).toFixed(2)}`;
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
      { description: 'Design sprint', quantity: 3, rateCents: cents(125) },
      { description: 'Hosting setup', quantity: 1, rateCents: cents(80.25) },
    ],
  };
}

function calculateInvoice(invoice) {
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
    displayTotal: money(subtotalCents + taxCents + adjustmentCents),
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
    groups[status].push(invoice);
    return groups;
  }, { draft: [], sent: [], paid: [], overdue: [] });
}

function publicSummary(invoice) {
  const totals = calculateInvoice(invoice);
  return JSON.stringify({ ...invoice, totals }, null, 2);
}

function createStatusSamples() {
  return [
    { id: 'draft', status: 'draft', dueDate: '2026-06-01', paidAt: '' },
    { id: 'sent', status: 'sent', dueDate: '2026-06-01', paidAt: '' },
    { id: 'paid', status: 'paid', dueDate: '2026-04-01', paidAt: '2026-04-03' },
    { id: 'overdue', status: 'sent', dueDate: '2026-04-01', paidAt: '' },
  ];
}

const api = {
  calculateInvoice,
  createSampleInvoice,
  createStatusSamples,
  groupInvoices,
  invoiceStatus,
  money,
  publicSummary,
};

if (typeof module !== 'undefined') {
  module.exports = api;
}
if (typeof window !== 'undefined') {
  window.invoiceProof = api;
}
