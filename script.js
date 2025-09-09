document.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading");
  const content = document.getElementById("content");
  if (loading && content) {
    setTimeout(() => {
      loading.style.display = "none";
      content.classList.remove("hidden");
    }, 1000);
  }

  // Index page
  const tableBody = document.getElementById("todoBody");
  if (tableBody) {
    let data = JSON.parse(localStorage.getItem("todoData")) || [];

    function renderTable() {
      tableBody.innerHTML = "";
      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="empty">⚠ Data tidak terisi</td></tr>`;
        return;
      }

      data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.nama}</td>
          <td>${item.asal}</td>
          <td>${item.umur}</td>
          <td>
            <button class="actionBtn editBtn" onclick="editData(${index})">Edit</button>
            <button class="actionBtn deleteBtn" onclick="deleteData(${index})">Hapus</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
    renderTable();

    window.deleteData = (i) => {
      if (confirm("Yakin hapus data ini?")) {
        data.splice(i, 1);
        localStorage.setItem("todoData", JSON.stringify(data));
        renderTable();
        showNotif("🗑 Data berhasil dihapus!");
      }
    };

    window.editData = (i) => {
      localStorage.setItem("editIndex", i);
      localStorage.setItem("editData", JSON.stringify(data[i]));
      window.location.href = "form.html";
    };
  }

  // Form page
  const form = document.getElementById("dataForm");
  if (form) {
    let data = JSON.parse(localStorage.getItem("todoData")) || [];
    const editIndex = localStorage.getItem("editIndex");
    const editData = localStorage.getItem("editData");

    if (editIndex !== null && editData) {
      const { nama, asal, umur } = JSON.parse(editData);
      document.getElementById("nama").value = nama;
      document.getElementById("asal").value = asal;
      document.getElementById("umur").value = umur;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nama = document.getElementById("nama").value.trim();
      const asal = document.getElementById("asal").value.trim();
      const umur = parseInt(document.getElementById("umur").value);

      // Validasi nama
      if (nama.length < 3 || !/^[a-zA-Z\s]+$/.test(nama)) {
        showNotif("⚠ Tolong masukkan nama dengan benar");
        return;
      }

      // Validasi umur
      if (umur < 1 || umur > 120 || isNaN(umur)) {
        showNotif("🤔 Apakah anda manusia?");
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
      showNotif("✅ Data berhasil disimpan!", true);
    });
  }
});

// Notif
function showNotif(message, redirect = false) {
  const notif = document.getElementById("notification");
  if (!notif) return;
  notif.innerText = message;
  notif.classList.remove("hidden");
  setTimeout(() => notif.classList.add("show"), 50);

  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => {
      notif.classList.add("hidden");
      if (redirect) window.location.href = "index.html";
    }, 400);
  }, 2000);
}
