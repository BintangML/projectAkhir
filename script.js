// ================= Loader =================
window.addEventListener("load", () => {
  const loader = document.getElementById("loading");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
    }, 500);
    setTimeout(() => loader.remove(), 1000);
  }
});

// ========== Fungsi Notifikasi ==========
function showNotif(message, type = "success") {
  let notif = document.getElementById("notif");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "notif";
    document.body.appendChild(notif);
  }

  notif.className = ""; // reset class
  notif.textContent = message;

  if (type === "error") notif.classList.add("error");
  else if (type === "warning") notif.classList.add("warning");
  else notif.classList.add("success");

  notif.style.display = "block";
  setTimeout(() => notif.classList.add("show"), 20);

  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => (notif.style.display = "none"), 300);
  }, 2000);
}

// ================= Index Page =================
if (document.getElementById("btnTambah")) {
  const todoBody = document.getElementById("todoBody");
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  function renderTable() {
    todoBody.innerHTML = "";
    if (todos.length === 0) {
      todoBody.innerHTML = `<tr><td colspan="5" class="empty">⚠ Data tidak terisi</td></tr>`;
      return;
    }

    todos.forEach((t, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${t.nama}</td>
        <td>${t.asal}</td>
        <td>${t.umur}</td>
        <td>
          <button onclick="editData(${i})">Edit</button>
          <button class="delete" data-index="${i}">Hapus</button>
        </td>
      `;
      todoBody.appendChild(tr);
    });
  }

  // delegasi klik tombol hapus
  todoBody.addEventListener("click", (ev) => {
    const btn = ev.target;
    if (btn && btn.classList.contains("delete")) {
      const i = parseInt(btn.getAttribute("data-index"), 10);
      openDeleteConfirm(i);
    }
  });

  // Edit data
  window.editData = function (i) {
    localStorage.setItem("editIndex", i);
    window.location.href = "form.html";
  };

  // Konfirmasi hapus
  function openDeleteConfirm(i) {
    const confirmBox = document.createElement("div");
    confirmBox.className = "confirm-box";
    confirmBox.innerHTML = `
      <div class="confirm-content" style="background:#111;color:#fff;padding:18px;border-radius:8px;box-shadow:0 6px 30px rgba(0,0,0,0.6);max-width:90%;margin:20px auto;text-align:center;">
        <p style="margin-bottom:12px">⚠ Yakin ingin menghapus data ini?</p>
        <div style="display:flex;gap:10px;justify-content:center">
          <button class="yes" style="background:#f44336;color:#fff;padding:8px 14px;border-radius:6px;border:none;cursor:pointer">Ya</button>
          <button class="no" style="background:#666;color:#fff;padding:8px 14px;border-radius:6px;border:none;cursor:pointer">Tidak</button>
        </div>
      </div>
    `;

    confirmBox.style.position = "fixed";
    confirmBox.style.inset = "0";
    confirmBox.style.display = "flex";
    confirmBox.style.justifyContent = "center";
    confirmBox.style.alignItems = "center";
    confirmBox.style.zIndex = "2000";
    confirmBox.style.background = "rgba(0,0,0,0.6)";

    document.body.appendChild(confirmBox);

    const yes = confirmBox.querySelector("button.yes");
    const no = confirmBox.querySelector("button.no");

    yes.addEventListener("click", () => {
      todos.splice(i, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTable();
      showNotif("✅ Data berhasil dihapus", "success");
      confirmBox.remove();
    });

    no.addEventListener("click", () => confirmBox.remove());
  }

  // tombol tambah
  document.getElementById("btnTambah").addEventListener("click", () => {
    localStorage.removeItem("editIndex");
    window.location.href = "form.html";
  });

  renderTable();
}

// ================= Form Page =================
if (document.getElementById("dataForm")) {
  const form = document.getElementById("dataForm");
  const nama = document.getElementById("nama");
  const asal = document.getElementById("asal");
  const umur = document.getElementById("umur");
  const index = localStorage.getItem("editIndex");
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Kalau mode edit
  if (index !== null) {
    const data = todos[index];
    if (data) {
      nama.value = data.nama;
      asal.value = data.asal;
      umur.value = data.umur;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!nama.value || !asal.value || !umur.value) {
      showNotif("⚠ Tolong isi data terlebih dahulu", "error");
      return;
    }

    if (!/^[A-Za-z ]{2,20}$/.test(nama.value)) {
      showNotif("⚠ Tolong masukkan nama dengan benar", "error");
      return;
    }

    const umurNum = parseInt(umur.value, 10);
    if (isNaN(umurNum) || umurNum < 1 || umurNum > 120) {
      showNotif("🤔 Apakah anda manusia?", "error");
      return;
    }

    const newData = { nama: nama.value.trim(), asal: asal.value.trim(), umur: umurNum };

    if (index !== null && todos[index]) {
      todos[index] = newData;
      localStorage.removeItem("editIndex");
      showNotif("✅ Data berhasil diupdate", "success");
    } else {
      todos.push(newData);
      showNotif("✅ Data berhasil disimpan", "success");
    }

    localStorage.setItem("todos", JSON.stringify(todos));
    setTimeout(() => (window.location.href = "index.html"), 1000);
  });

  document.getElementById("btnKembali").addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
