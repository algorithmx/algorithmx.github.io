"use strict";
// a good blog https://segmentfault.com/a/1190000019761439
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function main(url_md) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url_md);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdownText = yield response.text();
        const renderer = new marked.Renderer();
        renderer.codeDefault = renderer.code;
        let currentLevel = 0;
        renderer.heading = (text) => {
            let level = Number(text.depth);
            let isTitle = text.raw.includes("===") && !text.raw.includes("#");
            let closingTags = '';
            if (level <= currentLevel) {
                closingTags = '</div></div></details>'.repeat(currentLevel - level + 1);
            }
            currentLevel = level;
            return `${closingTags}<details ${isTitle || level <= 1 ? 'open' : ''}>
            <summary>${text.text}</summary>
            <div class="content">
                <div class="box">`;
        };
        renderer.text = (inp) => {
            const text = inp.raw;
            return text.replace(/\$\$(.*?)\$\$/g, (_, tex) => {
                return katex.renderToString(tex, { displayMode: true });
            }).replace(/\$(.*?)\$/g, (_, tex) => {
                return katex.renderToString(tex, { displayMode: false });
            });
        };
        renderer.code = (inp) => {
            if (inp) {
                if (inp.lang === 'mermaid') {
                    return `<pre class="mermaid">${inp.text}</pre>`;
                }
                else {
                    return renderer.codeDefault(inp);
                }
            }
            else {
                return '';
            }
        };
        const html = marked.parse(markdownText, { renderer: renderer });
        // Close any remaining open tags
        const finalClosingTags = '</div></div></details>'.repeat(currentLevel);
        const contentElement = document.getElementById('content');
        if (contentElement) {
            contentElement.innerHTML = html + finalClosingTags;
        }
    });
}
