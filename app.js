const pesanan = [];

const dataTersimpan = localStorage.getItem("dataPesanan");
if (dataTersimpan) {
  pesanan.push(...JSON.parse(dataTersimpan));
  renderPesanan();
  updateTotal();
}

function tambahPesanan() {
  const nama = document.getElementById("nama").value;
  const menu = document.getElementById("menu").value;
  const minuman = document.getElementById("minuman").value;
  const harga = Number(document.getElementById("harga").value);

  if (!nama || !menu || !harga || !minuman) {
    alert("monggo kolom e diisi sedoyo");
    return;
  }

  const now = new Date();
  const waktu = now.toLocaleTimeString();

  const data = {
    id: Date.now(),
    nama,
    menu,
    minuman,
    harga,
    status: "Tunggu Sekedap",
    waktu,
  };

  pesanan.push(data);
  renderPesanan();
  updateTotal();
  simpanKeLocalStorage();

  // Kosongkan input
  document.getElementById("nama").value = "";
  document.getElementById("menu").value = "";
  document.getElementById("minuman").value = "";
  document.getElementById("harga").value = "";
}

function renderPesanan() {
  const list = document.getElementById("daftarPesanan");
  const filter = document.getElementById("filter")?.value || "Semua";
  const keyword =
    document.getElementById("searchInput")?.value.toLowerCase() || "";

  list.innerHTML = "";

  pesanan
    .filter((item) => {
      const cocokFilter = filter === "Semua" || item.status === filter;
      const cocokKeyword =
        item.nama.toLowerCase().includes(keyword) ||
        item.menu.toLowerCase().includes(keyword) ||
        item.minuman.toLowerCase().includes(keyword);
      return cocokFilter && cocokKeyword;
    })
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.nama}</strong> memesan <strong>${item.menu}</strong> dan minumnya <strong>${item.minuman}</strong> seharga <strong>${item.harga}</strong><br>
        Status:
        <span class="${item.status === "Sampun Siap !" ? "status-selesai" : ""}">${item.status}</span><br>
        <em>Dipesan pada: ${item.waktu}</em><br>
        <button onclick="ubahStatus(${item.id})">Tandai Sampun Siap !</button>
        <button onclick="hapusPesanan(${item.id})">Hapus</button>
      `;
      list.appendChild(li);
    });
}

function hapusPesanan(id) {
  const index = pesanan.findIndex((p) => p.id === id);
  if (index !== -1) {
    pesanan.splice(index, 1);
    renderPesanan();
    updateTotal();
    simpanKeLocalStorage();
  }
}

function ubahStatus(id) {
  const item = pesanan.find((p) => p.id === id);
  if (item && item.status !== "Sampun Siap !") {
    item.status = "Sampun Siap !";
    renderPesanan();
    simpanKeLocalStorage();
  }
}

function updateTotal() {
  const total = pesanan.reduce((acc, cur) => acc + cur.harga, 0);
  document.getElementById("totalHarga").textContent = total;
}

function resetPesanan() {
  if (confirm("Yakin pengen dihapus kabeh gan ?")) {
    pesanan.length = 0;
    renderPesanan();
    updateTotal();
    simpanKeLocalStorage();
  }
}

function simpanKeLocalStorage() {
  localStorage.setItem("dataPesanan", JSON.stringify(pesanan));
}

// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const tombol = document.getElementById("darkToggle");
  const isDark = document.body.classList.contains("dark-mode");
  tombol.textContent = isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap";

  localStorage.setItem("darkMode", isDark ? "true" : "false");
}

document.getElementById("darkToggle").addEventListener("click", toggleDarkMode);

// Cek dark mode saat load
window.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
    document.getElementById("darkToggle").textContent = "☀️ Mode Terang";
  }

  // Re-render saat pencarian diketik
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", renderPesanan);
  }
});
