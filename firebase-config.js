// === KONFIGURASI FIREBASE USER ===
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
const database = firebase.database();

let currentUser = null;

let globalData = {
    lamaran: {},
    nikahan: {},
    seserahan: {},
    administrasi: {},
    tamu: {}
};

// DATA DEFAULT AWAL
const defaultInitialData = {
    lamaran: {
        l1: { id: 'l1', name: 'Cincin', estimasi: 0, aktual: 0, note: 'Toko Emas (Gold)', paid: false },
        l2: { id: 'l2', name: 'Baju Lamaran Couple', estimasi: 0, aktual: 0, note: 'Shopee (Abu-abu)', paid: false },
        l3: { id: 'l3', name: 'Hias Seserahan', estimasi: 0, aktual: 0, note: 'WO (Abu-abu)', paid: false },
        l4: { id: 'l4', name: 'MakeUp Lamaran', estimasi: 0, aktual: 0, note: 'Mba Dinda (Soft Natural)', paid: false },
        l5: { id: 'l5', name: 'Fotografer', estimasi: 0, aktual: 0, note: 'Toophoto', paid: false },
        l6: { id: 'l6', name: 'Dekor', estimasi: 0, aktual: 0, note: 'WO (Putih)', paid: false },
        l7: { id: 'l7', name: 'Souvenir Jilbab', estimasi: 0, aktual: 0, note: 'Epicentrum (Soft Natural)', paid: false },
        l8: { id: 'l8', name: 'Catering', estimasi: 0, aktual: 0, note: 'Mama (masak sendiri)', paid: false }
    },
    nikahan: {
        n1: { id: 'n1', name: 'Dokumen Pernikahan KUA', estimasi: 600000, aktual: 600000, note: 'Pendaftaran KUA', paid: true },
        n2: { id: 'n2', name: 'Berkas FC Calon Pria', estimasi: 50000, aktual: 0, note: 'KTP, Ijazah, Akte, KK', paid: false },
        n3: { id: 'n3', name: 'Berkas FC Calon Wanita', estimasi: 50000, aktual: 0, note: 'KTP, Ijazah, Akte, KK', paid: false },
        n4: { id: 'n4', name: 'Catering & Dekorasi', estimasi: 25000000, aktual: 0, note: 'DP WO 30%', paid: false }
    },
    seserahan: {
        s1: { id: 's1', name: 'Seperangkat Alat Sholat', category: 'Seserahan Cewe', brand: 'Putih Silk', link: 'https://shopee.co.id', estimasi: 500000, aktual: 500000, paid: true },
        s2: { id: 's2', name: 'Set Skincare Perawatan', category: 'Seserahan Cewe', brand: 'Wardah / Soft Pink', link: 'https://tokopedia.com', estimasi: 1000000, aktual: 0, paid: false },
        s3: { id: 's3', name: 'Set Kemeja Kerja Pria', category: 'Seserahan Cowo', brand: 'Executive / Hitam', link: '', estimasi: 750000, aktual: 0, paid: false },
        s4: { id: 's4', name: 'Jadah & Wajik Ketan', category: 'Seserahan Adat', brand: 'Ketan Manis Tradisional', link: '', estimasi: 300000, aktual: 0, paid: false }
    },
    administrasi: {
        a1: { id: 'a1', name: 'Surat Pengantar RT/RW (Pria)', category: 'Persyaratan Cowo', estimasi: 0, aktual: 0, note: 'RT/RW Calon Pria', paid: false },
        a2: { id: 'a2', name: 'Surat N1, N2, N4 Kelurahan (Pria)', category: 'Persyaratan Cowo', estimasi: 50000, aktual: 0, note: 'Kelurahan asal Pria', paid: false },
        a3: { id: 'a3', name: 'Surat Rekomendasi Nikah KUA (Pria)', category: 'Persyaratan Cowo', estimasi: 0, aktual: 0, note: 'KUA Kecamatan Pria (Numpang Nikah)', paid: false },
        a4: { id: 'a4', name: 'Pasfoto 2x3 & 4x6 Latar Biru (Pria)', category: 'Persyaratan Cowo', estimasi: 30000, aktual: 0, note: 'Kemeja Putih Polos', paid: false },
        a5: { id: 'a5', name: 'Surat Pengantar RT/RW (Wanita)', category: 'Persyaratan Cewe', estimasi: 0, aktual: 0, note: 'RT/RW Calon Wanita', paid: false },
        a6: { id: 'a6', name: 'Surat N1, N2, N4 Kelurahan (Wanita)', category: 'Persyaratan Cewe', estimasi: 50000, aktual: 0, note: 'Kelurahan asal Wanita', paid: false },
        a7: { id: 'a7', name: 'Sertifikat Catin & Imunisasi TT (Wanita)', category: 'Persyaratan Cewe', estimasi: 50000, aktual: 0, note: 'Puskesmas setempat', paid: false },
        a8: { id: 'a8', name: 'Pasfoto 2x3 & 4x6 Latar Biru (Wanita)', category: 'Persyaratan Cewe', estimasi: 30000, aktual: 0, note: 'Berjilbab / Rapi', paid: false },
        a9: { id: 'a9', name: 'Pendaftaran & Biling KUA Target', category: 'Dokumen Bersama', estimasi: 600000, aktual: 600000, note: 'Pendaftaran Nikah KUA', paid: true }
    },
    tamu: {
    t1: { id: 't1', name: 'Keluarga Besar Pak RT', pihak: 'Pihak Cewe', alamat: 'Jl. Melati No. 12', pax: 2, sent: true },
    t2: { id: 't2', name: 'Sahabat SMA Sindi', pihak: 'Pihak Cewe', alamat: 'Jakarta Selatan', pax: 5, sent: false },
    t3: { id: 't3', name: 'Budi & Pasangan', pihak: 'Pihak Cowo', alamat: 'Bandung', pax: 2, sent: false }
	}
};

// Cek Status Auth
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        const authScreen = document.getElementById('auth-screen');
        const appScreen = document.getElementById('app-screen');
        if (authScreen) authScreen.classList.add('hidden');
        if (appScreen) appScreen.classList.remove('hidden');
        listenDatabase();
    } else {
        currentUser = null;
        const authScreen = document.getElementById('auth-screen');
        const appScreen = document.getElementById('app-screen');
        if (authScreen && appScreen) {
            authScreen.classList.remove('hidden');
            appScreen.classList.add('hidden');
        } else {
            const currentPage = window.location.pathname.split("/").pop();
            if (currentPage !== "" && currentPage !== "index.html") {
                window.location.href = "index.html";
            }
        }
    }
});

function listenDatabase() {
    const dbRef = database.ref('wedding-planner-app');
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            globalData = {
                lamaran: data.lamaran || {},
                nikahan: data.nikahan || {},
                seserahan: data.seserahan || {},
                administrasi: data.administrasi || {},
                tamu: data.tamu || {}
            };
        } else {
            globalData = defaultInitialData;
            syncData();
        }
        if (typeof renderPage === 'function') {
            renderPage();
        }
    });
}

function syncData() {
    if (currentUser) {
        database.ref('wedding-planner-app').set(globalData);
    }
}

function handleLogout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    });
}

function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
}

function showAuthLoading(show) {
    const form = document.getElementById('auth-form');
    const loader = document.getElementById('auth-loader');
    if (form) form.classList.toggle('hidden', show);
    if (loader) loader.classList.toggle('hidden', !show);
}

function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorMsg = document.getElementById('auth-error');

    if (errorMsg) errorMsg.classList.add('hidden');
    showAuthLoading(true);

    auth.signInWithEmailAndPassword(email, password)
        .then(() => showAuthLoading(false))
        .catch((error) => {
            showAuthLoading(false);
            if (errorMsg) {
                errorMsg.innerText = "Gagal masuk: " + error.message;
                errorMsg.classList.remove('hidden');
            }
        });
}

function handleRegister() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorMsg = document.getElementById('auth-error');

    if (!email || !password || password.length < 6) {
        if (errorMsg) {
            errorMsg.innerText = "Masukkan email dan password (minimal 6 karakter).";
            errorMsg.classList.remove('hidden');
        }
        return;
    }

    if (errorMsg) errorMsg.classList.add('hidden');
    showAuthLoading(true);

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            showAuthLoading(false);
            alert("Akun berhasil dibuat!");
        })
        .catch((error) => {
            showAuthLoading(false);
            if (errorMsg) {
                errorMsg.innerText = "Gagal mendaftar: " + error.message;
                errorMsg.classList.remove('hidden');
            }
        });
}