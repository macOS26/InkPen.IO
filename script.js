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

autoDiscoverReleases();
