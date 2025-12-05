// ================== STORAGE HELPERS ==================
function getEvents() {
  return JSON.parse(localStorage.getItem("seeeEvents") || "[]");
}
function saveEvents(events) {
  localStorage.setItem("seeeEvents", JSON.stringify(events));
}

function getUpdates() {
  return JSON.parse(localStorage.getItem("seeeUpdates") || "[]");
}
function saveUpdates(updates) {
  localStorage.setItem("seeeUpdates", JSON.stringify(updates));
}

function getBoardMembers() {
  return JSON.parse(localStorage.getItem("seeeBoard") || "[]");
}
function saveBoardMembers(list) {
  localStorage.setItem("seeeBoard", JSON.stringify(list));
}

// ================== MAIN ==================
document.addEventListener("DOMContentLoaded", () => {
  // ----- LOGIN PAGE -----
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.onclick = () => {
      const u = document.getElementById("loginUser").value.trim();
      const p = document.getElementById("loginPass").value.trim();
      const err = document.getElementById("loginError");

      const ADMIN_USER = "admin";
      const ADMIN_PASS = "1234"; // change if you want

      if (u === ADMIN_USER && p === ADMIN_PASS) {
        err.textContent = "";
        window.location.href = "admin.html";
      } else {
        err.textContent = "Invalid username or password";
      }
    };
  }

  // ----- EVENTS ADMIN -----
  const eventSaveBtn = document.getElementById("eventSaveBtn");
  const eventResetBtn = document.getElementById("eventResetBtn");
  if (eventSaveBtn && eventResetBtn) {
    renderAdminEvents();
    eventResetBtn.onclick = resetEventForm;

    eventSaveBtn.onclick = () => {
      const title = document.getElementById("eventTitle").value.trim();
      const date = document.getElementById("eventDate").value;
      const type = document.getElementById("eventType").value;
      const desc = document.getElementById("eventDesc").value.trim();
      const files = document.getElementById("eventImages").files;
      const editIndex = parseInt(
        document.getElementById("eventEditIndex").value,
        10
      );
      const msg = document.getElementById("eventMsg");

      if (!title || !date || !desc) {
        msg.textContent = "Please fill title, date and description.";
        msg.style.color = "red";
        return;
      }

      const events = getEvents();

      readAllImages(files, (imgArray) => {
        if (!imgArray.length && editIndex >= 0 && events[editIndex].images) {
          imgArray = events[editIndex].images;
        }

        const createdAt =
          editIndex >= 0 && events[editIndex] && events[editIndex].createdAt
            ? events[editIndex].createdAt
            : new Date().toISOString();

        const obj = {
          title,
          date,
          type,
          desc,
          images: imgArray,
          createdAt,
        };

        if (editIndex >= 0 && editIndex < events.length) {
          events[editIndex] = obj;
          msg.textContent = "Event updated successfully!";
        } else {
          events.push(obj);
          msg.textContent = "Event added successfully!";
        }
        msg.style.color = "green";

        saveEvents(events);
        renderAdminEvents();
        resetEventForm();
      });
    };
  }

  // ----- UPDATES ADMIN -----
  const updSaveBtn = document.getElementById("updSaveBtn");
  const updResetBtn = document.getElementById("updResetBtn");
  if (updSaveBtn && updResetBtn) {
    renderAdminUpdates();
    updResetBtn.onclick = resetUpdateForm;

    updSaveBtn.onclick = () => {
      const title = document.getElementById("updTitle").value.trim();
      const date = document.getElementById("updDate").value;
      const desc = document.getElementById("updDesc").value.trim();
      const file = document.getElementById("updImage").files[0];
      const editIndex = parseInt(
        document.getElementById("updEditIndex").value,
        10
      );
      const msg = document.getElementById("updMsg");

      if (!title || !date || !desc) {
        msg.textContent = "Please fill title, date and description.";
        msg.style.color = "red";
        return;
      }

      const updates = getUpdates();

      const saveUpdateObj = (imgData) => {
        const createdAt =
          editIndex >= 0 && updates[editIndex] && updates[editIndex].createdAt
            ? updates[editIndex].createdAt
            : new Date().toISOString();

        const obj = {
          title,
          date,
          desc,
          img: imgData || null,
          createdAt,
        };

        if (editIndex >= 0 && editIndex < updates.length) {
          updates[editIndex] = obj;
          msg.textContent = "Update edited successfully!";
        } else {
          updates.push(obj);
          msg.textContent = "Update added successfully!";
        }
        msg.style.color = "green";
        saveUpdates(updates);
        renderAdminUpdates();
        resetUpdateForm();
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => saveUpdateObj(e.target.result);
        reader.readAsDataURL(file);
      } else {
        if (editIndex >= 0 && updates[editIndex] && updates[editIndex].img) {
          saveUpdateObj(updates[editIndex].img);
        } else {
          saveUpdateObj(null);
        }
      }
    };
  }

  // ----- BOARD MEMBERS ADMIN -----
  const boardSaveBtn = document.getElementById("boardSaveBtn");
  const boardResetBtn = document.getElementById("boardResetBtn");
  if (boardSaveBtn && boardResetBtn) {
    renderAdminBoard();
    boardResetBtn.onclick = resetBoardForm;

    boardSaveBtn.onclick = () => {
      const name = document.getElementById("boardName").value.trim();
      const role = document.getElementById("boardRole").value;
      const year = document.getElementById("boardYear").value.trim();
      const file = document.getElementById("boardImage").files[0];
      const editIndex = parseInt(
        document.getElementById("boardEditIndex").value,
        10
      );
      const msg = document.getElementById("boardMsg");

      if (!name || !role) {
        msg.textContent = "Please enter name and role.";
        msg.style.color = "red";
        return;
      }

      const list = getBoardMembers();

      const saveMemberObj = (imgData) => {
        const createdAt =
          editIndex >= 0 && list[editIndex] && list[editIndex].createdAt
            ? list[editIndex].createdAt
            : new Date().toISOString();

        const obj = {
          name,
          role,
          year,
          img: imgData || null,
          createdAt,
        };

        if (editIndex >= 0 && editIndex < list.length) {
          list[editIndex] = obj;
          msg.textContent = "Board member updated!";
        } else {
          list.push(obj);
          msg.textContent = "Board member added!";
        }
        msg.style.color = "green";
        saveBoardMembers(list);
        renderAdminBoard();
        resetBoardForm();
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => saveMemberObj(e.target.result);
        reader.readAsDataURL(file);
      } else {
        if (editIndex >= 0 && list[editIndex] && list[editIndex].img) {
          saveMemberObj(list[editIndex].img);
        } else {
          saveMemberObj(null);
        }
      }
    };
  }

  // ----- PUBLIC EVENTS PAGE -----
  if (
    document.getElementById("upcomingEvents") &&
    document.getElementById("pastEvents")
  ) {
    renderEventsPage();
    setupEventFilters();
  }

  // ----- PUBLIC UPDATES PAGE -----
  if (document.getElementById("updatesList")) {
    renderUpdatesPublic();
  }

  // ----- PUBLIC BOARD PAGE -----
  if (document.getElementById("boardList")) {
    renderBoardPublic();
  }
});

// ============ UTIL: read multiple image files ============
function readAllImages(fileList, callback) {
  if (!fileList || !fileList.length) {
    callback([]);
    return;
  }
  let images = [];
  let loaded = 0;

  for (let i = 0; i < fileList.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.push(e.target.result);
      loaded++;
      if (loaded === fileList.length) {
        callback(images);
      }
    };
    reader.readAsDataURL(fileList[i]);
  }
}

// ================== ADMIN: EVENTS ==================
function resetEventForm() {
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventType").value = "Technical";
  document.getElementById("eventDesc").value = "";
  document.getElementById("eventImages").value = "";
  document.getElementById("eventEditIndex").value = "-1";
  const msg = document.getElementById("eventMsg");
  if (msg) msg.textContent = "";
}

function renderAdminEvents() {
  const events = getEvents();
  const container = document.getElementById("adminEventsList");
  if (!container) return;

  if (!events.length) {
    container.innerHTML = "<p>No events added yet.</p>";
    return;
  }

  container.innerHTML = "";
  events.forEach((ev, i) => {
    const row = document.createElement("div");
    row.className = "admin-event-row";
    row.innerHTML = `
      <div class="admin-event-text">
        <strong>${ev.title}</strong> (${ev.date}) – ${ev.type}
      </div>
      <div class="admin-event-actions">
        <button class="editBtn" data-i="${i}">Edit</button>
        <button class="deleteBtn" data-i="${i}">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll(".editBtn").forEach((btn) => {
    btn.onclick = () => loadEventToForm(parseInt(btn.dataset.i, 10));
  });
  container.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.onclick = () => deleteEvent(parseInt(btn.dataset.i, 10));
  });
}

function loadEventToForm(index) {
  const ev = getEvents()[index];
  document.getElementById("eventTitle").value = ev.title;
  document.getElementById("eventDate").value = ev.date;
  document.getElementById("eventType").value = ev.type;
  document.getElementById("eventDesc").value = ev.desc;
  document.getElementById("eventEditIndex").value = index;
  const msg = document.getElementById("eventMsg");
  if (msg) {
    msg.textContent = "Loaded event for editing.";
    msg.style.color = "orange";
  }
}

function deleteEvent(index) {
  if (!confirm("Delete this event?")) return;
  const events = getEvents();
  events.splice(index, 1);
  saveEvents(events);
  renderAdminEvents();
}

// ================== ADMIN: UPDATES ==================
function resetUpdateForm() {
  document.getElementById("updTitle").value = "";
  document.getElementById("updDate").value = "";
  document.getElementById("updDesc").value = "";
  document.getElementById("updImage").value = "";
  document.getElementById("updEditIndex").value = "-1";
  const msg = document.getElementById("updMsg");
  if (msg) msg.textContent = "";
}

function renderAdminUpdates() {
  const updates = getUpdates();
  const container = document.getElementById("adminUpdatesList");
  if (!container) return;

  if (!updates.length) {
    container.innerHTML = "<p>No updates added yet.</p>";
    return;
  }

  container.innerHTML = "";
  updates.forEach((u, i) => {
    const row = document.createElement("div");
    row.className = "admin-event-row";
    row.innerHTML = `
      <div class="admin-event-text">
        <strong>${u.title}</strong> (${u.date})
      </div>
      <div class="admin-event-actions">
        <button class="editBtnUpd" data-i="${i}">Edit</button>
        <button class="deleteBtnUpd" data-i="${i}">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll(".editBtnUpd").forEach((btn) => {
    btn.onclick = () => loadUpdateToForm(parseInt(btn.dataset.i, 10));
  });
  container.querySelectorAll(".deleteBtnUpd").forEach((btn) => {
    btn.onclick = () => deleteUpdate(parseInt(btn.dataset.i, 10));
  });
}

function loadUpdateToForm(index) {
  const u = getUpdates()[index];
  document.getElementById("updTitle").value = u.title;
  document.getElementById("updDate").value = u.date;
  document.getElementById("updDesc").value = u.desc;
  document.getElementById("updEditIndex").value = index;
  const msg = document.getElementById("updMsg");
  if (msg) {
    msg.textContent = "Loaded update for editing.";
    msg.style.color = "orange";
  }
}

function deleteUpdate(index) {
  if (!confirm("Delete this update?")) return;
  const updates = getUpdates();
  updates.splice(index, 1);
  saveUpdates(updates);
  renderAdminUpdates();
}

// ================== ADMIN: BOARD MEMBERS ==================
function resetBoardForm() {
  document.getElementById("boardName").value = "";
  document.getElementById("boardRole").value = "President";
  document.getElementById("boardYear").value = "";
  document.getElementById("boardImage").value = "";
  document.getElementById("boardEditIndex").value = "-1";
  const msg = document.getElementById("boardMsg");
  if (msg) msg.textContent = "";
}

function rolePriority(role) {
  const map = {
    "President": 1,
    "Vice President": 2,
    "Lead Coordinator": 3,
    "Secretary": 4,
    "Joint Secretary": 5,
    "Treasurer": 6,
    "People Relation Manager": 7,
    "Event Coordinator": 8,
    "Technical Coordinator": 9,
    "Cultural Coordinator": 10,
    "Sports Coordinator": 11,
    "Design Coordinator": 12,
    "Photographer": 13,
    "Other": 20,
  };
  return map[role] || 20;
}

function renderAdminBoard() {
  const list = getBoardMembers();
  const container = document.getElementById("adminBoardList");
  if (!container) return;

  if (!list.length) {
    container.innerHTML = "<p>No board members added yet.</p>";
    return;
  }

  const sorted = list
    .slice()
    .sort((a, b) => rolePriority(a.role) - rolePriority(b.role));

  container.innerHTML = "";
  sorted.forEach((m, idxSorted) => {
    const originalIndex = list.indexOf(m);
    const row = document.createElement("div");
    row.className = "admin-event-row";
    row.innerHTML = `
      <div class="admin-event-text">
        <strong>${m.name}</strong> – ${m.role}
        ${m.year ? "(" + m.year + ")" : ""}
      </div>
      <div class="admin-event-actions">
        <button class="editBtnBoard" data-i="${originalIndex}">Edit</button>
        <button class="deleteBtnBoard" data-i="${originalIndex}">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll(".editBtnBoard").forEach((btn) => {
    btn.onclick = () => loadBoardToForm(parseInt(btn.dataset.i, 10));
  });
  container.querySelectorAll(".deleteBtnBoard").forEach((btn) => {
    btn.onclick = () => deleteBoardMember(parseInt(btn.dataset.i, 10));
  });
}

function loadBoardToForm(index) {
  const m = getBoardMembers()[index];
  document.getElementById("boardName").value = m.name;
  document.getElementById("boardRole").value = m.role;
  document.getElementById("boardYear").value = m.year || "";
  document.getElementById("boardEditIndex").value = index;
  const msg = document.getElementById("boardMsg");
  if (msg) {
    msg.textContent = "Loaded board member for editing.";
    msg.style.color = "orange";
  }
}

function deleteBoardMember(index) {
  if (!confirm("Delete this board member?")) return;
  const list = getBoardMembers();
  list.splice(index, 1);
  saveBoardMembers(list);
  renderAdminBoard();
}

// ================== PUBLIC: EVENTS PAGE ==================
function renderEventsPage() {
  const events = getEvents();
  const upcomingDiv = document.getElementById("upcomingEvents");
  const pastDiv = document.getElementById("pastEvents");
  upcomingDiv.innerHTML = "";
  pastDiv.innerHTML = "";

  if (!events.length) {
    upcomingDiv.innerHTML = "<p>No events available yet.</p>";
    pastDiv.innerHTML = "<p>No past events yet.</p>";
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  events
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((ev) => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.dataset.type = ev.type;

      const imagesHtml =
        ev.images && ev.images.length
          ? ev.images
              .map(
                (img) =>
                  `<img src="${img}" class="event-img" alt="${ev.title}">`
              )
              .join("")
          : "";

      card.innerHTML = `
        ${imagesHtml}
        <h3>${ev.title}</h3>
        <p class="event-meta">${ev.date} • ${ev.type}</p>
        <p>${ev.desc}</p>
      `;

      if (ev.date >= today) {
        upcomingDiv.appendChild(card);
      } else {
        pastDiv.appendChild(card);
      }
    });

  if (!upcomingDiv.childElementCount) {
    upcomingDiv.innerHTML = "<p>No upcoming events.</p>";
  }
  if (!pastDiv.childElementCount) {
    pastDiv.innerHTML = "<p>No past events yet.</p>";
  }
}

function setupEventFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      const allCards = document.querySelectorAll(".event-card");
      allCards.forEach((card) => {
        const type = card.dataset.type;
        card.style.display =
          filter === "All" || type === filter ? "block" : "none";
      });
    });
  });
}

// ================== PUBLIC: UPDATES PAGE ==================

// convert URLs in text into clickable <a> links
function linkify(text) {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank">Open Link</a>`;
  });
}

function renderUpdatesPublic() {
  const updates = getUpdates();
  const container = document.getElementById("updatesList");
  if (!container) return;

  if (!updates.length) {
    container.innerHTML = "<p>No updates yet.</p>";
    return;
  }

  container.innerHTML = "";
  updates
    .slice()
    .sort((a, b) => {
      const da = a.createdAt || a.date;
      const db = b.createdAt || b.date;
      return db.localeCompare(da); // latest first
    })
    .forEach((u) => {
      const dateText = (u.createdAt || u.date).slice(0, 10);
      const imgHtml = u.img
        ? `<img src="${u.img}" class="update-img" alt="${u.title}">`
        : "";

      const card = document.createElement("div");
      card.className = "update-card";
      card.innerHTML = `
        <h3>${u.title}</h3>
        <p class="update-meta">Updated on ${dateText}</p>
        ${imgHtml}
        <p class="update-text">${linkify(u.desc)}</p>
      `;
      container.appendChild(card);
    });
}

// ================== PUBLIC: BOARD PAGE ==================
function renderBoardPublic() {
  const list = getBoardMembers();
  const container = document.getElementById("boardList");
  if (!container) return;

  if (!list.length) {
    container.innerHTML = "<p>No board members added yet.</p>";
    return;
  }

  const sorted = list
    .slice()
    .sort((a, b) => rolePriority(a.role) - rolePriority(b.role));

  container.innerHTML = "";
  sorted.forEach((m) => {
    const card = document.createElement("div");
    card.className = "board-card";
    const imgHtml = m.img
      ? `<img src="${m.img}" alt="${m.name}" class="board-photo">`
      : `<div class="board-photo placeholder">SEEE</div>`;

    card.innerHTML = `
      ${imgHtml}
      <h3 class="board-name">${m.name}</h3>
      <p class="board-role">${m.role}</p>
      ${
        m.year
          ? `<p class="board-year">${m.year}</p>`
          : ""
      }
    `;
    container.appendChild(card);
  });
}



