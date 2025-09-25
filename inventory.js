const items = JSON.parse(localStorage.getItem('r_items')||'[]')
function renderItems(){
  const tbody = document.querySelector('#itemsTable tbody')
  tbody.innerHTML=''
  items.forEach(it=>{
    const tr=document.createElement('tr')
    tr.innerHTML = `<td>${it.sku}</td><td>${it.name}</td><td>${it.stock}</td><td>${it.reorder}</td><td>${formatCurrency(it.price||0)}</td><td><div class="actions"><button class="btn" data-id="${it.sku}" data-action="edit">Edit</button><button class="btn secondary" data-id="${it.sku}" data-action="del">Delete</button></div></td>`
    tbody.appendChild(tr)
  })
}
function formatCurrency(v){return '$'+Number(v||0).toFixed(2)}
renderItems()
document.querySelector('#newItem').addEventListener('click',()=>document.querySelector('#itemForm').style.display='block')
document.querySelector('#cancelItem').addEventListener('click',()=>document.querySelector('#itemForm').style.display='none')
document.querySelector('#saveItem').addEventListener('click',()=>{
  const sku=document.querySelector('#sku').value.trim()
  const name=document.querySelector('#iname').value.trim()
  const stock=Number(document.querySelector('#stock').value||0)
  const reorder=Number(document.querySelector('#reorder').value||0)
  const price=Number(document.querySelector('#price').value||0)
  const supplier=document.querySelector('#supplier').value.trim()
  if(!sku||!name) return
  const exists = items.find(i=>i.sku===sku)
  if(exists){
    exists.name=name;exists.stock=stock;exists.reorder=reorder;exists.price=price;exists.supplier=supplier
  } else {
    items.push({sku,name,stock,reorder,price,supplier})
  }
  localStorage.setItem('r_items',JSON.stringify(items))
  document.querySelector('#itemForm').style.display='none'
  renderItems()
})
document.querySelector('#itemsTable tbody').addEventListener('click',e=>{
  const btn=e.target.closest('button');if(!btn) return
  const id=btn.dataset.id, act=btn.dataset.action
  if(act==='del'){const idx=items.findIndex(x=>x.sku===id);if(idx>-1) items.splice(idx,1);localStorage.setItem('r_items',JSON.stringify(items));renderItems()}
  if(act==='edit'){const it=items.find(x=>x.sku===id);document.querySelector('#itemForm').style.display='block';document.querySelector('#sku').value=it.sku;document.querySelector('#iname').value=it.name;document.querySelector('#stock').value=it.stock;document.querySelector('#reorder').value=it.reorder;document.querySelector('#price').value=it.price;document.querySelector('#supplier').value=it.supplier}
})
document.querySelector('#itemSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase()
  const rows=document.querySelectorAll('#itemsTable tbody tr')
  rows.forEach(r=>r.style.display = r.innerText.toLowerCase().includes(q)?'':'none')
})
