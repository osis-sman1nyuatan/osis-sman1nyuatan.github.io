/* Published content stays editable in the separate owner-only admin panel. */
(()=>{
  const esc=schoolUX.escape,image=schoolUX.image;
  const safeURL=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:''}catch{return ''}};
  const hex=value=>/^#[0-9a-f]{6}$/i.test(value)?value:'#537da5';
  const luminance=value=>{const rgb=hex(value).slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
  // Black/white selection keeps small button and navigation labels above 4.5:1.
  const inkFor=value=>luminance(value)>.179?'#000000':'#ffffff';
  const rows=(arr,fn,empty)=>arr.length?arr.map(fn).join(''):`<div class="empty">${empty}</div>`;
  const photo=(value,alt)=>image(value)?`<img class="content-photo" src="${image(value)}" alt="${esc(alt)}" width="640" height="420" loading="lazy">`:'';
  let cfg,previewReceived=false;
  function apply(d){
    cfg=d;const t=d.theme||{},root=document.documentElement;
    root.style.setProperty('--green',hex(t.primary));root.style.setProperty('--paper',hex(t.background));root.style.setProperty('--banner',hex(t.banner));root.style.setProperty('--header',hex(t.header));root.style.setProperty('--button-ink',inkFor(t.primary));root.style.setProperty('--header-ink',inkFor(t.header));root.style.setProperty('--radius',`${Math.max(0,Math.min(24,+t.radius||0))}px`);
    document.body.style.fontFamily=`${['Arial','Verdana','Georgia'].includes(t.font)?t.font:'Arial'},sans-serif`;
    articles.splice(0,articles.length,...d.news.map(a=>[esc(a.title),esc(a.category),'Informasi',esc(a.summary),esc(a.body).replace(/\n/g,'<br>')]));
    programs.splice(0,programs.length,...d.programs.map(a=>[esc(a.title),esc(a.category),esc(a.summary),esc(a.body)]));
    divisions.splice(0,divisions.length,...d.divisions.map(a=>[esc(a.title),esc(a.summary),a.tasks.split('\n').filter(Boolean).map(esc)]));
    schoolUX.galleryItems=d.gallery;
    pages.agenda=()=>head('Catat tanggalnya','Agenda Kegiatan','Jadwal kegiatan yang sudah diterbitkan oleh pengurus.')+rows(d.agenda,a=>`<section class="panel" style="margin-bottom:18px"><span class="tag">${esc(a.date)} · ${esc(a.location)}</span><h2>${esc(a.title)}</h2><p>${esc(a.body)}</p></section>`,'Belum ada agenda resmi yang diterbitkan.');
    pages.galeri=()=>head('Album sekolah','Biar fotonya<br>yang cerita.','Potongan kegiatan, karya, dan hari-hari kita di SMAN 1 Nyuatan. Klik foto untuk melihat lebih dekat.')+schoolUX.gallery(d.gallery);
    pages.pengurus=()=>head('Kenalan dengan pengurus','Struktur Pengurus','Susunan kepengurusan OSIS SMAN 1 Nyuatan.')+`<div class="cards">${rows(d.people,a=>`<article class="card">${photo(a.image,a.name)}<div class="card-body"><span class="tag">${esc(a.role)}</span><h3>${esc(a.name)}</h3><p>${esc(a.body)}</p></div></article>`,'Daftar pengurus belum diterbitkan.')}</div>`;
    pages.kontak=()=>head('Tetap terhubung','Kontak OSIS','Kanal komunikasi yang diterbitkan oleh pengurus.')+`<section class="panel"><h2>SMAN 1 Nyuatan</h2><p>${esc(d.contact.address)}</p>${d.contact.email?`<p>Email: ${esc(d.contact.email)}</p>`:''}${d.contact.phone?`<p>Telepon: ${esc(d.contact.phone)}</p>`:''}${safeURL(d.contact.instagram)?`<a class="text-link" href="${esc(safeURL(d.contact.instagram))}" target="_blank" rel="noopener">Buka media sosial OSIS</a>`:''}</section>`;
    pages.profil=()=>head('Tentang pengurus','Profil & Visi Misi','Kenali arah kerja OSIS SMAN 1 Nyuatan.')+`<div class="grid2"><section class="panel"><h2>Visi</h2><p>${esc(d.profile.vision)}</p></section><section class="panel"><h2>Misi</h2><ol>${d.profile.missions.split('\n').filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section></div>`;
    pages.dokumen=()=>head('Arsip & laporan','Dokumen OSIS','Berkas yang telah diterbitkan oleh pengurus untuk dibaca bersama.')+rows(d.documents,a=>`<section class="panel" style="margin-bottom:16px"><h2>${esc(a.title)}</h2><p>${esc(a.body)}</p>${safeURL(a.url)?`<a class="btn" href="${esc(safeURL(a.url))}" target="_blank" rel="noopener">Buka dokumen</a>`:'<span class="small">Tautan belum tersedia</span>'}</section>`,'Belum ada dokumen yang diterbitkan.');
    // Content arriving late must not replace a message the student is typing.
    if(!(location.hash==='#aspirasi'&&document.querySelector('.aspiration-paper')))render();
    decorate();
  }
  function decorate(){
    if(!cfg)return;const d=cfg;
    if(image(d.home.logo))document.querySelectorAll('.logo').forEach(el=>{el.innerHTML=`<img src="${image(d.home.logo)}" width="130" height="130" alt="Logo sekolah" style="position:static;width:100%;height:100%;object-fit:contain">`;el.style.background='transparent'});
    // Missing field uses the supplied first logo; an explicit empty value hides it.
    const osisLogo=Object.prototype.hasOwnProperty.call(d.home,'osisLogo')
      ? (d.home.osisLogo==='/osis-logo.png'?'./osis-logo.png':image(d.home.osisLogo))
      : './osis-logo.png';
    document.querySelectorAll('header .brand, .school-identity').forEach(area=>{
      const school=area.querySelector('.logo');if(!school)return;
      let logo=area.querySelector('img.osis-logo');
      if(!osisLogo){area.querySelectorAll('.osis-logo').forEach(el=>el.remove());return}
      let group=school.closest('.identity-logos');
      if(!group){group=document.createElement('span');group.className='identity-logos';school.before(group);group.append(school)}
      if(!logo){area.querySelectorAll('.osis-logo').forEach(el=>el.remove());logo=document.createElement('img');logo.className='osis-logo';group.append(logo)}
      logo.src=osisLogo;logo.alt='Logo OSIS';logo.width=44;logo.height=52;
    });
    if((location.hash||'#beranda')!=='#beranda')return;
    const banner=document.querySelector('.school-banner');if(!banner)return;
    // Migrate only the old stock hero on display; an owner's custom text wins.
    const oldTitle=!d.home.title||/^OSIS SMAN 1 Nyuatan$/i.test(d.home.title.trim());
    const oldSubtitle=!d.home.subtitle||/Transparan dan komunikatif/i.test(d.home.subtitle);
    banner.querySelector('h1').textContent=oldTitle?schoolUX.hero.title:d.home.title;
    banner.querySelector('.hero-copy>p').textContent=oldSubtitle?schoolUX.hero.subtitle:d.home.subtitle;
    if(image(d.home.banner)){banner.style.backgroundImage=`linear-gradient(90deg,rgba(235,243,250,.96),rgba(235,243,250,.91)),url("${image(d.home.banner)}")`;banner.style.backgroundSize='cover';banner.style.backgroundPosition='center'}
    const intro=document.querySelector('.intro-block');intro.querySelector('h2').textContent=d.home.introTitle;intro.querySelector('p').textContent=d.home.intro;
    const nodes={shortcuts:document.querySelector('.shortcuts'),intro,news:document.querySelector('.news-section'),agenda:document.querySelector('.home-columns'),gallery:document.querySelector('.gallery-section')};
    nodes.agenda.querySelector('.empty').outerHTML=rows(d.agenda.slice(0,3),a=>`<div class="line-item"><span class="tag">${esc(a.date)}</span><h3>${esc(a.title)}</h3><p>${esc(a.location)}</p></div>`,'Belum ada agenda resmi yang diterbitkan.');
    nodes.gallery.querySelector('.empty').outerHTML=schoolUX.gallery(d.gallery,5);
    for(const [i,a]of d.news.slice(0,3).entries()){const cover=nodes.news.querySelectorAll('.cover')[i];if(cover&&image(a.image)){cover.style.padding='0';cover.innerHTML=photo(a.image,a.title)}}
    for(const key of d.order){if(nodes[key]){nodes[key].hidden=d.hidden.includes(key);document.querySelector('main').append(nodes[key])}}
  }
  window.addEventListener('hashchange',()=>setTimeout(decorate,0));
  window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='osis-preview'&&window.parent!==window){previewReceived=true;apply(e.data.content);if(!document.getElementById('preview-label')){const b=document.createElement('div');b.id='preview-label';b.textContent='Pratinjau draf, belum diterbitkan';b.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#173852;color:white;padding:10px;text-align:center;z-index:99;font-size:12px';document.body.append(b)}}});
  const api=location.hostname.endsWith('github.io')?'https://osis-sman-1-nyuatan.prasetyaaldo72.chatgpt.site':'';
  const state=document.createElement('p');state.className='cms-status';state.setAttribute('role','status');state.textContent='Memuat kabar terbaru dari pengurus…';document.querySelector('main').before(state);
  Promise.all([fetch('./defaults.json').then(r=>{if(!r.ok)throw Error();return r.json()}),fetch(api+'/api/content').then(r=>{if(!r.ok)throw Error();return r.json()}).catch(()=>null)]).then(([defaults,published])=>{if(!previewReceived)apply(published||defaults);if(!published&&!previewReceived){state.textContent='Konten terbaru belum bisa dimuat. Menampilkan versi bawaan.';const retry=document.createElement('button');retry.textContent='Coba muat ulang';retry.onclick=()=>location.reload();state.append(' ',retry)}else state.remove()}).catch(()=>{state.textContent='Konten terbaru belum bisa dimuat. Coba muat ulang halaman.'});
})();
