let groomTime = [];
// const date = document.getElementById('date')

const findTime = (e) => {
  e.preventDefault();
  if (date.value === "" || service.value === "") {
    alert("fill in all inputs");
  } else {
    let groomObj = {
      dat: date.value,
      sevice: service.value,
    };
    groomTime.push(groomObj);
    // console.log(groomObj);
    // console.log(groomTime);

    localStorage.setItem('time', JSON.stringify(groomTime))
    // if()
  }

console.log(date.value);
date.value = "";
service.value = "";
};


