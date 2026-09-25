// Keep the introduction, research, featured papers and patents available without JavaScript.
// Run from any directory: node scripts/render-research.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const content = Object.fromEntries(['profile', 'projects', 'publications', 'patents'].map(name =>
  [name, JSON.parse(read(`content/${name}.json`))]));
const targets = Object.fromEntries(['#top', '#overview', '#details-root', '#patents'].map(id => [id, { innerHTML: '' }]));
const context = vm.createContext({ siteData: content, document: {
  querySelector(selector) {
    if (!targets[selector]) throw new Error(`Unexpected render target: ${selector}`);
    return targets[selector];
  }
} });
const source = read('app.js');
if (!/\ninit\(\);\s*$/.test(source)) throw new Error('App entry point changed; review static rendering.');
vm.runInContext(source.replace(/\ninit\(\);\s*$/, '\n') + '\ndata = siteData; renderHero(); renderOverview(); renderProjects(); renderPatents();', context);
if (!targets['#details-root'].innerHTML.includes('class="research-figure"')) throw new Error('Research figures were not rendered.');
if (!targets['#patents'].innerHTML.includes('class="patent"')) throw new Error('Patent records were not rendered.');

const filename = path.join(root, 'index.html');
const html = read('index.html');
const start = '<div id="details-root">';
const end = '</div><section class="section wrap" id="career">';
const a = html.indexOf(start);
const b = html.indexOf(end, a);
if (a < 0 || b < 0 || html.indexOf(start, a + 1) !== -1) throw new Error('Static research section boundaries changed.');
let output = html.slice(0, a + start.length) + targets['#details-root'].innerHTML + html.slice(b);
const patentStart = '<section class="section wrap" id="patents">';
const patentEnd = '</section><section class="section wrap" id="contact">';
const pa = output.indexOf(patentStart);
const pb = output.indexOf(patentEnd, pa);
if (pa < 0 || pb < 0 || output.indexOf(patentStart, pa + 1) !== -1) throw new Error('Static patent section boundaries changed.');
output = output.slice(0, pa + patentStart.length) + targets['#patents'].innerHTML + output.slice(pb);

for (const [id, classes] of [['top', 'hero wrap'], ['overview', 'section wrap']]) {
  const opening = `<section class="${classes}" id="${id}">`;
  const start = output.indexOf(opening);
  const end = output.indexOf('</section>', start);
  if (start < 0 || end < 0) throw new Error(`Missing static section: ${id}`);
  output = output.slice(0, start + opening.length) + targets[`#${id}`].innerHTML + output.slice(end);
}

// Replace only the featured list; retain the separate complete bibliography fallback.
const featured = vm.runInContext("data.publications.filter(p=>p.featured).sort((a,b)=>a.featuredOrder-b.featuredOrder).map(publicationCard).join('')", context);
const listStart = '<div class="publication-list">';
const listAt = output.indexOf(listStart);
if (listAt < 0) throw new Error('Missing featured publications container.');
const tags = /<\/?div\b[^>]*>/g;
tags.lastIndex = listAt + listStart.length;
let depth = 1, match, listEnd = -1;
while ((match = tags.exec(output))) {
  depth += match[0].startsWith('</') ? -1 : 1;
  if (!depth) { listEnd = match.index; break; }
}
if (listEnd < 0) throw new Error('Featured publications container is not balanced.');
output = output.slice(0, listAt + listStart.length) + featured + output.slice(listEnd);
fs.writeFileSync(filename, output.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, ''));
console.log(`Rendered introduction, ${content.projects.length} research cases, featured papers and ${content.patents.length} patents.`);
