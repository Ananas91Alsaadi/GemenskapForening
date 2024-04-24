var textData;
var language = '';

const langLink = () => {
  switch (language) {
    case 'en':
      return './text/english.json';
    case 'ar':
      return './text/arabic.json';
    default:
      return './text/swedish.json';
  }
};

function createPageElements() { 
fetch(langLink())
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch JSON file');
    }
    return response.json();
  })
  .then(data => {

    textData = data

    createNav();
    getDateAndTime();

    document.getElementById('head-text').innerHTML = data.headerText;

    

  })
  .catch(error => {
    console.error('Error fetching JSON file:', error);
  });
}

createPageElements();

function getDateAndTime() {
fetch('https://api.aladhan.com/v1/timingsByCity/23-04-2024?city=Ronneby&country=Sweden&method=8')
  .then(response => response.json())
  .then(data => {

    const timings = data.data.timings;
    console.log(data);


    const timingsArray = [];
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today = new Date();
    var swedenDate = today.toLocaleDateString('en-SE', options);
    var d = language=='ar'? data.data.date.hijri.month.ar: data.data.date.hijri.month.en;
    var hijriDate = data.data.date.hijri.day + ' '+ d  +' '+ data.data.date.hijri.year;
    console.log(data.data.date.hijri.month.ar);

    document.getElementById('today-date').innerHTML =swedenDate+' / ('+ hijriDate + ')';

    for (let key in timings) {
      timingsArray.push({ name: key, time: timings[key] });
    }

    console.log(timingsArray);

    populateTable(timingsArray);

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

}

function populateTable(e) {
  console.log(textData);

  document.getElementById('times').innerHTML = `          <div class="head-time">
  <i class="fa-solid fa-person-praying"></i>
  <span>${textData.timeTable.salah}</span>
  <span>${textData.timeTable.time}</span>
</div>
`;
var now = new Date();
var currentTime = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes(); 

  var comingTime=false;

  e.forEach(function(prayer) {

    console.log(prayer.time);
    console.log(currentTime);
    console.log(comingTime);


    document.getElementById('times').innerHTML += ` <div class="one-time ${prayer.time >= currentTime && !comingTime ? 'next-time':''}">
    <i class="fa-solid fa-clock"></i>
    <span>${prayer.name}</span>
    <span>${prayer.time}</span>
  </div>
  `;

  prayer.time >= currentTime? comingTime=true :'';

  });

  var tableRows = document.querySelectorAll('#times tr');

  tableRows.forEach(function(row) {
    row.style.border = '1px solid #000';
    
  });
  
}


function createNav() {

  const now = new Date();
  const currentTime = now.toLocaleTimeString();

  var data = `          
  <ul>
    <li><a href="#">${textData.nav.home}</a></li>
    <li><a href="#">${textData.nav.contact}</a></li>
    <li><a href="#">${textData.nav.activity}</a></li>
    <li><a href="#">${textData.nav.aboutIslam}</a></li>
    <li><a href="#">${textData.nav.aboutMosque}</a></li>
    <li><a href="#">${textData.nav.other}</a></li>
    <li><a href="#">${textData.nav.members}</a></li>

  </ul>
  `

  document.querySelector('#nav-bar').innerHTML = data;

}


function langButtons(e) {
  language = e;
  createPageElements();


}

