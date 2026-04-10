// Footer - Shared across pages
(function() {
    // Detect if in subdirectory
    const inHelp = window.location.pathname.includes('/help/');
    const homeLink = inHelp ? '../index.html' : 'index.html';
    const docsLink = inHelp ? 'index.html' : 'help/index.html';
    const statsLink = inHelp ? '../ip-stats.html' : 'ip-stats.html';

    // Insert footer HTML at end of body
    const footerHTML = `
    <footer>
        <div class="container">
            <div class="footer-content">
                <div><a href="${homeLink}" style="color: inherit;">Home</a></div>
                <div><a href="https://chat.xcf.ai" target="_blank" style="color: inherit;">Chat</a></div>
                <div><a href="${docsLink}">Docs</a></div>
                <div><a href="${statsLink}" onclick="this.href='${statsLink}?v='+Date.now()" style="color: inherit;">Stats</a></div>
                <div><a href="https://macos26.app" target="_blank" style="color: inherit;">Agent!</a></div>
                <div class="year-tooltip">2026
                    <div class="tooltip-popup">
                        Created by Todd Bruss<br>
                        Copyright 2026<br>
                        Logos InkPen LLC<br>
                        All Rights Reserved
                    </div>
                </div>
            </div>
        </div>
    </footer>`;

    // Insert footer CSS
    const footerCSS = `
    footer {
        background-color: #000;
        color: #fff;
        padding: 37px 0 38px 0;
        width: 100%;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        margin-bottom: -20px;
        position: relative;
        display: flex;
        align-items: center;
    }
    footer .container {
        width: 100%;
        max-width: 970px;
        margin: 0 auto;
        padding: 0 40px;
    }
    footer .footer-content {
        font-family: 'Courier New', Courier, monospace;
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        max-width: none;
        margin: 0 auto;
        font-size: 1rem;
    }
    footer .footer-content div {
        color: #fff;
        text-align: center;
        flex: 1;
    }
    footer .footer-content a {
        color: #fff;
        text-decoration: none;
    }
    footer .footer-content a:hover {
        text-decoration: underline;
    }
    .year-tooltip {
        position: relative;
        cursor: pointer;
    }
    .year-tooltip:hover {
        text-decoration: underline;
    }
    .tooltip-popup {
        visibility: hidden;
        opacity: 0;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #666;
        color: #fff;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 0.85rem;
        white-space: nowrap;
        text-align: center;
        line-height: 1.6;
        margin-bottom: 10px;
        transition: opacity 0.2s, visibility 0.2s;
        z-index: 1000;
    }
    .tooltip-popup::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 8px solid transparent;
        border-top-color: #666;
    }
    .year-tooltip:hover .tooltip-popup {
        visibility: visible;
        opacity: 1;
    }
    @media (max-width: 768px) {
        .hide-mobile {
            display: none;
        }
    }`;

    // Insert CSS
    const style = document.createElement('style');
    style.textContent = footerCSS;
    document.head.appendChild(style);

    // Insert HTML at end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
})();
