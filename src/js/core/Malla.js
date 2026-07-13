// Futuro remplazo de canvas.js

class Malla {

    constructor(subjectType = Ramo, scaleX = 1, scaleY = 1) {

        // Propiedades antes del render
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.subjectType = subjectType;
        this.rawMalla = {};
        this.categories = {};
        this.malla = {};
        this.longestSemester = 0;
        this.totalCredits = 0;
        this.totalSubjects = 0;
        this.semesterManager = null;
        this.currentMalla = null;
        this.generatedCode = [];

        // Propiedades despues del render
        this.APPROVED = [];
        this.SUBJECTID = 1;
        this.ALLSUBJECTS = {};
        this.checkPrer = false;
        this.saveEnabled = false;
        this.isMallaSet = false;
        this.showCreditSystem = false;
        this.showCreditStats = false;

        this.totalCredits = 0;
        this.totalSubjects = 0;


    }

    // Se explica solo
    enableCreditsStats() {
        this.showCreditStats = true;
    }

    // Se explica solo
    enableCreditsSystem() {
        this.showCreditSystem = true;
    }

    // Habilita el guardado de ramos aprobados para futuras sesiones
    enableSave() {
        this.saveEnabled = true;
    }

    /**
     * Loads career data and returns a promise when data is fetched and properties are ready
     * Checks for shared malla data in localStorage first, otherwise fetches from JSON files
     * @param {string} carr - Career identifier code
     * @param {string} fullCareerName - Full display name of the career
     * @param {string} relaPath - Relative path to data files
     * @returns {Promise} Promise that resolves when malla data is loaded
     */
    setCareer(carr, fullCareerName, relaPath, baseCarr = null) {
        // Check if there's a shared malla saved in localStorage (e.g., from URL sharing)
        if (localStorage["sharedMalla"] != undefined) {
            const unparsedData = localStorage["sharedMalla"];
            localStorage.removeItem("sharedMalla");
            const data = JSON.parse(unparsedData);
            this.currentMalla = data.name;
            this.fullCareerName = data.name;
            console.log("hola");
            console.log(data.name);
            return Promise.resolve(this.setMallaAndCategories(data.malla, data.categories));

        } else {
            // Load from JSON files: data file contains subjects, colors file contains categories
            this.currentMalla = carr;
            this.fullCareerName = fullCareerName;
            const promises = [];

            if (baseCarr) {
                promises.push(d3.json( `${relaPath  }data/${  baseCarr  }/data_${  baseCarr  }.json`));
                promises.push(d3.json( `${relaPath  }data/${  baseCarr  }/colors_${  baseCarr  }.json`));
            }

            promises.push(d3.json( `${relaPath  }data/${  this.currentMalla  }/data_${  this.currentMalla  }.json`));
            promises.push(d3.json( `${relaPath  }data/${  this.currentMalla  }/colors_${  this.currentMalla  }.json`));
            // Wait for both files to load, then initialize malla with the data
            return Promise.all(promises).then(values => {
                if (baseCarr) {
                    const baseData = values[0];
                    const baseColors = values[1];
                    const specificData = values[2];
                    const specificColors = values[3];

                    const mergedData = {};
                    const allSemesters = new Set([...Object.keys(baseData), ...Object.keys(specificData)]);

                    allSemesters.forEach(sem => {
                        const baseSem = baseData[sem] || [];
                        const specSem = specificData[sem] || [];

                        // Filter out ESP placeholders from base when merging with a specialty
                        const mergedSem = baseSem.filter(c => c[3] !== "ESP");
                        specSem.forEach(specCourse => {
                            const existingIdx = mergedSem.findIndex(c => c[1] === specCourse[1]);
                            if (existingIdx !== -1) {
                                mergedSem[existingIdx] = specCourse;
                            } else {
                                mergedSem.push(specCourse);
                            }
                        });

                        // Order: CORE > Especialidad > Plan comun
                        mergedSem.sort((a, b) => {
                            const catA = a[3];
                            const catB = b[3];

                            const getPriority = (cat) => {
                                if (cat === "CORE") return 1;
                                if (cat === "PC" || cat === "AC") return 3;
                                return 2; // Specialty
                            };

                            return getPriority(catA) - getPriority(catB);
                        });

                        mergedData[sem] = mergedSem;
                    });

                    const mergedColors = Object.assign({}, baseColors, specificColors);
                    this.setMallaAndCategories(mergedData, mergedColors);
                } else {
                    this.setMallaAndCategories(values[0], values[1]);
                }
            });

        }
    }

    /**
     * Initializes malla data structure from JSON and creates subject instances
     * Processes subjects for each semester, handling both old and new data formats
     * Calculates total credits, subjects, and finds the longest semester
     */
    setMallaAndCategories(malla, categories) {
        let semester;
        let longest_semester = 0;
        let totalCredits = 0;
        let totalRamos = 0;

        this.rawMalla = malla;
        this.categories = categories;

        // Iterate through each semester and instantiate subject objects
        for (semester in this.rawMalla) {
            this.malla[semester] = {};

            // Track the semester with the most subjects for rendering height
            if (malla[semester].length > longest_semester)
                longest_semester = malla[semester].length;
            malla[semester].forEach(subject => {
                // Se instancia el ramo y se agrega a la malla en su semestre
                totalRamos += 1;
                // Format: [name, code, credits(SCT), category, prerequisites]
                this.malla[semester][subject[1]] = new this.subjectType(
                    subject[0], // name
                    subject[1], // sigla
                    subject[2], // credits (SCT)
                    subject[3], // category
                    subject.length > 4 ? subject[4] : [], // prerequisites
                    this.SUBJECTID++, // id
                    this, // malla
                    false // isCustom
                );
                // Add subject to global subjects registry for easy lookup by code
                this.ALLSUBJECTS[subject[1]] = this.malla[semester][subject[1]];
                totalCredits += this.malla[semester][subject[1]].getDisplayCredits();
            });
        }
        this.longestSemester = longest_semester;
        this.totalCredits = totalCredits;
        this.totalSubjects = totalRamos;
        this.isMallaSet = true;
    }

    // Define el controlador de semestres para que las asignaturas puedan acceder a el
    setSemesterManager(semesterManager) {
        this.semesterManager = semesterManager;
    }

    // Agrega ramos a la malla
    addSubject(subject) {
        this.ALLSUBJECTS[subject.sigla] = subject;
    }

    /**
     * Removes a subject from the malla and cleans up all references to it
     * Removes the subject from prerequisites of other subjects and updates their state
     */
    delSubjects(subject) {
        Object.values(this.ALLSUBJECTS).forEach(otherSubject => {
            // Remove this subject from the prerequisites list of any subjects that require it
            if (otherSubject.prer.has(subject.sigla)){
                otherSubject.prer.delete(subject.sigla);
                otherSubject.verifyPrer();
            }
        });
        delete this.ALLSUBJECTS[subject.sigla];
    }

    // Renderiza la malla. canvasId puede ser una clase o una id
    drawMalla(canvasId) {

        if (!this.isMallaSet)
            return;

        const separator = 10;
        const semesterIndicatorHeight = 30 * this.scaleY;
        // Se define el tamaño
        const width = (this.subjectType.getDisplayWidth(this.scaleX) * Object.keys(this.malla).length) +
            separator * (Object.keys(this.malla).length - 1);
        const height = (this.subjectType.getDisplayHeight(this.scaleY) + separator) * this.longestSemester +
            semesterIndicatorHeight * 2 + separator;
        const canvasWidth = width + separator; // for full show svg
        const canvasHeight = height + separator/2;

        const canvas = d3.select(canvasId).append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .attr("role", "figure");

        canvas.append("title")
            .text(`Malla ${  this.fullCareerName}`);

        const drawer = canvas;
        let globalX = separator / 2,
            globalY = 0;
        let isBigBarRendered = false;
        let semestersPassed = 0;
        let currentYear = 0;
        let currentYearIndicator = null;
        let currentYearIndicatorText = null;
        let yearIndicator = null;

        Object.keys(this.malla).forEach(semester => {
            globalY = 0;
            // Barra indicadora de años
            if (semestersPassed === 0) {
                yearIndicator = drawer.append("g")
                    .attr("cursor", "pointer")
                    .attr("role", "heading")
                    .attr("aria-level", "5")
                    .classed("year", true);
                // se crea la barra en caso de semestre impar
                const desc = yearIndicator.append("title");
                // rectangulo de la barra
                currentYearIndicator = yearIndicator.append("rect")
                    .attr("x", globalX)
                    .attr("y", globalY)
                    .attr("width", this.subjectType.getDisplayWidth(this.scaleX))
                    .attr("height", semesterIndicatorHeight)
                    .attr("fill", "gray")
                    .classed("bars", true);
                semestersPassed++;
                // texto de la barra
                currentYearIndicatorText = yearIndicator.append("text")
                    .attr("x", globalX + this.subjectType.getDisplayWidth(this.scaleX) / 2.0)
                    .attr("y", globalY + semesterIndicatorHeight / 2)
                    .text(`Año ${  currentYear++  } 1/2`)
                    // .attr("font-family", "sans-serif")
                    .attr("font-weight", "bold")
                    .attr("fill", "white")
                    .attr("dominant-baseline", "central")
                    .attr("text-anchor", "middle");
                desc.text(`Año ${  currentYear  } 1/2`);
                // Evento en caso de hacer click en el
                yearIndicator.on("click", (event) => {
                    const bar = d3.select(event.currentTarget);
                    const number = parseInt(bar.select("text").text().substr(4));
                    let ramosToSelect;
                    if (bar.node().getBBox().width <= this.subjectType.getDisplayWidth(this.scaleX) * 2 - this.subjectType.getDisplayWidth(this.scaleX) / 2) {
                        d3.select(`#sem${  number * 2 + 1}`).dispatch("click");
                    } else {
                        d3.select(`#sem${  number * 2}`).dispatch("click");
                        d3.select(`#sem${  number * 2 - 1}`).dispatch("click");

                    }

                });
            } else {
                // si es par, la actual se expande
                currentYearIndicator.attr("width", this.subjectType.getDisplayWidth(this.scaleX) * 2 + separator);
                currentYearIndicatorText.text(`Año ${  currentYear}`);
                currentYearIndicatorText.attr("x", globalX - separator / 2);
                semestersPassed = 0;
                yearIndicator.select("title").text(`Año ${ currentYear}`);
            }

            globalY += semesterIndicatorHeight + separator;

            // Barra gigante de semestres
            if (!isBigBarRendered) {
                // Se crea la barra
                drawer.append("rect")
                    .attr("x", globalX)
                    .attr("y", globalY)
                    .attr("width", width)
                    .attr("height", semesterIndicatorHeight)
                    .attr("fill", "#EEE")
                    .classed("sem", true);
                isBigBarRendered = true;
            }

            // Pequeño seteo de variables en caso de que semestre sea "S1" o 1 por ejemplo
            let intToRomanize = semester;
            if (intToRomanize[0] === "s") {
                intToRomanize = parseInt(intToRomanize.substr(1));
            } else {
                intToRomanize = parseInt(intToRomanize);
            }

            // barra de semestres individuales
            const semesterIndicator = drawer.append("g")
                .attr("id", `sem${  intToRomanize}`)
                .attr("cursor", "pointer")
                .attr("width", this.subjectType.getDisplayWidth(this.scaleX))
                .attr("height", semesterIndicatorHeight)
                .attr("role", "heading")
                .attr("aria-level", "6")
                .classed("sem", true);

            semesterIndicator.append("title").text(`Semestre ${  intToRomanize}`);


            semesterIndicator.append("rect")
                .attr("cursor", "pointer")
                .attr("x", globalX)
                .attr("y", globalY)
                .attr("width", this.subjectType.getDisplayWidth(this.scaleX))
                .attr("height", semesterIndicatorHeight)
                .classed("sem", true)
                .attr("fill", "#EEE");


            semesterIndicator.append("text")
                .attr("x", globalX + this.subjectType.getDisplayWidth(this.scaleX) / 2.0)
                .attr("y", globalY + semesterIndicatorHeight / 2)
                .text(this.romanize(intToRomanize))
                .attr("dominant-baseline", "central")
                .attr("text-anchor", "middle");
            // evento en caso de clickear la barra del semestre
            semesterIndicator.on("click", (event) => {
                let semNumber = intToRomanize;
                if (semester[0] === "s")
                    semNumber = `s${  semNumber}`;
                Object.values(this.malla[semNumber]).forEach(ramo => {
                    ramo.isBeingClicked();
                });

            });

            globalY += semesterIndicatorHeight + separator;

            // Se renderizan los ramos del semestre
            Object.keys(this.malla[semester]).forEach(subject => {
                this.malla[semester][subject].draw(drawer, globalX, globalY, this.scaleX, this.scaleY);
                globalY += this.subjectType.getDisplayHeight(this.scaleY) + separator;
            });


            globalX += this.subjectType.getDisplayWidth(this.scaleX) + separator;
        });
    }

    // Renderiza las descripciones de las categorías
    showColorDescriptions() {
        Object.keys(this.categories).forEach(key => {
            // Skip ESP placeholder category from legend
            if (key === "ESP") return;

            const color_description = d3.select(".color-description").append("div")
                .attr("style", "display:flex;vertical-align:middle;margin-right:15px;");
            const circle_color = color_description.append("svg")
                .attr("height", "25px")
                .attr("width", "25px");
            circle_color.append("circle")
                .attr("r", 10)
                .attr("cx", 12)
                .attr("cy", 12)
                .attr("fill", this.categories[key][0]);

            color_description.append("span").text(this.categories[key][1]);

        });
    }

    // Permite que se revise si los ramos cumplen prerrequisitos
    enablePrerCheck() {
        this.checkPrer = true;
        this.verifyPrer();
    }

    // Revisa que ramos cumplen prerrequisitos y "oculta" los que no los cumplen
    verifyPrer() {
        if (this.checkPrer) {
            Object.values(this.ALLSUBJECTS).forEach(ramo => {
                ramo.verifyPrer();
            });
            this.saveApproved();
        }
    }

    // Retorna el sistema de créditos utilizado
    displayCreditSystem() {
        if (!this.showCreditSystem)
            return;
        d3.select("#credits-system").text("SCT");
    }

    // Actualiza los datos como porcentaje de ramos aprobados etc
    updateStats() {
        if (!this.showCreditStats)
            return;
        let currentCredits = 0;
        let currentRamos = 0;
        this.APPROVED.forEach(ramo => {
            currentCredits += ramo.getDisplayCredits();
            currentRamos += 1;
        });
        const creditPercentage = currentCredits/this.totalCredits * 100;
        const careerAdvance = currentRamos/this.totalSubjects * 100;
        d3.select("#credits").text(parseInt(currentCredits));
        d3.select("#credPercentage").text(parseInt(creditPercentage));
        d3.select("#ramoPercentage").text(parseInt(careerAdvance));
    }

    // Limpia los ramos aprobados
    cleanSubjects() {
        const listToClean = [...this.APPROVED];
        listToClean.forEach(ramo => {
            ramo.cleanRamo();
        });
        this.verifyPrer();
        this.updateStats();
    }


    // Auto explanatorio
    approveSubject(subject) {
        this.APPROVED.push(subject);
    }

    // Auto explanatorio
    deApproveSubject(subject) {
        const _i = this.APPROVED.indexOf(subject);
        if (_i > -1) {
            this.APPROVED.splice(_i, 1);
        }
    }

    getSubject(sigla) {
        return this.ALLSUBJECTS[sigla];
    }

    // Auto explanatorio
    saveApproved() {
        if (this.saveEnabled) {
            const cacheName = `approvedRamos_${  this.currentMalla}`;
            const cacheToSave = [];
            this.APPROVED.forEach(ramo => {
                cacheToSave.push(ramo.sigla);
            });
            localStorage[cacheName] = JSON.stringify(cacheToSave);
        }
    }

    // Auto explanatorio
    loadApproved() {
        if (this.saveEnabled) {
            const cache = localStorage[`approvedRamos_${  this.currentMalla}`];
            if (cache) {
                const loadedData = JSON.parse(cache);
                loadedData.forEach(siglaRamo => {
                    if (this.ALLSUBJECTS[siglaRamo] !== undefined)
                        this.ALLSUBJECTS[siglaRamo].approveRamo();
                });
                this.verifyPrer();
            }
        }
    }

    // EXTRA

    romanize(arabic) {
        const r_nums = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
        return r_nums[arabic] || arabic.toString();
    }


}