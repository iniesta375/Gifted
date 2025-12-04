let groomTime = [];

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
    localStorage.setItem('time', JSON.stringify(groomTime))
  }

console.log(date.value);
date.value = "";
service.value = "";
};


