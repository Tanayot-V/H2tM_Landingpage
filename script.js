(function(){
  "use strict";
  const STORAGE_KEY = "harvest2themoon-site";
  const ADMIN_PASSWORD = "harvest2themoon-admin";

  const DEFAULT_DATA = {
    hero:{
      headline:"Harvest to the Moon",
      sub:"สถาบันสอนเทรดที่มุ่งพัฒนาผู้เรียนตั้งแต่ระดับพื้นฐาน จนสามารถทำกำไรได้อย่างมั่นคงด้วยตนเอง ผ่านแนวทางการเทรดที่เน้น ความเข้าใจ ไม่ใช่แค่ท่องจำ พร้อมการวางแผนและควบคุมความเสี่ยงอย่างเป็นระบบ เราให้ความสำคัญกับ Mindset ที่ถูกต้อง เพื่อการอยู่รอดในตลาดอย่างยั่งยืน พร้อมโค้ชที่ดูแลแบบใกล้ชิด ให้คำปรึกษารายบุคคล ปรับแผนเทรดให้เหมาะกับแต่ละคน และยินดีสอนซ้ำจนกว่าจะเห็นพัฒนาการจริง Harvest to the Moon ไม่ใช่แค่สอนให้เทรดได้แต่พาให้เทรดเป็นอยู่รอดและเติบโตได้",
      cta1:"Explore Tools & EAs",
      cta2:"Join the Academy"
    },
    slides:[
      {id:"s1",title:"Harvest to the Moon — กลยุทธ์ที่ดี เริ่มจากแผนที่คุณเข้าใจ",hue:230,image:"Element/Harvest_to_the_moonAsset_3.webp"},
      {id:"s2",title:"เรียนให้ลึก รู้ให้จริง — เทรดอย่างฉลาดไม่ใช่แค่ดูกราฟเก่ง",hue:265,image:"Element/home_-harvest_to_the_moon-02_1.webp"},
      {id:"s3",title:"เราติดตามผล เพื่อให้ผู้เรียนสร้างระบบเทรดของตัวเอง",hue:200,image:"Element/home_-harvest_to_the_moon-03.webp"}
    ],
    tools:[
      {id:"t1",name:"Orion Trend EA",category:"Expert Advisor",description:"Fully automated trend-following EA with adaptive risk sizing and news filter.",price:"$249",hue:235,image:""},
      {id:"t2",name:"Nebula Scalper EA",category:"Expert Advisor",description:"High-frequency scalping engine tuned for low-spread majors.",price:"$199",hue:255,image:""},
      {id:"t3",name:"Pulse Momentum Indicator",category:"Indicator",description:"Multi-timeframe momentum indicator with divergence alerts.",price:"$79",hue:210,image:""},
      {id:"t4",name:"Quasar Risk Manager",category:"Tool",description:"Position sizing and drawdown-guard panel for MT4/MT5.",price:"$59",hue:280,image:""},
      {id:"t5",name:"Stellar Grid EA",category:"Expert Advisor",description:"Grid-hedge strategy engineered for ranging markets, with equity stop.",price:"$219",hue:245,image:""},
      {id:"t6",name:"Comet Session Indicator",category:"Indicator",description:"Visualizes London/NY/Asia sessions with volatility overlays.",price:"$49",hue:195,image:""}
    ],
    academy:[
      {id:"a1",title:"Live Mentorship",description:"Weekly live sessions breaking down real trades and market structure."},
      {id:"a2",title:"Strategy Blueprints",description:"Step-by-step frameworks for trend, range, and breakout trading."},
      {id:"a3",title:"Risk Management Labs",description:"Hands-on position sizing and drawdown-control workshops."}
    ],
    reviews:[
      {id:"r1",name:"James Okoye",rating:5,text:"Orion Trend EA has been running on my live account for 6 months — consistent and drama-free."},
      {id:"r2",name:"Sasithorn P.",rating:5,text:"The academy sessions finally made risk management click for me. Worth every baht."},
      {id:"r3",name:"Marco Bellandi",rating:4,text:"Solid indicator suite. The session overlay alone improved my entries a lot."},
      {id:"r4",name:"Aiko Tanaka",rating:5,text:"Support team is responsive and the EA dashboard is genuinely useful for tracking performance."}
    ]
  };

  // ---------- storage helper: prefers window.storage, falls back to localStorage ----------
  const Store = {
    async get(key){
      if (window.storage){
        try{ const r = await window.storage.get(key, true); return r ? JSON.parse(r.value) : null; }
        catch(e){ return null; }
      }
      try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }catch(e){ return null; }
    },
    async set(key, value){
      if (window.storage){
        try{ await window.storage.set(key, JSON.stringify(value), true); return true; }
        catch(e){ return false; }
      }
      try{ localStorage.setItem(key, JSON.stringify(value)); return true; }catch(e){ return false; }
    }
  };

  let data = null;

  // ---------- placeholder art (deterministic pseudo-random starfield gradient) ----------
  function seededRand(seed){
    let x = seed || 1;
    return function(){ x = (x*9301+49297) % 233280; return x/233280; };
  }
  function placeholder(hue){
    hue = hue || 230;
    const rnd = seededRand(hue*7+13);
    const c1 = `hsl(${hue},70%,52%)`;
    const c2 = `hsl(${(hue+55)%360},65%,28%)`;
    let dots = "";
    for(let i=0;i<45;i++){
      const cx=(rnd()*800).toFixed(1), cy=(rnd()*500).toFixed(1), r=(0.5+rnd()*1.7).toFixed(1), o=(0.25+rnd()*0.6).toFixed(2);
      dots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="${o}"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><radialGradient id="g" cx="30%" cy="25%" r="85%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></radialGradient></defs><rect width="800" height="500" fill="url(#g)"/>${dots}</svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }
  function imgFor(obj){ return obj.image && obj.image.trim() ? obj.image.trim() : placeholder(obj.hue); }
  function esc(s){ return (s||"").toString().replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function uid(){ return 'id' + Math.random().toString(36).slice(2,9); }

  // ---------- render: public site ----------
  function renderHero(){
    document.getElementById('heroHeadline').textContent = data.hero.headline;
    document.getElementById('heroSub').textContent = data.hero.sub;
    document.getElementById('heroCtaPrimary').textContent = data.hero.cta1;
    document.getElementById('heroCtaSecondary').textContent = data.hero.cta2;
  }

  let currentSlide = 0, slideTimer = null;
  function renderSlideshow(){
    const el = document.getElementById('slideshow');
    Array.from(el.querySelectorAll('.slide')).forEach(s=>s.remove());
    const dotsEl = document.getElementById('slideDots');
    dotsEl.innerHTML = '';
    data.slides.forEach((s, i)=>{
      const div = document.createElement('div');
      div.className = 'slide' + (i===0?' active':'');
      div.innerHTML = `<img src="${imgFor(s)}" alt="${esc(s.title)}" loading="${i===0?'eager':'lazy'}">`;
      el.insertBefore(div, el.querySelector('.slide-nav'));
      const dot = document.createElement('button');
      dot.className = 'dot' + (i===0?' active':'');
      dot.addEventListener('click', ()=>goToSlide(i));
      dotsEl.appendChild(dot);
    });
    currentSlide = 0;
    resetSlideTimer();
  }
  function goToSlide(i){
    const slides = document.querySelectorAll('#slideshow .slide');
    const dots = document.querySelectorAll('#slideDots .dot');
    if(!slides.length) return;
    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = (i + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  function resetSlideTimer(){
    if(slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(()=>goToSlide(currentSlide+1), 5000);
  }

  function renderTools(){
    const grid = document.getElementById('toolsGrid');
    grid.innerHTML = data.tools.map(t => `
      <div class="tool-card">
        <div class="tool-img" style="background-image:url('${imgFor(t)}')">
          <span class="tool-badge">${esc(t.category)}</span>
        </div>
        <div class="tool-body">
          <h3>${esc(t.name)}</h3>
          <p>${esc(t.description)}</p>
          <div class="tool-foot">
            <span class="price mono">${esc(t.price)}</span>
            <button class="btn btn-ghost btn-sm">View Details</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderAcademy(){
    const grid = document.getElementById('academyGrid');
    grid.innerHTML = data.academy.map((a,i) => `
      <div class="academy-card">
        <div class="academy-icon">${String(i+1).padStart(2,'0')}</div>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.description)}</p>
      </div>
    `).join('');
  }

  function renderReviews(){
    const grid = document.getElementById('reviewsGrid');
    grid.innerHTML = data.reviews.map(r => `
      <div class="review-card">
        <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
        <p class="review-text">"${esc(r.text)}"</p>
        <div class="reviewer">
          <div class="avatar">${esc(r.name.split(' ').map(w=>w[0]).slice(0,2).join(''))}</div>
          <div class="name">${esc(r.name)}</div>
        </div>
      </div>
    `).join('');
  }

  function renderHeroStats(){
    document.getElementById('statToolsCount').textContent = data.tools.length;
    document.getElementById('statAcademyCount').textContent = data.academy.length;
    const avg = data.reviews.length ? (data.reviews.reduce((sum,r)=>sum+r.rating,0) / data.reviews.length) : 0;
    document.getElementById('statAvgRating').textContent = avg.toFixed(1);
    document.getElementById('statReviewsCount').textContent = data.reviews.length;
  }

  function renderAll(){
    renderHero(); renderSlideshow(); renderTools(); renderAcademy(); renderReviews(); renderHeroStats();
  }

  // ---------- nav interactions ----------
  document.getElementById('hamburgerBtn').addEventListener('click', ()=>{
    document.getElementById('navLinks').classList.toggle('open');
  });
  document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click', ()=>{
    document.getElementById('navLinks').classList.remove('open');
  }));
  document.getElementById('slidePrev').addEventListener('click', ()=>{ goToSlide(currentSlide-1); resetSlideTimer(); });
  document.getElementById('slideNext').addEventListener('click', ()=>{ goToSlide(currentSlide+1); resetSlideTimer(); });

  // ---------- toast ----------
  function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg || 'Changes saved';
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2200);
  }

  // ---------- admin: view switching ----------
  function showAdmin(){
    document.getElementById('publicView').style.display = 'none';
    document.getElementById('adminView').style.display = 'block';
    window.scrollTo(0,0);
  }
  function showPublic(){
    document.getElementById('adminView').style.display = 'none';
    document.getElementById('publicView').style.display = 'block';
    window.scrollTo(0,0);
  }
  document.getElementById('adminLink').addEventListener('click', (e)=>{ e.preventDefault(); showAdmin(); });
  document.getElementById('backToSite').addEventListener('click', (e)=>{ e.preventDefault(); showPublic(); });
  document.getElementById('backToSiteFromGate').addEventListener('click', (e)=>{ e.preventDefault(); showPublic(); });

  document.getElementById('adminLoginBtn').addEventListener('click', tryLogin);
  document.getElementById('adminPassInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter') tryLogin(); });
  function tryLogin(){
    const val = document.getElementById('adminPassInput').value;
    if(val === ADMIN_PASSWORD){
      document.getElementById('adminGate').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'block';
      populateAdminForms();
    } else {
      document.getElementById('adminError').textContent = 'Incorrect password. Try again.';
    }
  }

  document.querySelectorAll('.admin-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.admin-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  // ---------- admin: populate forms ----------
  function populateAdminForms(){
    document.getElementById('f-hero-headline').value = data.hero.headline;
    document.getElementById('f-hero-sub').value = data.hero.sub;
    document.getElementById('f-hero-cta1').value = data.hero.cta1;
    document.getElementById('f-hero-cta2').value = data.hero.cta2;

    renderSlidesEditor();
    renderToolsEditor();
    renderAcademyEditor();
    renderReviewsEditor();
  }

  document.getElementById('saveHero').addEventListener('click', async ()=>{
    data.hero.headline = document.getElementById('f-hero-headline').value.trim();
    data.hero.sub = document.getElementById('f-hero-sub').value.trim();
    data.hero.cta1 = document.getElementById('f-hero-cta1').value.trim();
    data.hero.cta2 = document.getElementById('f-hero-cta2').value.trim();
    await persist();
    renderHero();
    showToast('Hero section saved');
  });

  // -- slides editor --
  function renderSlidesEditor(){
    const list = document.getElementById('slidesEditList');
    list.innerHTML = data.slides.map((s,i) => `
      <div class="admin-item" data-id="${s.id}">
        <button class="admin-item-remove" data-remove="slides" data-id="${s.id}">Remove</button>
        <div class="field-row"><label>Description (alt text)</label><input data-field="title" data-id="${s.id}" data-group="slides" value="${esc(s.title)}" placeholder="Describes the image for screen readers — not shown on the page"></div>
        <div class="field-row"><label>Image URL</label><input data-field="image" data-id="${s.id}" data-group="slides" value="${esc(s.image)}" placeholder="Leave blank for generated art"></div>
      </div>
    `).join('');
    bindEditableFields();
    bindRemoveButtons();
  }
  document.getElementById('addSlide').addEventListener('click', ()=>{
    data.slides.push({id:uid(), title:'New Slide', hue: Math.floor(Math.random()*360), image:''});
    renderSlidesEditor();
  });
  document.getElementById('saveSlides').addEventListener('click', async ()=>{
    await persist(); renderSlideshow(); showToast('Slideshow saved');
  });

  // -- tools editor --
  function renderToolsEditor(){
    const list = document.getElementById('toolsEditList');
    list.innerHTML = data.tools.map(t => `
      <div class="admin-item" data-id="${t.id}">
        <button class="admin-item-remove" data-remove="tools" data-id="${t.id}">Remove</button>
        <div class="field-row"><label>Name</label><input data-field="name" data-id="${t.id}" data-group="tools" value="${esc(t.name)}"></div>
        <div class="field-row"><label>Category</label>
          <select data-field="category" data-id="${t.id}" data-group="tools">
            <option ${t.category==='Expert Advisor'?'selected':''}>Expert Advisor</option>
            <option ${t.category==='Indicator'?'selected':''}>Indicator</option>
            <option ${t.category==='Tool'?'selected':''}>Tool</option>
          </select>
        </div>
        <div class="field-row"><label>Description</label><textarea data-field="description" data-id="${t.id}" data-group="tools">${esc(t.description)}</textarea></div>
        <div class="field-row"><label>Price</label><input data-field="price" data-id="${t.id}" data-group="tools" value="${esc(t.price)}"></div>
        <div class="field-row"><label>Image URL</label><input data-field="image" data-id="${t.id}" data-group="tools" value="${esc(t.image)}" placeholder="Leave blank for generated art"></div>
      </div>
    `).join('');
    bindEditableFields();
    bindRemoveButtons();
  }
  document.getElementById('addTool').addEventListener('click', ()=>{
    data.tools.push({id:uid(), name:'New Tool', category:'Tool', description:'Describe this tool.', price:'$0', hue:Math.floor(Math.random()*360), image:''});
    renderToolsEditor();
  });
  document.getElementById('saveTools').addEventListener('click', async ()=>{
    await persist(); renderTools(); renderHeroStats(); showToast('Tools & EAs saved');
  });

  // -- academy editor --
  function renderAcademyEditor(){
    const list = document.getElementById('academyEditList');
    list.innerHTML = data.academy.map(a => `
      <div class="admin-item" data-id="${a.id}">
        <button class="admin-item-remove" data-remove="academy" data-id="${a.id}">Remove</button>
        <div class="field-row"><label>Title</label><input data-field="title" data-id="${a.id}" data-group="academy" value="${esc(a.title)}"></div>
        <div class="field-row"><label>Description</label><textarea data-field="description" data-id="${a.id}" data-group="academy">${esc(a.description)}</textarea></div>
      </div>
    `).join('');
    bindEditableFields();
    bindRemoveButtons();
  }
  document.getElementById('addAcademy').addEventListener('click', ()=>{
    data.academy.push({id:uid(), title:'New Highlight', description:'Describe this program.'});
    renderAcademyEditor();
  });
  document.getElementById('saveAcademy').addEventListener('click', async ()=>{
    await persist(); renderAcademy(); renderHeroStats(); showToast('Academy section saved');
  });

  // -- reviews editor --
  function renderReviewsEditor(){
    const list = document.getElementById('reviewsEditList');
    list.innerHTML = data.reviews.map(r => `
      <div class="admin-item" data-id="${r.id}">
        <button class="admin-item-remove" data-remove="reviews" data-id="${r.id}">Remove</button>
        <div class="field-row"><label>Name</label><input data-field="name" data-id="${r.id}" data-group="reviews" value="${esc(r.name)}"></div>
        <div class="field-row"><label>Rating (1-5)</label><input type="number" min="1" max="5" data-field="rating" data-id="${r.id}" data-group="reviews" value="${r.rating}"></div>
        <div class="field-row"><label>Review text</label><textarea data-field="text" data-id="${r.id}" data-group="reviews">${esc(r.text)}</textarea></div>
      </div>
    `).join('');
    bindEditableFields();
    bindRemoveButtons();
  }
  document.getElementById('addReview').addEventListener('click', ()=>{
    data.reviews.push({id:uid(), name:'New Trader', rating:5, text:'Add their review here.'});
    renderReviewsEditor();
  });
  document.getElementById('saveReviews').addEventListener('click', async ()=>{
    await persist(); renderReviews(); renderHeroStats(); showToast('Reviews saved');
  });

  // -- shared field/remove binding --
  function bindEditableFields(){
    document.querySelectorAll('[data-field]').forEach(el=>{
      el.oninput = () => {
        const group = el.dataset.group, id = el.dataset.id, field = el.dataset.field;
        const item = data[group].find(x => x.id === id);
        if(!item) return;
        item[field] = field === 'rating' ? Math.max(1, Math.min(5, parseInt(el.value)||5)) : el.value;
      };
    });
  }
  function bindRemoveButtons(){
    document.querySelectorAll('[data-remove]').forEach(btn=>{
      btn.onclick = () => {
        const group = btn.dataset.remove, id = btn.dataset.id;
        data[group] = data[group].filter(x => x.id !== id);
        ({slides:renderSlidesEditor, tools:renderToolsEditor, academy:renderAcademyEditor, reviews:renderReviewsEditor})[group]();
      };
    });
  }

  async function persist(){
    await Store.set(STORAGE_KEY, data);
  }

  // ---------- init ----------
  async function init(){
    const saved = await Store.get(STORAGE_KEY);
    data = saved || JSON.parse(JSON.stringify(DEFAULT_DATA));
    renderAll();
  }
  init();

})();
