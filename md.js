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
function markdownLoadRender(url_md) {
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
            const replacedText = text.replace(/\$\$(.*?)\$\$/g, (_, tex) => {
                return katex.renderToString(tex, { displayMode: true });
            }).replace(/\$(.*?)\$/g, (_, tex) => {
                return katex.renderToString(tex, { displayMode: false });
            });
            if (replacedText === text) {
                // Call the default renderer if no replacements were made
                return marked.Renderer.prototype.text.call(renderer, inp);
            }
            return replacedText;
        };
        renderer.link = (ln) => {
            console.log(ln);
            return `<a href="${ln.href}" target="_blank" rel="noopener noreferrer">${ln.text}</a>`;
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
function displayBlogList() {
    return __awaiter(this, void 0, void 0, function* () {
        const btn = document.getElementById('go-back-button');
        if (btn) {
            btn.innerHTML = '';
            const response = yield fetch('blogList.json');
            const blogList = yield response.json();
            const content = document.getElementById('content');
            if (content) {
                content.innerHTML = '<h2>Blog Posts</h2>';
                const ul = document.createElement('ul');
                ul.style.listStyleType = 'none';
                blogList.forEach((post) => {
                    const li = document.createElement('li');
                    li.className = 'box';
                    li.innerHTML = `<h3 style="color: ${post.color || "lightgreen"}">${post.title}</h3><p style="color: white">${post.summary}</p>`;
                    li.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                        yield renderPost(post.file);
                        mermaid.run({
                            querySelector: '.mermaid'
                        });
                    }));
                    ul.appendChild(li);
                });
                content.appendChild(ul);
            }
        }
    });
}
function renderPost(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const btn = document.getElementById('go-back-button');
        if (btn) {
            btn.innerHTML = '<button onclick="displayBlogList()">Back to List</button>';
        }
        yield markdownLoadRender(filename);
    });
}
