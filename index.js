document.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("user");
  const statsSection = document.getElementById("stats");
  const bookSection = document.getElementById("book-quiz-section");
  const weeklyPointsEl = document.getElementById("weekly-points");
  const goalEl = document.getElementById("goal");
  const bookList = document.getElementById("book-list");

  let users = [];
  let books = [];
  let currentUser = null;

  // Fetch users and books from the backend
  async function loadData() {
    const base = window.WORDQUEST_API_BASE;

    try {
      const [userRes, bookRes] = await Promise.all([
        fetch(`${base}/users`),
        fetch(`${base}/books`)
      ]);

      users = await userRes.json();
      books = await bookRes.json();

      users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        userSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }

  // Handle user selection
  userSelect.addEventListener("change", () => {
    const selectedId = userSelect.value;
    currentUser = users.find(u => u.id === selectedId);

    if (currentUser) {
      statsSection.style.display = "block";
      bookSection.style.display = "block";
      weeklyPointsEl.textContent = currentUser.weekly_points || 0;
      goalEl.textContent = "50";
      populateBooks();
    } else {
      statsSection.style.display = "none";
      bookSection.style.display = "none";
    }
  });

  // Populate book list
  function populateBooks() {
    bookList.innerHTML = "";
    books.forEach(book => {
      const li = document.createElement("li");
      li.textContent = `${book.title} by ${book.author || "Unknown"} (${book.point_value} pts)`;
      li.addEventListener("click", () => {
        window.location.href = `/quiz.html?bookId=${book.id}&userId=${currentUser.id}`;
      });
      bookList.appendChild(li);
    });
  }

  loadData();
});