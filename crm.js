const crmStore = JSON.parse(localStorage.getItem('r_customers')||'[]')
function renderCustomers(){
  const tbody = document.querySelector('#customersTable tbody')
  tbody.innerHTML = ''
  crmStore.forEach(c=>{
    const tr=document.createElement('tr')
    tr.innerHTML = `<td>${c.name}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.notes||''}</td><td><div class="actions"><button class="btn" data-id="${c.id}" data-action="edit">Edit</button><button class="btn secondary" data-id="${c.id}" data-action="del">Delete</button></div></td>`
    tbody.appendChild(tr)
  })
}
renderCustomers()
document.querySelector('#newCustomer').addEventListener('click',()=>{
  document.querySelector('#customerForm').style.display='block'
})
document.querySelector('#cancelCustomer').addEventListener('click',()=>{
  document.querySelector('#customerForm').style.display='none'
})
document.querySelector('#saveCustomer').addEventListener('click',()=>{
  const name=document.querySelector('#cname').value.trim()
  const email=document.querySelector('#cemail').value.trim()
  const phone=document.querySelector('#cphone').value.trim()
  const notes=document.querySelector('#cnotes').value.trim()
  if(!name) return
  const id='c_'+Date.now()
  crmStore.push({id,name,email,phone,notes})
  localStorage.setItem('r_customers',JSON.stringify(crmStore))
  document.querySelector('#customerForm').style.display='none'
  renderCustomers()
})
document.querySelector('#customersTable tbody').addEventListener('click',e=>{
  const btn=e.target.closest('button')
  if(!btn) return
  const id=btn.dataset.id, act=btn.dataset.action
  if(act==='del'){
    const idx=crmStore.findIndex(x=>x.id===id);if(idx>-1) crmStore.splice(idx,1);localStorage.setItem('r_customers',JSON.stringify(crmStore));renderCustomers()
  }
  if(act==='edit'){
    const cust=crmStore.find(x=>x.id===id)
    document.querySelector('#customerForm').style.display='block'
    document.querySelector('#cname').value=cust.name
    document.querySelector('#cemail').value=cust.email
    document.querySelector('#cphone').value=cust.phone
    document.querySelector('#cnotes').value=cust.notes
  }
})
document.querySelector('#custSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase()
  const rows=document.querySelectorAll('#customersTable tbody tr')
  rows.forEach(r=>r.style.display = r.innerText.toLowerCase().includes(q)?'':'none')
})
