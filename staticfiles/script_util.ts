
interface AjaxResult { success: boolean; status: number|null; statusText: string|null; body: string|null; headers: Map<string, string>|null }

function $(sel: string): HTMLElement|null
{ 
    return document.querySelector<HTMLElement>(sel); 
}

function $_<T extends HTMLElement>(sel: string): T|null
{
    return document.querySelector<T>(sel);
}

function $all(sel: string): HTMLElement[]
{
    return Array.prototype.slice.apply(document.querySelectorAll<HTMLElement>(sel));
}

function $_all<T extends HTMLElement>(sel: string): T[]
{
    return Array.prototype.slice.apply(document.querySelectorAll<T>(sel));
}

function $attr(sel: string, attr: string): string|null
{ 
    return document.querySelector(sel)?.getAttribute(attr) ?? null; 
}

function $ajax(method: string, url: string): Promise<AjaxResult>
{
    return new Promise(resolve =>
    {
        const request = new XMLHttpRequest();
        request.open(method, url, true);

        request.onload  = function()
        {
            let headerMap = new Map<string, string>();
            request.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach(function (line) { const parts = line.split(': '); const header = parts.shift()!; headerMap.set(header.toLowerCase(), parts.join(': ')); });
            resolve({success: true, status: this.status, statusText: this.statusText, body: this.response, headers: headerMap });
        }
        request.onerror  = function()
        {
            resolve({ success: false, status: null, statusText: null, body: null, headers: null });
        }

        request.send();
    });
}

function escapeHtml(text: string): string
{
    if (typeof text !== "string") text = (""+text).toString();
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function(m) { return (map as any)[m] as string; });
}

function formatSeconds(sec: number): string
{
    if (sec <= 60) return sec + 's';

    const omin = Math.floor(sec/60);
    const osec = Math.floor(sec - (omin*60));
    return omin + 'min ' + osec + 's';
}

function formatDate(date: string): string
{
    return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);
}

function formatNumber(num: number|string): string
{
    num = num+'';
    let rex = /(\d+)(\d{3})/;
    while (rex.test(num)) num = num.replace(rex, '$1' + '.' + '$2');
    return num;
}

function shuffle<T>(a: T[], srand: SeedRandom): T[]
{
    for (let i = a.length - 1; i > 0; i--) 
    {
        const j = Math.floor(srand.double() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function sleepAsync(ms: number): Promise<void>
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setImageSource(image: HTMLImageElement, src: string): Promise<boolean>
{
    return new Promise(resolve =>
    {
        let resolved = false;
        image.onload = function () {
            if (resolved) return;
            resolved = true;
            image.onload = null;
            image.onerror = null;
            resolve(true);
        }
        image.onerror = function () {
            if (resolved) return;
            resolved = true;
            image.onload = null;
            image.onerror = null;
            resolve(false);
        }
        image.src = src;
    });
}

function htmlToElement(html: string): HTMLElement
{
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
}


function isElementInViewport(el: HTMLElement): boolean
{
    const rect = el.getBoundingClientRect();

    return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight)
    );
}


