function selfDelete(element, id) {
    console.log(element);

    if (id !== 0)
    {
        fetch('/heroes/' + id, {method: "Delete"}).then(res => element.parentElement.remove());
    }
    else {
        element.parentElement.remove()
        addFirstCard();
    }
}

window.addEventListener("load", (event) => {
    getJson().then((data) => {
        populateAdmin(data)
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
    const response = await fetch('/heroes')
    const heroes = await response.json();
    return(heroes)
}

function addFirstCard() {
    let itemsWrapper = document.querySelector('.items_wrapper');

    let tempItem = document.createElement('div')
    tempItem.classList.add('item_wrapper')
    tempItem.setAttribute("addDate", "new")

    const item = `
                    <div class="image_select">
                        <img src="/static/photos/placeholder.png" alt="">
                        <div class="image_button_wrapper">
                            <p>142x142</p>
                            <label>завантажити<input class="image_input" type="file" accept="image/jpeg, image/png, image/jpg" onchange="saveImage(this)"></label>
                        </div>
                    </div>
                    <!-- name -->
                    <div class="input_wrapper"> 
                        <label for="">Ім'я героя</label>
                        <input class="heroName" type="text" placeholder="новий герой">
                    </div>
                    <!-- region -->
                    <div class="input_wrapper">
                        <label for="">Регіон</label>
                        <input class="heroRegion" type="text">
                    </div>
                    <!-- gender -->
                    <div class="input_wrapper">
                        <label for="">Стать</label>
                        <input class="heroGender" type="text">
                    </div>
                    <!-- position -->
                    <div class="input_wrapper">
                        <label for="">Посада</label>
                        <input class="heroPosition" type="text">
                    </div>
                    <!-- death date -->
                    <div class="input_wrapper">
                        <label for="">Дата загибелі</label>
                        <input class="heroDeathDate" type="date">
                    </div>
                    <!-- url -->
                    <div class="input_wrapper">
                        <label for="">Посилання</label>
                        <input class="heroLink" type="text">
                    </div>
                    <button class="delete_button" onclick="selfDelete(this, 0)">Видалити</button>
                    <button class="delete_button" onclick="save(this, 0)">Зберігти</button>
                `;
        tempItem.innerHTML = item;
        itemsWrapper.insertBefore(tempItem, itemsWrapper.firstChild);
}

function populateAdmin(data) {
    let itemsWrapper = document.querySelector('.items_wrapper');

    addFirstCard();

    data.forEach((elem) => {
        let tempItem = document.createElement('div')
        tempItem.classList.add('item_wrapper')
        tempItem.setAttribute("addDate", elem['date_added'])

        if (elem['image'].length < 1) {
            elem["image"] = "../static/photos/placeholder.png";
        }

        const item = `
                    <div class="image_select">
                        <img loading="lazy" src="/static`+ elem['image'].split('/static')[1] +`" alt="">
                        <div class="image_button_wrapper">
                            <p>142x142</p>
                            <label>завантажити<input class="image_input" type="file" accept="image/jpeg, image/png, image/jpg" onchange="saveImage(this)"></label>
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
                    <button class="delete_button" onclick="selfDelete(this, '`+elem["id"]+`')">Видалити</button>
                    <button class="delete_button" onclick="save(this, '`+elem["id"]+`')">Зберігти</button>
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

    fetch('/Images', {
        method: "POST",
        body: formData
    }).then(response => response.text())
        .then(fetch(
                '/Images?filePath='+image.src,
                { method: "DELETE"}
            ))
        .then(data => image.src = data)
}

async function save(element, id) {
    let item = element.parentElement;
    let method = "POST"

    let itemResult = {
        "image": item.querySelector('img').src,
        "name": item.querySelector('.heroName').value,
        "region": item.querySelector('.heroRegion').value,
        "gender": item.querySelector('.heroGender').value,
        "position": item.querySelector('.heroPosition').value,
        "death_date": item.querySelector('.heroDeathDate').value,
        "url": item.querySelector('.heroLink').value,
        "date_added": item.getAttribute('adddate'),
        "id": id
    }

    if (itemResult['date_added'] === 'new') {
        itemResult['date_added'] = new Date().toJSON().slice(0, 10);
        method = "PUT"
    }

    let resp = await fetch('/heroes', {
        method: method,
        body: JSON.stringify(itemResult)
    }).then(() => {window.location.reload(true)})
}