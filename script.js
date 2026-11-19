
let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
let marks = JSON.parse(localStorage.getItem("marks")) || [];
let fees = JSON.parse(localStorage.getItem("fees")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));
    localStorage.setItem("marks", JSON.stringify(marks));
    localStorage.setItem("fees", JSON.stringify(fees));
    localStorage.setItem("events", JSON.stringify(events));
}

function showPage(page, element) {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    document.querySelectorAll(".sidebar a").forEach(a => {
        a.classList.remove("active");
    });

    if (element) element.classList.add("active");

    refreshPage();
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

function addStudent() {
    const name = document.getElementById("studentName").value.trim();
    const roll = document.getElementById("studentRoll").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const course = document.getElementById("studentCourse").value;

    if (!name || !roll || !email || !course) {
        alert("Please fill all student details!");
        return;
    }

    if (students.some(s => s.roll.toLowerCase() === roll.toLowerCase())) {
        alert("Roll number already exists!");
        return;
    }

    students.push({ name, roll, email, course });

    saveData();

    document.getElementById("studentName").value = "";
    document.getElementById("studentRoll").value = "";
    document.getElementById("studentEmail").value = "";
    document.getElementById("studentCourse").value = "";

    refreshPage();
    alert("Student added successfully!");
}

function renderStudents() {
    const search = document.getElementById("searchStudent")?.value.toLowerCase() || "";

    const filtered = students.filter(s =>
        (s.name + s.roll + s.email + s.course).toLowerCase().includes(search)
    );

    document.getElementById("studentTable").innerHTML =
        filtered.map(s => `
        <tr>
            <td>${escapeHTML(s.name)}</td>
            <td>${escapeHTML(s.roll)}</td>
            <td>${escapeHTML(s.email)}</td>
            <td>${escapeHTML(s.course)}</td>
            <td>
                <button onclick="deleteStudent('${encodeURIComponent(s.roll)}')">
                    Delete
                </button>
            </td>
        </tr>
        `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[c]);
}

function deleteStudent(roll) {
    roll = decodeURIComponent(roll);

    if (!confirm("Delete this student?")) return;

    students = students.filter(s => s.roll !== roll);

    attendance = attendance.filter(a => a.roll !== roll);
    marks = marks.filter(m => m.roll !== roll);
    fees = fees.filter(f => f.roll !== roll);

    saveData();
    refreshPage();
}

function updateStudentOptions() {
    ["marksStudent", "feeStudent"].forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">Select Student</option>';

        students.forEach(s => {
            const option = document.createElement("option");
            option.value = s.roll;
            option.textContent = s.name + " (" + s.roll + ")";
            select.appendChild(option);
        });
    });
}

function markAttendance() {
    const date = document.getElementById("attendanceDate").value;

    if (!date) {
        alert("Select a date first!");
        return;
    }

    const list = document.getElementById("attendanceList");

    list.innerHTML = students.map(s => `
        <p>
            ${escapeHTML(s.name)} (${escapeHTML(s.roll)})
            <select id="att-${encodeURIComponent(s.roll)}">
                <option>Present</option>
                <option>Absent</option>
            </select>
        </p>
    `).join("");
}

function saveAttendance() {
    const date = document.getElementById("attendanceDate").value;

    if (!date || students.length === 0) {
        alert("Select a date and add students first!");
        return;
    }

    attendance = attendance.filter(a => a.date !== date);

    students.forEach(s => {
        const value = document.getElementById("att-" + encodeURIComponent(s.roll));

        if (value) {
            attendance.push({
                roll: s.roll,
                date,
                status: value.value
            });
        }
    });

    saveData();
    alert("Attendance saved!");
}

function saveMarks() {
    const roll = document.getElementById("marksStudent").value;
    const value = Number(document.getElementById("marksValue").value);

    if (!roll || document.getElementById("marksValue").value === "" ||
        !Number.isFinite(value) || value < 0 || value > 100) {
        alert("Select a student and enter marks from 0 to 100!");
        return;
    }

    marks = marks.filter(m => m.roll !== roll);
    marks.push({ roll, value });

    saveData();
    refreshPage();
}

function saveFee() {
    const roll = document.getElementById("feeStudent").value;
    const amount = Number(document.getElementById("feeAmount").value);
    const status = document.getElementById("feeStatus").value;

    if (!roll || !Number.isFinite(amount) || amount <= 0) {
        alert("Enter valid fee details!");
        return;
    }

    fees.push({ roll, amount, status });

    saveData();
    refreshPage();
}

function addEvent() {
    const name = document.getElementById("eventName").value.trim();
    const date = document.getElementById("eventDate").value;

    if (!name || !date) {
        alert("Enter event name and date!");
        return;
    }

    events.push({ name, date });

    saveData();
    refreshPage();
}

function refreshPage() {
    document.getElementById("totalStudents").textContent = students.length;

    renderStudents();
    updateStudentOptions();

    document.getElementById("recentStudents").innerHTML =
        students.slice(-5).map(s =>
            `<p>🎓 ${escapeHTML(s.name)} - ${escapeHTML(s.course)}</p>`
        ).join("") || "No students added yet.";

    document.getElementById("marksList").innerHTML =
        marks.map(m => {
            const s = students.find(x => x.roll === m.roll);
            return s ? `<p>${escapeHTML(s.name)}: ${m.value}/100</p>` : "";
        }).join("");

    document.getElementById("feeList").innerHTML =
        fees.map(f => {
            const s = students.find(x => x.roll === f.roll);
            return s ? `<p>${escapeHTML(s.name)}: ₹${f.amount} - ${f.status}</p>` : "";
        }).join("");

    document.getElementById("eventList").innerHTML =
        events.map(e =>
            `<p>🎉 ${escapeHTML(e.name)} - ${escapeHTML(e.date)}</p>`
        ).join("");
}

document.getElementById("attendanceDate").value =
    new Date().toISOString().slice(0, 10);

document.getElementById("attendanceDate").addEventListener("change", markAttendance);

refreshPage();
markAttendance();
