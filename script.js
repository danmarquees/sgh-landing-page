const card = (icon, title, text) => `<article class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:-translate-y-1 transition-transform"><div class="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-4"><i data-lucide="${icon}" class="w-5 h-5"></i></div><h3 class="font-bold text-sm tracking-wide mb-2">${title}</h3><p class="text-slate-600 text-sm leading-relaxed">${text}</p></article>`;
const darkCard = (icon, title, text) => `<article class="bg-white/10 border border-white/20 rounded-xl p-6"><i data-lucide="${icon}" class="w-7 h-7 text-brand-100 mb-5"></i><h3 class="font-bold mb-2">${title}</h3><p class="text-brand-100 text-sm leading-relaxed">${text}</p></article>`;
const step = (number, title, text) => `<article class="border-t-4 border-brand-500 bg-slate-50 rounded-b-xl p-5"><span class="text-brand-600 font-mono text-sm">${number}</span><h3 class="font-bold mt-3 mb-2">${title}</h3><p class="text-slate-600 text-sm leading-relaxed">${text}</p></article>`;
const eventCard = (icon, title) => `<div class="bg-white border border-brand-100 rounded-xl p-5 text-center"><span class="text-2xl">${icon}</span><p class="font-semibold text-sm mt-3">${title}</p></div>`;
const listItem = text => `<li class="flex gap-3 items-start"><span class="text-brand-500">&#10003;</span><span>${text}</span></li>`;
const flow = (title, text) => `<div class="bg-white/10 border border-white/20 rounded-xl p-5 w-full md:w-44"><b>${title}</b><span class="block text-sm text-brand-100 mt-2">${text}</span></div>`;
const arrow = () => `<i data-lucide="arrow-right" class="hidden md:block"></i>`;
const faq = (question, answer) => `<details class="bg-white border border-slate-200 rounded-xl p-5 group"><summary class="flex justify-between gap-4 cursor-pointer font-semibold">${question}<i data-lucide="chevron-down" class="w-5 text-brand-600 group-open:rotate-180 transition-transform"></i></summary><p class="text-slate-600 mt-4 pr-8 leading-relaxed">${answer}</p></details>`;
const input = (label, name, required = false, type = 'text') => `<label class="text-sm text-slate-300">${label}<input ${required ? 'required' : ''} type="${type}" name="${name}" class="mt-2 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-3 text-white" placeholder="${label}"></label>`;

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('section').forEach(element => {
		element.innerHTML = element.innerHTML.replace(/\$\{card\('([^']+)','([^']+)','([^']+)'\)\}/g, (_, icon, title, text) => card(icon, title, text));
		element.innerHTML = element.innerHTML.replace(/\$\{darkCard\('([^']+)','([^']+)','([^']+)'\)\}/g, (_, icon, title, text) => darkCard(icon, title, text));
		element.innerHTML = element.innerHTML.replace(/\$\{step\('([^']+)','([^']+)','([^']+)'\)\}/g, (_, number, title, text) => step(number, title, text));
		element.innerHTML = element.innerHTML.replace(/\$\{eventCard\('([^']+)','([^']+)'\)\}/g, (_, icon, title) => eventCard(icon, title));
		element.innerHTML = element.innerHTML.replace(/\$\{listItem\('([^']+)'\)\}/g, (_, text) => listItem(text));
		element.innerHTML = element.innerHTML.replace(/\$\{flow\('([^']+)','([^']*)'\)\}/g, (_, title, text) => flow(title, text));
		element.innerHTML = element.innerHTML.replaceAll('${arrow()}', arrow());
		element.innerHTML = element.innerHTML.replace(/\$\{faq\('([^']+)','([^']+)'\)\}/g, (_, question, answer) => faq(question, answer));
		element.innerHTML = element.innerHTML.replace(/\$\{input\('([^']+)','([^']+)',(true)? ?(?:,'([^']+)')?\)\}/g, (_, label, name, required, type) => input(label, name, Boolean(required), type || 'text'));
	});

	lucide.createIcons();
	const menuButton = document.getElementById('mobile-menu-btn');
	const menu = document.getElementById('mobile-menu');
	menuButton?.addEventListener('click', () => menu.classList.toggle('hidden'));
	menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.classList.add('hidden')));
	document.getElementById('lead-form')?.addEventListener('submit', event => {
		event.preventDefault();
		document.getElementById('form-message').classList.remove('hidden');
		event.target.reset();
	});
});
