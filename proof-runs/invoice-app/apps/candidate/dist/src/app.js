const proof = window.invoiceProof;
const invoice = proof.createSampleInvoice();
const totals = proof.calculateInvoice(invoice);
const statusGroups = proof.groupInvoices(proof.createStatusSamples());
const emptyErrors = proof.validateInvoice({ clientName: '', invoiceNumber: '', dueDate: '', items: [] });

function setText(id, value) {
  document.querySelector(id).textContent = value;
}

setText('#client', invoice.clientName);
setText('#number', invoice.invoiceNumber);
setText('#due', invoice.dueDate);
setText('#status', proof.invoiceStatus(invoice));
setText('#subtotal', totals.display.subtotal);
setText('#tax', totals.display.tax);
setText('#adjustment', totals.display.adjustment);
setText('#total', totals.display.total);

document.querySelector('#items').innerHTML = invoice.items.map((item) => `
  <tr>
    <td>${item.description}</td>
    <td>${item.quantity}</td>
    <td>${proof.money(item.rateCents)}</td>
    <td>${proof.money(item.quantity * item.rateCents)}</td>
  </tr>
`).join('');

document.querySelector('#status-board').innerHTML = Object.entries(statusGroups).map(([status, rows]) => `
  <section class="status-card ${status}">
    <div>
      <h2>${status}</h2>
      <p>${status === 'overdue' ? 'Needs attention' : 'Ready to scan'}</p>
    </div>
    <strong>${rows.length}</strong>
  </section>
`).join('');

document.querySelector('#empty-state').textContent = 'No line items yet. Add one billable item to preview totals.';
document.querySelector('#saving-state').textContent = 'Saving invoice draft... changes remain local in this proof build.';
document.querySelector('#validation-state').innerHTML = emptyErrors.map((error) => `<li>${error}</li>`).join('');
document.querySelector('#error-state').textContent = 'Could not copy summary. Check browser permissions and try again.';
document.querySelector('#readiness').innerHTML = proof.realWorldReadinessNotes().map((note) => `<li>${note}</li>`).join('');

const summary = document.querySelector('#summary');
summary.value = proof.publicSummary(invoice);

document.querySelector('#copy').addEventListener('click', async () => {
  summary.value = proof.publicSummary(invoice);
  document.querySelector('#copy-status').textContent = 'Public-safe summary ready to copy.';
});
