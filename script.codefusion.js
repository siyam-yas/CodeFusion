class CFCodeView extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.loadLibraries().then(() => {
        const codeContent = this.textContent.trim(); // Get inner content
        const language = this.getAttribute('data-language') || 'javascript'; // Default language
        const theme = this.getAttribute('data-theme') || 'dark'; // Default theme
  
        // Template for the code view with Bootstrap, FontAwesome icons, and Prism.js
        this.shadowRoot.innerHTML = `
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/themes/prism-${theme}.min.css">
          <link rel="stylesheet" href="style.codefusion.css">
          <div class="cf-codeview-wrapper" data-theme="${theme}">
            <div class="cf-code-header d-flex justify-content-between align-items-center p-2">
              <span class="cf-title">Code Snippet</span>
              <div class="cf-buttons">
                <button class="copy-btn btn btn-sm btn-outline-light" title="Copy"><i class="fas fa-copy"></i></button>
                <button class="embed-btn btn btn-sm btn-outline-light" title="Copy Embed"><i class="fas fa-code"></i></button>
                <button class="theme-toggle btn btn-sm btn-outline-light" title="Toggle Theme"><i class="fas fa-adjust"></i></button>
              </div>
            </div>
            <div class="cf-code-body">
              <div class="line-numbers"></div>
              <pre class="code-container"><code class="language-${language}">${Prism.highlight(codeContent, Prism.languages[language], language)}</code></pre>
            </div>
          </div>
        `;
  
        const codeContainer = this.shadowRoot.querySelector('.code-container');
        const lineNumberContainer = this.shadowRoot.querySelector('.line-numbers');
  
        // Handle line numbers
        const lines = codeContent.split('\n');
        lineNumberContainer.innerHTML = lines.map((line, index) => `${index + 1}<br>`).join('');
  
        // Copy functionality
        this.shadowRoot.querySelector('.copy-btn').addEventListener('click', () => {
          navigator.clipboard.writeText(codeContainer.textContent.trim()).then(() => {
            alert('Code copied!');
          });
        });
  
        // Copy embed functionality
        this.shadowRoot.querySelector('.embed-btn').addEventListener('click', () => {
          const embedCode = `<cf-codeview data-language="${language}" data-theme="${theme}">${codeContainer.textContent.trim()}</cf-codeview>`;
          navigator.clipboard.writeText(embedCode).then(() => {
            alert('Embed code copied!');
          });
        });
  
        // Theme toggle functionality
        this.shadowRoot.querySelector('.theme-toggle').addEventListener('click', () => {
          const currentTheme = this.getAttribute('data-theme');
          this.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
          this.applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
  
        // Apply initial theme
        this.applyTheme(theme);
      });
    }
  
    // Method to load libraries dynamically
    loadLibraries() {
      return new Promise((resolve) => {
        // Load Prism.js
        const prismScript = document.createElement('script');
        prismScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/prism.min.js';
        document.head.appendChild(prismScript);
  
        // Load FontAwesome
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesomeLink);
  
        // Load Bootstrap
        const bootstrapLink = document.createElement('link');
        bootstrapLink.rel = 'stylesheet';
        bootstrapLink.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css';
        document.head.appendChild(bootstrapLink);
  
        // Wait for all libraries to load
        prismScript.onload = () => resolve();
      });
    }
  
    // Method to handle theme switching
    applyTheme(theme) {
      const wrapper = this.shadowRoot.querySelector('.cf-codeview-wrapper');
      if (theme === 'dark') {
        wrapper.setAttribute('data-theme', 'dark');
      } else {
        wrapper.setAttribute('data-theme', 'light');
      }
    }
  }
  
  // Register the custom element
  customElements.define('cf-codeview', CFCodeView);
  