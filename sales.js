const orders = JSON.parse(localStorage.getItem('r_orders')||'[]')
const itemsList = JSON.parse(localStorage.getItem('r_items')||'[]')
const customersList = JSON.parse(localStorage.getItem('r_customers')||'[]')
function populateSelects(){
  const selCust = document.querySelector('#selectCustomer')
  selCust.innerHTML = ''
  customersList.forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.name;selCust.appendChild(o)})
  const selItem = document.querySelector('#orderItem')
  selItem.innerHTML=''
  itemsList.forEach(i=>{const o=document.createElement('option');o.value=i.sku;o.textContent=`${i.name} (${i.sku})`;selItem.appendChild(o)})
}
function renderHistory(){
  const tbody=document.querySelector('#orderHistory tbody');tbody.innerHTML=''
  orders.slice().reverse().forEach((o,idx)=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${o.id}</td><td>${o.customer}</td><td>${o.items.map(it=>it.sku+' x'+it.qty).join(', ')}</td><td>${formatCurrency(o.total)}</td><td>${o.status}</td>`;tbody.appendChild(tr)})
}
function formatCurrency(v){return '$'+Number(v||0).toFixed(2)}
populateSelects();renderHistory()
document.querySelector('#newOrder').addEventListener('click',()=>{document.querySelector('#orderForm').style.display='block'})
document.querySelector('#cancelOrder').addEventListener('click',()=>{document.querySelector('#orderForm').style.display='none'})
document.querySelector('#orderQty').addEventListener('input',calculateTotal)
document.querySelector('#orderItem').addEventListener('change',calculateTotal)
function calculateTotal(){
  const sku=document.querySelector('#orderItem').value
  const qty=Number(document.querySelector('#orderQty').value||0)
  const it = itemsList.find(x=>x.sku===sku) || {}
  document.querySelector('#orderTotal').value = formatCurrency((it.price||0)*qty)
}
document.querySelector('#processPay').addEventListener('click',()=>{
  const cid=document.querySelector('#selectCustomer').value
  const c = customersList.find(x=>x.id===cid)
  const sku=document.querySelector('#orderItem').value
  const qty=Number(document.querySelector('#orderQty').value||0)
  if(!c||!sku||qty<1) return
  const it = itemsList.find(x=>x.sku===sku)
  const total = (it.price||0)*qty
  const oid='o_'+Date.now()
  orders.push({id:oid,customer:c.name,items:[{sku,qty}],total,status:'paid',date:Date.now()})
  it.stock = Math.max(0,(it.stock||0)-qty)
  localStorage.setItem('r_orders',JSON.stringify(orders))
  localStorage.setItem('r_items',JSON.stringify(itemsList))
  renderHistory();calculateTotal();alert('Payment processed (simulated).')
})
