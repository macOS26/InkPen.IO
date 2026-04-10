// Banner - Shared across pages
(function() {
    // Detect if in subdirectory
    const inHelp = window.location.pathname.includes('/help/');
    const homeLink = inHelp ? '../index.html' : 'index.html';
    const docsLink = inHelp ? 'index.html' : 'help/index.html';
    const statsLink = inHelp ? '../ip-stats.html' : 'ip-stats.html';

    const GITHUB_API = 'https://api.github.com/repos/macos26/logos/releases';

    // Insert banner HTML at start of body
    const bannerHTML = `
    <div class="countdown-banner">
        <div class="countdown-banner-content">
            <div class="countdown-label" id="countdown-label">LOGOS INKPEN</div>
            <div class="countdown-released" id="countdown-released">RELEASED</div>
            <div class="countdown-sponsor">Sponsor <a href="https://xcf.ai" target="_blank">Agent!</a> <span class="sponsor-sep">for</span> <a href="https://xcf.ai" target="_blank">macOS 26.4+</a> <span class="sponsor-dim">Agentic AI for your Apple Mac Desktop</span></div>
        </div>
        <div class="banner-nav">
            <a href="${homeLink}">Home</a>
            <a href="https://chat.xcf.ai" target="_blank">Chat</a>
            <a href="${docsLink}">Docs</a>
            <a href="${statsLink}">Stat</a>
            <a href="https://xcf.ai" target="_blank">Agent</a>
        </div>
        <div class="founder-notice">
            <span class="ribbon-icon">&#x1F397;</span> Our founder, Todd Bruss, is currently battling Cancer. Through it all, he continues to pour his heart into InkPen. Your support and encouragement mean the world. <span class="ribbon-icon">&#x1F397;</span>
        </div>
    </div>`;

    // Insert banner CSS
    const bannerCSS = `
    .countdown-banner {
        background-color: #000;
        color: #fff;
        text-align: center;
        padding: 2px 0 0 0;
        font-family: 'Courier New', Courier, monospace;
        position: sticky;
        top: 0;
        z-index: 1000;
        width: 100%;
    }
    .countdown-banner-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1px;
    }
    .countdown-label {
        font-size: 0.9rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        line-height: 1;
        text-align: center;
        width: 100%;
        font-family: 'Orbitron', monospace;
        padding-bottom: 3px;
    }
    .countdown-released {
        font-size: 2.468rem;
        font-weight: 900;
        letter-spacing: 0.1em;
        font-family: 'Orbitron', monospace;
        padding: 1px 4px 1px 6px;
        background: rgba(20, 20, 20, 0.5);
        border-radius: 5px;
        border: none;
        line-height: 1;
        background: linear-gradient(135deg, #00d4ff, #7b2ff7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .countdown-sponsor {
        font-size: 0.75rem;
        font-weight: 400;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #00d4ff;
        margin-top: 1.5px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    .countdown-sponsor a {
        background: linear-gradient(135deg, #00d4ff, #7b2ff7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-decoration: none;
        font-weight: 700;
    }
    .countdown-sponsor a:hover {
        background: linear-gradient(135deg, #7b2ff7, #00d4ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .sponsor-sep {
        color: #999;
    }
    .sponsor-dim {
        color: #666;
        font-weight: 300;
    }
    .banner-nav {
        display: flex;
        justify-content: center;
        gap: 31px;
        margin-top: 4px;
        padding: 6px 0;
        background-color: #666;
    }
    .banner-nav a {
        color: #fff;
        text-decoration: none;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        font-family: 'Orbitron', monospace;
        position: relative;
    }
    .banner-nav a:hover::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 1px;
        width: calc(100% - 0.15em);
        height: 1px;
        background-color: #fff;
    }
    .founder-notice {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: #e0e0e0;
        font-size: 0.8rem;
        font-weight: 400;
        letter-spacing: 0.02em;
        padding: 8px 20px;
        line-height: 1.5;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        font-style: italic;
        border-top: 1px solid rgba(100, 100, 255, 0.2);
    }
    .ribbon-icon {
        font-style: normal;
    }
    .show-mobile {
        display: none;
    }
    @media (max-width: 768px) {
        .countdown-released {
            font-size: 1.495rem;
        }
        .countdown-sponsor {
            font-size: 0.65rem;
        }
        .hide-mobile {
            display: none;
        }
        .show-mobile {
            display: inline;
        }
        .founder-notice {
            font-size: clamp(0.6rem, 2.5vw, 0.8rem);
            padding: 6px 12px;
            line-height: 1.4;
        }
    }`;

    // Insert CSS
    const style = document.createElement('style');
    style.textContent = bannerCSS;
    document.head.appendChild(style);

    // Insert HTML at start of body
    document.body.insertAdjacentHTML('afterbegin', bannerHTML);

    // Fetch latest version from GitHub and update banner
    async function updateBannerVersion() {
        try {
            var response = await fetch(GITHUB_API);
            if (!response.ok) return;
            var releases = await response.json();
            if (!releases.length) return;

            for (var r = 0; r < releases.length; r++) {
                var release = releases[r];
                for (var a = 0; a < release.assets.length; a++) {
                    var asset = release.assets[a];
                    if (asset.name.endsWith('.dmg')) {
                        var match = asset.name.match(/(\d+\.\d+\.\d+)/);
                        if (match) {
                            document.getElementById('countdown-label').textContent = 'LOGOS INKPEN ' + match[1];
                        }
                        return;
                    }
                }
            }
        } catch (e) {
            // Keep default text on failure
        }
    }

    updateBannerVersion();
})();
