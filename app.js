const mock = {
  users: JSON.parse(localStorage.getItem('r_users')||'[]'),
  orders: JSON.parse(localStorage.getItem('r_orders')||'[]'),
  items: JSON.parse(localStorage.getItem('r_items')||'[]'),
  customers: JSON.parse(localStorage.getItem('r_customers')||'[]'),
  campaigns: JSON.parse(localStorage.getItem('r_campaigns')||'[]'),
  tickets: JSON.parse(localStorage.getItem('r_tickets')||'[]')
}
function saveAll(){
  localStorage.setItem('r_users',JSON.stringify(mock.users));
  localStorage.setItem('r_orders',JSON.stringify(mock.orders));
  localStorage.setItem('r_items',JSON.stringify(mock.items));
  localStorage.setItem('r_customers',JSON.stringify(mock.customers));
  localStorage.setItem('r_campaigns',JSON.stringify(mock.campaigns));
  localStorage.setItem('r_tickets',JSON.stringify(mock.tickets));
}
function ensureDemoData(){
  if(!mock.users.length){
    mock.users.push({id:'u_demo',name:'Demo User',email:'demo@rictei.test',avatar:'D'});
  }
  if(!mock.items.length){
    mock.items.push({sku:'SKU001',name:'Delivery Van',stock:5,reorder:2,price:250, supplier:'Local Motors'});
    mock.items.push({sku:'SKU002',name:'Forklift',stock:2,reorder:1,price:1200,supplier:'LiftCo'});
    mock.items.push({sku:'SKU003',name:'Tarpaulin',stock:50,reorder:20,price:15,supplier:'PackSup'});
  }
  if(!mock.customers.length){
    mock.customers.push({id:'c1',name:'Aalto Ltd',email:'contact@aalto.test',phone:'+254700001',notes:'Long-term client'});
    mock.customers.push({id:'c2',name:'Bright Movers',email:'hello@bright.test',phone:'+254700002',notes:''});
  }
  if(!mock.orders.length){
    mock.orders.push({id:'o1',customer:'Aalto Ltd',items:[{sku:'SKU001',qty:1}],total:250,status:'paid',date:Date.now()-86400000*4});
    mock.orders.push({id:'o2',customer:'Bright Movers',items:[{sku:'SKU003',qty:10}],total:150,status:'pending',date:Date.now()-86400000});
  }
  saveAll();
}
ensureDemoData();
function qs(sel){return document.querySelector(sel)}
function qsa(sel){return Array.from(document.querySelectorAll(sel))}
function formatCurrency(v){return '$'+Number(v).toFixed(2)}
function renderOverview(){
  qs('#kpiRevenue').innerText = formatCurrency(mock.orders.reduce((s,o)=>s+Number(o.total),0))
  qs('#kpiCustomers').innerText = mock.customers.length
  qs('#kpiStock').innerText = mock.items.filter(i=>i.stock<=i.reorder).length
  const tbody = qs('#ordersTable tbody')
  tbody.innerHTML = ''
  mock.orders.slice().reverse().forEach(o=>{
    const tr=document.createElement('tr')
    tr.innerHTML = `<td>${o.id}</td><td>${o.customer}</td><td>${o.status}</td><td>${formatCurrency(o.total)}</td>`
    tbody.appendChild(tr)
  })
  const inv = qs('#inventoryList')
  inv.innerHTML = ''
  mock.items.slice(0,6).forEach(i=>{
    const el=document.createElement('div')
    el.className='badge'
    el.innerText=`${i.name} — ${i.stock} in stock`
    inv.appendChild(el)
  })
  const mlist=qs('#marketingList')
  mlist.innerHTML=''
  mock.campaigns.slice(-4).reverse().forEach(c=>{
    const el=document.createElement('div')
    el.className='badge'
    el.innerText=`${c.name} • ${c.reach||0} reached`
    mlist.appendChild(el)
  })
}
function setupChat(){
  const messages = qs('#messages')
  function botReply(text){
    const d=document.createElement('div')
    d.className='msg bot'
    d.innerHTML = `<div>${text}</div><small>${new Date().toLocaleString()}</small>`
    messages.appendChild(d)
    messages.scrollTop = messages.scrollHeight
  }
  qs('#sendChat').addEventListener('click',()=>{
    const v = qs('#chatInput').value.trim()
    if(!v) return
    const u=document.createElement('div');u.className='msg user';u.textContent=v;messages.appendChild(u)
    qs('#chatInput').value=''
    messages.scrollTop = messages.scrollHeight
    setTimeout(()=>botReply('Automated assistant: We received your message. For complex issues create a ticket in Support.'),700)
  })
}
if(document.body.contains(qs('#messages'))){
  renderOverview()
  setupChat()
  const user=mock.users[0]
  qs('#userName').innerText = user.name
  qs('#userEmail').innerText = user.email
  qs('#userAvatar').innerText = user.avatar||user.name[0]
}
(function attachLogin(){
  if(!document.body.contains(qs('#loginBtn'))) return
  qs('#gotoRegister').addEventListener('click',()=>location.href='register.html')
  qs('#loginBtn').addEventListener('click',()=>{
    const email=qs('#email').value.trim(),pw=qs('#password').value
    const user = mock.users.find(u=>u.email===email) || mock.users[0]
    localStorage.setItem('r_current',JSON.stringify(user))
    location.href='dashboard.html'
  })
  qs('#demoSign').addEventListener('click',()=>{
    localStorage.setItem('r_current',JSON.stringify(mock.users[0]))
    location.href='dashboard.html'
  })
  qs('#googleSign').addEventListener('click',()=>{
    localStorage.setItem('r_current',JSON.stringify(mock.users[0]))
    location.href='dashboard.html'
  })
})();
(function attachRegister(){
  if(!document.body.contains(qs('#registerBtn'))) return
  qs('#gotoLogin').addEventListener('click',()=>location.href='login.html')
  qs('#registerBtn').addEventListener('click',()=>{
    const name=qs('#rname').value.trim(),email=qs('#remail').value.trim(),phone=qs('#rphone').value.trim()
    const id='u_'+Date.now()
    const user={id,name,email,phone,avatar:name?name[0]:'U'}
    mock.users.push(user);saveAll()
    localStorage.setItem('r_current',JSON.stringify(user))
    location.href='dashboard.html'
  })
})();
