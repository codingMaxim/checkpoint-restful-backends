const main = document.querySelector("#main");
const invitations = document.querySelector("#invitations");

let localData = [];

function renderPendingInvitations() {
  let counter = 0;
  if (getFromLocalStorage()) {
    counter = getFromLocalStorage();
  }
  counterStatement(counter);
}
renderPendingInvitations();

function loadDataFromApi() {
  const url = "https://dummy-apis.netlify.app/api/contact-suggestions?count=8";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      localData = data;
      render();
    });
}

function loadSinglePerson() {
  const url = "https://dummy-apis.netlify.app/api/contact-suggestions?count=1";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      localData.push(data[0]);
      render();
    });
}

loadDataFromApi();

function render() {
  let template = "";
  localData.forEach((person, i) => {
    const name = `${localData[i].name.first} ${localData[i].name.last}`;
    const profileImg = localData[i].picture;
    let backgroundImg = localData[i].backgroundImage;
    let backgroundTemplate = "";
    if (localData[i].backgroundImage) {
      backgroundImg += `&reload=${name}`;
      backgroundTemplate = `<img src="${backgroundImg}"class="background-img-person" alt="">`;
    }
    const role = localData[i].title;
    const connections = localData[i].mutualConnections;

    template += `
        <section class="single-person">
            <button class="delete-btn">X</button>
            <header class="person-background">
                ${backgroundTemplate}
            </header>
            <main class="person-main">
                <img src="${profileImg}" class="profile-img">
                <h2 class="name">${name}</h2>
                <p class="role">${role}</p>
                <p class="connections"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
              </svg>
              ${connections} mutual connections</p>
                <button class="connect-pending">Connect</button>
            </main>
        </section>
    `;
  });
  main.innerHTML = template;

  const allConnectBtns = document.querySelectorAll(".connect-pending");
  allConnectBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (btn.innerText === "Connect") {
        counter = getFromLocalStorage();
        btn.innerText = "Pending";
        counter++;
        setToLocalStorage(counter);
        counterStatement(counter);
      } else {
        counter = getFromLocalStorage();
        btn.innerText = "Connect";
        counter--;
        setToLocalStorage(counter);
        counterStatement(counter);
      }
    });
  });

  const allDeleteBtns = document.querySelectorAll(".delete-btn");

  allDeleteBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => deletePerson(e, index));
  });
}

function setToLocalStorage(counter) {
  JSON.stringify(localStorage.setItem("invitations", counter));
}
function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("invitations"));
}

function deletePerson(event, i) {
  event.target.parentElement.remove();
  localData.splice(i, 1);
  loadSinglePerson();
}

function counterStatement(counter) {
  if (counter === 1) {
    invitations.innerText = `${counter} pending invitation`;
  } else if (counter > 1) {
    invitations.innerText = `${counter} pending invitations`;
  } else {
    invitations.innerText = `No pending invitations`;
  }
}
