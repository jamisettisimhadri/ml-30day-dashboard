// ==========================================
// 30-Day ML Journey Tracker - Core Controller
// ==========================================

// Firebase cloud-sync helpers (CDN ES modules)
import { loadFromFirestore, saveToFirestore, trackEvent } from './firebase.js';

// Curriculum schedule dataset
const DAYS_DATA = [
    {
        day: 1,
        title: "ML Overview & Supervised vs Unsupervised",
        learning: "ML overview, supervised vs unsupervised learning",
        coding: "Set up Jupyter, scikit-learn, Kaggle notebook",
        revision: "Write notes on ML types",
        project: "Create a GitHub repo for ML journey"
    },
    {
        day: 2,
        title: "Statistics Basics",
        learning: "Statistics basics: mean, median, variance, probability",
        coding: "Solve stats examples in Python",
        revision: "Revise formulas and terms",
        project: "Add a simple stats notebook"
    },
    {
        day: 3,
        title: "Linear Algebra Basics for ML",
        learning: "Linear algebra basics for ML",
        coding: "Practice NumPy arrays, matrix operations",
        revision: "Revise vectors, matrices",
        project: "Save a notebook on NumPy basics"
    },
    {
        day: 4,
        title: "Data Preprocessing Basics",
        learning: "Data preprocessing basics",
        coding: "Use Pandas to clean a dataset",
        revision: "Revise missing values, encoding",
        project: "Clean a small CSV dataset"
    },
    {
        day: 5,
        title: "Data Visualization",
        learning: "Data visualization",
        coding: "Make plots with Matplotlib/Seaborn",
        revision: "Review chart types and when to use them",
        project: "Visualize one dataset clearly"
    },
    {
        day: 6,
        title: "Train/Test Split & Over/Underfitting",
        learning: "Train/test split, overfitting, underfitting",
        coding: "Use scikit-learn to split data",
        revision: "Revise bias-variance idea",
        project: "Start a house price prediction notebook"
    },
    {
        day: 7,
        title: "Linear Regression Theory",
        learning: "Linear regression theory",
        coding: "Implement linear regression",
        revision: "Review evaluation basics",
        project: "Continue house price prediction"
    },
    {
        day: 8,
        title: "Regression Metrics",
        learning: "Regression metrics",
        coding: "Compute MAE, MSE, RMSE, R2",
        revision: "Revise regression metrics",
        project: "Improve the house price project"
    },
    {
        day: 9,
        title: "Logistic Regression Theory",
        learning: "Logistic regression theory",
        coding: "Implement logistic regression",
        revision: "Compare regression vs classification",
        project: "Start a spam classifier notebook"
    },
    {
        day: 10,
        title: "Classification Metrics",
        learning: "Classification metrics",
        coding: "Practice accuracy, precision, recall, F1",
        revision: "Revise confusion matrix",
        project: "Evaluate spam classifier"
    },
    {
        day: 11,
        title: "Decision Trees",
        learning: "Decision trees",
        coding: "Build a decision tree model",
        revision: "Revise tree splitting idea",
        project: "Add decision tree to one dataset"
    },
    {
        day: 12,
        title: "Random Forest",
        learning: "Random forest",
        coding: "Train random forest model",
        revision: "Compare tree vs forest",
        project: "Improve model performance notebook"
    },
    {
        day: 13,
        title: "K-Nearest Neighbors",
        learning: "K-nearest neighbors",
        coding: "Implement KNN",
        revision: "Revise distance-based learning",
        project: "Test KNN on a sample dataset"
    },
    {
        day: 14,
        title: "Naive Bayes Text Classifier",
        learning: "Naive Bayes",
        coding: "Build a text classifier",
        revision: "Revise Bayes idea",
        project: "Improve spam classification project"
    },
    {
        day: 15,
        title: "Support Vector Machines (SVM)",
        learning: "Support Vector Machine basics",
        coding: "Train an SVM model",
        revision: "Review kernel idea",
        project: "Compare SVM with other models"
    },
    {
        day: 16,
        title: "Unsupervised Learning Basics",
        learning: "Unsupervised learning basics",
        coding: "Learn clustering concepts",
        revision: "Revise labeled vs unlabeled data",
        project: "Start customer segmentation notebook"
    },
    {
        day: 17,
        title: "K-Means Clustering",
        learning: "K-means clustering",
        coding: "Implement K-means",
        revision: "Revise centroid and clusters",
        project: "Visualize clustering results"
    },
    {
        day: 18,
        title: "Dimensionality Reduction & PCA",
        learning: "Dimensionality reduction",
        coding: "Learn PCA concept",
        revision: "Revise feature reduction",
        project: "Apply PCA to dataset"
    },
    {
        day: 19,
        title: "Model Selection & Hyperparameters",
        learning: "Model selection",
        coding: "Learn cross-validation and grid search",
        revision: "Revise tuning terms",
        project: "Tune one existing model"
    },
    {
        day: 20,
        title: "Feature Engineering",
        learning: "Feature engineering",
        coding: "Create new features from data",
        revision: "Revise feature types",
        project: "Improve a project with features"
    },
    {
        day: 21,
        title: "Supervised Learning Review",
        learning: "Review all supervised learning",
        coding: "Rebuild one model from scratch",
        revision: "Summarize all algorithms",
        project: "Polish house price project"
    },
    {
        day: 22,
        title: "Classification Review",
        learning: "Review all classification topics",
        coding: "Solve a classification dataset",
        revision: "Revise metrics and confusion matrix",
        project: "Improve spam classifier"
    },
    {
        day: 23,
        title: "Clustering & PCA Review",
        learning: "Review clustering and PCA",
        coding: "Practice K-means and PCA again",
        revision: "Summarize unsupervised learning",
        project: "Finish customer segmentation"
    },
    {
        day: 24,
        title: "Introduction to Pipelines",
        learning: "Intro to pipelines",
        coding: "Build a scikit-learn pipeline",
        revision: "Revise preprocessing flow",
        project: "Add pipeline to one project"
    },
    {
        day: 25,
        title: "Model Deployment Basics",
        learning: "Intro to model deployment",
        coding: "Learn Flask or FastAPI basics",
        revision: "Revise deployment steps",
        project: "Prepare model for deployment"
    },
    {
        day: 26,
        title: "Save & Load Models",
        learning: "Save and load models",
        coding: "Use joblib or pickle",
        revision: "Revise full ML workflow",
        project: "Save one trained model"
    },
    {
        day: 27,
        title: "GitHub Portfolio Cleanup",
        learning: "GitHub portfolio cleanup",
        coding: "Push notebooks and code properly",
        revision: "Review README format",
        project: "Write project descriptions"
    },
    {
        day: 28,
        title: "Kaggle Practice",
        learning: "Kaggle practice",
        coding: "Solve one small Kaggle dataset",
        revision: "Revise weak topics",
        project: "Submit a better notebook"
    },
    {
        day: 29,
        title: "Interview Preparation",
        learning: "Interview basics",
        coding: "Review common ML questions",
        revision: "Make short revision notes",
        project: "Final project cleanup"
    },
    {
        day: 30,
        title: "Full Curriculum Recap",
        learning: "Full recap",
        coding: "Rebuild one mini project without help",
        revision: "Review everything learned",
        project: "Publish final portfolio version"
    }
];

// Project nodes mapping (which days relate to which project)
const PROJECT_DAYS = {
    regression: [6, 7, 8, 21, 24],
    classification: [9, 10, 14, 22],
    clustering: [16, 17, 23]
};

// Global App State
let appState = {
    startDate: new Date().toISOString().split('T')[0],
    days: {},
    projects: {
        regression: { repo: "", demo: "" },
        classification: { repo: "", demo: "" },
        clustering: { repo: "", demo: "" }
    },
    resources: {
        kaggle: false,
        google: false,
        sklearn: false,
        statquest: false
    }
};

// Initialize empty progress objects for days if not present
DAYS_DATA.forEach(d => {
    appState.days[d.day] = {
        checked: { learning: false, coding: false, revision: false, project: false },
        notes: ""
    };
});

// UI Ref Pointers
let activeDay = 1;
let filterType = 'all';

// Audio Context for synthetic sound alert
let audioCtx = null;

// Timer State variables
let timerInterval = null;
let timerSecondsLeft = 3600; // 60 mins default
let timerTotalSeconds = 3600;
let timerRunning = false;

// -------------------------------------------------------------
// Life-cycle / Bootloader Methods
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    await loadStateFromStorage();
    initUI();
    renderStats();
    renderGrid();
    renderActiveDayDetails();
    renderProjectProgress();
    renderResources();
    setupEventListeners();
    trackEvent('dashboard_opened');
});

// Load state — tries Firestore first, falls back to localStorage
async function loadStateFromStorage() {
    setSyncStatus('loading');

    // Try Firestore cloud data first
    let cloudState = null;
    try {
        cloudState = await loadFromFirestore();
    } catch (_) {}

    const localRaw = localStorage.getItem("ml_30day_tracker_state");
    const localState = localRaw ? JSON.parse(localRaw) : null;

    // Use whichever state is available (prefer cloud)
    const saved = cloudState || localState;

    if (saved) {
        try {
            appState.startDate = saved.startDate || appState.startDate;
            appState.projects = saved.projects || appState.projects;
            appState.resources = saved.resources || appState.resources;
            DAYS_DATA.forEach(d => {
                if (saved.days && saved.days[d.day]) {
                    appState.days[d.day].checked = {
                        learning: !!saved.days[d.day].checked.learning,
                        coding: !!saved.days[d.day].checked.coding,
                        revision: !!saved.days[d.day].checked.revision,
                        project: !!saved.days[d.day].checked.project
                    };
                    appState.days[d.day].notes = saved.days[d.day].notes || "";
                }
            });
        } catch (e) {
            console.error("Error merging saved state:", e);
        }
    }

    setSyncStatus(cloudState ? 'synced' : 'local');
}

// Save state to localStorage and Firestore cloud
function saveStateToStorage() {
    localStorage.setItem("ml_30day_tracker_state", JSON.stringify(appState));
    setSyncStatus('saving');
    saveToFirestore(appState).then(ok => {
        setSyncStatus(ok ? 'synced' : 'local');
    });
}

// Update the sync indicator pill in the UI
function setSyncStatus(status) {
    const el = document.getElementById('sync-indicator');
    if (!el) return;
    const icons = {
        loading: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`,
        saving: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
        synced: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        local: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    };
    const labels = { loading: 'Connecting...', saving: 'Syncing...', synced: 'Synced to cloud', local: 'Saved locally' };
    el.innerHTML = `${icons[status]} ${labels[status]}`;
    el.style.opacity = status === 'saving' || status === 'loading' ? '0.6' : '1';
}

// Initialize specific UI Elements
function initUI() {
    document.getElementById('start-date-input').value = appState.startDate;
    
    // Set custom visual gradient programmatically for overall completion circle
    const svgEl = document.querySelector('.circular-svg');
    if (svgEl) {
        // Append gradient colors inside SVG dynamically
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1" />
                <stop offset="100%" stop-color="#a855f7" />
            </linearGradient>
        `;
        svgEl.prepend(defs);
    }
    
    // Auto-expand textarea on typing
    const txtArea = document.getElementById('day-notes');
    txtArea.addEventListener('input', () => {
        txtArea.style.height = 'auto';
        txtArea.style.height = txtArea.scrollHeight + 'px';
    });
}

// -------------------------------------------------------------
// Rendering Modules
// -------------------------------------------------------------

// Calculate and render all dashboard metrics
function renderStats() {
    let completedDaysCount = 0;
    let completedTasksCount = 0;
    let totalHoursLogged = 0;

    DAYS_DATA.forEach(d => {
        const check = appState.days[d.day].checked;
        const tasksDone = Object.values(check).filter(Boolean).length;
        completedTasksCount += tasksDone;

        // Calculate hours based on checkbox values:
        // Learning (1.0 hr), Coding (1.0 hr), Revision (0.5 hr), Project (0.5 hr)
        if (check.learning) totalHoursLogged += 1.0;
        if (check.coding) totalHoursLogged += 1.0;
        if (check.revision) totalHoursLogged += 0.5;
        if (check.project) totalHoursLogged += 0.5;

        if (tasksDone === 4) {
            completedDaysCount++;
        }
    });

    // Overall completion percentage
    const completionPercent = Math.round((completedDaysCount / 30) * 100);
    document.getElementById('overall-percentage').textContent = `${completionPercent}%`;
    
    // Animate circular progress ring
    const circle = document.getElementById('overall-progress-circle');
    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (completionPercent / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }

    // Hours indicator
    document.getElementById('total-hours').textContent = `${totalHoursLogged.toFixed(1)}h`;

    // Tasks ratio (e.g. 15/120)
    document.getElementById('tasks-ratio').textContent = `${completedTasksCount}/120`;

    // Streak calculation (longest consecutive completed days from Day 1)
    let streak = 0;
    for (let i = 1; i <= 30; i++) {
        const check = appState.days[i].checked;
        const allDone = Object.values(check).every(Boolean);
        if (allDone) {
            streak++;
        } else {
            break; // Stop at first uncompleted day
        }
    }
    document.getElementById('current-streak').textContent = streak;
}

// Render the 30 days grid
function renderGrid() {
    const gridContainer = document.getElementById('days-grid');
    gridContainer.innerHTML = '';

    let cardIndex = 0;
    DAYS_DATA.forEach(d => {
        const checked = appState.days[d.day].checked;
        const tasksDone = Object.values(checked).filter(Boolean).length;
        
        let status = 'not-started';
        if (tasksDone === 4) {
            status = 'completed';
        } else if (tasksDone > 0) {
            status = 'in-progress';
        }

        // Apply filters
        if (filterType === 'completed' && status !== 'completed') return;
        if (filterType === 'in-progress' && status !== 'in-progress') return;
        if (filterType === 'not-started' && status !== 'not-started') return;

        // Insert week separator label before Day 1, 8, 15, 22, 29
        if (filterType === 'all') {
            if (d.day === 1 || d.day === 8 || d.day === 15 || d.day === 22 || d.day === 29) {
                const weekNum = Math.ceil(d.day / 7);
                const weekLabel = document.createElement('div');
                weekLabel.className = 'week-group-label';
                weekLabel.textContent = `Week ${weekNum}`;
                gridContainer.appendChild(weekLabel);
            }
        }

        // Card element
        const card = document.createElement('div');
        card.className = `day-card ${status} ${d.day === activeDay ? 'active' : ''}`;
        card.dataset.day = d.day;
        card.style.setProperty('--i', cardIndex);
        cardIndex++;

        card.innerHTML = `
            <div class="day-card-header">
                <span class="day-number">Day ${d.day}</span>
                <span class="status-indicator-dot"></span>
            </div>
            <div class="day-card-topic">${d.title}</div>
            <div class="day-card-progress">
                <span class="day-card-progress-bar ${checked.learning ? 'filled' : ''}"></span>
                <span class="day-card-progress-bar ${checked.coding ? 'filled' : ''}"></span>
                <span class="day-card-progress-bar ${checked.revision ? 'filled' : ''}"></span>
                <span class="day-card-progress-bar ${checked.project ? 'filled' : ''}"></span>
            </div>
        `;

        card.addEventListener('click', () => {
            activeDay = d.day;
            // Update active states
            document.querySelectorAll('.day-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            renderActiveDayDetails();
        });

        gridContainer.appendChild(card);
    });
}

// Render detailed info for the active day in the right sidebar
function renderActiveDayDetails() {
    const dayObj = DAYS_DATA.find(d => d.day === activeDay);
    const dayState = appState.days[activeDay];

    document.getElementById('detail-day-badge').textContent = `Day ${activeDay}`;
    document.getElementById('detail-title').textContent = dayObj.title;

    // Display formatted calendar date
    const dateLabel = document.getElementById('detail-calendar-date');
    dateLabel.textContent = getFormattedDateForDay(activeDay, true);

    // Update checkboxes
    document.getElementById('task-learning').checked = dayState.checked.learning;
    document.getElementById('task-coding').checked = dayState.checked.coding;
    document.getElementById('task-revision').checked = dayState.checked.revision;
    document.getElementById('task-project').checked = dayState.checked.project;

    // Set tasks details descriptions
    document.getElementById('task-learning-desc').textContent = dayObj.learning;
    document.getElementById('task-coding-desc').textContent = dayObj.coding;
    document.getElementById('task-revision-desc').textContent = dayObj.revision;
    document.getElementById('task-project-desc').textContent = dayObj.project;

    // Load notes
    const notesArea = document.getElementById('day-notes');
    notesArea.value = dayState.notes;
    notesArea.style.height = 'auto';
    notesArea.style.height = notesArea.scrollHeight + 'px';
}

// Update and render projects progress
function renderProjectProgress() {
    // Regression project logic
    calculateSingleProjectProgress('regression', 'p1-repo-url', 'p1-demo-url');
    // Classification project logic
    calculateSingleProjectProgress('classification', 'p2-repo-url', 'p2-demo-url');
    // Clustering project logic
    calculateSingleProjectProgress('clustering', 'p3-repo-url', 'p3-demo-url');
}

function calculateSingleProjectProgress(projectKey, repoId, demoId) {
    const targetDays = PROJECT_DAYS[projectKey];
    let completedCount = 0;
    
    targetDays.forEach(dayNum => {
        const state = appState.days[dayNum];
        if (state.checked.project) {
            completedCount++;
        }
    });

    const percent = Math.round((completedCount / targetDays.length) * 100);
    const cardEl = document.querySelector(`.project-milestone-card[data-project="${projectKey}"]`);
    
    // Update texts and progress bar
    if (cardEl) {
        cardEl.querySelector('.project-completion-text').textContent = `${percent}% Done`;
        cardEl.querySelector('.project-progress-bar').style.width = `${percent}%`;
        
        // Highlight involved day nodes in the project UI
        targetDays.forEach(dayNum => {
            const node = cardEl.querySelector(`.day-node[data-day="${dayNum}"]`);
            if (node) {
                if (appState.days[dayNum].checked.project) {
                    node.classList.add('node-completed');
                } else {
                    node.classList.remove('node-completed');
                }
            }
        });
    }

    // Set repositories inputs
    document.getElementById(repoId).value = appState.projects[projectKey].repo;
    document.getElementById(demoId).value = appState.projects[projectKey].demo;
}

// Render resources checkbox state
function renderResources() {
    document.getElementById('res-kaggle').checked = appState.resources.kaggle;
    document.getElementById('res-google').checked = appState.resources.google;
    document.getElementById('res-sklearn').checked = appState.resources.sklearn;
    document.getElementById('res-statquest').checked = appState.resources.statquest;
}

// -------------------------------------------------------------
// Interactive Events & Handlers
// -------------------------------------------------------------
function setupEventListeners() {
    // Checkbox controls in detail pane
    ['learning', 'coding', 'revision', 'project'].forEach(task => {
        const box = document.getElementById(`task-${task}`);
        box.addEventListener('change', (e) => {
            appState.days[activeDay].checked[task] = e.target.checked;
            saveStateToStorage();
            renderStats();
            renderGrid();
            renderProjectProgress();
        });
    });

    // Notes auto-saving
    document.getElementById('day-notes').addEventListener('input', (e) => {
        appState.days[activeDay].notes = e.target.value;
        saveStateToStorage();
    });

    // Project input urls updates
    const linkMap = [
        { id: 'p1-repo-url', proj: 'regression', key: 'repo' },
        { id: 'p1-demo-url', proj: 'regression', key: 'demo' },
        { id: 'p2-repo-url', proj: 'classification', key: 'repo' },
        { id: 'p2-demo-url', proj: 'classification', key: 'demo' },
        { id: 'p3-repo-url', proj: 'clustering', key: 'repo' },
        { id: 'p3-demo-url', proj: 'clustering', key: 'demo' }
    ];

    linkMap.forEach(item => {
        document.getElementById(item.id).addEventListener('change', (e) => {
            appState.projects[item.proj][item.key] = e.target.value;
            saveStateToStorage();
        });
    });

    // Resource trackers check/uncheck
    const resMap = [
        { id: 'res-kaggle', key: 'kaggle' },
        { id: 'res-google', key: 'google' },
        { id: 'res-sklearn', key: 'sklearn' },
        { id: 'res-statquest', key: 'statquest' }
    ];

    resMap.forEach(item => {
        document.getElementById(item.id).addEventListener('change', (e) => {
            appState.resources[item.key] = e.target.checked;
            saveStateToStorage();
        });
    });

    // Grid filters selection
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterType = e.target.dataset.filter;
            renderGrid();
        });
    });

    // Jump to active day (first uncompleted day)
    document.getElementById('today-shortcut-btn').addEventListener('click', () => {
        let firstUnfinished = 1;
        for (let i = 1; i <= 30; i++) {
            const checked = appState.days[i].checked;
            const allDone = Object.values(checked).every(Boolean);
            if (!allDone) {
                firstUnfinished = i;
                break;
            }
        }
        activeDay = firstUnfinished;
        renderGrid();
        renderActiveDayDetails();
        
        // Scroll to active card in the grid
        const activeCard = document.querySelector(`.day-card[data-day="${activeDay}"]`);
        if (activeCard) {
            activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    // Settings Dropdown visibility Toggle
    const settingsToggle = document.getElementById('settings-toggle-btn');
    const settingsMenu = document.getElementById('settings-menu');
    settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (settingsMenu && !settingsMenu.classList.contains('hidden') && !settingsMenu.contains(e.target) && e.target !== settingsToggle) {
            settingsMenu.classList.add('hidden');
        }
    });

    // Start date adjustment setting
    document.getElementById('start-date-input').addEventListener('change', (e) => {
        appState.startDate = e.target.value;
        saveStateToStorage();
        renderActiveDayDetails(); // Refresh dates shown on UI
        renderGrid();
    });

    // Export state backup file
    document.getElementById('export-data-btn').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `ml_30day_progress_backup_${new Date().toISOString().split('T')[0]}.json`);
        dlAnchorElem.click();
    });

    // Import state backup file
    const fileInput = document.getElementById('import-file-input');
    document.getElementById('import-data-btn').addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            (async () => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (parsed.days && typeof parsed.days === 'object') {
                        appState = parsed;
                        saveStateToStorage();
                        
                        // Reload everything
                        await loadStateFromStorage();
                        document.getElementById('start-date-input').value = appState.startDate;
                        renderStats();
                        renderGrid();
                        renderActiveDayDetails();
                        renderProjectProgress();
                        renderResources();
                        alert("Dashboard profile imported successfully!");
                    } else {
                        alert("Invalid JSON format. Upload state failed.");
                    }
                } catch (err) {
                    alert("Error parsing backup file.");
                }
            })();
        };
        reader.readAsText(file);
    });

    // Reset application state data
    document.getElementById('reset-progress-btn').addEventListener('click', () => {
        const conf = confirm("Are you absolutely sure you want to reset all your progress data, project links, and study notes? This cannot be undone.");
        if (conf) {
            localStorage.removeItem("ml_30day_tracker_state");
            
            // Re-initialize clean state
            appState = {
                startDate: new Date().toISOString().split('T')[0],
                days: {},
                projects: {
                    regression: { repo: "", demo: "" },
                    classification: { repo: "", demo: "" },
                    clustering: { repo: "", demo: "" }
                },
                resources: {
                    kaggle: false,
                    google: false,
                    sklearn: false,
                    statquest: false
                }
            };
            DAYS_DATA.forEach(d => {
                appState.days[d.day] = {
                    checked: { learning: false, coding: false, revision: false, project: false },
                    notes: ""
                };
            });
            
            saveStateToStorage();
            document.getElementById('start-date-input').value = appState.startDate;
            renderStats();
            renderGrid();
            renderActiveDayDetails();
            renderProjectProgress();
            renderResources();
            alert("Progress wiped. Good luck starting fresh!");
        }
    });

    // -------------------------------------------------------------
    // Focus Session Timer Operations
    // -------------------------------------------------------------
    const presets = document.querySelectorAll('.btn-preset');
    presets.forEach(p => {
        p.addEventListener('click', (e) => {
            presets.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            const mins = parseInt(e.target.dataset.time);
            resetTimer(mins);
        });
    });

    // Timer play/pause controls
    const playBtn = document.getElementById('timer-play-btn');
    playBtn.addEventListener('click', () => {
        if (timerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    document.getElementById('timer-reset-btn').addEventListener('click', () => {
        const activePreset = document.querySelector('.btn-preset.active');
        const mins = activePreset ? parseInt(activePreset.dataset.time) : 60;
        resetTimer(mins);
    });
}

// -------------------------------------------------------------
// Timer Internal Helpers
// -------------------------------------------------------------
function startTimer() {
    // Unlock Audio Context on user interaction (safeguard browsers block autoplay)
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    timerRunning = true;
    const playBtn = document.getElementById('timer-play-btn');
    const timerContainer = document.getElementById('timer-ring-fg').closest('.timer-ring-container');
    timerContainer.classList.add('timer-running');
    
    // Swap icon & label to Pause
    playBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="timer-btn-pause-icon"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        <span>Pause</span>
    `;
    playBtn.classList.remove('btn-primary');
    playBtn.classList.add('btn-warning');

    timerInterval = setInterval(() => {
        timerSecondsLeft--;
        updateTimerVisuals();

        if (timerSecondsLeft <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            timerContainer.classList.remove('timer-running');
            playBeepChime();
            alert("Focus session complete! Take a brief break or switch study blocks.");
            
            // Revert play button to start state
            resetTimerControlsUI();
        }
    }, 1000);
}

function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    
    const timerContainer = document.getElementById('timer-ring-fg').closest('.timer-ring-container');
    timerContainer.classList.remove('timer-running');
    
    const playBtn = document.getElementById('timer-play-btn');
    playBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="timer-btn-play-icon"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>Resume</span>
    `;
    playBtn.classList.remove('btn-warning');
    playBtn.classList.add('btn-primary');
}

function resetTimer(minutes) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerTotalSeconds = minutes * 60;
    timerSecondsLeft = timerTotalSeconds;
    updateTimerVisuals();
    resetTimerControlsUI();
    
    const timerContainer = document.getElementById('timer-ring-fg').closest('.timer-ring-container');
    if (timerContainer) timerContainer.classList.remove('timer-running');
}

function resetTimerControlsUI() {
    const playBtn = document.getElementById('timer-play-btn');
    playBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="timer-btn-play-icon"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>Start</span>
    `;
    playBtn.classList.remove('btn-warning');
    playBtn.classList.add('btn-primary');
}

function updateTimerVisuals() {
    const mins = Math.floor(timerSecondsLeft / 60);
    const secs = timerSecondsLeft % 60;
    
    // Formatting text display e.g. 05:09
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = formatted;

    // Math calculation for SVG dash-offset
    const ring = document.getElementById('timer-ring-fg');
    if (ring) {
        const circumference = 2 * Math.PI * 45; // r=45 -> 282.74
        const fraction = timerSecondsLeft / timerTotalSeconds;
        // Decrease dashoffset to draw the ring backwards
        const offset = circumference - (fraction * circumference);
        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = offset;
    }
}

// Synthesizer beep chime using Web Audio API
function playBeepChime() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Play two notes (chime)
    playSynthNote(523.25, 0.15); // C5
    setTimeout(() => {
        playSynthNote(659.25, 0.35); // E5
    }, 150);
}

function playSynthNote(freq, duration) {
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime); // keep volume subtle
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.error("Web Audio synthesized note failed", e);
    }
}

// -------------------------------------------------------------
// Utilities & Date Generators
// -------------------------------------------------------------
function getFormattedDateForDay(dayNum, verbose = false) {
    if (!appState.startDate) return "";
    
    const baseDate = new Date(appState.startDate);
    // Add N - 1 days
    baseDate.setDate(baseDate.getDate() + (dayNum - 1));
    
    if (verbose) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return baseDate.toLocaleDateString('en-US', options);
    } else {
        // Shorthand e.g. "Jul 05"
        const options = { month: 'short', day: 'numeric' };
        return baseDate.toLocaleDateString('en-US', options);
    }
}
