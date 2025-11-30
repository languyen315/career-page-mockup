const jobs = [
  { id: '1', title: 'Frontend Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time', summary: 'Build delightful web experiences using React and modern CSS.' },
  { id: '2', title: 'Product Designer', dept: 'Design', location: 'NYC', type: 'Full-time', summary: 'Design interfaces and experiences that delight our users.' },
  { id: '3', title: 'Marketing Manager', dept: 'Marketing', location: 'Remote', type: 'Part-time', summary: 'Lead campaigns and growth initiatives.' }
];

const jobsList = document.getElementById('jobsList');
const searchInput = document.getElementById('searchInput');
const filterDept = document.getElementById('filterDept');
const filterLoc = document.getElementById('filterLoc');
const yearEl = document.getElementById('year');
const applyModal = document.getElementById('applyModal');
const closeModal = document.getElementById('closeModal');
const cancelApply = document.getElementById('cancelApply');
const applyForm = document.getElementById('applyForm');
const roleIdInput = document.getElementById('roleId');

function init() {
  populateFilters();
  renderJobs(jobs);
  yearEl.textContent = new Date().getFullYear();
  attachEvents();
}

function populateFilters(){
  const depts = Array.from(new Set(jobs.map(j=>j.dept)));
  const locs = Array.from(new Set(jobs.map(j=>j.location)));
  depts.forEach(d=>{
    const opt = document.createElement('option'); opt.value = d; opt.textContent = d; filterDept.appendChild(opt);
  });
  locs.forEach(l=>{
    const opt = document.createElement('option'); opt.value = l; opt.textContent = l; filterLoc.appendChild(opt);
  });
}

function renderJobs(list){
  jobsList.innerHTML = '';
  if(list.length===0){ jobsList.innerHTML = '<p>No roles found.</p>'; return }
  list.forEach(j=>{
    const card = document.createElement('article'); card.className = 'job-card';
    card.innerHTML = `
      <h4>${escapeHtml(j.title)}</h4>
      <div class="job-meta">${escapeHtml(j.dept)} • ${escapeHtml(j.location)} • ${escapeHtml(j.type)}</div>
      <p>${escapeHtml(j.summary)}</p>
      <div class="job-actions">
        <button class="btn" data-role="${j.id}">Apply</button>
        <a class="btn btn-ghost" href="#">View details</a>
      </div>
    `;
    jobsList.appendChild(card);
  });
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]) }

function attachEvents(){
  searchInput.addEventListener('input', applyFilters);
  filterDept.addEventListener('change', applyFilters);
  filterLoc.addEventListener('change', applyFilters);

  jobsList.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button[data-role]');
    if(!btn) return;
    openApplyModal(btn.getAttribute('data-role'));
  });

  closeModal.addEventListener('click', closeApplyModal);
  cancelApply.addEventListener('click', closeApplyModal);
  applyForm.addEventListener('submit', submitApplication);

  // close on outside click
  applyModal.addEventListener('click', (ev)=>{ if(ev.target===applyModal) closeApplyModal(); });
}

function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const dept = filterDept.value;
  const loc = filterLoc.value;
  const filtered = jobs.filter(j=>{
    const matchesQ = q === '' || (j.title + ' ' + j.summary + ' ' + j.dept).toLowerCase().includes(q);
    const matchesDept = !dept || j.dept === dept;
    const matchesLoc = !loc || j.location === loc;
    return matchesQ && matchesDept && matchesLoc;
  });
  renderJobs(filtered);
}

function openApplyModal(roleId){
  roleIdInput.value = roleId;
  applyModal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  document.getElementById('applicantName').focus();
}
function closeApplyModal(){
  applyModal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  applyForm.reset();
}

function submitApplication(ev){
  ev.preventDefault();
  const payload = {
    roleId: roleIdInput.value,
    name: document.getElementById('applicantName').value,
    email: document.getElementById('applicantEmail').value,
    cover: document.getElementById('applicantCover').value
  };
  // In a real site we'd POST to an API. Here we just show a friendly message.
  alert(`Thanks ${payload.name}! Your application for role ${payload.roleId} was received.`);
  closeApplyModal();
}

init();
