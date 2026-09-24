const $ = (s,root=document)=>root.querySelector(s);
const escape = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url,label,cls='') => /^https?:\/\//.test(url)?`<a class="${cls}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`:'';
const heading=(num,label,title,description)=>`<div class="section-heading"><p class="eyebrow">${num} / ${label}</p><h2>${title}</h2><p>${description}</p></div>`;
const topicNames={design:'RNA & LNP',target:'Targeted delivery',modulate:'Immune & cell engineering'};
let data,mode='featured',filter='all';
const person = s => escape(s).replace(/Sakurai Y|Yu SAKURAI|Yu Sakurai|遊 櫻井/g,'<strong>$&</strong>');
function illustration(type){
 const label=(x,y,first,second)=>`<text x="${x}" y="${y}" text-anchor="middle"><tspan x="${x}">${escape(first)}</tspan><tspan x="${x}" dy="24">${escape(second)}</tspan></text>`;
 const start=`<svg class="schematic" viewBox="0 0 360 190" role="img" aria-label="${escape({design:'Conceptual sequence from RNA cargo to encapsulation and delivery.',target:'A lipid carrier connects to lymphatic, brain capillary and tumor endothelial targets studied in separate projects.',modulate:'Conceptual sequence from RNA delivery to gene expression and altered cell function.'}[type])}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arrow-${type}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="currentColor"/></marker></defs><g transform="translate(0,${type==='target'?0:-6})" fill="none" stroke="currentColor" stroke-width="1.4">`;
 let body='';
 if(type==='design')body=`<path d="M14 90q10-35 20 0t20 0t20 0"/><path d="M88 88h35" marker-end="url(#arrow-design)"/><path d="M237 88h34" marker-end="url(#arrow-design)"/><circle cx="180" cy="88" r="40"/><circle cx="180" cy="88" r="32" stroke-dasharray="3 5"/><path d="M160 88q10-28 20 0t20 0"/><rect x="287" y="48" width="57" height="79" rx="23"/><path d="M299 91q8-22 16 0t16 0"/></g><g class="svg-label">${label(44,160,'RNA','cargo')}${label(180,160,'Lipid','carrier')}${label(316,160,'Cell','delivery')}</g>`;
 if(type==='target')body=`<circle cx="53" cy="93" r="28"/><circle cx="53" cy="93" r="20" stroke-dasharray="2 5"/><path d="M81 93h32M113 33v120"/><path d="M113 33h40" marker-end="url(#arrow-target)"/><path d="M113 93h40" marker-end="url(#arrow-target)"/><path d="M113 153h40" marker-end="url(#arrow-target)"/><rect x="161" y="7" width="184" height="52" rx="6"/><rect x="161" y="67" width="184" height="52" rx="6"/><rect x="161" y="127" width="184" height="52" rx="6"/></g><g class="svg-label"><text x="53" y="149" text-anchor="middle">Carrier</text>${label(253,26,'Lymphatic','endothelium')}${label(253,86,'Brain capillary','endothelium')}${label(253,146,'Tumor','endothelium')}</g>`;
 if(type==='modulate')body=`<circle cx="39" cy="88" r="23"/><path d="M26 89q7-20 14 0t14 0"/><path d="M73 88h36" marker-end="url(#arrow-modulate)"/><path d="M241 88h29" marker-end="url(#arrow-modulate)"/><rect x="125" y="37" width="103" height="98" rx="44"/><path d="M145 78q8-23 16 0t16 0"/><path d="M177 88v16h23" marker-end="url(#arrow-modulate)"/><circle cx="200" cy="109" r="7"/><circle cx="315" cy="88" r="32"/><path d="M304 78v20m-10-10h20M338 76l8-7m-5 19h10m-13 12 8 7"/></g><g class="svg-label">${label(44,160,'RNA','delivery')}${label(177,160,'Gene','expression')}${label(315,160,'Cell','function')}</g>`;
 return start+body+'</svg>';
}
function paperLinks(ids){return ids.map(id=>{const p=data.publications.find(p=>p.id===id);return p?`<a class="evidence-link" href="${escape(p.pubmedUrl||p.publisherUrl||('https://doi.org/'+p.doi))}" data-paper="${p.id}"><span>${p.year??'In press'}</span>${escape(p.title)} <span aria-hidden="true">↘</span></a>`:''}).join('')}
function selectTheme(id,move=false){
 const t=data.themes.find(t=>t.id===id);if(!t)return;
 document.querySelectorAll('[data-theme]').forEach(b=>{const active=b.dataset.theme===id;b.setAttribute('aria-expanded',active);b.closest('.theme-card').classList.toggle('active',active)});
 $('#theme-detail').innerHTML=`<div><p class="eyebrow">${t.number} / ${t.verb}</p><h3 id="theme-detail-title">${escape(t.title)}</h3><p>${escape(t.summary)}</p><div class="tags">${t.techniques.map(s=>`<span>${escape(s)}</span>`).join('')}</div>${t.note?`<p class="context-note">${escape(t.note)}</p>`:""}</div><div><p class="detail-label">RELATED PUBLICATIONS</p>${paperLinks(t.publications)}<div class="related-patents"><p class="detail-label">RELATED PATENT RECORDS</p>${t.patents.filter(id=>data.patents.some(p=>p.id===id)).map(id=>{const p=data.patents.find(p=>p.id===id);return `<a href="#patent-${id}" data-patent="${id}">${escape(p.shortTitle)} <span>↘</span></a>`}).join('')}</div><a class="theme-return" href="#research">All research directions <span aria-hidden="true">↑</span></a></div>`;
 const panel=$('#theme-detail');
 panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','theme-detail-title');panel.setAttribute('tabindex','-1');panel.removeAttribute('aria-live');
 if(move){panel.focus({preventScroll:true});panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
}
function renderThemes(){
 $('.theme-grid').innerHTML=data.themes.map(t=>`<article class="theme-card" id="research-${t.id}"><span class="theme-number">${t.number} / ${t.verb}</span><h3>${escape(t.title)}</h3><p>${escape(t.short)}</p>${illustration(t.diagram)}<div class="schematic-caption">Conceptual schematic</div><button class="theme-button" data-theme="${t.id}" aria-expanded="false" aria-controls="theme-detail">Explore this direction <span aria-hidden="true">↘</span></button></article>`).join('');
 if(!$('#theme-detail'))$('.quant-strip').insertAdjacentHTML('afterend','<div id="theme-detail" class="theme-detail" aria-live="polite"></div>');
 selectTheme('target');
}
function renderOverview(){
 $('#overview').innerHTML=heading('01','WHAT I BRING','Targeting strategy.<br>Development decisions.',escape(data.profile.overview)+' <a class="overview-map-link" href="#research">View the research map <span aria-hidden="true">↘</span></a>')+`
 <div class="value-grid">${data.profile.valuePillars.map((s,i)=>`<article><p class="detail-label">0${i+1} / ${escape(s.label)}</p><h3>${escape(s.title)}</h3><p>${escape(s.text)}</p><a href="#${escape(s.anchor)}">${escape(s.evidence)} <span aria-hidden="true">↘</span></a></article>`).join('')}</div>
 <p class="overview-context">Academic RNA-delivery research and pharmaceutical R&D in Japan and Germany. <a href="#career">Experience & responsibilities <span aria-hidden="true">→</span></a></p>`;
}
function renderIndustry(){
 $('#industry').innerHTML=heading('02','PHARMACEUTICAL R&D','Contributions in<br>drug development.','Selected contributions from my pharmaceutical R&D roles.')+`<div class="industry-grid">${data.profile.industryContributions.map(c=>`<article class="industry-case" id="industry-${escape(c.id)}"><p class="detail-label">${escape(c.label)}</p><h3>${escape(c.title)}</h3><p>${escape(c.contribution)}</p><div class="industry-result"><p class="detail-label">${escape(c.resultLabel)}</p><p>${escape(c.result)}</p></div></article>`).join('')}</div>`;
}
function directEvidence(ids){
 return ids.map(id=>{const p=data.publications.find(p=>p.id===id);if(!p)return '';const journal=p.journal.split('.')[0];return link(p.pubmedUrl||p.publisherUrl,escape(journal)+' · '+escape(p.year)+' · '+(p.pubmedUrl?'PubMed':'Publisher'),'direct-evidence')}).join('');
}
function renderProjects(){
 $('#details-root').innerHTML=`<section class="section wrap" id="projects">${heading('03','SELECTED RESEARCH','Unconventional ideas.<br>Experimental evidence.',escape(data.profile.workingApproach))}
 <div class="projects">${data.projects.map((p,i)=>`<article class="case-study" id="case-${p.id}">
 <div class="case-heading"><span class="project-index">0${i+1}</span><div><p class="detail-label">${escape(p.subtitle)}</p><h3>${escape(p.title)}</h3></div></div>
 ${p.evidenceFlow?`<ol class="evidence-flow" aria-label="From a targeting hypothesis to experimental evidence">${p.evidenceFlow.map(s=>`<li><span class="detail-label">${escape(s.label)}</span><h4>${escape(s.title)}</h4><p>${escape(s.text)}</p></li>`).join('')}</ol>`:`<div class="case-brief"><div><h4>The different idea</h4><p>${escape(p.idea)}</p></div><div><h4>Experimental result</h4><p>${escape(p.outcome)}</p></div></div>`}
 <p class="case-role"><span>MY CONTRIBUTION</span>${escape(p.contribution)}</p>
 <p class="case-value"><span>VALUE FOR R&D</span>${escape(p.teamValue)}</p>
 <div class="case-evidence" aria-label="Published evidence">${directEvidence([p.publications[0]])}${p.relatedPatent?`<a class="case-patent-link" href="#patent-${escape(p.relatedPatent)}" data-patent="${escape(p.relatedPatent)}">${escape(p.patentLinkLabel)} <span aria-hidden="true">↘</span></a>`:''}</div>
 <details class="project"><summary><span>Approach & supporting studies</span><span class="expand" aria-hidden="true">+</span></summary><div class="project-content">
 <div class="project-fields">${[['challenge','The problem'],['approach','How the study tested it'],['relevance','Research approach']].map(([k,label])=>`<div><h4>${label}</h4><p>${escape(p[k])}</p></div>`).join('')}${p.quantitativeEvidence?`<div><h4>Measured result & comparison</h4><p>${escape(p.quantitativeEvidence)}</p>${link(p.sources[p.sources.length-1],'Read the full study','text-link')}</div>`:''}${p.relatedInsight?`<div><h4>Another targeting approach</h4><p>${escape(p.relatedInsight)}</p></div>`:''}</div>
 <div class="tags">${p.techniques.map(s=>`<span>${escape(s)}</span>`).join('')}</div><p class="detail-label">SUPPORTING PUBLICATIONS</p>${paperLinks(p.publications)}${p.contributionSource?`<p class="author-perspective">${link(p.contributionSource,'My account of the research · 2022 award review','text-link')}</p>`:''}<p class="source-note">Academic research in preclinical models.</p></div></details>
 </article>`).join('')}</div></section>`;
}
function renderPublications(){
 const root=$('#publications');
 root.innerHTML=heading('07','PUBLICATIONS','The published work.','Selected evidence for delivery mechanisms, formulation design and biological function. Browse all listed publications below.')+`<div class="publication-controls"><div class="view-switch" role="group" aria-label="Publication view"><button data-mode="featured" aria-pressed="true">Featured</button><button data-mode="all" aria-pressed="false">All publications (${data.publications.length})</button></div><div class="filters" role="group" aria-label="Filter publications by research topic"><button data-filter="all" aria-pressed="true">All topics</button><button data-filter="design" aria-pressed="false">RNA & LNP</button><button data-filter="target" aria-pressed="false">Targeted delivery</button><button data-filter="modulate" aria-pressed="false">Immune & cell</button><button data-filter="reviews" aria-pressed="false">Reviews</button></div></div><p class="results-count" aria-live="polite"></p><div class="publication-list"></div><p class="source-note">${data.publications.filter(p=>p.type==='Original paper').length} original papers and ${data.publications.filter(p=>p.type==='Review').length} reviews in the bibliography dated ${displayDate(data.profile.publicationSourceDate)}. Bibliographic details checked on ${displayDate(data.profile.publicationsVerifiedOn)}: ${data.publications.filter(p=>p.verification?.source==='PubMed').length} PubMed records and ${data.publications.filter(p=>p.verification?.source==='Publisher').length} publisher record. Online dates and journal dates are shown separately where available; year labels follow the journal citation. Earlier bibliography entries remain available in the publication details. Topic groupings are editorial.</p>`;
 updatePubs();
}
function displayDate(iso){return iso?escape(new Date(iso+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})):''}
function dateMarkup(date){return date?.iso?`<time datetime="${escape(date.iso)}">${escape(date.display)}</time>`:escape(date?.display)}
function publicationCard(p){
 const primaryDate=p.onlineDate||p.publicationDate;
 const dateLabel=p.onlineDate?'Published online':'Publication date';
 const dates=primaryDate?`<p class="pub-date">${dateLabel} ${dateMarkup(primaryDate)}</p>`:'';
 const verification=p.verification?`<p class="verification-note">Bibliographic source: ${escape(p.verification.source)} · Checked ${displayDate(p.verification.checkedOn)}</p>`:'';
 const journalDate=p.publicationDate?`<p>Journal citation date: ${dateMarkup(p.publicationDate)}</p>`:'';
 const titleNote=p.id==='p040'?'<p class="verification-note">The title and citation above follow the indexed publication record.</p>':'';
 const evidence=p.verifiedCitation?`<p>${escape(p.journal)}</p>${journalDate}${verification}${titleNote}<details class="original-citation"><summary>Original bibliography entry</summary><p>${escape(p.sourceCitation)}</p></details>`:`<p>${escape(p.sourceCitation)}</p>`;
 const actions=p.pubmedUrl?link(p.pubmedUrl,'PubMed','paper-out'):p.publisherUrl?link(p.publisherUrl,'Publisher','paper-out'):link('https://pubmed.ncbi.nlm.nih.gov/?term='+encodeURIComponent('"'+p.title+'"'),'Find paper','paper-out');
 return `<article class="publication" id="pub-${p.id}"><div class="pub-year">${p.year??'In press'}<span>${escape(p.type)}</span></div><div class="pub-content"><p class="pub-journal">${escape(p.journal)}</p><h3>${escape(p.title)}</h3>${dates}<p class="pub-topics">${p.topics.map(t=>topicNames[t]).join(' / ')}</p><details class="authors"><summary>Authors & publication details</summary><p>${person(p.authors)}</p>${p.authorshipNote?`<p>${escape(p.authorshipNote)} ${link(p.authorshipSource,'Authorship source')}</p>`:''}${evidence}</details></div><div class="paper-links">${actions}${p.doi?link('https://doi.org/'+p.doi,'DOI','paper-out'):''}</div></article>`;
}
function updatePubs(){
 const records=data.publications.filter(p=>(mode==='all'||p.featured)&&(filter==='all'||(filter==='reviews'?p.type==='Review':p.topics.includes(filter))));
 if(mode==='featured')records.sort((a,b)=>(a.featuredOrder??999)-(b.featuredOrder??999));
 $('[data-mode="featured"]').setAttribute('aria-pressed',mode==='featured');$('[data-mode="all"]').setAttribute('aria-pressed',mode==='all');
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===filter));
 $('.results-count').textContent=`${records.length} ${records.length===1?'publication':'publications'} · ${mode==='featured'?'selected papers':'all listed publications'}`;
 $('.publication-list').innerHTML=records.map(publicationCard).join('')||'<p class="empty-state">No publications in this selection. Choose another topic or view all publications.</p>';
}
function renderPatents(){
 $('#patents').innerHTML=heading('08','INTELLECTUAL PROPERTY','Ideas that lead<br>to inventions.','Selected public patent records spanning lipid chemistry, formulation and tissue-selective delivery.')+`<div class="patents-grid">${data.patents.map(p=>`<details class="patent" id="patent-${p.id}"><summary><span class="patent-id">${p.id} <span>${p.year}</span></span><h3>${escape(p.shortTitle)}</h3><span class="patent-type">${escape(p.recordType)}</span><span class="patent-expand">View record +</span></summary><div class="patent-details"><h4>Publication title</h4><p>${escape(p.title)}</p><h4>Inventors</h4><p>${p.inventors.map(person).join(' · ')}</p><h4>Applicants listed in the record</h4><p>${p.applicants.map(escape).join(' · ')}</p><p class="detail-label">Published ${escape(p.publicationDate)}</p>${link(p.url,'Open patent record','text-link')}</div></details>`).join('')}</div><p class="source-note">${data.patents.length} selected publication records verified on 24 September 2026. Publication types are shown; this is not a statement of current legal status or a complete patent-family count.</p>`;
}
function renderCareer(){
 $('#career').innerHTML=heading('04','EXPERIENCE','From academic research<br>to pharmaceutical R&D.','Roles and responsibilities across Japan and Germany.')+`<div class="career-layout"><div class="timeline">${data.career.map((s,i)=>`<details ${i===0?'open':''}><summary><span class="career-date">${escape(s.date)}</span><div><p>${escape(s.location)}</p><h3>${escape(s.organization)}</h3><span>${escape(s.role)}</span></div><span class="expand" aria-hidden="true">+</span></summary><div class="career-detail"><p>${escape(s.summary)}</p>${s.responsibilities?`<ul class="career-responsibilities">${s.responsibilities.map(r=>`<li>${escape(r)}</li>`).join('')}</ul>`:''}<div class="tags">${s.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div></div></details>`).join('')}</div><div class="research-record">${data.profile.researchRecord.map(r=>`<article${r.id?` id="${escape(r.id)}"`:""}><p class="detail-label">${escape(r.label)}</p><h3>${escape(r.title)}</h3><p>${escape(r.text)}</p>${link(r.url,escape(r.linkLabel),'text-link')}</article>`).join('')}</div></div><div class="academic-responsibilities"><h3>Academic methods<br>& mentoring</h3><ul>${data.profile.academicResponsibilities.map(r=>`<li><strong>${escape(r.title)}</strong><p>${escape(r.text)}${r.publication?` <a class="skill-evidence" href="${escape(data.publications.find(p=>p.id===r.publication).pubmedUrl)}" data-paper="${escape(r.publication)}">Published example <span aria-hidden="true">↘</span></a>`:''}</p></li>`).join('')}</ul></div><p class="education">Ph.D. in Pharmaceutical Sciences · Hokkaido University<br>Licensed Pharmacist · March 2008</p>`;
 $('#expertise').innerHTML=heading('06','EXPERIMENTS & DATA','Formulation science.<br>Hands-on computation.','I write code for proteomics and RNA-seq analyses, connecting complex biological datasets with experimental questions.')+`<div class="method-example">${data.profile.methodExamples.map(m=>`<article class="method-study"><p class="detail-label">${escape(m.label)}</p><h3>${escape(m.title).replace(/\n/g,'<br>')}</h3><p>${escape(m.text)}</p><p class="method-role"><span>MY CONTRIBUTION</span>${escape(m.contribution)}</p>${paperLinks([m.publication])}</article>`).join('')}</div><div class="expertise-grid">${data.skills.map(s=>`<div><h3>${escape(s.category)}</h3><ul>${s.items.map(t=>`<li>${skillItem(t)}</li>`).join('')}</ul></div>`).join('')}</div>`;
 const email=data.profile.email;
 const emailLink=email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?`<a class="button primary" href="mailto:${escape(email)}">Email Yu <span aria-hidden="true">↗</span></a>`:'';
 $('#contact').innerHTML=`<div class="closing"><div><p class="eyebrow">CONTACT</p><h2>Let's discuss<br>targeted delivery.</h2></div><div><p>${escape(data.profile.contactScope)}</p><p class="contact-prompt">Share the delivery challenge, the scientific scope of the role and the team context.</p><div class="hero-actions">${emailLink}${data.profile.links.filter(l=>l.label==='LinkedIn').map(l=>link(l.url,escape(l.label),'text-link')).join('')}</div>${email?`<p class="contact-email">${escape(email)}</p>`:''}<div class="profile-actions"><a class="text-link" href="${escape(data.profile.cv)}" download="Yu_Sakurai_CV.pdf">Download CV</a>${data.profile.links.filter(l=>l.label!=='LinkedIn').map(l=>link(l.url,escape(l.label),'text-link')).join('')}</div></div></div>`;
}
function skillItem(item){
 if(typeof item==='string')return escape(item);
 const p=data.publications.find(p=>p.id===item.publication);
 if(!p)return escape(item.label);
 return `<a class="skill-evidence" href="${escape(p.pubmedUrl||p.publisherUrl||('https://doi.org/'+p.doi))}" data-paper="${p.id}">${escape(item.label)} <span aria-hidden="true">↘</span></a>`;
}
function showPaper(id,focus=false){
 if(!data.publications.some(p=>p.id===id))return;
 mode='all';filter='all';updatePubs();const el=document.getElementById('pub-'+id);if(!el)return;
 el.classList.add('highlight');el.setAttribute('tabindex','-1');if(focus)el.focus({preventScroll:true});
 requestAnimationFrame(()=>el.scrollIntoView({block:'center'}));
}
function restoreAnchor(){
 const id=location.hash.slice(1);if(!id)return;
 if(id.startsWith('research-')){
  const themeId=id.slice('research-'.length);
  if(data.themes.some(t=>t.id===themeId)){
   selectTheme(themeId);
   requestAnimationFrame(()=>$('#theme-detail').scrollIntoView({block:'start'}));
   return;
  }
 }
 if(id.startsWith('pub-')){showPaper(id.slice(4));return;}
 const el=document.getElementById(id);if(!el)return;
 if(id.startsWith('patent-'))el.open=true;
 requestAnimationFrame(()=>el.scrollIntoView({block:'start'}));
}
function fitNavigation(){
 const header=$('.header');
 const sync=()=>{
  const height=header.getBoundingClientRect().height;
  const inFlow=height>window.innerHeight/3;
  header.classList.toggle('header-in-flow',inFlow);
  document.documentElement.style.setProperty('--header-clearance',inFlow?'0px':Math.ceil(height)+'px');
 };
 sync();window.addEventListener('resize',sync,{passive:true});
 if('ResizeObserver' in window)new ResizeObserver(sync).observe(header);
}
async function init(){
 try{
 const names=['profile','themes','projects','publications','patents','career','skills'];
 const vals=await Promise.all(names.map(async n=>{const r=await fetch(`content/${n}.json`);if(!r.ok)throw Error(n);return r.json()}));
 data=Object.fromEntries(names.map((n,i)=>[n,vals[i]]));
 $('.focus-strip a[href="#publications"] strong').textContent=`${data.publications.filter(p=>p.type==='Original paper').length} original papers · ${data.publications.filter(p=>p.type==='Review').length} reviews`;
 $('.hero-description').textContent=data.profile.positioning;
 $('.hero-role').textContent=`${data.profile.position} · ${data.profile.organization} · ${data.profile.location}`;
 renderOverview();renderIndustry();renderThemes();renderProjects();renderPublications();renderPatents();renderCareer();
 document.addEventListener('click',e=>{
 const th=e.target.closest('[data-theme]');if(th){const hash='#research-'+th.dataset.theme;if(location.hash!==hash)history.pushState(null,'',hash);selectTheme(th.dataset.theme,true)}
 const view=e.target.closest('[data-mode]');if(view){mode=view.dataset.mode;filter='all';updatePubs()}
 const f=e.target.closest('[data-filter]');if(f){filter=f.dataset.filter;mode='all';updatePubs()}
 const p=e.target.closest('[data-paper]');if(p&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();history.pushState(null,'','#pub-'+p.dataset.paper);showPaper(p.dataset.paper,true)}
 const pat=e.target.closest('[data-patent]');if(pat){const el=$('#patent-'+pat.dataset.patent);el.open=true}
 });
 document.documentElement.dataset.ready='true';
 fitNavigation();
 restoreAnchor();window.addEventListener('hashchange',restoreAnchor);
 }catch(err){const root=$('#details-root');if(!root.querySelector('.case-study'))root.innerHTML='<div class="wrap load-error" role="alert">The research content could not be loaded. <a href="cv/CV.pdf">Download the CV</a> or <a href="mailto:serendipity100111@gmail.com">contact Yu</a>.</div>';console.error(err)}
}
init();
