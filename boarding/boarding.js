

let boardTime = [];

const checkTime = (e) => {
  e.preventDefault();
  if (checkIn.value === "" || checkOut.value === "" || service.value === "") {
    alert("fill in all inputs");
  } else {
    let boardObj = {
      dateIn: checkIn.value,
      dateOut: checkOut.value,
      service: service.value,
    };
    boardTime.push(boardObj);
    localStorage.setItem("board", JSON.stringify(boardTime));
  }

  console.log(dateIn, dateOut, service);
  
  checkIn.value = "";
  checkOut.value = "";
  service.value = "";
};
