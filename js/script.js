

// Data dummy: array of object untuk Daftar Course
// URL Backend NestJS
const KURSUS_API = "http://localhost:3000/kursus";

// Data kursus dari backend
let daftarKursus = [];

const KELAS_BADGE = "inline-block rounded-[20px] px-2.5 py-1 text-[0.8rem] font-semibold text-white";
const KELAS_LINK = "font-semibold text-navy hover:text-gold-dark";

// Format Rupiah
function formatRupiah(angka) {
  return "Rp" + String(angka).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Filter berdasarkan level
function filterByLevel(data, level) {
  if (level === "semua") {
    return data;
  }

  return data.filter(function (kursus) {
    return kursus.level === level;
  });
}

// Menampilkan kursus
function tampilkanKursus(level = "semua") {
  const tbody = document.getElementById("tabel-kursus-body");
  const info = document.getElementById("info-jumlah");

  if (!tbody) return;

  const hasil = filterByLevel(daftarKursus, level);

  let baris = "";

  if (hasil.length === 0) {
    baris = '<tr><td colspan="6">Belum ada kursus untuk level ini</td></tr>';
  } else {
    for (let i = 0; i < hasil.length; i++) {
      const kursus = hasil[i];

      let kelasBadge = KELAS_BADGE + " bg-gold";

      if (kursus.level === "Lanjutan") {
        kelasBadge = KELAS_BADGE + " bg-linear-to-br from-ember to-danger";
      }

      baris +=
        "<tr>" +
        "<td>" + (i + 1) + "</td>" +
        "<td>" + kursus.nama + "</td>" +
        '<td><span class="' + kelasBadge + '">' + kursus.level + "</span></td>" +
        "<td>" + kursus.jadwal + "</td>" +
        '<td><span class="font-bold text-navy">' + formatRupiah(kursus.harga) + "</span></td>" +
        "<td>" +
          '<a href="' + kursus.halamanDetail + '" class="' + KELAS_LINK + '">Lihat Detail</a> | ' +
          '<a href="formKursus.html" class="' + KELAS_LINK + '">Daftar</a> | ' +
          '<button type="button" data-action="edit" data-id="' + kursus.id + '" class="font-semibold text-navy">Edit</button> | ' +
          '<button type="button" data-action="delete" data-id="' + kursus.id + '" class="font-semibold text-danger">Hapus</button>' +
        "</td>" +
        "</tr>";
    }
  }

  tbody.innerHTML = baris;

  if (info) {
    info.textContent =
      "Menampilkan " + hasil.length + " dari " + daftarKursus.length + " kursus";
  }
}

// Mengambil data kursus dari backend
async function ambilKursus() {
  try {
    const response = await fetch(KURSUS_API);

    if (!response.ok) {
      throw new Error("Gagal mengambil data kursus");
    }

    daftarKursus = await response.json();

    const filter = document.getElementById("filter-level");

    tampilkanKursus(filter ? filter.value : "semua");

  } catch (error) {
    console.error("Error kursus:", error);

    const tbody = document.getElementById("tabel-kursus-body");

    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="6">Gagal mengambil data kursus dari server</td></tr>';
    }
  }
}

// Menambahkan dan mengubah kursus
const formKursus = document.getElementById("form-kelola-kursus");

if (formKursus) {
  formKursus.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("kursus-id").value;

    const data = {
      nama: document.getElementById("kursus-nama").value.trim(),
      level: document.getElementById("kursus-level").value,
      jadwal: document.getElementById("kursus-jadwal").value.trim(),
      harga: Number(document.getElementById("kursus-harga").value),
      halamanDetail: document.getElementById("kursus-detail").value,
    };

    try {
      const response = await fetch(
        id ? KURSUS_API + "/" + id : KURSUS_API,
        {
          method: id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const hasil = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(hasil.message)
            ? hasil.message.join(", ")
            : hasil.message || "Gagal menyimpan kursus"
        );
      }

      alert(id ? "Kursus berhasil diubah!" : "Kursus berhasil ditambahkan!");

      formKursus.reset();
      document.getElementById("kursus-id").value = "";

      document.getElementById("btn-simpan-kursus").textContent =
        "Tambah Kursus";

      document.getElementById("btn-batal-edit").classList.add("hidden");

      await ambilKursus();

    } catch (error) {
      alert(error.message);
    }
  });
}

// Memilih Edit atau Hapus
const tabelKursus = document.getElementById("tabel-kursus-body");

if (tabelKursus) {
  tabelKursus.addEventListener("click", async function (e) {
    const tombol = e.target.closest("button[data-action]");

    if (!tombol) return;

    const id = tombol.dataset.id;
    const aksi = tombol.dataset.action;

    if (aksi === "edit") {
      const kursus = daftarKursus.find(
        (item) => item.id === id
      );

      if (!kursus) return;

      document.getElementById("kursus-id").value = kursus.id;
      document.getElementById("kursus-nama").value = kursus.nama;
      document.getElementById("kursus-level").value = kursus.level;
      document.getElementById("kursus-jadwal").value = kursus.jadwal;
      document.getElementById("kursus-harga").value = kursus.harga;
      document.getElementById("kursus-detail").value = kursus.halamanDetail;

      document.getElementById("btn-simpan-kursus").textContent =
        "Simpan Perubahan";

      document.getElementById("btn-batal-edit").classList.remove("hidden");

      document.getElementById("form-kelola-kursus").scrollIntoView({
        behavior: "smooth",
      });
    }

    if (aksi === "delete") {
      const yakin = confirm("Apakah kamu yakin ingin menghapus kursus ini?");

      if (!yakin) return;

      try {
        const response = await fetch(KURSUS_API + "/" + id, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Gagal menghapus kursus");
        }

        alert("Kursus berhasil dihapus!");

        await ambilKursus();

      } catch (error) {
        alert(error.message);
      }
    }
  });
}

// Membatalkan mode edit
const tombolBatalEdit = document.getElementById("btn-batal-edit");

if (tombolBatalEdit) {
  tombolBatalEdit.addEventListener("click", function () {
    formKursus.reset();

    document.getElementById("kursus-id").value = "";

    document.getElementById("btn-simpan-kursus").textContent =
      "Tambah Kursus";

    tombolBatalEdit.classList.add("hidden");
  });
}

// Mengambil data saat halaman dibuka
ambilKursus();


//    BAGIAN 2 - JQUERY

if (typeof jQuery === "undefined") {
  console.warn("jQuery belum termuat. Fitur filter dan sidebar tidak aktif.");
} else {
  jQuery(function ($) {


    $("#filter-level").on("change", function () {
      tampilkanKursus($(this).val());
      $("#tabel-kursus-body").hide().fadeIn(300);
    });


    
    const $nav = $("header nav").first();     
    const $baris = $nav.children().first();   
    const $menu = $baris.find("ul").first();  

    if ($menu.length === 0) {
      return;
    }

    const LEBAR_MOBILE = 768;
    const GESER = -340; 
    const durasi = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 280;
    const halamanSekarang = location.pathname.split("/").pop() || "index.html";
    let terbuka = false;

    const itemMenu = $menu.find("a").map(function () {
      return { label: $(this).text().trim(), href: $(this).attr("href") };
    }).get();

    function adalahHalamanAktif(href) {
      if (href === halamanSekarang) {
        return true;
      }
      return href === "detailKursus.html" && halamanSekarang.indexOf("detail-") === 0;
    }

    let htmlLink = "";
    $.each(itemMenu, function (i, item) {
      let kelas = "sb-link";
      let atribut = "";
      if (item.href === "formKursus.html") {
        kelas += " is-cta";
      }
      if (adalahHalamanAktif(item.href)) {
        kelas += " is-active";
        atribut = ' aria-current="page"';
      }
      htmlLink += '<li><a class="' + kelas + '" href="' + item.href + '"' + atribut + ">" + item.label + "</a></li>";
    });

    const $toggle = $(
      '<button type="button" class="sb-toggle" aria-label="Buka menu navigasi" ' +
      'aria-expanded="false" aria-controls="sidebar">' +
      '<i class="fa-solid fa-bars" aria-hidden="true"></i></button>'
    );
    const $overlay = $('<div class="sb-overlay"></div>');
    const $panel = $(
      '<aside id="sidebar" class="sb-panel" role="dialog" aria-modal="true" ' +
      'aria-label="Menu navigasi" aria-hidden="true">' +
        '<div class="sb-head">' +
          '<a class="sb-logo" href="index.html">' +
          '<i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> COURSE <span>BAHASA</span></a>' +
          '<button type="button" class="sb-close" aria-label="Tutup menu">' +
          '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
        "</div>" +
        '<ul class="sb-links">' + htmlLink + "</ul>" +
      "</aside>"
    );

    $baris.addClass("sb-row").append($toggle);
    $menu.addClass("sb-menu");
    $("body").append($overlay, $panel);

    function bukaSidebar() {
      if (terbuka) {
        return;
      }
      terbuka = true;
      $("body").addClass("sb-lock");
      $overlay.stop(true, true).fadeIn(durasi);                              // efek fadeIn
      $panel.stop(true, true).show().animate({ right: 0 }, durasi);          // efek geser masuk
      $panel.attr("aria-hidden", "false");
      $toggle.attr("aria-expanded", "true");
      $panel.find(".sb-close").trigger("focus");
    }

    function tutupSidebar(langsung) {
      if (!terbuka) {
        return;
      }
      terbuka = false;
      const d = langsung ? 0 : durasi;
      $overlay.stop(true, true).fadeOut(d);
      $panel.stop(true, true).animate({ right: GESER }, d, function () {
        $panel.hide();
      });
      $panel.attr("aria-hidden", "true");
      $toggle.attr("aria-expanded", "false");
      $("body").removeClass("sb-lock");
      $toggle.trigger("focus");
    }

    // event handling jQuery
    $toggle.on("click", bukaSidebar);
    $panel.on("click", ".sb-close", function () { tutupSidebar(); });
    $overlay.on("click", function () { tutupSidebar(); });
    $panel.on("click", ".sb-link", function () { tutupSidebar(true); });

    $(document).on("keydown", function (e) {
      if (!terbuka) {
        return;
      }
      if (e.key === "Escape") {
        tutupSidebar();
        return;
      }
      if (e.key === "Tab") {
        const fokusable = $panel.find("a, button");
        const pertama = fokusable.first()[0];
        const terakhir = fokusable.last()[0];
        if (e.shiftKey && document.activeElement === pertama) {
          e.preventDefault();
          terakhir.focus();
        } else if (!e.shiftKey && document.activeElement === terakhir) {
          e.preventDefault();
          pertama.focus();
        }
      }
    });

    $(window).on("resize", function () {
      if (window.innerWidth > LEBAR_MOBILE) {
        tutupSidebar(true);
      }
    });
  });
}

// MENGGUNAKAN FETCH API


const API_URL = "https://6ae3454e933120ae20f89170.mockapi.io/testimoni/testimoni";

async function ambilTestimoni() {
  const loading = document.getElementById("api-loading");
  const success = document.getElementById("api-success");
  const error = document.getElementById("api-error");
  const retry = document.getElementById("api-retry");
  const list = document.getElementById("api-list");

  loading.classList.remove("hidden");
  loading.textContent = "Memuat testimoni...";
  success.classList.add("hidden");
  error.classList.add("hidden");
  retry.classList.add("hidden");
  list.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Gagal mengambil testimon");
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Data testimoni tidak tersedia");
    }

    const enamTestimoni = data.slice(0, 6);

    list.innerHTML = enamTestimoni.map((item) => `
      <article
        data-id="${item.id}"
        class="rounded-xl border border-mist bg-white p-5 shadow-card"
      >
        <div class="mb-4 flex items-center gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-snow font-bold text-navy"
          >
            ${item.nama.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 class="font-bold text-ink">
              ${item.nama}
            </h3>

            <p class="text-sm text-black">
              ${item.kursus}
            </p>
          </div>
        </div>

        <p class="mb-3 text-sm text-gold" aria-label="Rating ${item.rating} dari 5">
          ${"★".repeat(Math.max(0, Math.min(5, Number(item.rating) || 0)))}${"☆".repeat(5 - Math.max(0, Math.min(5, Number(item.rating) || 0)))}
        </p>

        <p class="text-sm leading-relaxed text-black">
          "${item.testimoni}"
        </p>
      </article>
    `).join("");

    loading.classList.add("hidden");
    success.classList.remove("hidden");

  } catch (err) {
    loading.classList.add("hidden");
    success.classList.add("hidden");

    error.textContent =
      "Testimoni gagal dimuat. Periksa koneksi atau URL API.";

    error.classList.remove("hidden");
    retry.classList.remove("hidden");

    console.error("Error API:", err);
  }
}

document.getElementById("api-retry")
  .addEventListener("click", ambilTestimoni);

ambilTestimoni();
