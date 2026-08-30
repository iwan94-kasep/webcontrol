const navbarNav = document.querySelector('.navbar-nav');

// Saat hamburger menu diklik
document.querySelector('#menu').onclick = (e) => {
e.preventDefault();
navbarNav.classList.toggle('active');
};

// Saat link navbar diklik
document.querySelectorAll('.navbar-nav a').forEach(link => {


link.addEventListener('click', () => {
    navbarNav.classList.remove('active');
});


});

// Saat klik di luar hamburger dan menu
const hamburger = document.querySelector('#menu');

document.addEventListener('click', function(e) {


if (
    !hamburger.contains(e.target) &&
    !navbarNav.contains(e.target)
) {
    navbarNav.classList.remove('active');
}


});


/*pop up pesanan*/
let layananDipilih = {};
let koordinatPengguna = null;

// Buka popup
function bukaPesanan(nama, durasi, harga) {

layananDipilih = {
    nama: nama,
    durasi: durasi,
    harga: harga
};

document.getElementById("namaLayanan").textContent = nama;
document.getElementById("durasiLayanan").textContent = durasi;
document.getElementById("hargaLayanan").textContent = harga;

document.getElementById("popupPesanan").classList.add("active");

// Reset form
document.getElementById("alamat").value = "";
document.getElementById("catatan").value = "";

document.querySelectorAll('input[name="terapis"]').forEach(input => {
    input.checked = false;
});

koordinatPengguna = null;


}

// Tutup popup
function tutupPesanan() {
document.getElementById("popupPesanan").classList.remove("active");
}

// Ambil lokasi GPS
function ambilLokasi() {


if (!navigator.geolocation) {
    alert("Browser Anda tidak mendukung GPS.");
    return;
}

const tombol = document.querySelector(".btn-gps");

tombol.textContent = "📍 Mengambil lokasi...";

navigator.geolocation.getCurrentPosition(

    async function(position) {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        koordinatPengguna = {
            lat: lat,
            lon: lon
        };

        try {

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
            );

            const data = await response.json();

            if (data.display_name) {
                document.getElementById("alamat").value =
                    data.display_name;
            }

            tombol.textContent = "📍 Lokasi Berhasil Diambil";

        } catch (error) {

            document.getElementById("alamat").value =
                `Lokasi GPS: ${lat}, ${lon}`;

            tombol.textContent = "📍 Gunakan Lokasi Saya";
        }

    },

    function(error) {

        tombol.textContent = "📍 Gunakan Lokasi Saya";

        if (error.code === 1) {
            alert("Izin lokasi ditolak. Silakan izinkan akses lokasi pada browser.");
        } else {
            alert("Lokasi tidak dapat ditemukan. Silakan coba lagi.");
        }

    },

    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }

);


}

// Konfirmasi pesanan
function konfirmasiPesanan() {


const alamat = document.getElementById("alamat").value.trim();

const terapis = document.querySelector(
    'input[name="terapis"]:checked'
);

const catatan = document.getElementById("catatan").value.trim();


if (!alamat) {
    alert("Silakan isi alamat lengkap terlebih dahulu.");
    return;
}

if (!terapis) {
    alert("Silakan pilih jenis terapis.");
    return;
}


const nomorWA = "6281413529419";


const pesan =


`Halo Tritans Massage, saya ingin memesan:

Layanan: ${layananDipilih.nama}
Durasi: ${layananDipilih.durasi}
Harga: ${layananDipilih.harga}

Alamat:
${alamat}

Terapis: ${terapis.value}

Catatan:
${catatan || "-"}`;


const url =
    `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;


window.open(url, "_blank");

tutupPesanan();


}
