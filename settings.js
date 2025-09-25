const team = JSON.parse(localStorage.getItem('r_team')||'[]')
function renderTeam(){const t=document.querySelector('#teamList');t.innerHTML='';team.forEach(m=>{const el=document.createElement('div');el.className='badge';el.innerText=`${m.email} • ${m.role||'member'}`;t.appendChild(el)})}
renderTeam()
document.querySelector('#inviteBtn').addEventListener('click',()=>{
  const email=document.querySelector('#inviteEmail').value.trim()
  if(!email) return
  team.push({email,role:'member',date:Date.now()})
  localStorage.setItem('r_team',JSON.stringify(team));renderTeam()
})
document.querySelector('#toggle2fa').addEventListener('click',()=>{
  const current = localStorage.getItem('r_2fa')==='true'
  localStorage.setItem('r_2fa',!current)
  alert('Two-factor authentication toggled')
})
