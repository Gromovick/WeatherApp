const input_btn = document.querySelector(".enter");
const input = document.querySelector(".input");
const date_btns = document.querySelectorAll(".date-btn");
const time_btn = document.querySelectorAll(".time-date__btn");
let main_data;

input_btn.addEventListener("click", () => {
  startInput(input.value);
});

async function startInput(city) {
  const data = await getWeather(city);
  if (city) {
    input.value = city;
  }
  main_data = data;
  updateTabs(0, data);
  timeRend(true)
}

async function getWeather(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=dd4c033a54944f03a10101029241205&q=${city}&days=5&aqi=no&alerts=no`;
  // console.log(input.value);
  // console.log(await fetch(url));
  try {
    let res = await fetch(url);
    // console.log(res);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let mainData = await res.json().then((data) => {
      return data;
    });
    const status = document.querySelector(".status");
    status.innerText = "";
    // console.log(mainData);
    return mainData;
  } catch (error) {
    // console.log(error);
    errorP();
  }
}
function getPos() {
  const success = async (position) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?lati
    tude=${position.coords.latitude}&longitude=${position.coords.longitude}&local
    ityLanguage=en`;
    // console.log(position.coords.latitude);
    // console.log(position.coords.longitude);
    const city = await fetch(url)
      .then((res) => res.json())
      .then((data) => data);
    // console.log(city);
    startInput(city.city);
  };
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, errorP);
  }
}

function errorP() {
  const status = document.querySelector(".status");
  status.innerText = "Sorry, we can't find your city";
  // console.log("Here");
}
date_btns.forEach((e, index) => {
  e.addEventListener("click", () => {
    timeRend(true);
    date_btns.forEach((el) => {
      el.classList.remove("active");
    });
    dateBtnAnim(index);
    updateTabs(index, main_data);
    // console.log("Index", index);
    e.classList.add("active");
  });
});

time_btn.forEach((e, index) => {
  e.addEventListener("click", () => {
    const tabs = document.querySelectorAll(".tabs");

    tabs.forEach((e) => {
      e.classList.remove("choose");
    });
    tabs[index].classList.add("choose");
    // console.log(index);
  });
});

function updateTabs(day = 0, data) {
  if (!main_data) {
    return;
  }
  const wrapper = document.querySelector(".content-wrapper");
  wrapper.innerHTML = "";
  for (let i = -1; i < 6; i++) {
    // console.log(i);
    if (i > -1) {
      // console.log(data.forecast.forecastday[day].hour[i * 4].time);
    }
    const tab = document.createElement("div");
    tab.classList.add("tabs", "content-info");
    tab.innerHTML = `
        <div class="content-info-item">
        <span class="text location"> <span class="contrast-text">Location:</span> ${
          data.location.name
        }</span>
        <div class="icon icon-location"></div>
      </div>
      <div class="content-info-item">
        <span class="text type"> <span class="contrast-text">Type:</span> ${
          i < 0
            ? data.current.condition.text
            : data.forecast.forecastday[day].hour[i * 4].condition.text
        }</span>
        <img src="${
          i < 0
            ? data.current.condition.icon
            : data.forecast.forecastday[day].hour[i * 4].condition.icon
        }" class="icon-img">
      </div>
      <div class="content-info-item">
        <span class="text temperature">
          <span class="contrast-text">Temperature:</span> ${
            i < 0
              ? data.current.temp_c
              : data.forecast.forecastday[day].hour[i * 4].temp_c
          }°C</span>
        <div class="icon icon-temperature"></div>
      </div>
      <div class="content-info-item">
        <span class="text wet"> <span class="contrast-text">Wet:</span> ${
          i < 0
            ? data.current.humidity
            : data.forecast.forecastday[day].hour[i * 4].humidity
        }%</span>
        <div class="icon icon-wet"></div>
      </div>
      <div class="content-info-item">
        <span class="text rain"> <span class="contrast-text">Rain:</span> ${
          i < 0
            ? data.current.precip_mm
            : data.forecast.forecastday[day].hour[i * 4].precip_mm
        }mm</span>
        <div class="icon icon-rain"></div>
      </div>
      <div class="content-info-item">
        <span class="text wind"> <span class="contrast-text">Wind speed:</span> ${
          i < 0
            ? data.current.wind_kph
            : data.forecast.forecastday[day].hour[i * 4].wind_kph
        } km/h</span>
        <div class="icon icon-wind"></div>
      </div>
      <div class="content-info-item">
        <span class="text direction">
          <span class="contrast-text">Wind direction:</span> ${
            i < 0
              ? data.current.wind_dir
              : data.forecast.forecastday[day].hour[i * 4].wind_dir
          }</span>
    <div class="icon icon-direction"></div>`;
    if (i < 0) {
      tab.classList.add("choose");
    }
    wrapper.append(tab);
  }
}

function dateBtnAnim(number = 0) {
  const dateBtn = document.querySelector(".date-btn");
  const slider = document.querySelector(".slider");
  slider.style.width = `${Number(dateBtn.offsetWidth)}px`;
  slider.style.left = `${number * Number(dateBtn.offsetWidth)}px`;
}

window.addEventListener("load", () => {
  getPos();
  dateBtnAnim();
  // startInput();
  renderTime();
  renderDate();
  renderDays();
  gsapAnim();
  timeRend();
});

function renderTime() {
  setInterval(() => {
    const dateNow = new Date(Date.now());
    const time = document.querySelector(".cur-time");
    time.innerText = dateNow.toTimeString().split(" ")[0];
    // console.log(dateNow.toDateString());
    // console.log(getDayOfWeek(dateNow.getDay()), getMonth(dateNow.getMonth()), dateNow.getDate());
  }, 1000);
}

function renderDate() {
  const dateNow = new Date(Date.now());
  const dateDiv = document.querySelector(".weather-content__date");
  const day = getDayOfWeek(dateNow.getDay());
  const month = getMonths(dateNow.getMonth());
  const date = dateNow.getDate();

  const subs = ["st", "d", "d", "th"];
  let sub;

  if (Number(date) < 4 || Number(String(date)[1]) < 4) {
    sub = subs[Number(String(date)[1]) - 1 || Number(date) - 1];
  } else {
    sub = subs[3];
  }
  dateDiv.innerText = `${day}, ${date}${sub} ${month}`;
}

function getDayOfWeek(index) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[index];
}

function getMonths(index) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    " September",
    "October",
    "November",
    "December",
  ];
  return months[index];
}

function renderDays() {
  const day = new Date(Date.now());
  let count = new Date(day.getFullYear(), day.getMonth() + 1, 0);
  count = Number(String(count).split(" ")[2]);
  let now = day.getDate();
  let days = [];
  const subs = ["st", "d", "d", "th"];
  let sub;
  for (let i = 0; i < 5; i++) {
    if (now > count) {
      now = 1;
      // console.log("Here");
    }
    days.push(now);
    now++;
  }
  const daysDiv = document.querySelectorAll(".date-btn");
  daysDiv.forEach((e, index) => {
    if (days[index] < 4 || days[index][1] < 4) {
      sub = subs[days[index][1] - 1 || days[index] - 1];
    } else {
      sub = subs[3];
    }
    e.innerText = `${days[index]}${sub}`;
  });
}

function gsapAnim() {
  // gsap.from(".weather-img", {x: -100, opacity: 0, duration: 1, delay: 1});
  document.querySelector(".container").style.gridTemplateRows = "1fr";
  gsap.from(".left-info", { x: -200, opacity: 0, duration: 1, delay: 2 });
  gsap.from(".date-buttons", { x: -200, opacity: 0, duration: 0.5, delay: 1 });
  gsap.from(".date-btn", { scale: 0, duration: 0.5, delay: 1.5 });
  gsap.from(".slider", { scale: 0, duration: 0.5, delay: 1.5 });
  gsap.from(".btn-time-wrapper", {
    x: 200,
    opacity: 0,
    duration: 0.5,
    delay: 2,
    stagger: 0.25,
  });
  gsap.from(".right-info", {
    x: 200,
    opacity: 0,
    duration: 0.5,
    delay: 2,
  });
}

input.addEventListener("input", autoComplete);

async function autoComplete() {
  if (!input.value.length === 0) {
    document.querySelector(".auto-com").style.display = "flex";
  }
  const url = `https://api.weatherapi.com/v1/search.json?key=dd4c033a54944f03a10101029241205&q=${input.value}`;
  let answers = [];
  const response = await fetch(url).then((res) => res.json());
  // console.log(response);
  document.querySelectorAll(".auto-com-item").forEach((e) => {
    e.remove();
    e.addEventListener("click", () => {
      input.value = e.innerText;
      startInput(e.innerText);
    });
  });

  response.forEach((e) => {
    const item = document.createElement("span");
    item.classList.add("auto-com-item");
    item.innerText = `${e.name}, ${e.country}`;
    document.querySelector(".auto-com").append(item);
  });

  document.querySelectorAll(".auto-com-item").forEach((e) => {
    e.addEventListener("click", () => {
      input.value = e.innerText;
      startInput(e.innerText);
      document.querySelector(".auto-com").style.display = "none";
    });
  });
  // console.log(document.querySelectorAll(".auto-com-item"));
}

input.addEventListener("focus", function () {
  document.querySelector(".auto-com").style.display = "flex";
});

document.addEventListener("click", function (event) {
  if (
    !input.contains(event.target) &&
    !document.querySelector(".auto-com").contains(event.target)
  ) {
    document.querySelector(".auto-com").style.display = "none";
  }
});
function timeRend(out) {
  // document.querySelectorAll(".btn-time-wrapper").forEach((e) => {
  //   e.classList.remove("active");
  // });
  document.querySelectorAll(".btn-time-wrapper").forEach((e, index) => {
    e.addEventListener("click", () => {
      document.querySelectorAll(".btn-time-wrapper").forEach((e) => {
        e.classList.remove("active");
      });
      e.classList.add("active");
    });
    if (out && index === 0) {
      document.querySelectorAll(".btn-time-wrapper").forEach((e) => {
        e.classList.remove("active");
      });
      e.classList.add("active");
      return;
    }
  });
}

window.addEventListener("resize", resizeFunc);

function resizeFunc() {
  // const myElement = document.querySelector("html");
  const windowWidth = window.innerWidth;

  if (windowWidth <= 769) {
    document
      .querySelector(".weather-content")
      .insertBefore(
        document.querySelector(".date-buttons"),
        document.querySelector(".right-info")
      );
  } else {
    document
      .querySelector(".main-content")
      .insertBefore(
        document.querySelector(".date-buttons"),
        document.querySelector(".weather-content")
      );
  }
}
