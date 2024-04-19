document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#BookInput");
  const submit = document.querySelector("#bookSubmit");
  const incompleteList = document.querySelector("#InCompleteBookShelf");
  const completeList = document.querySelector("#BookShelfComplete");
  let books = [];
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) books = JSON.parse(storedBooks);

  function save() {
    localStorage.setItem("books", JSON.stringify(books));
  }

function showNotification(message) {
  if ('Notification' in window) {
    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        new Notification(message);
      }
    });
  }
}

function remove(id) {
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    save();
    update();
    updateStats();
    showNotification('Buku berhasil dihapus!');
  }
}

input.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#BookTitle").value;
  const author = document.querySelector("#BookAuthor").value;
  const year = Number(document.querySelector("#BookYear").value);
  const desk = document.querySelector("#BookDesk").value;
  const isComplete = document.querySelector("#IfBookIsCompleted").checked;

  const isDuplicate = books.some((book) => book.title === title);

  if (isDuplicate) {
    alert("Buku sudah ada.");
  } else {
    const book = {
      id: new Date().getTime(),
      title,
      author,
      year,
      desk,
      isComplete,
    };
    books.push(book);
    save();
    update();
    showNotification('Book Added Successfully!');
    document.querySelector("#BookTitle").value = "";
    document.querySelector("#BookAuthor").value = "";
    document.querySelector("#BookYear").value = "";
    document.querySelector("#BookDesk").value = "";
    document.querySelector("#IfBookIsCompleted").checked = false;
  }
});

  function update() {
    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    for (const book of books) {
      const item = createBook(book);
      book.isComplete ? completeList.append(item) : incompleteList.append(item);
    }
  }

  function remove(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      save();
      update();
      updateStats();
    }
  }

  function toggle(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      save();
      update();
      updateStats();
    }
  }

  const search = document.querySelector("#searchBook");
  const searchTitle = document.querySelector("#SearchBook");

  search.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchTitle.value.toLowerCase().trim();
    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.year.toString().includes(query)
    );
    updateSearch(results);
  });

  function updateSearch(results) {
    incompleteList.innerHTML = "";
    completeList.innerHTML = "";
    for (const book of results) {
      const item = createBook(book);
      book.isComplete
        ? completeList.appendChild(item)
        : incompleteList.appendChild(item);
    }
  }

  function createBook(book) {
    const item = document.createElement("article");
    item.className = "book_item";
    item.style.margin = "10px";

    const actions = document.createElement("div");
    actions.className = "action";

    const title = document.createElement("h2");
    title.textContent = book.title;
    title.style.color = "white";
    title.style.marginBottom = "10px";

    const author = document.createElement("p");
    author.textContent = "Author: " + book.author;
    author.style.color = "white";
    author.style.marginBottom = "10px";

    const year = document.createElement("p");
    year.textContent = "Year: " + book.year;
    year.style.color = "white";
    year.style.marginBottom = "10px";

    const desk = document.createElement("p");
    desk.textContent = "Desk:" + book.desk;
    desk.style.color = "white";
    desk.style.marginBottom = "10px";

    const removeButton = Action("Delete", "red", () => remove(book.id));
    const toggleButton = Action(
      book.isComplete ? "Not yet" : "Done",
      "green",
      () => toggle(book.id)
    );

    const img = document.createElement("img");
    img.src = "Rin.jpeg";
    img.alt = "Rin";
    img.style.width = "50px";

    const container = document.createElement("div");
    container.appendChild(title);
    container.appendChild(img);

    removeButton.style.padding = toggleButton.style.padding = "10px";
    removeButton.style.margin = toggleButton.style.margin = "10px";
    removeButton.style.borderRadius = toggleButton.style.borderRadius = "10px";
    removeButton.style.border = toggleButton.style.border = "0";
    removeButton.style.backgroundColor = toggleButton.style.backgroundColor =
      "white";
    removeButton.style.color = toggleButton.style.color = "#4793AF";
    removeButton.style.fontWeight = toggleButton.style.fontWeight = "bold";

    actions.appendChild(toggleButton);
    actions.appendChild(removeButton);

    item.appendChild(container);
    item.appendChild(author);
    item.appendChild(year);
    item.appendChild(desk);
    item.appendChild(actions);

    return item;
  }

  function Action(text, className, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener("click", () => {
      clickHandler();
      document.querySelector("#BookTitle").value = "";
      document.querySelector("#BookAuthor").value = "";
      document.querySelector("#BookYear").value = "";
      document.querySelector("#IfBookIsCompleted").checked = false;
    });
    return button;
  }

  function updateStats() {
    const totalBooksElement = document.querySelector(
      ".stats h3:nth-of-type(1)"
    );
    const completeBooksElement = document.querySelector(
      ".stats h3:nth-of-type(2)"
    );
    const incompleteBooksElement = document.querySelector(
      ".stats h3:nth-of-type(3)"
    );

    const totalBooks = books.length;
    const completedBooks = books.filter((book) => book.isComplete).length;
    const incompleteBooks = totalBooks - completedBooks;

    totalBooksElement.textContent = `Total Books: ${totalBooks}`;
    completeBooksElement.textContent = `Completed Books: ${completedBooks}`;
    incompleteBooksElement.textContent = `Incomplete Books: ${incompleteBooks}`;
  }

  updateStats();
  update();
});
