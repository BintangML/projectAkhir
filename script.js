document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");
  const container = document.querySelector(".container");
  const content = document.getElementById("content");
  if (loader) {
    setTimeout(() => {
      loader.style.display = "none";
      if (container) container.classList.remove("hidden");
      if (content) content.classList.remove("hidden");
    }, 1200);
  }

  // ===== INDEX PAGE =====
  const table = document.getElementById("todoTable");
  if (table) {
    let data = JSON.parse(localStorage.getItem("todoData")) || [];
    const emptyMessage = document.getElementById("emptyMessage");
    const confirmBox = document.getElementById("confirmBox");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    let deleteIndex = null;

    function renderTable() {
      table.innerHTML = "";
      if (data.length === 0) {
        emptyMessage.classList.remove("hidden");
      } else {
        emptyMessage.classList.add("hidden");
        data.forEach((item, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.asal}</td>
            <td>${item.umur}</td>
            <td>
              <button class="editBtn" data-index="${index}">Edit</button>
              <button class="deleteBtn" data-index="${index}">Hapus</button>
            </td>
          `;
          table.appendChild(row);
        });
      }
    }

    renderTable();

    table.addEventListener("click", (e) => {
      if (e.target.classList.contains("editBtn")) {
        const index = e.target.getAttribute("data-index");
        localStorage.setItem("editIndex", index);
        localStorage.setItem("editData", JSON.stringify(data[index]));
        window.location.href = "form.html";
      }

      if (e.target.classList.contains("deleteBtn")) {
        deleteIndex = e.target.getAttribute("data-index");
        confirmBox.classList.remove("hidden");
        confirmBox.classList.add("zoomIn");
      }
    });

    yesBtn.addEventListener("click", () => {
      if (deleteIndex !== null) {
        data.splice(deleteIndex, 1);
        localStorage.setItem("todoData", JSON.stringify(data));
        renderTable();
        confirmBox.classList.add("hidden");
      }
    });

    noBtn.addEventListener("click", () => {
      confirmBox.classList.add("hidden");
    });
  }

  // ===== FORM PAGE =====
  const form = document.getElementById("dataForm");
  if (form) {
    let data = JSON.parse(localStorage.getItem("todoData")) || [];
    const editIndex = localStorage.getItem("editIndex");
    const editData = JSON.parse(localStorage.getItem("editData"));

    if (editIndex !== null && editData) {
      document.getElementById("nama").value = editData.nama;
      document.getElementById("asal").value = editData.asal;
      document.getElementById("umur").value = editData.umur;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nama = document.getElementById("nama").value.trim();
      const asal = document.getElementById("asal").value.trim();
      const umur = parseInt(document.getElementById("umur").value);

      // ✅ Validasi nama (hanya huruf & spasi, min 2 huruf, max 30)
      const namaValid = /^[a-zA-Z\s]{2,30}$/;
      if (!namaValid.test(nama)) {
        showCustomNotif("⚠ Tolong masukkan nama dengan benar");
        return;
      }

      // ✅ Validasi umur
      if (umur < 1 || umur > 120 || isNaN(umur)) {
        showCustomNotif("🤔 Apakah anda manusia?");
        return;
      }

      if (editIndex !== null) {
        data[editIndex] = { nama, asal, umur };
        localStorage.removeItem("editIndex");
        localStorage.removeItem("editData");
      } else {
        data.push({ nama, asal, umur });
      }

      localStorage.setItem("todoData", JSON.stringify(data));
      showCustomNotif("✅ Data berhasil disimpan!", true);
    });
  }
});

// ===== Helper Notifikasi =====
function showCustomNotif(message, redirect = false) {
  const notif = document.getElementById("notification");
  if (notif) {
    notif.innerText = message;
    notif.classList.remove("hidden");
    setTimeout(() => notif.classList.add("show"), 50);

    setTimeout(() => {
      notif.classList.remove("show");
      setTimeout(() => {
        notif.classList.add("hidden");
        if (redirect) window.location.href = "index.html";
      }, 500);
    }, 2000);
  }
}
