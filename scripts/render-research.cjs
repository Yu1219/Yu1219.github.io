// Keep published research figures and citations available without JavaScript.
// Run from any directory: node scripts/render-research.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const content = Object.fromEntries(['profile', 'projects', 'publications'].map(name =>
  [name, JSON.parse(read(`content/${name}.json`))]));
const target = { innerHTML: '' };
const context = vm.createContext({ siteData: content, document: {
  querySelector(selector) {
    if (selector !== '#details-root') throw new Error(`Unexpected render target: ${selector}`);
    return target;
  }
} });
const source = read('app.js');
if (!/\ninit\(\);\s*$/.test(source)) throw new Error('App entry point changed; review static rendering.');
vm.runInContext(source.replace(/\ninit\(\);\s*$/, '\n') + '\ndata = siteData; renderProjects();', context);
if (!target.innerHTML.includes('class="research-figure"')) throw new Error('Research figures were not rendered.');

const filename = path.join(root, 'index.html');
const html = read('index.html');
const start = '<div id="details-root">';
const end = '</div><section class="section wrap" id="career">';
const a = html.indexOf(start);
const b = html.indexOf(end, a);
if (a < 0 || b < 0 || html.indexOf(start, a + 1) !== -1) throw new Error('Static research section boundaries changed.');
const output = html.slice(0, a + start.length) + target.innerHTML + html.slice(b);
fs.writeFileSync(filename, output);
console.log(`Rendered ${content.projects.length} research cases, including original figures and full citations.`);
