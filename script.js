let data = JSON.parse(localStorage.getItem("todoData")) || [];
let deleteIndex = null;

function renderTable() {
  const tbody = document.getElementById("todoBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="emptyMsg">⚠ Data tidak terisi</td>
      </tr>
    `;
    return;
  }

  data.forEach((item, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${item.nama}</td>
        <td>${item.asal}</td>
        <td>${item.umur}</td>
        <td>
          <button class="editBtn" onclick="editData(${index})">Edit</button>
          <button class="deleteBtn" onclick="openModal(${index})">Hapus</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Modal Hapus
function openModal(index) {
  deleteIndex = index;
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}
function confirmDelete() {
  if (deleteIndex !== null) {
    data.splice(deleteIndex, 1);
    localStorage.setItem("todoData", JSON.stringify(data));
    renderTable();
    closeModal();
  }
}

// Edit
function editData(index) {
  const item = data[index];
  localStorage.setItem("editIndex", index);
  localStorage.setItem("editData", JSON.stringify(item));
  window.location.href = "form.html";
}

// Loader + Form handling
document.addEventListener("DOMContentLoaded", () => {
  // Loader transition
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
    const content = document.getElementById("content");
    if (content) content.classList.remove("hidden");
  }, 1600);

  // Render table kalau di index.html
  renderTable();

  // Handle form submit kalau di form.html
  const form = document.getElementById("dataForm");
  if (form) {
    const editDataStored = localStorage.getItem("editData");
    if (editDataStored) {
      const edit = JSON.parse(editDataStored);
      document.getElementById("nama").value = edit.nama;
      document.getElementById("asal").value = edit.asal;
      document.getElementById("umur").value = edit.umur;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nama = document.getElementById("nama").value;
      const asal = document.getElementById("asal").value;
      const umur = document.getElementById("umur").value;

      const editIndex = localStorage.getItem("editIndex");
      if (editIndex !== null) {
        data[editIndex] = { nama, asal, umur };
        localStorage.removeItem("editIndex");
        localStorage.removeItem("editData");
      } else {
        data.push({ nama, asal, umur });
      }

      localStorage.setItem("todoData", JSON.stringify(data));

      // 🔔 Notifikasi sukses
      const notif = document.getElementById("notification");
      if (notif) {
        notif.classList.remove("hidden");
        setTimeout(() => notif.classList.add("show"), 50);

        // Hilang setelah 2 detik lalu balik ke index.html
        setTimeout(() => {
          notif.classList.remove("show");
          setTimeout(() => {
            notif.classList.add("hidden");
            window.location.href = "index.html";
          }, 500);
        }, 2000);
      } else {
        // fallback kalau notif ga ada
        window.location.href = "index.html";
      }
    });
  }
});
