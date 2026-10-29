// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDJLcsdfehGYG_IA_k6cIlBX2XqbbxO9BY",
    authDomain: "wedding-planner-c23c1.firebaseapp.com",
    databaseURL: "https://wedding-planner-c23c1-default-rtdb.firebaseio.com",
    projectId: "wedding-planner-c23c1",
    storageBucket: "wedding-planner-c23c1.firebasestorage.app",
    messagingSenderId: "848634853179",
    appId: "1:848634853179:web:f53582b92e6b83c200a91e",
    measurementId: "G-763K2JP176"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let globalData = {
    info: {
        lamaranLocation: "Rumah Sindi",
        lamaranDate: "",
        nikahanLocation: "Gedung / KUA",
        nikahanDate: ""
    },
    lamaran: {},
    nikahan: {},
    seserahan: {},
    administrasi: {},
    tamu: {}
};

const defaultInitialData = {
    info: {
        lamaranLocation: "Rumah Sindi",
        lamaranDate: "2027-06-15",
        nikahanLocation: "Gedung Utama",
        nikahanDate: "2027-12-20"
    },
    lamaran: {},
    nikahan: {},
    seserahan: {},
    administrasi: {},
    tamu: {}
};

// Listener Real-time Autentikasi dan Sinkronisasi Database
auth.onAuthStateChanged((user) => {
    const authScreen = document.getElementById('auth-screen');
    const appScreen = document.getElementById('app-screen');
    const currentPage = window.location.pathname.split('/').pop();

    if (user) {
        currentUser = user;
        if (authScreen) authScreen.classList.add('hidden');
        if (appScreen) appScreen.classList.remove('hidden');

        // Mendengarkan perubahan data Firebase secara Real-time (.on)
        db.ref('weddings/' + user.uid).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                globalData = data;
            } else {
                globalData = defaultInitialData;
                syncData();
            }

            // Memperbarui tampilan secara otomatis pada tab/halaman yang aktif
            if (typeof renderPage === 'function') {
                renderPage();
            }
        });
    } else {
        currentUser = null;
        // Memastikan sesi halaman terlindungi jika pengguna belum login
        if (currentPage && currentPage !== 'index.html' && currentPage !== '') {
            window.location.href = 'index.html';
        } else {
            if (authScreen) authScreen.classList.remove('hidden');
            if (appScreen) appScreen.classList.add('hidden');
        }
    }
});

// Fungsi Mengirim Data Baru ke Firebase
function syncData() {
    if (currentUser) {
        db.ref('weddings/' + currentUser.uid).set(globalData);
    }
}

// Format Angka ke Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number || 0);
}

// Fungsi Autentikasi
function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    errorEl.classList.add('hidden');

    auth.signInWithEmailAndPassword(email, password).catch((error) => {
        errorEl.innerText = error.message;
        errorEl.classList.remove('hidden');
    });
}

function handleRegister() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    errorEl.classList.add('hidden');

    if (!email || !password) {
        errorEl.innerText = "Isi email dan password terlebih dahulu.";
        errorEl.classList.remove('hidden');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password).catch((error) => {
        errorEl.innerText = error.message;
        errorEl.classList.remove('hidden');
    });
}

function handleLogout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}