// a good blog https://segmentfault.com/a/1190000019761439

declare const mermaid: any;

declare const katex: {
    renderToString(tex: string, options: { displayMode: boolean }): string;
};

// Define the renderer type
type Renderer = {
    heading: (text: any) => string;
    text: (text: any) => string;
    code: (cc: any) => string;
    codeDefault: (cc: any) => string;
};

// Define the marked module
declare namespace marked {
    function parse(markdown: string, options?: { renderer: Renderer }): string;
    class Renderer implements Renderer {
        heading(text: any): string;
        text(text: any): string;
        code(cc: any): string;
        codeDefault(cc: any): string;
    }
}

async function main(url_md: string) {
    const response = await fetch(url_md);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const markdownText = await response.text();
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
        return text.replace(/\$\$(.*?)\$\$/g, (_, tex) => {
            return katex.renderToString(tex, { displayMode: true });
        }).replace(/\$(.*?)\$/g, (_, tex) => {
            return katex.renderToString(tex, { displayMode: false });
        });
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
