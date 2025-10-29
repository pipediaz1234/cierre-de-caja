// Declaración de variables globales
let nequiTransactions = [];
let daviplataTransactions = [];
let datafonoTransactions = [];
let cashTotal = 0;
let distributionChart;

// Función para formatear moneda
function formatCurrency(amount) {
  return '$' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Actualizar fecha y hora
function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  document.getElementById('dateTime').textContent = now.toLocaleDateString('es-ES', options);
}
updateDateTime();
setInterval(updateDateTime, 60000);

// Sistema de pestañas
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Remover clase active de todas las pestañas y contenidos
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Agregar clase active a la pestaña clickeada
    tab.classList.add('active');
    
    // Mostrar el contenido correspondiente
    const tabId = tab.getAttribute('data-tab');
    document.getElementById(`${tabId}-tab`).classList.add('active');
  });
});

// Funciones para Nequi
function addNequi() {
  const input = document.getElementById('nequiInput');
  const value = parseFloat(input.value);
  
  if (value && value > 0) {
    nequiTransactions.push(value);
    input.value = '';
    updateNequi();
    input.focus();
  } else {
    alert('⚠️ Por favor ingresa un valor válido');
  }
}

function updateNequi() {
  const list = document.getElementById('nequiList');
  const total = nequiTransactions.reduce((sum, val) => sum + val, 0);
  
  list.innerHTML = nequiTransactions.map((val, index) => `
    <div class="transaction-item">
      <span class="transaction-value">Transacción ${index + 1}: ${formatCurrency(val)}</span>
      <button class="delete-transaction-btn" onclick="deleteNequi(${index})">🗑️</button>
    </div>
  `).join('');

  document.getElementById('nequiCount').textContent = nequiTransactions.length;
  document.getElementById('nequiTotal').textContent = formatCurrency(total);
}

function deleteNequi(index) {
  nequiTransactions.splice(index, 1);
  updateNequi();
}

// Funciones para Daviplata
function addDaviplata() {
  const input = document.getElementById('daviplataInput');
  const value = parseFloat(input.value);
  
  if (value && value > 0) {
    daviplataTransactions.push(value);
    input.value = '';
    updateDaviplata();
    input.focus();
  } else {
    alert('⚠️ Por favor ingresa un valor válido');
  }
}

function updateDaviplata() {
  const list = document.getElementById('daviplataList');
  const total = daviplataTransactions.reduce((sum, val) => sum + val, 0);
  
  list.innerHTML = daviplataTransactions.map((val, index) => `
    <div class="transaction-item">
      <span class="transaction-value">Transacción ${index + 1}: ${formatCurrency(val)}</span>
      <button class="delete-transaction-btn" onclick="deleteDaviplata(${index})">🗑️</button>
    </div>
  `).join('');

  document.getElementById('daviplataCount').textContent = daviplataTransactions.length;
  document.getElementById('daviplataTotal').textContent = formatCurrency(total);
}

function deleteDaviplata(index) {
  daviplataTransactions.splice(index, 1);
  updateDaviplata();
}

// Funciones para Datafono
function addDatafono() {
  const input = document.getElementById('datafonoInput');
  const value = parseFloat(input.value);
  
  if (value && value > 0) {
    datafonoTransactions.push(value);
    input.value = '';
    updateDatafono();
    input.focus();
  } else {
    alert('⚠️ Por favor ingresa un valor válido');
  }
}

function updateDatafono() {
  const list = document.getElementById('datafonoList');
  const total = datafonoTransactions.reduce((sum, val) => sum + val, 0);
  
  list.innerHTML = datafonoTransactions.map((val, index) => `
    <div class="transaction-item">
      <span class="transaction-value">Voucher ${index + 1}: ${formatCurrency(val)}</span>
      <button class="delete-transaction-btn" onclick="deleteDatafono(${index})">🗑️</button>
    </div>
  `).join('');

  document.getElementById('datafonoCount').textContent = datafonoTransactions.length;
  document.getElementById('datafonoTotal').textContent = formatCurrency(total);
}

function deleteDatafono(index) {
  datafonoTransactions.splice(index, 1);
  updateDatafono();
}

// Funciones para Efectivo
function calculateCash() {
  let total = 0;
  total += (parseFloat(document.getElementById('bill100k').value) || 0) * 100000;
  total += (parseFloat(document.getElementById('bill50k').value) || 0) * 50000;
  total += (parseFloat(document.getElementById('bill20k').value) || 0) * 20000;
  total += (parseFloat(document.getElementById('bill10k').value) || 0) * 10000;
  total += (parseFloat(document.getElementById('bill5k').value) || 0) * 5000;
  total += (parseFloat(document.getElementById('bill2k').value) || 0) * 2000;
  
  cashTotal = total;
  document.getElementById('cashTotal').textContent = formatCurrency(total);
}

// Funciones para calcular todo
function calculateAll() {
  const nequiTotal = nequiTransactions.reduce((sum, val) => sum + val, 0);
  const daviplataTotal = daviplataTransactions.reduce((sum, val) => sum + val, 0);
  const datafonoTotal = datafonoTransactions.reduce((sum, val) => sum + val, 0);

  document.getElementById('summaryNequi').textContent = formatCurrency(nequiTotal);
  document.getElementById('summaryNequiCount').textContent = `${nequiTransactions.length} transacciones`;
  
  document.getElementById('summaryDaviplata').textContent = formatCurrency(daviplataTotal);
  document.getElementById('summaryDaviplataCount').textContent = `${daviplataTransactions.length} transacciones`;
  
  document.getElementById('summaryDatafono').textContent = formatCurrency(datafonoTotal);
  document.getElementById('summaryDatafonoCount').textContent = `${datafonoTransactions.length} vouchers`;
  
  document.getElementById('summaryCash').textContent = formatCurrency(cashTotal);

  const grandTotal = nequiTotal + daviplataTotal + datafonoTotal + cashTotal;
  document.getElementById('grandTotal').textContent = formatCurrency(grandTotal);

  updateChart(nequiTotal, daviplataTotal, datafonoTotal, cashTotal);
  showModal();
}

function updateChart(nequi, daviplata, datafono, cash) {
  const ctx = document.getElementById('distributionChart').getContext('2d');
  
  if (distributionChart) distributionChart.destroy();

  distributionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Nequi', 'Daviplata', 'Datafono', 'Efectivo'],
      datasets: [{
        data: [nequi, daviplata, datafono, cash],
        backgroundColor: [
          '#10b981',
          '#ef4444',
          '#3b82f6',
          '#f59e0b'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 14,
              weight: '600'
            }
          }
        }
      }
    }
  });
}

// Mostrar vista previa del mensaje de WhatsApp
function showWhatsAppPreview() {
  calculateAll();
  
  const now = new Date();
  const date = now.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const time = now.toLocaleTimeString('es-ES');

  const nequiTotal = nequiTransactions.reduce((sum, val) => sum + val, 0);
  const daviplataTotal = daviplataTransactions.reduce((sum, val) => sum + val, 0);
  const datafonoTotal = datafonoTransactions.reduce((sum, val) => sum + val, 0);

  const bill100k = document.getElementById('bill100k').value;
  const bill50k = document.getElementById('bill50k').value;
  const bill20k = document.getElementById('bill20k').value;
  const bill10k = document.getElementById('bill10k').value;
  const bill5k = document.getElementById('bill5k').value;
  const bill2k = document.getElementById('bill2k').value;

  const grandTotal = nequiTotal + daviplataTotal + datafonoTotal + cashTotal;

  let message = `🍬 *CIERRE DE CAJA - MIS DULCES*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📅 *Fecha:* ${date}\n`;
  message += `🕐 *Hora:* ${time}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📱 *BILLETERAS VIRTUALES*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  message += `💚 *Nequi*\n`;
  message += `   Cantidad de transacciones: ${nequiTransactions.length}\n`;
  if (nequiTransactions.length > 0) {
    message += `   Detalle:\n`;
    nequiTransactions.forEach((val, i) => {
      message += `   ${i + 1}. ${formatCurrency(val)}\n`;
    });
  }
  message += `   *Total: ${formatCurrency(nequiTotal)}*\n\n`;
  
  message += `🔴 *Daviplata*\n`;
  message += `   Cantidad de transacciones: ${daviplataTransactions.length}\n`;
  if (daviplataTransactions.length > 0) {
    message += `   Detalle:\n`;
    daviplataTransactions.forEach((val, i) => {
      message += `   ${i + 1}. ${formatCurrency(val)}\n`;
    });
  }
  message += `   *Total: ${formatCurrency(daviplataTotal)}*\n\n`;
  
  message += `💳 *Datafono (Tarjetas)*\n`;
  message += `   Cantidad de vouchers: ${datafonoTransactions.length}\n`;
  if (datafonoTransactions.length > 0) {
    message += `   Detalle:\n`;
    datafonoTransactions.forEach((val, i) => {
      message += `   ${i + 1}. ${formatCurrency(val)}\n`;
    });
  }
  message += `   *Total: ${formatCurrency(datafonoTotal)}*\n\n`;
  
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💵 *EFECTIVO*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `💸 *Conteo de Billetes:*\n`;
  if (bill100k > 0) message += `   $100,000 × ${bill100k} = ${formatCurrency(bill100k * 100000)}\n`;
  if (bill50k > 0) message += `   $50,000 × ${bill50k} = ${formatCurrency(bill50k * 50000)}\n`;
  if (bill20k > 0) message += `   $20,000 × ${bill20k} = ${formatCurrency(bill20k * 20000)}\n`;
  if (bill10k > 0) message += `   $10,000 × ${bill10k} = ${formatCurrency(bill10k * 10000)}\n`;
  if (bill5k > 0) message += `   $5,000 × ${bill5k} = ${formatCurrency(bill5k * 5000)}\n`;
  if (bill2k > 0) message += `   $2,000 × ${bill2k} = ${formatCurrency(bill2k * 2000)}\n`;
  message += `\n   *Total Efectivo: ${formatCurrency(cashTotal)}*\n\n`;
  
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *RESUMEN FINAL*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `💚 Nequi: ${formatCurrency(nequiTotal)} (${nequiTransactions.length} transacciones)\n`;
  message += `🔴 Daviplata: ${formatCurrency(daviplataTotal)} (${daviplataTransactions.length} transacciones)\n`;
  message += `💳 Datafono: ${formatCurrency(datafonoTotal)} (${datafonoTransactions.length} vouchers)\n`;
  message += `💵 Efectivo: ${formatCurrency(cashTotal)}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🎯 *TOTAL GENERAL:* ${formatCurrency(grandTotal)}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `✅ Cierre realizado exitosamente`;

  document.getElementById('whatsappMessagePreview').textContent = message;
  document.getElementById('whatsappModal').style.display = 'flex';
}

// Enviar a WhatsApp
function sendToWhatsApp() {
  const message = document.getElementById('whatsappMessagePreview').textContent;
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/573208036863?text=${encodedMessage}`;
  
  window.open(whatsappURL, '_blank');
  closeWhatsAppModal();
}

function closeWhatsAppModal() {
  document.getElementById('whatsappModal').style.display = 'none';
}

function resetAll() {
  if (confirm('¿Estás seguro de que deseas iniciar un nuevo cierre? Se perderán todos los datos actuales.')) {
    nequiTransactions = [];
    daviplataTransactions = [];
    datafonoTransactions = [];
    cashTotal = 0;
    
    updateNequi();
    updateDaviplata();
    updateDatafono();
    
    document.getElementById('bill100k').value = 0;
    document.getElementById('bill50k').value = 0;
    document.getElementById('bill20k').value = 0;
    document.getElementById('bill10k').value = 0;
    document.getElementById('bill5k').value = 0;
    document.getElementById('bill2k').value = 0;
    
    calculateCash();
    calculateAll();
  }
}

function showModal() {
  document.getElementById('successModal').style.display = 'flex';
  setTimeout(() => {
    closeModal();
  }, 3000);
}

function closeModal() {
  document.getElementById('successModal').style.display = 'none';
}

// Inicializar
updateChart(0, 0, 0, 0);

// Permitir enviar con Enter
document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
    if (activeTab === 'nequi') addNequi();
    else if (activeTab === 'daviplata') addDaviplata();
    else if (activeTab === 'datafono') addDatafono();
  }
});
