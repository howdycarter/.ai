const invoice = window.invoiceProof.createSampleInvoice();
const totals = window.invoiceProof.calculateInvoice(invoice);
const samples = window.invoiceProof.groupInvoices(window.invoiceProof.createStatusSamples());

document.querySelector('#client').textContent = invoice.clientName;
document.querySelector('#number').textContent = invoice.invoiceNumber;
document.querySelector('#due').textContent = invoice.dueDate;
document.querySelector('#items').innerHTML = invoice.items.map((item) => `
  <tr>
    <td>${item.description}</td>
    <td>${item.quantity}</td>
    <td>${window.invoiceProof.money(item.rateCents)}</td>
    <td>${window.invoiceProof.money(item.quantity * item.rateCents)}</td>
  </tr>
`).join('');
document.querySelector('#subtotal').textContent = window.invoiceProof.money(totals.subtotalCents);
document.querySelector('#tax').textContent = window.invoiceProof.money(totals.taxCents);
document.querySelector('#adjustment').textContent = window.invoiceProof.money(totals.adjustmentCents);
document.querySelector('#total').textContent = totals.displayTotal;

document.querySelector('#columns').innerHTML = Object.entries(samples).map(([status, rows]) => `
  <section class="column">
    <h2>${status}</h2>
    <strong>${rows.length}</strong>
  </section>
`).join('');

document.querySelector('#copy').addEventListener('click', () => {
  document.querySelector('#summary').value = window.invoiceProof.publicSummary(invoice);
});
