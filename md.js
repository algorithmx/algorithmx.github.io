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
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Lesson learned: the type declaration in Typescript is essentially a type-check helper
 * for the tsc compiler. Writing the type declaration is a kind of building safe-guard
 * for the subsequent developments. It also provides the necessary context to the linter
 * and the copilot to help on the code editing.
 *
 * The project management and the type-declaration are indeed two separate aspects for
 * Typescript development.
 */
function filterMarkdownLines(markdownText) {
    const lines = markdownText.split('\n');
    let secondAppearanceIndex = -1;
    let appearanceCount = 0;
    // Find the index of the line just above the second appearance of "==="
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith("===")) {
            appearanceCount++;
            if (appearanceCount === 2) {
                secondAppearanceIndex = i - 1;
                break;
            }
        }
    }
    // If the second appearance of "===" is found, filter the lines
    if (secondAppearanceIndex !== -1) {
        return lines.slice(secondAppearanceIndex).join('\n');
    }
    return markdownText;
}
function markdownLoadRender(url_md) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url_md);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let markdownText = yield response.text();
        markdownText = filterMarkdownLines(markdownText);
        // Filter images with links starting with "https://"
        markdownText = markdownText.replace(/!\[.*?\]\((https:\/\/.*?)\)/g, (_, url) => {
            return ``;
        });
        markdownText = markdownText.replace(/\[#.*?\]\((https:\/\/.*?)\)/g, (_, url) => {
            return ``;
        });
        markdownText = markdownText.replace(/\[]\((https:\/\/.*?)\)/g, (_, url) => {
            return ``;
        });
        markdownText = markdownText.replace(/(\d)\\(\.)/g, '## $1$2');
        // markdownText = markdownText.replace(/-------(-)+/g, '---');
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
        const contentElement = document.getElementById('post-content');
        const listElement = document.getElementById('post-list');
        if (listElement) {
            listElement.innerHTML = '';
        }
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
            const content = document.getElementById('post-list');
            if (content) {
                content.innerHTML = '';
                blogList.forEach((section, index) => {
                    const sectionContainer = document.createElement('div');
                    sectionContainer.className = 'box';
                    // Create details element for expandable section
                    const details = document.createElement('details');
                    details.open = true; // Initially expanded
                    // Create summary element for the section title
                    const summary = document.createElement('summary');
                    const sectionTitle = document.createElement('h3');
                    sectionTitle.textContent = section.title;
                    summary.appendChild(sectionTitle);
                    // Create container for posts
                    const postsContainer = document.createElement('div');
                    section.posts.forEach((post) => {
                        const postBox = document.createElement('div');
                        postBox.className = 'box';
                        postBox.style.color = post.color || 'rgb(70, 146, 252)';
                        const postContent = document.createElement('a');
                        postContent.style.textDecoration = 'none';
                        postContent.style.color = 'inherit';
                        postContent.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.summary}</p>
                    `;
                        postContent.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                            yield renderPost(post.file);
                            mermaid.run({
                                querySelector: '.mermaid'
                            });
                        }));
                        postBox.appendChild(postContent);
                        postsContainer.appendChild(postBox);
                    });
                    // Assemble the section
                    details.appendChild(summary);
                    details.appendChild(postsContainer);
                    sectionContainer.appendChild(details);
                    content.appendChild(sectionContainer);
                });
            }
            const postContent = document.getElementById('post-content');
            if (postContent) {
                // remove all children
                while (postContent.firstChild) {
                    postContent.removeChild(postContent.firstChild);
                }
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
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex'; // Show the overlay
        }
        yield markdownLoadRender(filename);
        if (overlay) {
            overlay.style.display = 'none'; // Show the overlay
        }
    });
}
