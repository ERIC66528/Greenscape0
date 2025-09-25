const tickets = JSON.parse(localStorage.getItem('r_tickets')||'[]')
function renderTickets(){
  const list = document.querySelector('#ticketList');list.innerHTML=''
  tickets.slice().reverse().forEach(t=>{
    const el=document.createElement('div');el.className='badge';el.innerHTML=`<div style="font-weight:700">${t.title||t.id}</div><div style="color:var(--muted);font-size:13px">${t.status} • ${new Date(t.date).toLocaleString()}</div>`
    list.appendChild(el)
  })
}
renderTickets()
document.querySelector('#openTicket').addEventListener('click',()=>{
  const id='t_'+Date.now()
  tickets.push({id,title:'New ticket',status:'open',date:Date.now(),messages:[]})
  localStorage.setItem('r_tickets',JSON.stringify(tickets))
  renderTickets()
})
document.querySelector('#supportSend').addEventListener('click',()=>{
  const v=document.querySelector('#supportInput').value.trim()
  if(!v) return
  const box=document.querySelector('#supportMessages')
  const u=document.createElement('div');u.className='msg user';u.textContent=v;box.appendChild(u)
  document.querySelector('#supportInput').value=''
  setTimeout(()=>{const b=document.createElement('div');b.className='msg bot';b.innerHTML='Assistant: We logged your issue and recommended steps were sent to your mailbox.';box.appendChild(b);box.scrollTop=box.scrollHeight},700)
})
