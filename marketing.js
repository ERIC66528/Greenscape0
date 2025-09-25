const campaigns = JSON.parse(localStorage.getItem('r_campaigns')||'[]')
function renderCampaigns(){
  const list=document.querySelector('#campaignList');list.innerHTML=''
  campaigns.slice().reverse().forEach(c=>{
    const el=document.createElement('div');el.className='badge';el.innerHTML=`<div style="font-weight:700">${c.name}</div><div style="color:var(--muted);font-size:13px">${c.date?new Date(c.date).toLocaleString():''} • ${c.reach||0} reached</div>`
    list.appendChild(el)
  })
}
renderCampaigns()
document.querySelector('#newCampaign').addEventListener('click',()=>{document.querySelector('#campaignForm').style.display='block'})
document.querySelector('#cancelCampaign').addEventListener('click',()=>{document.querySelector('#campaignForm').style.display='none'})
document.querySelector('#sendCampaign').addEventListener('click',()=>{
  const name=document.querySelector('#campName').value.trim()
  const content=document.querySelector('#campContent').value.trim()
  if(!name||!content) return
  campaigns.push({id:'c_'+Date.now(),name,content,date:Date.now(),reach:Math.floor(Math.random()*2000)})
  localStorage.setItem('r_campaigns',JSON.stringify(campaigns))
  renderCampaigns()
  document.querySelector('#campaignForm').style.display='none'
})
