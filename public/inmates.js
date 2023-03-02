async function buildInmatesTable(inmatesTable, inmatesTableHeader, token, message) {
    try {
      const response = await fetch("/api/v1/inmates", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      var children = [inmatesTableHeader];
      if (response.status === 200) {
        if (data.count === 0) {
          inmatesTable.replaceChildren(...children); // clear this for safety
          return 0;
        } else {
          for (let i = 0; i < data.inmates.length; i++) {
            let editButton = `<td><button type="button" class="editButton" data-id=${data.inmates[i]._id}>edit</button></td>`;
            let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.inmates[i]._id}>delete</button></td>`;
            let rowHTML = `<td>${data.inmates[i].inmateName}</td><td>${data.inmates[i].totalYears}</td><td>${data.inmates[i].yearsLeft}</td><td>${data.inmates[i].lifeSentence}</td><td>${data.inmates[i].crimeCommitted}</td><td>${data.inmates[i].threatLevel}</td>${editButton}${deleteButton}`;
            let rowEntry = document.createElement("tr");
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          }
          inmatesTable.replaceChildren(...children);
        }
        return data.count;
      } else {
        message.textContent = data.msg;
        return 0;
      }
    } catch (err) {
      message.textContent = "A communication error occurred.";
      return 0;
    }
  }

document.addEventListener("DOMContentLoaded", () => {
    const logoff = document.getElementById("logoff");
    const message = document.getElementById("message");
    const logonRegister = document.getElementById("logon-register");
    const logon = document.getElementById("logon");
    const register = document.getElementById("register");
    const logonDiv = document.getElementById("logon-div");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const logonButton = document.getElementById("logon-button");
    const logonCancel = document.getElementById("logon-cancel");
    const registerDiv = document.getElementById("register-div");
    const name = document.getElementById("name");
    const email1 = document.getElementById("email1");
    const password1 = document.getElementById("password1");
    const password2 = document.getElementById("password2");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");
    const inmates = document.getElementById("inmates");
    const inmatesTable = document.getElementById("inmates-table");
    const inmatesTableHeader = document.getElementById("inmates-table-header");
    const addInmate = document.getElementById("add-inmate");
    const editInmate = document.getElementById("edit-inmate");
    const inmateName = document.getElementById("inmateName");
    const totalYears = document.getElementById("totalYears");
    const yearsLeft = document.getElementById("yearsLeft");
    const lifeSentence = document.getElementById("lifeSentence");
    const crimeCommitted = document.getElementById("crimeCommitted");
    const threatLevel = document.getElementById("threatLevel");
    const addingInmate = document.getElementById("adding-inmate");
    const inmatesMessage = document.getElementById("inmates-message");
    const editCancel = document.getElementById("edit-cancel");
  
    // section 2 
    let showing = logonRegister;
  let token = null;
  document.addEventListener("startDisplay", async () => {
    showing = logonRegister;
    token = localStorage.getItem("token");
    if (token) {
      //if the user is logged in
      logoff.style.display = "block";
      const count = await buildInmatesTable(
        inmatesTable,
        inmatesTableHeader,
        token,
        message
      );
      if (count > 0) {
        inmatesMessage.textContent = "";
        inmatesTable.style.display = "block";
      } else {
        inmatesMessage.textContent = "There are no inmates to display for this user.";
        inmatesTable.style.display = "none";
      }
      inmates.style.display = "block";
      showing = inmates;
    } else {
      logonRegister.style.display = "block";
    }
  });

  var thisEvent = new Event("startDisplay");
  document.dispatchEvent(thisEvent);
  var suspendInput = false;

  // section 3
  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === "BUTTON") {
      message.textContent = "";
    }
    if (e.target === logoff) {
      localStorage.removeItem("token");
      token = null;
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      inmatesTable.replaceChildren(inmatesTableHeader); // don't want other users to see
      message.textContent = "You are logged off.";
    } else if (e.target === logon) {
      showing.style.display = "none";
      logonDiv.style.display = "block";
      showing = logonDiv;
    } else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === logonCancel || e.target == registerCancel) {
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      email.value = "";
      password.value = "";
      name.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
    } else if (e.target === logonButton) {
      suspendInput = true;
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = `Logon successful.  Welcome ${data.user.name}`;
          token = data.token;
          localStorage.setItem("token", token);
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          email.value = "";
          password.value = "";
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "A communications error occurred.";
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value != password2.value) {
        message.textContent = "The passwords entered do not match.";
      } else {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              email: email1.value,
              password: password1.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            message.textContent = `Registration successful.  Welcome ${data.user.name}`;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communications error occurred.";
        }
        suspendInput = false;
      }
    } // section 4
    else if (e.target === addInmate) {
        showing.style.display = "none";
        editInmate.style.display = "block";
        showing = editInmate;
        delete editInmate.dataset.id;
        inmateName.value = "";
        totalYears.value = "";
        yearsLeft.value = "";
        lifeSentence.value = "";
        crimeCommitted.value = "";
        threatLevel.value = "pending";
        addingInmate.textContent = "add";
      } else if (e.target === editCancel) {
        showing.style.display = "none";
        inmateName.value = "";
        totalYears.value = "";
        yearsLeft.value = "";
        lifeSentence.value = "";
        crimeCommitted.value = "";
        threatLevel.value = "pending";
        thisEvent = new Event("startDisplay");
        document.dispatchEvent(thisEvent);
      } else if (e.target === addingInmate) {
        if (!editInmate.dataset.id) {
          // this is an attempted add
          suspendInput = true;
          try {
            const response = await fetch("/api/v1/inmates", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                inmateName: inmateName.value,
                totalYears: totalYears.value,
                yearsLeft: yearsLeft.value,
                lifeSentence: lifeSentence.value,
                crimeCommitted: crimeCommitted.value,
                threatLevel:  threatLevel.value
              })
            });
            const data = await response.json();
            if (response.status === 201) {
              //successful create
              message.textContent = "The inmate entry was created.";
              showing.style.display = "none";
              thisEvent = new Event("startDisplay");
              document.dispatchEvent(thisEvent);
              inmateName.value = "";
              totalYears.value = "";
              yearsLeft.value = "";
              lifeSentence.value = "";
              crimeCommitted.value = "";
              threatLevel.value = "pending";
            } else {
              // failure
              message.textContent = data.msg;
            }
          } catch (err) {
            message.textContent = "A communication error occurred.";
          }
          suspendInput = false;
        } else {
          // this is an update
          suspendInput = true;
          try {
            const inmateID = editInmate.dataset.id;
            const response = await fetch(`/api/v1/inmates/${inmateID}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                inmateName: inmateName.value,
                totalYears: totalYears.value,
                yearsLeft: yearsLeft.value,
                lifeSentence: lifeSentence.value,
                crimeCommitted: crimeCommitted.value,
                threatLevel:  threatLevel.value,
              }),
            });
            const data = await response.json();
            if (response.status === 200) {
              message.textContent = "The entry was updated.";
              showing.style.display = "none";
              inmateName.value = "";
              totalYears.value = "";
              yearsLeft.value = "";
              lifeSentence.value = "";
              crimeCommitted.value = "";
              threatLevel.value = "pending";
              thisEvent = new Event("startDisplay");
              document.dispatchEvent(thisEvent);
            } else {
              message.textContent = data.msg;
            }
          } catch (err) {
  
            message.textContent = "A communication error occurred.";
          }
        }
        suspendInput = false;
      } // section 5
      else if (e.target.classList.contains("editButton")) {
        editInmate.dataset.id = e.target.dataset.id;
        suspendInput = true;
        try {
          const response = await fetch(`/api/v1/inmates/${e.target.dataset.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.status === 200) {
            inmateName.value = data.inmate.inmateName;
            totalYears.value = data.inmate.totalYears;
            yearsLeft.value = data.inmate.yearsLeft;
            lifeSentence.value = data.inmate.lifeSentence;
            crimeCommitted.value = data.inmate.crimeCommitted;
            threatLevel.value = data.inmate.threatLevel;
            showing.style.display = "none";
            showing = editInmate;
            showing.style.display = "block";
            addingInmate.textContent = "update";
            message.textContent = "";
          } else {
            // might happen if the list has been updated since last display
            message.textContent = "The inmates entry was not found";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          }
        } catch (err) {
          message.textContent = "A communications error has occurred.";
        }
        suspendInput = false;
      } // Delete Section
      else if (e.target.classList.contains('deleteButton')) {
        suspendInput = true
        try {
          const inmateID = e.target.dataset.id
          const response = await fetch(`/api/v1/inmates/${inmateID}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
  
          if (response.status === 200) {
            message.textContent = 'The inmate was successfully deleted'
            showing.style.display = 'none'
            addingInmate.textContent = 'update'
            thisEvent = new Event('startDisplay')
            document.dispatchEvent(thisEvent)
          } else {
            message.textContent = 'The inmates entry was not found'
          }
        } catch (err) {
          message.textContent = 'A communications error has occurred.'
        }
        suspendInput = false
    }
  })
});

function toggleDarkMode() {
  var bodyElement = document.getElementById('main-background')
  var darkModeBtn = document.getElementById('dark-mode-btn')

  if (bodyElement.style.background == "black") {
      bodyElement.style.background = "#b1dae7"
      darkModeBtn.innerHTML = "Change to Dark Mode"
      bodyElement.style.color = "black"

  } else {
      bodyElement.style.background = "black"
      bodyElement.style.color = "	#daa520"
      darkModeBtn.innerHTML = "Change to Light Mode"
  }


};
