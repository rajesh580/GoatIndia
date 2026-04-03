const generateInvoiceEmail = (order, items, shipping) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 700;">${item.name.toUpperCase()} (SIZE: ${item.size})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; font-weight: 700;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 700;">₹${(item.price * item.qty).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: monospace, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 30px; color: #000;">
      <h1 style="text-transform: uppercase; font-weight: 900; letter-spacing: 2px; text-align: center; border-bottom: 4px solid #000; padding-bottom: 20px; margin-top: 0;">GOAT INDIA</h1>
      <h2 style="text-align: center; text-transform: uppercase; letter-spacing: 1px;">[ MANIFEST VERIFIED ]</h2>
      <p style="font-weight: 700;">ORDER ID: #${order.id}</p>
      <p style="font-weight: 700;">TRANSACTION DATE: ${new Date().toLocaleDateString('en-GB')}</p>
      
      <h3 style="text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 5px; margin-top: 30px;">Shipping Dispatch Location</h3>
      <p style="margin: 5px 0; font-weight: 600;">${shipping.address}</p>
      <p style="margin: 5px 0; font-weight: 600;">${shipping.city}, ${shipping.postalCode}</p>
      <p style="margin: 5px 0; font-weight: 600;">${shipping.country}</p>

      <h3 style="text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 5px; margin-top: 30px;">Architecture Logs (Items)</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #000; color: #fff;">
            <th style="padding: 10px; text-align: left; text-transform: uppercase;">Architecture</th>
            <th style="padding: 10px; text-align: center; text-transform: uppercase;">Qty</th>
            <th style="padding: 10px; text-align: right; text-transform: uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; padding-top: 20px; border-top: 2px solid #000;">
        <h3 style="margin: 5px 0; font-weight: 700;">SUBTOTAL: ₹${order.totalPrice.toFixed(2)}</h3>
        <h3 style="margin: 5px 0; color: #28a745; font-weight: 700;">SHIPPING: FREE</h3>
        <h2 style="text-transform: uppercase; font-weight: 900; margin-top: 15px;">FINAL AMOUNT: ₹${order.totalPrice.toFixed(2)}</h2>
      </div>

      <div style="margin-top: 40px; padding: 20px; background-color: #f4f4f4; text-align: center; border: 2px dashed #000;">
        <p style="margin: 0; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Thank you for your acquisition.</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; font-weight: 600; color: #666;">For support, reply to this email or contact support@goatindia.com</p>
      </div>
    </div>
  `;
};

module.exports = { generateInvoiceEmail };