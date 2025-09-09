// ========== Fungsi Notifikasi ==========
function showNotif(message, type = "success") {
  const notif = document.createElement("div");
  notif.className = `notif ${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("show");
  }, 10);

  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 2000);
}

// ========== Index Page ==========
if (document.getElementById("btnTambah")) {
  const todoBody = document.getElementById("todoBody");
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  function renderTable() {
    todoBody.innerHTML = "";
    if (todos.length === 0) {
      todoBody.innerHTML = `<tr><td colspan="5" class="empty">⚠ Data tidak terisi</td></tr>`;
    } else {
      todos.forEach((t, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${t.nama}</td>
          <td>${t.asal}</td>
          <td>${t.umur}</td>
          <td>
            <button onclick="editData(${i})">Edit</button>
            <button class="delete" onclick="deleteData(${i})">Hapus</button>
          </td>
        `;
        todoBody.appendChild(tr);
      });
    }
  }

  // Edit data
  window.editData = function (i) {
    localStorage.setItem("editIndex", i);
    window.location.href = "form.html";
  };

  // Delete data
  window.deleteData = function (i) {
    const confirmBox = document.createElement("div");
    confirmBox.className = "confirm-box";
    confirmBox.innerHTML = `
      <div class="confirm-content">
        <p>⚠ Yakin ingin menghapus data ini?</p>
        <button id="yesDel">Ya</button>
        <button id="noDel">Tidak</button>
      </div>
    `;
    document.body.appendChild(confirmBox);

    document.getElementById("yesDel").onclick = () => {
      todos.splice(i, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTable();
      showNotif("Data berhasil dihapus");
      confirmBox.remove();
    };

    document.getElementById("noDel").onclick = () => {
      confirmBox.classList.add("hide");
      setTimeout(() => confirmBox.remove(), 300);
    };
  };

  renderTable();
}

// ========== Form Page ==========
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

  // Submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // 🔥 Validasi input kosong
    if (!nama.value || !asal.value || !umur.value) {
      showNotif("⚠ Tolong isi data terlebih dahulu", "error");
      return;
    }

    // 🔥 Validasi nama ngawur
    if (!/^[A-Za-z ]{2,20}$/.test(nama.value)) {
      showNotif("⚠ Tolong masukkan nama dengan benar", "error");
      return;
    }

    // 🔥 Validasi umur ngawur
    if (umur.value < 1 || umur.value > 120) {
      showNotif("🤔 Apakah anda manusia?", "error");
      return;
    }

    const newData = { nama: nama.value, asal: asal.value, umur: umur.value };

    if (index !== null && todos[index]) {
      todos[index] = newData;
      localStorage.removeItem("editIndex");
      showNotif("Data berhasil diupdate");
    } else {
      todos.push(newData);
      showNotif("Data berhasil disimpan");
    }

    localStorage.setItem("todos", JSON.stringify(todos));
    setTimeout(() => (window.location.href = "index.html"), 1200);
  });

  // Tombol kembali
  document.getElementById("btnKembali").addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
