/*
 * Obtencion de archivos JS de manera paralela y carga sincronica
 */
//loadjs(['https://kit.fontawesome.com/bf671ef02a.js', 'https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js', '/js/ramos.js', '/js/canvas.js'], 'init');
/*loadjs.ready('init', {
    success: function() { console.log("Recursos cargados") },
    error: function(depsNotFound) {
        Swal.fire(
            "Fallo al cargar",
            "Tuvimos problemas al cargar algunas dependencias... el sitio se recargara en 5 segundos.",
            "error"
        );
        setTimeout(function(){
            location.reload();
        }, 5000);
    },
});*/


const relaPath = "./";
let fullCareerName = "";
const texts = "Malla";
if ("serviceWorker" in navigator) {
    console.log("Service worker compatible");
    window.addEventListener("load", function() {
        navigator.serviceWorker.register(`${relaPath  }serviceWorker.js`).then(function(registration) {
            // Registration was successful
            console.log("ServiceWorker registration successful with scope: ", registration.scope);
        }, function(err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
        });
    });
}

const params = new URLSearchParams(window.location.search);

let carr = localStorage.getItem("currentCarreer");

if (params.get("m")) {
    carr = params.get("m");
    localStorage.setItem("currentCarreer", carr);
}

// update the url for feedback
if (carr) {
    const url = new URL(window.location.href);
    url.searchParams.set("m", carr);
    window.history.pushState({}, "", url);
}


if (!carr)
    carr = "INF";

// document.addEventListener("DOMContentLoaded", loadViews)
//
// window.addEventListener("load", function () {console.log("load")})
// function loadViews() {
console.log("dom");
// obtener vistas
const includes = document.querySelectorAll("[data-include]");
const promises = [];
let welcomeTexts = {};
includes.forEach(include => {
    const fileURL = `${relaPath  }views/${  include.attributes["data-include"].nodeValue  }.html`;
    promises.push(fetch(fileURL).then(response => response.text())
        .then(data => {
            include.insertAdjacentHTML("afterbegin", data);
        }));
});
const fileURL = `${relaPath  }data/welcomeTexts.json`;
promises.push(fetch(fileURL).then(response => response.json()));
const careersPromise = Promise.all(promises).then((datas) => {
    fetch(`${relaPath  }date.txt`).then(response => response.text()).then(text => {
        const lines = text.trim().split("\n");
        const timestamp = lines[0];
        const commitText = lines.length > 1 ? lines[1] : "";

        let dateObj = new Date(parseInt(timestamp));
        if (isNaN(dateObj.getTime())) {
            dateObj = new Date();
        }
        const simpleDateText = dateObj.toLocaleString();
        const textToDisplay = commitText ? commitText : simpleDateText;

        const updateEl = document.getElementById("lastUpdate");
        updateEl.textContent = textToDisplay;

        if (commitText) {
            updateEl.classList.add("clickable");
            updateEl.style.cursor = "pointer";
            updateEl.title = "Click para ver la fecha exacta";
            updateEl.addEventListener("click", function() {
                if (this.textContent === textToDisplay) {
                    this.textContent = simpleDateText;
                } else {
                    this.textContent = textToDisplay;
                }
            });
        }
    }).catch(() => {
        document.getElementById("lastUpdate").textContent = "No disponible";
    });

    welcomeTexts = datas.pop()[texts];

    const home = document.getElementById("goToHome");
    home.setAttribute("href", `${relaPath  }?m=${  carr}`);
    return fetch(`${relaPath  }/data/carreras.json`);
}).then(response => response.json());

careersPromise.then((careers) => {
    careers.forEach(career => {
        if (career["Link"] === carr) {
            fullCareerName = career["Nombre"];
            welcomeTexts["welcomeTitle"] = welcomeTexts["welcomeTitle"].replace("CARRERA", career["Nombre"]);
            document.querySelectorAll(".carrera").forEach(el => el.textContent = career["Nombre"]);
            document.title = `Malla interactiva ${  career["Nombre"]  } UAI`;
        }
    });
    document.getElementById("carreras1-nav").insertAdjacentHTML("beforeend", careers.map(function (values) {
        return `<li><a class="nav-item nav-link" href="?m=${values.Link}"><span class="d-md-none">Malla </span>${values.Nombre}</a></li>`;
    }).join(""));
    document.getElementById("carreras2-nav").insertAdjacentHTML("beforeend", careers.map(function (values) {
        return `<a class="dropdown-item" href="?m=${values.Link}">Malla ${values.Nombre}</a>`;
    }).join(""));
    if ( document.querySelector(".overlay-content h1")){
        document.querySelector(".overlay-content h1").textContent = welcomeTexts["welcomeTitle"];
        document.querySelector(".overlay-content h5").textContent = welcomeTexts["welcomeDesc"];
    }
});
// }

function removePopUp() {
    d3.select("body").style("overflow", "initial");
    d3.selectAll(".overlay").style("-webkit-backdrop-filter", "blur(0px) contrast(100%)");
    d3.selectAll(".overlay").style("backdrop-filter", "blur(0px) contrast(100%)");
    d3.select(".overlay-content").transition().style("filter", "opacity(0)");
    d3.select(".overlay").transition().style("filter", "opacity(0)").on("end", function() {
        d3.select(this).remove();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("creditsExample").textContent = "Créditos SCT";

    careersPromise.then((careers) => {
        const malla = new Malla();
        malla.enableCreditsStats();
        malla.enableCreditsSystem();
        malla.enableSave();
        document.getElementById("cleanApprovedButton").addEventListener("click", () => malla.cleanSubjects());

        const currentCareerObj = careers.find(c => c.Link === carr);
        const drawnMalla = malla.setCareer(carr, fullCareerName, relaPath, currentCareerObj ? currentCareerObj.Base : null).then((val) => {
            return malla.drawMalla(".canvas");
        });
        drawnMalla.then(() => {
            malla.updateStats();
            malla.displayCreditSystem();
            malla.showColorDescriptions(".color-description");
            document.getElementById("overlay").addEventListener("click", () => {
                malla.loadApproved();
                malla.enablePrerCheck();
            });
        });
    });
});

// Credit system toggle removed - only SCT credits are used
