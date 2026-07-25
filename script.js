document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');
    const splashProgressBar = document.getElementById('splashProgressBar');
    const splashLog = document.getElementById('splashLog');
    
    const loginScreen = document.getElementById('loginScreen');
    const loginForm = document.getElementById('loginForm');
    const driverNameInput = document.getElementById('driverName');
    
    const appContent = document.getElementById('appContent');
    const loggedDriverSpan = document.getElementById('loggedDriver');
    const btnLogout = document.getElementById('btnLogout');

    const jobForm = document.getElementById('jobForm');
    const jobsList = document.getElementById('jobsList');
    const totalKmSpan = document.getElementById('totalKm');
    const totalEarnedSpan = document.getElementById('totalEarned');
    const totalJobsSpan = document.getElementById('totalJobs');

    let driverJobs = [];

    // --- 1. NAČÍTACÍ ANIMACE ---
    let progress = 0;
    const splashInterval = setInterval(() => {
        progress += 5;
        splashProgressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(splashInterval);
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                checkAuth();
            }, 300);
        }
    }, 30);

    // --- 2. PŘIHLÁŠENÍ & ULOŽENÍ UŽIVATELE ---
    function checkAuth() {
        const savedDriver = localStorage.getItem('uac_driver_name');
        if (savedDriver) {
            loggedDriverSpan.innerText = savedDriver;
            appContent.classList.remove('hidden');
            loadJobs();
        } else {
            loginScreen.classList.remove('hidden');
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const driverName = driverNameInput.value.trim();
        if (driverName) {
            localStorage.setItem('uac_driver_name', driverName);
            loggedDriverSpan.innerText = driverName;
            loginScreen.classList.add('hidden');
            appContent.classList.remove('hidden');
            loadJobs();
        }
    });

    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('uac_driver_name');
        appContent.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });

    // --- 3. SPRÁVA JÍZD & STATISTIK ---
    function loadJobs() {
        const saved = localStorage.getItem('uac_driver_jobs');
        driverJobs = saved ? JSON.parse(saved) : [];
        renderJobs();
    }

    function renderJobs() {
        jobsList.innerHTML = '';
        let totalKm = 0;
        let totalEarned = 0;

        if (driverJobs.length === 0) {
            jobsList.innerHTML = '<p class="empty-msg">Žádné zaznamenané jízdy.</p>';
        } else {
            driverJobs.forEach((job) => {
                totalKm += Number(job.distance);
                totalEarned += Number(job.income);

                const card = document.createElement('div');
                card.className = 'job-card';
                card.innerHTML = `
                    <div>
                        <div class="job-route">${job.from} ➔ ${job.to}</div>
                        <div class="job-sub">${job.cargo} • ${job.distance} km</div>
                    </div>
                    <div class="job-pay">+${job.income} €</div>
                `;
                jobsList.appendChild(card);
            });
        }

        totalKmSpan.innerText = totalKm.toLocaleString() + ' km';
        totalEarnedSpan.innerText = totalEarned.toLocaleString() + ' €';
        totalJobsSpan.innerText = driverJobs.length;
    }

    jobForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newJob = {
            from: document.getElementById('fromCity').value.trim(),
            to: document.getElementById('toCity').value.trim(),
            cargo: document.getElementById('cargo').value.trim(),
            distance: document.getElementById('distance').value,
            income: document.getElementById('income').value,
            date: new Date().toLocaleDateString()
        };

        driverJobs.unshift(newJob);
        localStorage.setItem('uac_driver_jobs', JSON.stringify(driverJobs));
        
        jobForm.reset();
        renderJobs();
    });
});