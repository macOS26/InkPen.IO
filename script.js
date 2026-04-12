const GITHUB_API = 'https://api.github.com/repos/macos26/logos/releases';

function extractVersion(filename) {
    if (!filename) return '';
    var match = filename.match(/(\d+\.\d+\.\d+)/);
    return match ? match[1] : '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

async function autoDiscoverReleases() {
    try {
        var response = await fetch(GITHUB_API);
        if (!response.ok) return;

        var releases = await response.json();
        if (!releases.length) return;

        // Find the latest release with a DMG asset
        var latestDmg = null;
        for (var r = 0; r < releases.length; r++) {
            var release = releases[r];
            for (var a = 0; a < release.assets.length; a++) {
                var asset = release.assets[a];
                if (asset.name.endsWith('.dmg')) {
                    if (!latestDmg) {
                        latestDmg = {
                            url: asset.browser_download_url,
                            version: extractVersion(asset.name),
                            tag: release.tag_name
                        };
                    }
                    break;
                }
            }
        }

        // Update download button and links
        if (latestDmg) {
            var downloadBtn = document.getElementById('download-btn');
            if (downloadBtn) {
                downloadBtn.href = latestDmg.url;
                downloadBtn.textContent = 'Download v' + latestDmg.version;
            }
            var descLink = document.getElementById('desc-download-link');
            if (descLink) {
                descLink.href = latestDmg.url;
                descLink.textContent = 'v' + latestDmg.version + ' available for download';
            }
            var whatsNewHeader = document.getElementById('whats-new-header');
            if (whatsNewHeader) {
                whatsNewHeader.textContent = "WHAT'S NEW IN " + latestDmg.version;
            }
            var mainTitle = document.getElementById('main-title');
            if (mainTitle) {
                mainTitle.textContent = 'Logos InkPen ' + latestDmg.version;
            }
        }

        // Render What's New from latest release notes
        renderReleaseNotes(releases[0].body);

        // Build the release history table
        var tbody = document.getElementById('release-history-body');
        if (!tbody) return;

        var rows = '';
        for (var r = 0; r < releases.length; r++) {
            var release = releases[r];
            for (var a = 0; a < release.assets.length; a++) {
                var asset = release.assets[a];
                if (!asset.name.endsWith('.dmg')) continue;
                var version = extractVersion(asset.name);
                var date = formatDate(new Date(release.published_at || release.created_at));
                var size = formatFileSize(asset.size);
                var url = asset.browser_download_url;

                rows += '<tr>'
                    + '<td><a href="' + url + '" style="text-decoration: none;"><span class="version-badge">' + version + '</span></a></td>'
                    + '<td>' + date + '</td>'
                    + '<td>' + size + '</td>'
                    + '<td>' + asset.download_count.toLocaleString() + '</td>'
                    + '</tr>';
            }
        }

        tbody.innerHTML = rows || '<tr><td colspan="4" style="text-align: center; color: #999;">No releases found.</td></tr>';
    } catch (e) {
        // Silently fail — the page still works with fallback links
    }
}

function renderReleaseNotes(body) {
    var container = document.getElementById('whats-new-content');
    if (!container || !body) return;

    var lines = body.split(/\r?\n/);
    var html = '';
    var inList = false;
    var bullet = '<span style="font-size: 1.7rem; vertical-align: -3.5px; line-height: 0; color: #999;">\u2022</span>';
    var listStyle = 'list-style: none; padding-left: 0; line-height: 1.8; font-size: 0.85rem; color: #000; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;';

    function cleanText(t) {
        t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
        t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        return t;
    }

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        // Skip images, horizontal rules, empty lines, top title/bold summary
        if (!line || line === '---' || line.match(/^<img /)) continue;
        if (line.match(/^##\s+\*\*Logos InkPen/)) continue;
        if (line.match(/^\*\*A massive update/)) continue;
        if (line.match(/^\*\*Full Changelog\*\*/)) continue;
        if (line.match(/^https?:\/\//)) continue;

        // Section headers (### or ####)
        var sectionMatch = line.match(/^#{2,4}\s+(.*)/);
        if (sectionMatch) {
            if (inList) { html += '</ul>'; inList = false; }
            var title = sectionMatch[1].replace(/\*+/g, '').replace(/[#]+/g, '').trim();
            title = title.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').trim();
            if (title) {
                html += '<h4 style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #333; margin: 1.2rem 0 0.5rem 0;">' + title + '</h4>';
            }
            continue;
        }

        // List item
        var itemMatch = line.match(/^-\s+(.*)/);
        if (itemMatch) {
            if (!inList) {
                html += '<ul style="' + listStyle + '">';
                inList = true;
            }
            html += '<li style="padding-top: 7.5px; padding-bottom: 0;">' + bullet + ' ' + cleanText(itemMatch[1]) + '</li>';
            continue;
        }
    }

    if (inList) html += '</ul>';

    container.innerHTML = html || '<p style="font-size: 0.85rem; color: #999;">No release notes available.</p>';
}

autoDiscoverReleases();
