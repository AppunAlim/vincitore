

// Data dummy: array of object untuk Daftar Course
const daftarKursus = [
  { id: 1, nama: "Bahasa Inggris", level: "Pemula",   jadwal: "Senin & Rabu, 19.00",   harga: 199999, halamanDetail: "detail-inggris.html" },
  { id: 2, nama: "Bahasa Inggris", level: "Lanjutan", jadwal: "Selasa & Kamis, 19.00", harga: 249999, halamanDetail: "detail-inggris.html" },
  { id: 3, nama: "Bahasa Arab",    level: "Pemula",   jadwal: "Sabtu, 09.00",          harga: 199999, halamanDetail: "detail-arab.html" },
  { id: 4, nama: "Bahasa Jepang",  level: "Pemula",   jadwal: "Minggu, 09.00",         harga: 199999, halamanDetail: "detail-jepang.html" }
];

const KELAS_BADGE = "inline-block rounded-[20px] px-2.5 py-1 text-[0.8rem] font-semibold text-white";
const KELAS_LINK = "font-semibold text-navy hover:text-gold-dark";

// Function format rupiah
function formatRupiah(angka) {
  return "Rp" + String(angka).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Function Filter Level
function filterByLevel(data, level) {
  if (level === "semua") {
    return data;
  }
  return data.filter(function (kursus) {
    return kursus.level === level;
  });
}

// Function membuat baris tabel dari array menggunakan perulangan
function tampilkanKursus(level) {
  const tbody = document.getElementById("tabel-kursus-body");
  const info = document.getElementById("info-jumlah");

  if (!tbody) {
    return;
  }

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
          '<a href="formKursus.html" class="' + KELAS_LINK + '">Daftar</a>' +
        "</td>" +
        "</tr>";
    }
  }

  tbody.innerHTML = baris;

  if (info) {
    info.textContent = "Menampilkan " + hasil.length + " dari " + daftarKursus.length + " kursus";
  }
}

tampilkanKursus("semua");


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