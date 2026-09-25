// Keep research figures, citations and patent records available without JavaScript.
// Run from any directory: node scripts/render-research.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const content = Object.fromEntries(['profile', 'projects', 'publications', 'patents'].map(name =>
  [name, JSON.parse(read(`content/${name}.json`))]));
const targets = { '#details-root': { innerHTML: '' }, '#patents': { innerHTML: '' } };
const context = vm.createContext({ siteData: content, document: {
  querySelector(selector) {
    if (!targets[selector]) throw new Error(`Unexpected render target: ${selector}`);
    return targets[selector];
  }
} });
const source = read('app.js');
if (!/\ninit\(\);\s*$/.test(source)) throw new Error('App entry point changed; review static rendering.');
vm.runInContext(source.replace(/\ninit\(\);\s*$/, '\n') + '\ndata = siteData; renderProjects(); renderPatents();', context);
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
fs.writeFileSync(filename, output.replace(/\r\n/g, '\n'));
console.log(`Rendered ${content.projects.length} research cases and ${content.patents.length} patent titles and publication numbers.`);
