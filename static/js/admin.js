// while (prompt("Введіть пароль") != "obozrevatelbest")
//     alert("не правильний пароль")

function selfDelete(element) {
    element.parentElement.remove()
}

window.addEventListener("load", (event) => {
    getJson().then((data) => {
        populateAdmin(data['heroes'])
        filter()
    })
});

function filter() {
    let filteInput = document.querySelector("#filterInput")
    let allNames = document.querySelectorAll(".heroName")

    filteInput.addEventListener("input", (e) => {
        let searchString = filteInput.value.toLowerCase();
        allNames.forEach((name) => {
            let parent = name.parentElement.parentElement;
            if (!name.value.toLowerCase().includes(searchString) && !parent.classList.contains('hidden')) {
                parent.classList.add('hidden')
            } else if (name.value.toLowerCase().includes(searchString)) {
                parent.classList.remove('hidden')
            }
                
        })
    })
}


async function getJson() {
    const response = await fetch('./getjson')
    const heroes = await response.json();
    return(heroes)
}

function populateAdmin(data) {
    let itemsWrapper = document.querySelector('.items_wrapper');

    data.forEach((elem) => {
        let tempItem = document.createElement('div')
        tempItem.classList.add('item_wrapper')
        tempItem.setAttribute("addDate", elem['date_added'])

        if (elem['image'].length < 1) {
            elem["image"] = "../static/photos/placeholder.png";
        }

        const item = `
                    <div class="image_select">
                        <img src="`+elem['image']+`" alt="">
                        <div class="image_button_wrapper">
                            <p>142x142</p>
                            <label>завантажити<input class="image_input" type="file" accept="image/jpeg, image/png, image/jpg"></label>
                        </div>
                    </div>
                    <!-- name -->
                    <div class="input_wrapper"> 
                        <label for="">Ім'я героя</label>
                        <input class="heroName" type="text" placeholder="новий герой" value="`+elem['name']+`">
                    </div>
                    <!-- region -->
                    <div class="input_wrapper">
                        <label for="">Регіон</label>
                        <input class="heroRegion" type="text" value="`+elem["region"]+`">
                    </div>
                    <!-- gender -->
                    <div class="input_wrapper">
                        <label for="">Стать</label>
                        <input class="heroGender" type="text" value="`+elem["gender"]+`">
                    </div>
                    <!-- position -->
                    <div class="input_wrapper">
                        <label for="">Посада</label>
                        <input class="heroPosition" type="text" value="`+elem["position"]+`">
                    </div>
                    <!-- death date -->
                    <div class="input_wrapper">
                        <label for="">Дата загибелі</label>
                        <input class="heroDeathDate" type="date" value="`+elem["death_date"]+`">
                    </div>
                    <!-- url -->
                    <div class="input_wrapper">
                        <label for="">Посилання</label>
                        <input class="heroLink" type="text" value="`+elem["url"]+`">
                    </div>
                    <button class="delete_button" onclick="selfDelete(this)">Видалити</button>
                `
        tempItem.innerHTML = item;
        itemsWrapper.appendChild(tempItem)
    })

}

function saveImage(upload) {
    let image = upload.parentElement.parentElement.parentElement.querySelector('img')
    
    const files = upload.files;
    const formData = new FormData();
    formData.append('newImage', files[0])

    fetch('/uploadImage', {
        method: "POST",
        body: formData
    }).then(response => response.text())
        .then(data => image.src = data)
}

function save() {
    let items = document.querySelectorAll('.item_wrapper')
    let result = {"heroes": []}

    items.forEach((elem) => {
        let itemResult = {
            "image": elem.querySelector('img').src,
            "name": elem.querySelector('.heroName').value,
            "region": elem.querySelector('.heroRegion').value,
            "gender": elem.querySelector('.heroGender').value,
            "position": elem.querySelector('.heroPosition').value,
            "death_date": elem.querySelector('.heroDeathDate').value,
            "url": elem.querySelector('.heroLink').value,
            "date_added": elem.getAttribute('adddate')
        }

        if (itemResult['name'].length > 2 && itemResult['date_added'] == 'new')
            itemResult['date_added'] = new Date().toJSON().slice(0, 10);

        if (itemResult['name'].length > 2)
            result['heroes'].push(itemResult)
    })
    fetch('./setjson', {
        method: "POST",
        body: JSON.stringify(result)
    }).then(location.reload())
}