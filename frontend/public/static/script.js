function updateCountdown(timezone, elementId) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const newYearTime = new Date(`January 1, ${currentYear + 1} 00:00:00 ${timezone}`);
    const diff = newYearTime - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById(elementId).innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function startCountdown() {
    updateCountdown('Asia/Seoul', 'time-seoul');
    updateCountdown('Asia/Kuala_Lumpur', 'time-malaysia');
    updateCountdown('Europe/Istanbul', 'time-turkey');
    updateCountdown('Europe/London', 'time-uk');

    setInterval(() => {
        updateCountdown('Asia/Seoul', 'time-seoul');
        updateCountdown('Asia/Kuala_Lumpur', 'time-malaysia');
        updateCountdown('Europe/Istanbul', 'time-turkey');
        updateCountdown('Europe/London', 'time-uk');
    }, 1000);
}

window.onload = startCountdown;