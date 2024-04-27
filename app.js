

var textData;

var language = localStorage.getItem('language');



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
      createIslamBlog();
      createMosqueBlog();
      createSadakaBlog();
      createDonateBlog();
      createContactBlog();
      document.getElementById('head-text') ? document.getElementById('head-text').innerHTML = data.headerText : '';



    })
    .catch(error => {
      console.error('Error fetching JSON file:', error);
    });
}

createPageElements();

function getDateAndTime() {

  let now = new Date();

  // Get the current date components
  let day = now.getDate().toString().padStart(2, '0'); // Get day of the month (1-31) and pad with 0 if necessary
  let month = (now.getMonth() + 1).toString().padStart(2, '0'); // Get month (0-11) and pad with 0 if necessary, adding 1 because months are zero-based
  let year = now.getFullYear(); // Get full year (e.g., 2024)

  // Format the date
  let currentDate = day + '-' + month + '-' + year;


  fetch(`https://api.aladhan.com/v1/timingsByCity/${currentDate}?city=Ronneby&country=Sweden&method=8`)
    .then(response => response.json())
    .then(data => {

      const timings = data.data.timings;
      console.log(data);


      const timingsArray = [];
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var today = new Date();
      var swedenDate = today.toLocaleDateString('en-SE', options);
      var d = language == 'ar' ? data.data.date.hijri.month.ar : data.data.date.hijri.month.en;
      var hijriDate = data.data.date.hijri.day + ' ' + d + ' ' + data.data.date.hijri.year;
      console.log(data.data.date.hijri.month.ar);

      document.getElementById('today-date') ? document.getElementById('today-date').innerHTML = swedenDate + ' / (' + hijriDate + ')' : '';

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

  document.getElementById('times') ? document.getElementById('times').innerHTML = `          <div class="head-time">
  <i class="fa-solid fa-person-praying"></i>
  <span>${textData.timeTable.salah}</span>
  <span>${textData.timeTable.time}</span>
</div>
`: '';
  var now = new Date();
  var currentTime = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

  var comingTime = false;

  const validPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  e.forEach(function (prayer) {

    if (validPrayers.includes(prayer.name)) {

      document.getElementById('times') ? document.getElementById('times').innerHTML += ` <div class="one-time ${prayer.time >= currentTime && !comingTime ? 'next-time' : ''}">
    <i class="fa-solid fa-clock"></i>
    <span>${prayer.name}</span>
    <span>${prayer.time}</span>
  </div>
  `: '';

      prayer.time >= currentTime ? comingTime = true : '';
    }
  });

  var tableRows = document.querySelectorAll('#times tr');

  tableRows.forEach(function (row) {
    row.style.border = '1px solid #000';

  });

}


function createNav() {

  const now = new Date();
  const currentTime = now.toLocaleTimeString();

  var data = `          
  <ul>
    <li><a href="/#">${textData.nav.home}</a></li>
    <li><a href="./contact.html">${textData.nav.contact}</a></li>
    <li><a href="#">${textData.nav.activity}</a></li>
    <li><a href="./islam.html">${textData.nav.aboutIslam}</a></li>
    <li><a href="./mosque.html">${textData.nav.aboutMosque}</a></li>
    <li><a href="#">${textData.nav.other}</a></li>
    <li><a href="./donation.html">${textData.nav.members}</a></li>

  </ul>
  `

  document.querySelector('#nav-bar').innerHTML = data;


  document.querySelector('#contact').innerHTML = `${textData.contact} `
  document.querySelector('#find-us').innerHTML = `${textData.socialMedia} `

}


function langButtons(e) {
  language = e;
  localStorage.setItem('language', language);

  createPageElements();


}

function createSadakaBlog() {
  document.querySelector('#sadaka p') ? document.querySelector('#sadaka p').innerHTML = textData.sadakaBlog : '';
  document.querySelector('#donate') ? document.querySelector('#donate').innerHTML = `${textData.donate} <i class="fa-solid fa-hand-holding-dollar">` : '';

}

function createIslamBlog() {
  document.querySelector('#islamHead') ? document.querySelector('#islamHead').innerHTML = textData.islamHead : '';
  document.querySelector('#aboutIslam') ? document.querySelector('#aboutIslam').innerHTML = textData.islamParagraph : '';

}
function createMosqueBlog() {
  document.querySelector('#mosqueHead') ? document.querySelector('#mosqueHead').innerHTML = textData.mosqueHead : '';
  document.querySelector('#aboutmosque') ? document.querySelector('#aboutmosque').innerHTML = textData.mosqueParagraph : '';

}
function createContactBlog() {
  document.querySelector('#contactHead') ? document.querySelector('#contactHead').innerHTML = textData.nav.contact : '';
  document.querySelector('#aboutcontact') ? document.querySelector('#aboutcontact').innerHTML = textData.contact : '';

}

function createDonateBlog() {
  document.querySelector('#donateHead') ? document.querySelector('#donateHead').innerHTML = textData.nav.members : '';
  // document.querySelector('#aboutcontact')?document.querySelector('#aboutcontact').innerHTML =  textData.contact:'';

}


const firebaseConfig = {
  apiKey: "AIzaSyCnNfzOlxMz3CbmDV9mH6HKFYQAGUSTHm4",
  authDomain: "iskm-49130.firebaseapp.com",
  projectId: "iskm-49130",
  storageBucket: "iskm-49130.appspot.com",
  messagingSenderId: "550193657135",
  appId: "1:550193657135:web:5d6a38bbbc2607631addda",
  measurementId: "G-7DEY6H6Y6G"
};

firebase.initializeApp(firebaseConfig);
var appDB = firebase.firestore();


const joinUsForm = document.getElementById('joinUsForm');

joinUsForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  const name = document.getElementById('name').value;
  const gender = document.getElementById('gender').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const personalNumber = document.getElementById('personal_number').value;

  // Basic form validation (optional, consider server-side validation too)
  if (!name || !gender || !email || !phone || !personalNumber) {
    alert('Please fill out all required fields.');
    return;
  }

  const memberRef = appDB.collection("members").doc(personalNumber);

  // Check if the document exists (optional)
  memberRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      // Update existing document
      memberRef.update({
        name: name,
        gender: gender,
        email: email,
        phone: phone
      }).then(() => {
        console.log("Document updated successfully");
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
    } else {
      // Create new document
      memberRef.set({
        name: name,
        gender: gender,
        email: email,
        phone: phone
      }).then(() => {
        console.log("Document added successfully");
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });
    }
  }).catch((error) => {
    console.error("Error checking document existence: ", error);
  });
});
