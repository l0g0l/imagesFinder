const result = document.querySelector('#result');
const form = document.querySelector('#form');
const paginationDiv = document.querySelector('#pagination');
const totalImages = document.querySelector('#totalImages');


const docsPerPage = 40; // imágenes por página
let totalPages; // almacena el num de paginas por categoría
let iterador;
let actualPage = 1 // la primera vez que llamemos a la API serán los docs de la pag 1


// registramos el submit para el formulario y lo validamos
window.onload = () => {
    form.addEventListener('submit', validationForm)

    //llamando a la función aquí lo que hago es que nada más cargar la página se muestren las imágenes de la categoría que le pase por parámetro
    searchImages('nature')

}


//validación el formulario
function validationForm(e) {
    e.preventDefault(); // paramos el formulario 

    // recogemos el valor del inmput
    const wordSearch = document.querySelector('#word').value


    // validamos que, si el input está vacío, muestre una alerta  
    if (wordSearch === '') {
        showAlert('Enter a search term');
        return;
    }

    //una vez pasa la validación, llamamos a la función de buscar imágenes
    searchImages(wordSearch)
}


// si la validación falla, mostramos un error
function showAlert(message) {

    const alertExist = document.querySelector('.alert')

    // le ponemos el if para indicar que, si no existe alerta, porque si no metes en un if, crear tantas alertas como veces le des al botón  de search

    if (!alertExist) {
        const alert = document.createElement('div');
        alert.classList.add('alert')
        alert.setAttribute("role", "alert")
        

        alert.innerHTML = `
            <strong class="span">Error! ${message}</strong>
        `;
        form.appendChild(alert);

        setTimeout(() => {
            alert.remove()
        }, 2000);
    }
}


// llamamos a la API 
function searchImages(word) {

    const key = '22854173-b9a58ddc094b31ac018df9dda';
    // a la url le pasamos la key, lo que el ususario ha metido en el input, las imagenes por pagina y el comienzo de la paginación
    const url = `https://pixabay.com/api/?key=${key}&q=${word}&per_page=${docsPerPage}&page=${actualPage}`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // calulamos el nº de páginas que tiene que mostrar
            totalPages = calculatePages(result.totalHits)
            totalPages2 = result.totalHits // muestra todas las imágenes que hay de la búsquedapor el input
            console.log(totalPages);

            showImages(result.hits, result.totalHits);

        })

}

// Creamos un GENERADOR (se pone el asterisco antes del nombre de la función) que va a calcular la cantidad de elementos de acuerdo a la páginas que haya. Iterará todos los docs hasta llegar al final

function* createPagination(page) {
    for (let i = 1; i <= page; i++) {
        // con yield lo que hacemos es guardar los valores de la iteración para mostrar las páginas que luego utilizaremos en printPages iterador = createPagination (totalPages)
        yield i;
    }
}

// el parámetro total son los resultados que nos de el fetch
function calculatePages(total) {
    console.log(total);


    // calculamos, redondeando al alza (con Math.ceil) para que si, el resultado tiene decimales, al redondear al alza no nos dejamos ningún docs sin mostrar. Los docs que debemos tener por página, teniendo en cuenta que la API solo nos mostrará un máximo de 500 docs por categoría y que nosotros queremos mostrar 40 por página. Total es el total por categoría y docsPerPage es la variable que hemos creado para que se muestren "n" docs por pagina

    return parseInt(Math.ceil(total / docsPerPage))
}


function showImages(images) {
    console.log(images);

    //elimina los resultados previos limpiando el HTML
    while (totalImages.firstChild) {
        totalImages.removeChild(totalImages.firstChild)
    }
    totalImages.innerHTML += `

        <p >${totalPages2} Images</p>

        `

    //elimina los resultados previos limpiando el HTML
    while (result.firstChild) {
        result.removeChild(result.firstChild)
    }


    // iteramos sobre el arreglo de imagenes con un forEach porque no necesito un neuvo array, por eso no uso un map y construimos el HTML
    images.forEach(item => {
        const { previewURL, likes, views, largeImageURL, tags } = item;

        result.innerHTML += `
      
        <div class="containerimg">
            <div class="divimg">
                <img class="img-card" src=${previewURL} alt=${tags}>
            </div>
            <div class="divtext">
                <p > ${likes} <span class="light">Likes</span> </p>
                <p > ${views} <span class="light">Times see</span> </p>
            <div class="link-btn">
            <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="link" > Image </a>

            </div>

            </div>
          

        </div>
    `


    })

    // limpiar paginador previo

    while (paginationDiv.firstChild) {
        paginationDiv.removeChild(paginationDiv.firstChild)
    }

    //generamos el nuevo HTML

    printPagination()
}

function printPagination() {
    // de primeras en el console.log vemos que en GENERADOR aparece como suspended, esto es así orque hacen lo que tienen que hacer y luego se duermen. Para despertarlo añadimos .next()
    iterador = createPagination(totalPages);

    // console.log(iterador.next().value); // valor de la iteración
    // console.log(iterador.next().done); // true o flase si ha terminado la iteración o no


    while (true) {
        const { value, done } = iterador.next();
        // si ha terminado y "done" es true, para
        if (done) return;

        // sino, genera un botón por cada elemento del generador

        const button = document.createElement('a');
        button.href = '#';
        button.dataset.page = value;
        button.textContent = value;
        button.classList.add('btn');

        // para navegar entre páginas a través de la paginación

        button.onclick = () => {
            // en esta variable almacenamos el valor del boton de la paginación que cliquemos, por default hemos inicializado la variable actualPage en 1 y en la url le hemos indicado que comience mostrando la 1
            actualPage = value

            // para que el valor de actualPage se vaya actualizando y mostrando distintos resultados, tenemos que llamar a la API cada vez que clickeos un botón
            searchImages()

        }

        paginationDiv.appendChild(button)
    }

}

/* scroll infinito
window.addEventListener('scroll', () =>  {
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        showImages()
    }
})
 */