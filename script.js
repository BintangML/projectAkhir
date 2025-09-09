// Loading
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 1000);
});

// Notif
function showNotif(msg, type="success") {
  const notif = document.getElementById("notif");
  notif.innerText = msg;
  notif.className = "";
  if (type === "error") notif.classList.add("error");
  if (type === "warning") notif.classList.add("warning");
  notif.style.display = "block";
  setTimeout(() => notif.style.display = "none", 2500);
}

// Index Page
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
          <td>${i+1}</td>
          <td>${t.nama}</td>
          <td>${t.asal}</td>
          <td>${t.umur}</td>
          <td>
            <button onclick="editData(${i})">Edit</button>
            <button onclick="deleteData(${i})">Hapus</button>
          </td>
        `;
        todoBody.appendChild(tr);
      });
    }
  }

  window.deleteData = (i) => {
    if (confirm("⚠ Yakin hapus data ini?")) {
      todos.splice(i,1);
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTable();
      showNotif("Data berhasil dihapus", "warning");
    }
  }

  window.editData = (i) => {
    localStorage.setItem("editIndex", i);
    window.location.href = "form.html";
  }

  document.getElementById("btnTambah").addEventListener("click", () => {
    localStorage.removeItem("editIndex");
    window.location.href = "form.html";
  });

  renderTable();
}

// Form Page
if (document.getElementById("dataForm")) {
  const form = document.getElementById("dataForm");
  const nama = document.getElementById("nama");
  const asal = document.getElementById("asal");
  const umur = document.getElementById("umur");
  const index = localStorage.getItem("editIndex");
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  if (index !== null) {
    const data = todos[index];
    if (data) {
      nama.value = data.nama;
      asal.value = data.asal;
      umur.value = data.umur;
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!/^[A-Za-z ]{2,20}$/.test(nama.value)) {
      showNotif("⚠ Tolong masukkan nama dengan benar", "error");
      return;
    }
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
    setTimeout(() => window.location.href = "index.html", 1200);
  });

  document.getElementById("btnKembali").addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
