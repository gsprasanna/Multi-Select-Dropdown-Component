// scripts
const currentDate = document.querySelector("#current_date");

const date = new Date();
currentDate.innerHTML = date.toDateString();

// insert the fetched data to dropdown
insertData = async () => {
  try {
    let response = await fetchData();
    if (response) {
      let apiResult = response;
      const multiSelect = document.querySelector("#multi-select");

      apiResult.forEach(createDropDownElement);
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
      alert("HTTP-Error: " + response);
    }
  } catch (e) {
    console.error(e);
  }
};

// fetch operation
const fetchData = () => {
  const requestUrl = "https://restcountries.eu/rest/v2/all";

  return new Promise((resolve, reject) => {
    fetch(requestUrl)
      .then(response => response.json())
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
    let option_text = elem.innerText;
    let option_value = elem.getAttribute("value");
    let selected_items = elem.parentElement.parentElement.querySelector(
      ".multiselect_fields"
    );

    let parentElement = document.createElement("div");
    parentElement.setAttribute("class", "multiselect_field");
    let childElement = document.createElement("div");
    childElement.setAttribute("value", option_value);
    childElement.setAttribute("class", "selected_content");
    childElement.style.cssText = `color:${
      selected_items.childElementCount % 2 === 0 ? "chocolate" : "crimson"
    }`;
    childElement.innerText = option_text;
    let secondchildElement = document.createElement("div");
    secondchildElement.setAttribute("class", "del_icon");

    secondchildElement.innerHTML = "&#10006";
    secondchildElement.addEventListener("click", function() {
      return remove_selected_item(this, event);
    });
    parentElement.appendChild(childElement);

    parentElement.appendChild(secondchildElement);

    selected_items.appendChild(parentElement);

    elem.remove();
  } catch (e) {
    console.error(e);
  }
};

// remove the items
const remove_selected_item = (elem, e) => {
  e.stopPropagation();
  try {
    let option_text = elem.parentElement.querySelector(".selected_content")
      .innerHTML;
    let option_value = elem.parentElement
      .querySelector(".selected_content")
      .getAttribute("value");
    let selector = elem.parentElement.parentElement.parentElement.querySelector(
      "#multi-select"
    );

    let listElement = document.createElement("li");

    listElement.appendChild(document.createTextNode(option_text));
    listElement.value = option_value;
    listElement.addEventListener("click", function() {
      return add_selected_item(this, event);
    });
    selector.appendChild(listElement);

    elem.parentElement.remove();
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

  let arr = [...htmlCollector];
  arr.filter(elem => {
    let value = elem.textContent || elem.innerText;
    if (value.toUpperCase().indexOf(filterValue) > -1) {
      elem.style.display = "";
    } else {
      elem.style.display = "none";
    }
  });
};
