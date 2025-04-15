async function loadMakdownFile() {
    try {
        const response = await fetch('./artigos.md');
        const markdown = await response.text();

        const artigos = markdown.split('---').map(artigo => artigo.trim());
        const secaoArtigos = document.querySelector('#artigos');
        artigos.forEach(artigoMarkdown => {
            // Usa a biblioteca marked.js para converter Markdown para HTML
            const articleHTML = marked.parse(artigoMarkdown);
            const articleElement = document.createElement('article');
            articleElement.innerHTML = articleHTML;
            articleElement.innerHTML = articleElement.innerHTML.replace(/<h1>/g, '<h3>').replace(/<\/h1>/g, '</h3>');
            secaoArtigos.appendChild(articleElement);
        });
    } catch (erro) {
        console.error('Erro ao carregar os artigos em Markdown:', erro);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    const icon = themeToggle.querySelector('i');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateIcon(currentTheme === 'dark');
    } else {
        const isDarkMode = prefersDarkScheme.matches;
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        updateIcon(isDarkMode);
    }

    themeToggle.addEventListener('click', function () {
        let theme;
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            theme = 'dark';
        } else {
            theme = 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcon(theme === 'dark');
    });

    function updateIcon(isDark) {
        if (isDark) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    prefersDarkScheme.addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateIcon(e.matches);
        }
    });
});

document.addEventListener('DOMContentLoaded', loadMakdownFile);