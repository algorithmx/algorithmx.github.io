// a good blog https://segmentfault.com/a/1190000019761439

/*
 * Below is a malpractice of Typescript I deliberately write for practice. 
 * The goal is to experiment on a minimal effort to work with the tsc Typescript 
 * compiler but not installing any libraries using npm. Being able to work this way,
 * I am capable of delivering safe code on top of the shit mountain Javascript codebase, 
 * at the same time without irritating the owner of the mountain by the alien Typescript. 
 * Life would be easy for both of us. Peace & Love !
 */

declare const mermaid: any;

declare const katex: {
    renderToString(tex: string, options: { displayMode: boolean }): string;
};

type Renderer = {
    heading: (text: any) => string;
    text: (text: any) => string;
    link: (text: any) => string;
    code: (cc: any) => string;
    codeDefault: (cc: any) => string;
};

declare namespace marked {
    function parse(markdown: string, options?: { renderer: Renderer }): string;
    class Renderer implements Renderer {
        heading(text: any): string;
        text(text: any): string;
        link(ln: any): string;
        code(cc: any): string;
        codeDefault(cc: any): string;
    }
}

/* 
 * Lesson learned: the type declaration in Typescript is essentially a type-check helper
 * for the tsc compiler. Writing the type declaration is a kind of building safe-guard 
 * for the subsequent developments. It also provides the necessary context to the linter
 * and the copilot to help on the code editing. 
 * 
 * The project management and the type-declaration are indeed two separate aspects for 
 * Typescript development. 
 */

function filterMarkdownLines(markdownText: string): string {
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

async function markdownLoadRender(url_md: string) {
    const response = await fetch(url_md);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let markdownText = await response.text();
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
    renderer.heading = (text: any): string => {
        let level = Number(text.depth);
        let isTitle = text.raw.includes("===") && !text.raw.includes("#")
        let closingTags = '';
        if (level <= currentLevel) {
            closingTags = '</div></div></details>'.repeat(currentLevel - level + 1);
        }
        currentLevel = level;
        return `${closingTags}<details ${isTitle||level<=1 ? 'open' : ''}>
            <summary>${text.text}</summary>
            <div class="content">
                <div class="box">`;
    };
    renderer.text = (inp: any): string => {
        const text: string = inp.raw;
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
    renderer.link = (ln: any) => {
        console.log(ln);
        return `<a href="${ln.href}" target="_blank" rel="noopener noreferrer">${ln.text}</a>`; 
    };
    renderer.code = (inp: any): string => {
        if (inp) {
            if (inp.lang==='mermaid') {
                return `<pre class="mermaid">${inp.text}</pre>`
            } else {
                return renderer.codeDefault(inp);
            }
        } else {
            return '';
        }
    }
    const html = marked.parse(markdownText, { renderer: renderer });
    // Close any remaining open tags
    const finalClosingTags = '</div></div></details>'.repeat(currentLevel);
    const contentElement = document.getElementById('content');
    if (contentElement) {
        contentElement.innerHTML = html + finalClosingTags;
    }
}

async function displayBlogList() {
    const btn = document.getElementById('go-back-button');
    if (btn) {
        btn.innerHTML = '';
        const response = await fetch('blogList.json');
        const blogList = await response.json();
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<h2>Blog Posts</h2>';
            const ul = document.createElement('ul');
            ul.style.listStyleType = 'none';
            blogList.forEach(
                (post : {title:string, file:string, summary:string, color?:string}) => {
                    const li = document.createElement('li');
                    li.className = 'box';
                    li.innerHTML = `<h3 style="color: ${post.color || "lightgreen"}">${post.title}</h3><p style="color: white">${post.summary}</p>`;
                    li.addEventListener('click', async () => {
                        await renderPost(post.file);
                        mermaid.run({
                            querySelector: '.mermaid'
                        });
                    });
                    ul.appendChild(li);
                }
            );
            content.appendChild(ul);
        }
    }
}

async function renderPost(filename: string) {
    const btn = document.getElementById('go-back-button');
    if (btn) {
        btn.innerHTML = '<button onclick="displayBlogList()">Back to List</button>';
    }
    await markdownLoadRender(filename);
}
