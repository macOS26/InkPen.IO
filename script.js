const GITHUB_API = 'https://api.github.com/repos/macos26/logos/releases';

function extractVersion(filename) {
    if (!filename) return '';
    // Try build number pattern (e.g., logos.inkpen.io-1.0b29.zip)
    var buildMatch = filename.match(/([\d.]+b\d+)/);
    if (buildMatch) return buildMatch[1];
    // Try semantic version (e.g., 1.0.0)
    var semverMatch = filename.match(/(\d+\.\d+\.\d+)/);
    if (semverMatch) return semverMatch[1];
    // Fallback: filename without extension
    return filename.replace(/\.(zip|dmg|pkg)$/i, '');
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

        // Find the latest release with a zip asset
        var latestZip = null;
        for (var r = 0; r < releases.length; r++) {
            var release = releases[r];
            for (var a = 0; a < release.assets.length; a++) {
                var asset = release.assets[a];
                if (asset.name.endsWith('.zip')) {
                    if (!latestZip) {
                        latestZip = {
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
        if (latestZip) {
            var downloadBtn = document.getElementById('download-btn');
            if (downloadBtn) {
                downloadBtn.href = latestZip.url;
                downloadBtn.textContent = 'Download ' + latestZip.version;
            }
            var descLink = document.getElementById('desc-download-link');
            if (descLink) {
                descLink.href = latestZip.url;
                descLink.textContent = latestZip.version + ' available for download';
            }
            var whatsNewHeader = document.getElementById('whats-new-header');
            if (whatsNewHeader) {
                whatsNewHeader.textContent = "WHAT'S NEW IN " + latestZip.version.toUpperCase();
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
                if (!asset.name.endsWith('.zip')) continue;
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
