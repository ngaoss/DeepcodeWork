// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Add simple hover effect for the logo
    const logo = document.querySelector('.logo');
    logo.addEventListener('mouseenter', () => {
        const logoImg = document.querySelector('.logo-img');
        if (logoImg) {
            logoImg.style.transform = 'scale(1.1) rotate(5deg)';
            logoImg.style.transition = 'transform 0.3s ease';
        }
    });

    logo.addEventListener('mouseleave', () => {
        const logoImg = document.querySelector('.logo-img');
        if (logoImg) {
            logoImg.style.transform = 'scale(1) rotate(0deg)';
        }
    });

    // Fetch and update download links
    fetchDownloadLinks();

    // Start platform text rotation
    rotatePlatformText();
});

function rotatePlatformText() {
    const textEl = document.getElementById('platform-text');
    if (!textEl) return;

    const platforms = ['Windows', 'MacOS', 'Android', 'iOS'];
    let currentIndex = 0;

    setInterval(() => {
        // Fade out
        textEl.style.opacity = 0;
        textEl.style.transform = 'translateY(10px)';
        textEl.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % platforms.length;
            textEl.textContent = platforms[currentIndex];

            // Fade in
            textEl.style.opacity = 1;
            textEl.style.transform = 'translateY(0)';
        }, 500); // Sync with transition duration
    }, 5000);
}

const VERSION_URL = "https://raw.githubusercontent.com/ngaoss/work/main/version.json";

async function fetchDownloadLinks() {
    try {
        const response = await fetch(VERSION_URL);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('Update data fetched:', data);

        // Mapping keys from JSON to Element IDs
        const mapping = {
            'windowsUrl': ['dl-windows-x64', 'dl-windows-arm64', 'dl-header'],
            'macosUrl': ['dl-macos-apple', 'dl-macos-intel'],
            'linuxUrl': ['dl-linux'],
            'androidUrl': ['dl-android'],
            'downloadUrl': ['dl-header'] // Fallback for header
        };

        // Update links
        Object.keys(mapping).forEach(key => {
            if (data[key]) {
                mapping[key].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.href = data[key];
                        // If it's the header button, we might want to be smart about the OS
                        // but for now, we'll just set it to the platform-specific URL if available
                    }
                });
            }
        });

        // Smart Header Link (detect OS)
        updateHeaderLink(data);

    } catch (error) {
        console.error('Error fetching download links:', error);
    }
}

function updateHeaderLink(data) {
    const headerBtn = document.getElementById('dl-header');
    if (!headerBtn) return;

    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.includes('win') && data.windowsUrl) {
        headerBtn.href = data.windowsUrl;
    } else if (userAgent.includes('mac') && data.macosUrl) {
        headerBtn.href = data.macosUrl;
    } else if (userAgent.includes('android') && data.androidUrl) {
        headerBtn.href = data.androidUrl;
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad') && data.iosUrl) {
        headerBtn.href = data.iosUrl;
    } else if (data.downloadUrl) {
        headerBtn.href = data.downloadUrl;
    }
}
