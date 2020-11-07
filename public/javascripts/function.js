const cellList = document.getElementsByClassName("cell");

let player = 1;
let win = 0;
let markup = new Array(cellList.length);
let tableID = 0;

// making sure the document is ready and loaded
if (document.readyState !== "loading") {
  console.log("executing");
  initialize();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("executing after wait");
    initialize();
  });
}

function initialize() {
  console.log("initializing");

  getTable();

  // add eventlisteners to all cells
  for (let i = 0; i < cellList.length; i++) {
    cellList[i].addEventListener("mousedown", function () {
      //do the thing that happens when u click
      if (win == 0) {
        clickAction(i);
      }
    });
  }

  // button eventlistener
  document.getElementById("restart").addEventListener("click", restart);
}

function clickAction(i) {
  console.log("CLICK from player " + player);
  //check if cell is empty or game has ended
  if (cellList[i].innerHTML.trim() === "" && win == 0) {
    if (player == 1) {
      // add x to cell
      cellList[i].innerHTML = "x";
      // change player
      player = 2;
    } else {
      // add o to cell
      cellList[i].innerHTML = "o";
      // change player
      player = 1;
    }

    // check win status
    // 5 in a row
    for (let i = 0; i < cellList.length; i = i + 5) {
      if (
        cellList[i].innerHTML !== "" &&
        cellList[i].innerHTML === cellList[i + 1].innerHTML &&
        cellList[i].innerHTML === cellList[i + 2].innerHTML &&
        cellList[i].innerHTML === cellList[i + 3].innerHTML &&
        cellList[i].innerHTML === cellList[i + 4].innerHTML
      ) {
        // trigger win
        winning(i);
      }
    }
    // 5 in a column
    if (win == 0) {
      for (let i = 0; i < 5; i++) {
        if (
          cellList[i].innerHTML !== "" &&
          cellList[i].innerHTML === cellList[i + 5].innerHTML &&
          cellList[i].innerHTML === cellList[i + 10].innerHTML &&
          cellList[i].innerHTML === cellList[i + 15].innerHTML &&
          cellList[i].innerHTML === cellList[i + 20].innerHTML
        ) {
          // trigger win
          winning(i);
        }
      }
    }
    // 5 diagonally
    if (win == 0) {
      let i = 0;
      if (
        cellList[i].innerHTML !== "" &&
        cellList[i].innerHTML === cellList[i + 6].innerHTML &&
        cellList[i].innerHTML === cellList[i + 12].innerHTML &&
        cellList[i].innerHTML === cellList[i + 18].innerHTML &&
        cellList[i].innerHTML === cellList[i + 24].innerHTML
      ) {
        // trigger win
        winning(i);
      }
    }
    if (win == 0) {
      let i = 4;
      if (
        cellList[i].innerHTML !== "" &&
        cellList[i].innerHTML === cellList[i + 4].innerHTML &&
        cellList[i].innerHTML === cellList[i + 8].innerHTML &&
        cellList[i].innerHTML === cellList[i + 12].innerHTML &&
        cellList[i].innerHTML === cellList[i + 16].innerHTML
      ) {
        // trigger win
        winning(i);
      }
    }
    // send table state to server
    sendClick();
  }
}

function getTable() {
  // get table and gameinfo from server?
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  fetch("/table/", {
    method: "GET"
  })
    //tämä on nyy saatu index.js kautta
    // tarvittavat tiedot datassa
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      //check if db is empty:
      if (data) {
        //tallennetaan paikallisiin muuttujiin
        //tableID = data.tableID;
        markup = data.markup;
        player = data.player;
        win = data.win;

        // render:
        for (let i = 0; i < cellList.length; i++) {
          cellList[i].innerHTML = markup[i];
        }
        console.log("Table data retrieved");
        console.log("Turn of player " + player);
      } else {
        console.log("No table data found");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function restart() {
  for (let i = 0; i < cellList.length; i++) {
    cellList[i].innerHTML = "";
  }
  win = 0;
  player = 1;

  console.log("Table emptied");
  sendClick();
}

function sendClick() {
  for (let i = 0; i < cellList.length; i++) {
    markup[i] = cellList[i].innerHTML;
  }

  //tableID++;

  var data = {
    tableID: tableID,
    markup: markup,
    player: player,
    win: win
  };
  console.log(JSON.stringify(data));

  console.log("Saving table state...");

  //send click information forward (data)
  fetch("/create", {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if (response.redirected) {
      console.log("redirect");
      window.location.href = response.url;
    }
  });
}

function winning(i) {
  console.log("win sequence");
  // show winning row/column/ etc
  // cellList[i].style.backgroundColor = "lightgreen";
  // ...
  // alert winner

  alert("Player " + player + " won!");
  console.log(player);

  // log win
  win = 1;
}
