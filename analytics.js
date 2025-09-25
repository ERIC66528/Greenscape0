const orders = JSON.parse(localStorage.getItem('r_orders')||'[]')
function renderTop(){
  const counts = {}
  orders.forEach(o=>o.items.forEach(it=>{counts[it.sku]=(counts[it.sku]||0)+it.qty}))
  const list = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,6)
  const container=document.querySelector('#topList');container.innerHTML=''
  list.forEach(([sku,qty])=>{
    const el=document.createElement('div');el.className='badge';el.innerText=`${sku} • ${qty} sold`;container.appendChild(el)
  })
}
function renderChart(){
  const ctx = document.createElement('canvas')
  const area=document.querySelector('#chartArea');area.innerHTML='';area.appendChild(ctx)
  const days = 30
  const byDay = {}
  for(let i=0;i<days;i++){byDay[i]=0}
  orders.forEach(o=>{
    const d = Math.floor((Date.now()-o.date)/86400000)
    if(d<days) byDay[days-1-d] += Number(o.total||0)
  })
  const labels = Object.keys(byDay).map((_,i)=>`${i+1}`)
  const data = Object.values(byDay)
  new Chart(ctx,{type:'line',data:{labels, datasets:[{label:'Revenue',data,fill:true,tension:0.4}]},options:{scales:{x:{display:true},y:{display:true}}}})
}
renderTop();renderChart()
document.querySelector('#exportCsv').addEventListener('click',()=>{
  const rows = [['id','customer','total','status','date','items']]
  orders.forEach(o=>rows.push([o.id,o.customer,o.total,o.status,new Date(o.date).toISOString(),JSON.stringify(o.items)]))
  const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob([csv],{type:'text/csv'}), url=URL.createObjectURL(blob)
  const a=document.createElement('a');a.href=url;a.download='orders_export.csv';a.click();URL.revokeObjectURL(url)
})
