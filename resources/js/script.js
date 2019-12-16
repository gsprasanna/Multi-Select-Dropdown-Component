// scripts
const currentDate = document.querySelector("#current_date");

const date = new Date();
currentDate.innerHTML = date.toDateString();

/* 
  fetch and insert the fetched data to dropdown.
  async function (ES8 features) to work with promises
*/
insertData = async () => {
  try {
    // call fetchdata function and get the json data
    let response = await fetchData();
    if (response) {
      let apiResult = response;
      const multiSelect = document.querySelector("#multi-select");

      // Iterate through each element in the response and call the createDropDownElement.
      apiResult.forEach(createDropDownElement);

      /*
        function which create a list element, add the attributes and event eventlisteners to it.
        List element is appended as child to #mulit-select(parent element)
      */
      function createDropDownElement(item) {
        let listElement = document.createElement("li");

        listElement.appendChild(document.createTextNode(item.name));
        listElement.setAttribute("value", item.region);
        listElement.addEventListener("click", function() {
          return add_selected_item(this, event);
        });
        multiSelect.appendChild(listElement);
      }
    } else {
      alert("Error in retrieving the data!");
    }
  } catch (e) {
    console.error(e);
  }
};

// fetch operation
const fetchData = () => {
  const requestUrl = "https://restcountries.eu/rest/v2/all";

  return new Promise((resolve, reject) => {
    // fetch function used to make the network request with requestURL
    fetch(requestUrl)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          let error = new Error(response.statusText || response.status);
          error.response = response;
          reject(error);
        }
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// add the selected items
const add_selected_item = (elem, e) => {
  e.stopPropagation();
  try {
    // debugger;
    if (elem.classList.contains("list-selected")) {
      elem.classList.remove("selected-items");
      elem.classList.remove("list-selected");
      let items = document.querySelectorAll(".selected_content");
      let arr = [...items];
      let removeElement = arr.find(item => {
        if (item.textContent.includes(elem.innerText)) {
          return item;
        }
      });
      remove_selected_item(removeElement, e);
    } else {
      elem.classList.add("list-selected");
      elem.classList.add("selected-items");
      let option_text = elem.innerText;
      let option_value = elem.getAttribute("value");
      let selected_items = elem.parentElement.parentElement.querySelector(
        ".multiselect_fields"
      );

      /*
      creating the child elements for the option selected by user 
      and 
      append to the parent element (selected_items).
    */
      let parentElement = document.createElement("div");
      parentElement.setAttribute("class", "multiselect_field");
      let childElement = document.createElement("div");
      childElement.setAttribute("value", option_value);
      childElement.setAttribute("class", "selected_content");

      childElement.innerText = option_text;
      let secondchildElement = document.createElement("span");
      secondchildElement.setAttribute("class", "del_icon");

      secondchildElement.innerHTML = "&#10006"; //"\u00D7";
      secondchildElement.addEventListener("click", function() {
        return remove_selected_item(this, event);
      });
      childElement.appendChild(secondchildElement);
      parentElement.appendChild(childElement);

      selected_items.insertBefore(
        parentElement,
        selected_items.lastElementChild
      );
    }
  } catch (e) {
    console.error(e);
  }
};

// remove the items
const remove_selected_item = (elem, e) => {
  e.stopPropagation();
  try {
    if (elem.classList.contains("del_icon")) {
      /*
        remove the items from multiselect field via remove icon
        remove the styles from dropdown list
      */
      elem.parentElement.parentElement.remove();
      let items = document.querySelectorAll(".list-selected");
      let arr = [...items];
      let removeStyle = arr.find(item => {
        if (elem.parentElement.textContent.includes(item.innerText)) {
          return item;
        }
      });
      removeStyle.classList.remove("list-selected");
      removeStyle.classList.remove("selected-items");
    } else {
      elem.parentElement.remove(); // remove the selected item via dropdown list
    }
  } catch (e) {
    console.error(e);
  }
};

// filter the dropdown content
const filterContent = () => {
  let inputElement, filterValue, htmlCollector;
  inputElement = document.getElementById("myInput");
  filterValue = inputElement.value.toUpperCase();
  let element = document.getElementById("multi-select");
  htmlCollector = element.getElementsByTagName("li");

  let arr = [...htmlCollector]; //using the spread operator

  /*
    filter method used to filter the data based on the input in search box and display the filtered results.
  */
  arr.filter(elem => {
    let value = elem.textContent || elem.innerText;
    if (value.toUpperCase().indexOf(filterValue) > -1) {
      elem.style.display = "";
    } else {
      elem.style.display = "none";
    }
  });
};

// get all selected Items
const getAllSelectedItems = () => {
  let selector = document.querySelectorAll(".selected_content");
  let arr = [...selector]; // spread operator to get the values stored in form of array
  if (arr.length) {
    let selectedItems = arr.map(item => item.innerText.split("\n")[0]);
    alert(selectedItems);
  } else {
    alert("Please select the items!");
  }
  return arr;
};
