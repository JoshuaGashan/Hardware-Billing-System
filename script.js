
const P = [
  {sku:'HW-001',name:'Claw Hammer 16oz',        cat:'Tools',         price:349, stock:45},
  {sku:'HW-002',name:'Adjustable Wrench 10"',    cat:'Tools',         price:289, stock:30},
  {sku:'HW-003',name:'Screwdriver Set (12pc)',   cat:'Tools',         price:599, stock:22},
  {sku:'HW-004',name:'Tape Measure 25ft',        cat:'Tools',         price:199, stock:60},
  {sku:'HW-005',name:'Spirit Level 24"',         cat:'Tools',         price:449, stock:18},
  {sku:'HW-006',name:'Pliers Set (3pc)',         cat:'Tools',         price:379, stock:25},
  {sku:'EL-001',name:'PVC Conduit 1"',           cat:'Electrical',    price:85,  stock:200},
  {sku:'EL-002',name:'MCB Switch 16A',           cat:'Electrical',    price:245, stock:80},
  {sku:'EL-003',name:'Wire 2.5mm (per mtr)',     cat:'Electrical',    price:48,  stock:500},
  {sku:'EL-004',name:'Junction Box 4×4',         cat:'Electrical',    price:120, stock:75},
  {sku:'EL-005',name:'LED Bulb 9W',              cat:'Electrical',    price:95,  stock:150},
  {sku:'PL-001',name:'CPVC Pipe 3/4"',           cat:'Plumbing',      price:145, stock:120},
  {sku:'PL-002',name:'Ball Valve 3/4"',          cat:'Plumbing',      price:185, stock:60},
  {sku:'PL-003',name:'Teflon Tape Roll',         cat:'Plumbing',      price:35,  stock:200},
  {sku:'PL-004',name:'P-Trap 2"',               cat:'Plumbing',      price:220, stock:40},
  {sku:'FA-001',name:'Wood Screw 2" (100pc)',    cat:'Fasteners',     price:89,  stock:300},
  {sku:'FA-002',name:'Anchor Bolt M10 (10pc)',   cat:'Fasteners',     price:65,  stock:250},
  {sku:'FA-003',name:'Hex Bolt M12×60 (10pc)',   cat:'Fasteners',     price:120, stock:180},
  {sku:'FA-004',name:'Nails 3" (1kg)',           cat:'Fasteners',     price:75,  stock:100},
  {sku:'PT-001',name:'Sandpaper 120G (5pk)',     cat:'Paint & Finish', price:110, stock:90},
  {sku:'PT-002',name:'Paint Roller Set',         cat:'Paint & Finish', price:275, stock:35},
  {sku:'PT-003',name:'Putty Knife 4"',           cat:'Paint & Finish', price:155, stock:50},
  {sku:'SF-001',name:'Safety Gloves',            cat:'Safety',        price:129, stock:80},
  {sku:'SF-002',name:'Safety Goggles',           cat:'Safety',        price:199, stock:55},
  {sku:'SF-003',name:'Dust Mask N95 (5pk)',      cat:'Safety',        price:249, stock:120},
];

let cart=[], inv=1, pay='Cash', hist=[], af='All', dt='pct';

// INIT
function init() {
  setInterval(()=>{ document.getElementById('clk').textContent=new Date().toLocaleTimeString('en-IN'); }, 1000);
  const _now = new Date().toLocaleString('en-IN');
  document.getElementById('dDate').textContent = _now;
  const hd = document.getElementById('hdrDate'); if(hd) hd.textContent = _now;
  renderFilters(); renderCat(); calcSummary(); renderHist(); updateCustCountBadge();
}

// CUSTOMER DIRECTORY
let customers = JSON.parse(localStorage.getItem('hws_customers')||'[]');

function saveCustStore() {
  localStorage.setItem('hws_customers', JSON.stringify(customers));
  updateCustCountBadge();
}

function updateCustCountBadge() {
  document.getElementById('custCountBadge').textContent = customers.length + ' saved';
}

function saveCustomer() {
  const name = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  if (!name) { t('Enter a customer name first', 'r'); return; }
  if (phone && !/^[0-9]{7,12}$/.test(phone)) { t('Enter a valid mobile number', 'r'); return; }
  const exists = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    exists.phone = phone || exists.phone;
    saveCustStore();
    t('✅ Customer updated');
    return;
  }
  customers.unshift({ name, phone, id: Date.now() });
  saveCustStore();
  t('✅ Customer saved: ' + name);
}

function onCustNameInput() {
  updCust();
  const q = document.getElementById('cName').value.trim().toLowerCase();
  const dd = document.getElementById('custDropdown');
  if (!q) { dd.classList.remove('open'); return; }
  const matches = customers.filter(c => c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q)));
  if (!matches.length) { dd.classList.remove('open'); return; }
  dd.innerHTML = matches.map(c => `
    <div class="cd-item" onclick="selectCust(${c.id})">
      <div class="cd-info">
        <div class="cd-name">${c.name}</div>
        <div class="cd-phone">${c.phone ? '📱 ' + c.phone : 'No mobile saved'}</div>
      </div>
      <button class="cd-del" onclick="event.stopPropagation();deleteCust(${c.id})">✕</button>
    </div>`).join('');
  dd.classList.add('open');
}

function selectCust(id) {
  const c = customers.find(x => x.id === id);
  if (!c) return;
  document.getElementById('cName').value = c.name;
  document.getElementById('cPhone').value = c.phone || '';
  document.getElementById('custDropdown').classList.remove('open');
  updCust();
  t('👤 ' + c.name + (c.phone ? ' · ' + c.phone : ''));
}

function deleteCust(id) {
  customers = customers.filter(c => c.id !== id);
  saveCustStore();
  onCustNameInput();
  t('Removed customer');
}

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.cust-search-wrap') && !e.target.closest('.cust-dropdown')) {
    document.getElementById('custDropdown').classList.remove('open');
  }
});

function updCust() {
  const n  = document.getElementById('cName').value  || 'Walk-in Customer';
  const ph = document.getElementById('cPhone').value || '';
  const ty = document.getElementById('bType').value;
  // Right panel hero
  document.getElementById('dCust').innerHTML =
    `${n}<br><span style="color:var(--gold);font-size:.65rem;">${ty}</span>`;
  const dph = document.getElementById('dPhone');
  if (dph) {
    if (ph) { dph.textContent = '📱 ' + ph; dph.style.display = 'block'; }
    else    { dph.textContent = '';          dph.style.display = 'none'; }
  }
  // Nav bar card
  const nn = document.getElementById('hdrCustName');
  const nt = document.getElementById('hdrCustType');
  if (nn) nn.textContent = n;
  if (nt) nt.textContent = ty;
}

// FILTERS
function renderFilters() {
  const cats = ['All',...new Set(P.map(p=>p.cat))];
  document.getElementById('frow').innerHTML = cats.map(c=>
    `<button class="fc ${c==='All'?'active':''}" onclick="setF('${c}',this)">${c}</button>`
  ).join('');
}

function setF(c,el) {
  af=c;
  document.querySelectorAll('.fc').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  renderCat();
}

// CATALOG
function renderCat() {
  const q = document.getElementById('srch').value.toLowerCase();
  const list = P.filter(p=>
    (af==='All'||p.cat===af)&&(!q||p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q))
  );
  const g = document.getElementById('cgrid');
  if (!list.length) { g.innerHTML=`<div style="color:var(--text-3);font-size:.75rem;font-weight:600;grid-column:1/-1;padding:.4rem;">No products found.</div>`; return; }
  g.innerHTML = list.map(p=>{
    let sc='',sl=`${p.stock} in stock`;
    if(p.stock===0){sc='s-out';sl='Out of stock';}
    else if(p.stock<10){sc='s-low';sl=`Only ${p.stock} left!`;}
    return `<div class="pc anim" onclick="addItem('${p.sku}')">
      <span class="pc-cat">${p.cat}</span>
      <div class="pc-name">${p.name}</div>
      <div class="pc-sku">${p.sku}</div>
      <div class="pc-price">₹${p.price}</div>
      <div class="pc-stock ${sc}">${sl}</div>
    </div>`;
  }).join('');
}

// CART
function addItem(sku) {
  const p=P.find(x=>x.sku===sku);
  if(!p) return;
  if(p.stock===0){t('Out of stock!','r');return;}
  const ex=cart.find(i=>i.sku===sku);
  if(ex) ex.qty++; else cart.push({...p,qty:1});
  renderCart(); calcSummary(); t(`Added: ${p.name}`);
}

function addSku() {
  const sku=document.getElementById('skuIn').value.trim().toUpperCase();
  const qty=parseInt(document.getElementById('skuQty').value)||1;
  const p=P.find(x=>x.sku===sku);
  if(!p){t('SKU not found!','r');return;}
  const ex=cart.find(i=>i.sku===sku);
  if(ex) ex.qty+=qty; else cart.push({...p,qty});
  document.getElementById('skuIn').value='';
  document.getElementById('skuQty').value=1;
  renderCart(); calcSummary(); t(`Added ${qty}× ${p.name}`);
}

function updQty(sku,v) {
  const q=parseInt(v);
  if(q<=0){delItem(sku);return;}
  const i=cart.find(x=>x.sku===sku);
  if(i) i.qty=q; calcSummary();
}

function delItem(sku) { cart=cart.filter(i=>i.sku!==sku); renderCart(); calcSummary(); }
function clearCart() { cart=[]; renderCart(); calcSummary(); }

function renderCart() {
  const el=document.getElementById('cartEl');
  if(!cart.length){
    el.innerHTML=`<div class="empty"><div style="font-size:1.6rem;margin-bottom:.4rem;opacity:.4;">🛒</div>Tap any product to add</div>`;
    return;
  }
  el.innerHTML=`<table class="ct">
    <thead><tr><th>#</th><th>Product</th><th>Rate</th><th>Qty</th><th>Total</th><th></th></tr></thead>
    <tbody>${cart.map((it,i)=>`
      <tr class="anim">
        <td style="color:var(--text-3);font-size:.68rem;">${i+1}</td>
        <td><div style="font-weight:700;font-size:1rem;">${it.name}</div><div style="font-size:.78rem;color:var(--text-3);">${it.sku}</div></td>
        <td style="color:var(--text-2);font-size:.76rem;">₹${it.price}</td>
        <td><input type="number" value="${it.qty}" min="0" max="${it.stock}" onchange="updQty('${it.sku}',this.value)"></td>
        <td style="color:var(--gold);font-weight:800;font-size:.8rem;">₹${(it.price*it.qty).toFixed(2)}</td>
        <td><button class="btn btn-del" onclick="delItem('${it.sku}')">✕</button></td>
      </tr>`).join('')}</tbody>
  </table>`;
}

// SUMMARY
function getTotals() {
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const dv=parseFloat(document.getElementById('discV').value)||0;
  let disc=dt==='pct'?(sub*dv/100):dv;
  disc=Math.min(disc,sub);
  const tax=(sub-disc)*0.18;
  const total=sub-disc+tax;
  const cnt=cart.reduce((s,i)=>s+i.qty,0);
  return {sub,disc,tax,total,cnt};
}

function calcSummary() {
  const {sub,disc,tax,total,cnt}=getTotals();
  document.getElementById('sub').textContent=`₹${sub.toFixed(2)}`;
  document.getElementById('disc').textContent=`−₹${disc.toFixed(2)}`;
  document.getElementById('tax').textContent=`₹${tax.toFixed(2)}`;
  document.getElementById('tot').textContent=`₹${total.toFixed(2)}`;
  document.getElementById('cnt').textContent=cnt;
  // Sync payment modal total
  const pt=document.getElementById('payTot'); if(pt) pt.textContent=`₹${total.toFixed(2)}`;
  updChange();
}

function updChange() {
  const total=getTotals().total;
  const tend=parseFloat(document.getElementById('tend').value)||0;
  const chg=tend-total;
  const el=document.getElementById('chg');
  el.textContent=`₹${Math.max(0,chg).toFixed(2)}`;
  el.style.color=chg>=0?'var(--green)':'var(--red)';
}

// DISCOUNT TYPE
function setDT(type) {
  dt=type;
  document.getElementById('rPct').classList.toggle('on',type==='pct');
  document.getElementById('rFlat').classList.toggle('on',type==='flat');
  calcSummary();
}

// PAYMENT
function setPay(el,method) {
  pay=method;
  document.querySelectorAll('.ppill').forEach(p=>p.classList.remove('on'));
  el.classList.add('on');
  // Show cash box in payment modal
  const pcb=document.getElementById('payCashBox');
  if(pcb) pcb.classList.toggle('show', method==='Cash');
}

function openPayModal() {
  if(!cart.length){t('Cart is empty!','r');return;}
  const {total}=getTotals();
  const pt=document.getElementById('payTot'); if(pt) pt.textContent=`₹${total.toFixed(2)}`;
  document.getElementById('tend').value='';
  document.getElementById('chg').textContent='₹0.00';
  // Always start on payment panel
  document.getElementById('modalSlider').style.transform='translateX(0)';
  document.getElementById('moverlay').classList.add('on');
}

function slideToReceipt() {
  // Slide left to reveal receipt panel
  const w = document.querySelector('#modalSlider > div').offsetWidth;
  document.getElementById('modalSlider').style.transform=`translateX(-${w}px)`;
}

function closeOnBg(e) {
  if(e.target===document.getElementById('moverlay')) closeM();
}

// PROCESS
function process() {
  if(!cart.length){t('Cart is empty!','r');return;}
  const {sub,disc,tax,total}=getTotals();
  const cust=document.getElementById('cName').value||'Walk-in Customer';
  const phone=document.getElementById('cPhone').value;
  const id=`INV-${String(inv).padStart(4,'0')}`;
  const date=new Date().toLocaleString('en-IN');
  hist.unshift({num:id,customer:cust,phone,date,items:cart.length,total:total.toFixed(2)});
  renderHist();

  document.getElementById('rcpt').innerHTML=`
    <div style="background:rgba(253,184,19,.07);border:1px solid rgba(253,184,19,.14);border-radius:12px;padding:.75rem .95rem;margin-bottom:.95rem;font-size:.72rem;color:var(--text-2);">
      <strong style="color:var(--gold)">${id}</strong> &nbsp;·&nbsp; ${date}<br>${cust}${phone?' &nbsp;·&nbsp; 📱 '+phone:''} &nbsp;·&nbsp; ${pay}
    </div>
    ${cart.map(i=>`<div class="ri"><span class="ri-name">${i.name} × ${i.qty}</span><span class="ri-amt">₹${(i.price*i.qty).toFixed(2)}</span></div>`).join('')}
    <div class="ri" style="color:var(--text-3)"><span>Subtotal</span><span>₹${sub.toFixed(2)}</span></div>
    <div class="ri" style="color:var(--red)"><span>Discount</span><span>−₹${disc.toFixed(2)}</span></div>
    <div class="ri" style="color:var(--text-3)"><span>GST 18%</span><span>₹${tax.toFixed(2)}</span></div>
    <div class="rtotal"><span>${id}</span><span>₹${total.toFixed(2)}</span></div>
    <div class="rfooter">Thank you for shopping at IronClad Hardware!<br>GST: 29ABCDE1234F1Z5 &nbsp;·&nbsp; support@ironclad.in</div>`;

  // Slide to receipt panel (modal already open)
  slideToReceipt();
  renderSendBar(phone, id, cust, total);
  inv++;
  t(`✅ Bill done — ₹${total.toFixed(2)}`);
}

// ── INVOICE IMAGE GENERATOR ──────────────────────────────
function generateInvoiceCanvas(invId, cust, phone, cartSnap, sub, disc, tax, total, payMethod, date) {
  const W = 720;
  const PAD = 40;
  const COL = '#fdb813';
  const BG1 = '#1a1400';
  const BG2 = '#0d0c0a';
  const LINE = 'rgba(255,255,255,0.1)';

  // Calculate height dynamically
  const HEADER_H = 160;
  const META_H   = 90;
  const ITEM_H   = cartSnap.length * 44 + 20;
  const TOTALS_H = (disc > 0 ? 4 : 3) * 36 + 20;
  const FOOTER_H = 80;
  const H = HEADER_H + META_H + ITEM_H + 1 + TOTALS_H + 1 + FOOTER_H + 40;

  const canvas = document.createElement('canvas');
  canvas.width  = W * 2;  // retina
  canvas.height = H * 2;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, BG1);
  bgGrad.addColorStop(1, BG2);
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 20);
  ctx.fill();

  // Gold top bar
  const barGrad = ctx.createLinearGradient(0, 0, W, 0);
  barGrad.addColorStop(0, '#fdb813');
  barGrad.addColorStop(1, '#ff8c00');
  ctx.fillStyle = barGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, 6, [6, 6, 0, 0]);
  ctx.fill();

  // Subtle grid lines background
  ctx.strokeStyle = 'rgba(253,184,19,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // Header: Logo icon (circle)
  const cx = PAD + 28, cy = 50;
  const lg = ctx.createRadialGradient(cx-6,cy-6,2,cx,cy,28);
  lg.addColorStop(0,'#ffd000'); lg.addColorStop(1,'#ff8c00');
  ctx.fillStyle = lg;
  ctx.beginPath(); ctx.arc(cx,cy,26,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔧', cx, cy + 7);

  // Store name
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Nunito, sans-serif';
  ctx.fillText('IronClad Hardware', PAD + 68, 44);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '13px Nunito, sans-serif';
  ctx.fillText('GST: 29ABCDE1234F1Z5  ·  support@ironclad.lk', PAD + 68, 62);

  // Invoice number (right side)
  ctx.textAlign = 'right';
  ctx.fillStyle = COL;
  ctx.font = 'bold 26px Nunito, sans-serif';
  ctx.fillText(invId, W - PAD, 44);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '12px Nunito, sans-serif';
  ctx.fillText(date, W - PAD, 62);

  // Thin separator
  ctx.strokeStyle = 'rgba(253,184,19,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD, 86); ctx.lineTo(W-PAD, 86); ctx.stroke();

  // Customer info row
  let y = 108;
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = 'bold 14px Nunito, sans-serif';
  ctx.fillText(cust, PAD, y);
  if (phone) {
    const fmtPhone = '+94 ' + (phone.startsWith('0') ? phone.slice(1) : phone);
    ctx.fillStyle = COL;
    ctx.font = '13px Nunito, sans-serif';
    ctx.fillText('📱 ' + fmtPhone, PAD, y + 20);
  }
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px Nunito, sans-serif';
  ctx.fillText('Payment: ' + payMethod, W - PAD, y);

  // Items header
  y = HEADER_H + META_H - 30;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.roundRect(PAD, y, W - PAD*2, 26, 6); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = 'bold 11px Nunito, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ITEM', PAD + 10, y + 17);
  ctx.textAlign = 'center';
  ctx.fillText('QTY', W/2 + 40, y + 17);
  ctx.textAlign = 'right';
  ctx.fillText('AMOUNT', W - PAD - 10, y + 17);

  // Items
  y = HEADER_H + META_H + 10;
  cartSnap.forEach((item, i) => {
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      ctx.beginPath(); ctx.roundRect(PAD, y - 4, W - PAD*2, 36, 4); ctx.fill();
    }
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = '600 13px Nunito, sans-serif';
    // Truncate long names
    let name = item.name;
    if (ctx.measureText(name).width > W/2 - 20) {
      while (ctx.measureText(name + '…').width > W/2 - 20) name = name.slice(0,-1);
      name += '…';
    }
    ctx.fillText(name, PAD + 10, y + 18);

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '11px Nunito, sans-serif';
    ctx.fillText('× ' + item.qty + '  @ ₹' + item.price, PAD + 10, y + 32);

    ctx.textAlign = 'right';
    ctx.fillStyle = COL;
    ctx.font = 'bold 14px Nunito, sans-serif';
    ctx.fillText('₹' + (item.price * item.qty).toFixed(2), W - PAD - 10, y + 22);

    y += 44;
  });

  // Totals separator
  ctx.strokeStyle = 'rgba(253,184,19,0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(PAD, y + 6); ctx.lineTo(W-PAD, y + 6); ctx.stroke();
  ctx.setLineDash([]);

  // Totals rows
  y += 28;
  function totalRow(label, value, bold, color) {
    ctx.textAlign = 'left';
    ctx.fillStyle = bold ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)';
    ctx.font = (bold ? 'bold ' : '') + '13px Nunito, sans-serif';
    ctx.fillText(label, PAD + 10, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = color || (bold ? '#ffffff' : 'rgba(255,255,255,0.65)');
    ctx.font = (bold ? 'bold ' : '') + '13px Nunito, sans-serif';
    ctx.fillText(value, W - PAD - 10, y);
    y += 34;
  }

  totalRow('Subtotal', '₹' + sub.toFixed(2));
  if (disc > 0) totalRow('Discount', '− ₹' + disc.toFixed(2), false, '#ff6b6b');
  totalRow('GST (18%)', '₹' + tax.toFixed(2));

  // Grand total box
  const gtGrad = ctx.createLinearGradient(PAD, y-8, W-PAD, y+38);
  gtGrad.addColorStop(0, 'rgba(253,184,19,0.18)');
  gtGrad.addColorStop(1, 'rgba(255,100,0,0.1)');
  ctx.fillStyle = gtGrad;
  ctx.strokeStyle = 'rgba(253,184,19,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(PAD, y-8, W-PAD*2, 46, 10); ctx.fill(); ctx.stroke();
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = 'bold 14px Nunito, sans-serif';
  ctx.fillText('TOTAL DUE', PAD + 14, y + 22);
  ctx.textAlign = 'right';
  ctx.fillStyle = COL;
  ctx.font = 'bold 22px Nunito, sans-serif';
  ctx.fillText('₹' + total.toFixed(2), W - PAD - 14, y + 24);
  y += 54;

  // Footer
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W-PAD, y); ctx.stroke();
  y += 22;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '12px Nunito, sans-serif';
  ctx.fillText('Thank you for shopping at IronClad Hardware! 🙏', W/2, y);
  ctx.fillStyle = 'rgba(253,184,19,0.4)';
  ctx.font = '11px Nunito, sans-serif';
  ctx.fillText('ironclad.lk  ·  support@ironclad.lk', W/2, y + 18);

  return canvas;
}

// ── SEND BAR ──────────────────────────────────────────────
let _invoiceDataURL = null;
let _currentPhone = '', _currentIntlNum = '', _currentInvId = '';

function renderSendBar(phone, invId, cust, total) {
  const sb = document.getElementById('sendBtns');
  const {sub, disc, tax} = getTotals();
  const payMethod = pay;
  const date = new Date().toLocaleString('en-IN');

  // Always generate the canvas image
  const canvas = generateInvoiceCanvas(invId, cust, phone, cart, sub, disc, tax, total, payMethod, date);

  // Put canvas inside the preview wrap (not after rcpt)
  canvas.style.cssText = 'width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.08);display:block;';
  canvas.id = 'invoicePreview';
  const wrap = document.getElementById('imgPreviewWrap');
  wrap.innerHTML = '';
  wrap.appendChild(canvas);

  // Convert to data URL (CSP-safe, no blob needed)
  _invoiceDataURL = canvas.toDataURL('image/png', 1.0);

  // Store phone for button handlers
  _currentPhone = phone;
  _currentInvId = invId;

  // Update WA button label with phone if available
  const waBtn = document.getElementById('btnWA');
  const comboBtn = document.getElementById('btnCombo');
  if (!phone) {
    if (waBtn)    { waBtn.style.opacity = '.4'; waBtn.title = 'Add mobile number to enable'; }
    if (comboBtn) { comboBtn.style.opacity = '.4'; comboBtn.title = 'Add mobile number to enable'; }
  } else {
    const num = phone.replace(/[^0-9]/g, '');
    const intlNum = (num.startsWith('94') || num.startsWith('0094')) ? num : (num.startsWith('0') ? '94' + num.slice(1) : '94' + num);
    _currentIntlNum = intlNum;
    if (waBtn)    { waBtn.style.opacity = '1'; waBtn.title = 'Send invoice image to WhatsApp (+' + intlNum + ')'; }
    if (comboBtn) { comboBtn.style.opacity = '1'; comboBtn.title = 'Print & Send to WhatsApp (+' + intlNum + ')'; }
  }
}

// ── ACTION FUNCTIONS ──
function _downloadImg() {
  if (!_invoiceDataURL) return false;
  const a = document.createElement('a');
  a.href = _invoiceDataURL;
  a.download = (_currentInvId || 'invoice') + '.png';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  return true;
}

function _openWA() {
  if (_currentIntlNum) window.open('https://wa.me/' + _currentIntlNum, '_blank');
}

function _setBtnState(id, loading) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled = loading;
  btn.style.opacity = loading ? '0.65' : '1';
}

// Print button — just window.print
function doPrint() {
  window.print();
}

// WhatsApp button — download image then open WA
function sendWhatsAppOnly() {
  if (!_invoiceDataURL) { t('Image not ready', 'r'); return; }
  if (!_currentIntlNum) { t('⚠️ Add a mobile number first', 'r'); return; }
  _setBtnState('btnWA', true);
  if (_downloadImg()) {
    setTimeout(() => {
      _openWA();
      t('📎 Image saved — attach it in WhatsApp!');
      _setBtnState('btnWA', false);
    }, 500);
  }
}

// Combo button — print + download image + open WA
function printAndSendWhatsApp() {
  if (!_invoiceDataURL) { t('Image not ready', 'r'); return; }
  if (!_currentIntlNum) { t('⚠️ Add a mobile number first', 'r'); return; }
  _setBtnState('btnCombo', true);
  window.print();
  if (_downloadImg()) {
    setTimeout(() => {
      _openWA();
      t('🖨️ Printed + 📎 Image saved — attach in WhatsApp!');
      _setBtnState('btnCombo', false);
    }, 600);
  }
}

function toggleImgPreview() {
  const wrap = document.getElementById('imgPreviewWrap');
  const arrow = document.getElementById('previewArrow');
  const isOpen = wrap.classList.toggle('open');
  if (arrow) arrow.classList.toggle('open', isOpen);
}

function closeM() {
  document.getElementById('moverlay').classList.remove('on');
  // Reset slider back to payment panel for next bill
  setTimeout(()=>{ document.getElementById('modalSlider').style.transform='translateX(0)'; }, 350);
  const wrap = document.getElementById('imgPreviewWrap');
  if (wrap) { wrap.innerHTML = ''; wrap.classList.remove('open'); }
  const arrow = document.getElementById('previewArrow');
  if (arrow) arrow.classList.remove('open');
  _invoiceDataURL = null;
  _currentPhone = ''; _currentIntlNum = ''; _currentInvId = '';
  newBill();
}

function newBill() {
  cart=[];
  ['cName','cPhone','tend'].forEach(id=>document.getElementById(id).value='');
  const _dp = document.getElementById('dPhone'); if(_dp){ _dp.textContent=''; _dp.style.display='none'; }
  document.getElementById('bType').value='Retail';
  document.getElementById('discV').value=0;
  const id=`INV-${String(inv).padStart(4,'0')}`;
  document.getElementById('dInv').textContent=id;
  document.getElementById('hdrInv').textContent=id;
  const _nd = new Date().toLocaleString('en-IN');
  document.getElementById('dDate').textContent=_nd;
  const _hd=document.getElementById('hdrDate'); if(_hd) _hd.textContent=_nd;
  updCust(); renderCart(); calcSummary();
  closePayModal();
}

function holdBill() { if(!cart.length){t('Nothing to hold!','r');return;} t('📌 Bill held'); }

// HISTORY
function renderHist() {
  const tb=document.getElementById('histTbody');
  if(!hist.length){
    tb.innerHTML=`<tr><td colspan="6" style="text-align:center;color:var(--text-3);padding:2rem;font-size:.72rem;font-weight:700;">No invoices yet</td></tr>`;
    return;
  }
  tb.innerHTML=hist.map(h=>`
    <tr>
      <td style="color:var(--gold);font-weight:800;">${h.num}</td>
      <td><div style="font-weight:700">${h.customer}</div>${h.phone?`<div style="font-size:.62rem;color:var(--gold)">📱 ${h.phone}</div>`:''}</td>
      <td style="font-size:.65rem;">${h.date}</td>
      <td style="text-align:center;">${h.items}</td>
      <td style="font-weight:700;">₹${h.total}</td>
      <td><span class="badge b-g">Paid</span></td>
    </tr>`).join('');
}

// TABS
function tab(name,el) {
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tp').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(`tp-${name}`).classList.add('active');
}

// TOAST
function t(msg,type='') {
  const el=document.getElementById('toast');
  el.textContent=msg;
  el.style.borderColor=type==='r'?'rgba(255,69,58,.3)':'rgba(255,255,255,.1)';
  el.classList.add('on');
  clearTimeout(el._t);
  el._t=setTimeout(()=>el.classList.remove('on'),2400);
}

init();
