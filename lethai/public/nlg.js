window.onload = function(e) {
    createThirdDataSection(data.third_data);
}

function createThirdDataSection(third_data) {
	var template = `<ul id="category-tabs" class="flex justify-around">`;
	for (const category in third_data) {
		template += `<li
    class="text-center flex-1 py-3 text-lg md:text-xl mb-3 rounded-t font-monts
    transition duration-500 ease-in-out hover:bg-gray-400 border-b-2
    ${category == "genders" ? "border-primary2" : "border-gray-400"}"
    data-value="${category}"
>
    ${category[0].toUpperCase() + category.substr(1)}
</li>`;
	}
	template += `</ul>`;
	for (const category in third_data) {
		template += `<div id="${category}" class="py-10 ${category == "genders" ? "" : "hidden"}">`;
		for (const subcategory in third_data[category]) {
			template += `<div
    class="charts-section-3__inner py-3 w-full sm:w-1/2 md:w-1/3 inline-block rounded-lg transition duration-500 ease-in-out hover:bg-gray-400 transform md:hover:-translate-y-1 md:scale-90 md:hover:scale-95 mb-10"
    data-category="${category}"
    data-level="3"
    data-tag="${subcategory}"
>
    <canvas id="${subcategory}"></canvas>
    <h2 class="text-base mt-8 text-center font-monts">Tag: <span class="font-bold tag">
        ${subcategory[0].toUpperCase() + subcategory.substr(1)}
    </span></h2>
    <h2 class="text-base mt-2 text-center font-monts">Score: <span class="font-bold score">
        ${Number(third_data[category][subcategory].score).toFixed(2)}
    </span></h2>
</div>`;
		}
		template += `</div>`;
	}
	document.querySelector("#charts-section-3").innerHTML = template;
	for (const category in third_data) {
		for (const subcategory in third_data[category]) {
			new Chart(document.querySelector(`#${subcategory}`), {
				type: "doughnut",
				data: {
					datasets: [
						{
							data: [third_data[category][subcategory].cp, third_data[category][subcategory].cn],
							backgroundColor: ["#2ecc71", "#e74c3c"],
						},
					],
					labels: ["Positive", "Negative"],
				},
			});
		}
	}
	canvasClickHandlers(".charts-section-3__inner");
	tabsHandler();
}

function createSecondDataSection(category, tag) {
	const subcategorydata = data.second_data[category][tag];
	var template = `
<button
    onclick="(()=>{
        document.querySelector('#${category}').classList.remove('hidden');
        document.querySelector('#charts-section-2').classList.add('hidden');
    })()"
    data-category="${category}"
    class="text-primary2 pb-3 font-nunito text-xl flex items-center transition ease-in-out duration-300 transform translate-x-1 hover:-translate-x-1"
>
    <svg class="h-5 inline-block mr-2
        version="1.1"
        x="0px" y="0px"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 58.3 57.3" enable-background="new 0 0 58.3 57.3" xml:space="preserve">
        <g>
            <polygon fill-rule="evenodd" clip-rule="evenodd" fill="#3E3E3E" points="1.6,28.6 19.8,1.3 33,1.3 14.9,28.6 33,56 19.8,56"/>
            <polygon fill-rule="evenodd" clip-rule="evenodd" fill="#0070bb" points="43.1,1.3 56.4,1.3 38.2,28.6 56.4,56 43.1,56 24.9,28.6"/>
        </g>
    </svg>
    Go Back
</button>
<div class="py-5 rounded-lg bg-gray-400 block md:flex justify-around items-center shadow-md">
    <div class="flex flex-col text-center">
        <span class="text-xl sm:text-2xl xl:text-3xl font-monts font-semibold text-gray-800 transition ease-in-out duration-200 hover:text-primary2">
            ${tag[0].toUpperCase() + tag.substr(1)}
        </span>
        <span class="text-sm sm:text-base md:text-sm lg:text-base font-nunito capitalize text-gray-600">Tag</span>
    </div>
    <div class="flex flex-col text-center">
        <span class="text-xl sm:text-2xl xl:text-3xl font-monts font-semibold text-gray-800 transition ease-in-out duration-200 hover:text-primary2">
            ${data.third_data[category][tag].score.toFixed(2)}
        </span>
        <span class="text-sm sm:text-base md:text-sm lg:text-base font-nunito capitalize text-gray-600">Score</span>
    </div>
    <div class="flex flex-col text-center">
        <span class="text-xl sm:text-2xl xl:text-3xl font-monts font-semibold text-gray-800 transition ease-in-out duration-200 hover:text-primary2">
            ${data.third_data[category][tag].cp}
        </span>
        <span class="text-sm sm:text-base md:text-sm lg:text-base font-nunito capitalize text-gray-600">Positives count</span>
    </div>
    <div class="flex flex-col text-center">
        <span class="text-xl sm:text-2xl xl:text-3xl font-monts font-semibold text-gray-800 transition ease-in-out duration-200 hover:text-primary2">
            ${data.third_data[category][tag].cn}
        </span>
        <span class="text-sm sm:text-base md:text-sm lg:text-base font-nunito capitalize text-gray-600">Negatives count</span>
    </div>
</div>
<div id="${category}__secondary" class="flex flex-wrap my-3 lg:my-5 modal-open">`;
	for (const subcategory_phrase in subcategorydata) {
		template += `
    <div
        class="charts-section-2__inner py-4 md:my-4 w-full sm:w-1/2 md:w-1/3 rounded-lg transition duration-500 ease-in-out hover:bg-gray-400 transform scale-90 hover:scale-95"
        data-category="${category}"
        data-tag="${tag}"
        data-phrase="${subcategory_phrase}"
        onclick='toggleModal("${category}", "${tag}", "${subcategory_phrase}")'
    >
        <canvas id="${subcategory_phrase.replace(/ /g, "-")}"></canvas>
        <h2 class="text-sm mt-8 text-center font-monts">Phrase:
            <span class="font-semibold phrase text-base">
                ${subcategory_phrase}
            </span>
        </h2>
        <h2 class="text-sm mt-1 text-center font-monts">Score:
            <span class="font-semibold score text-base">
                ${subcategorydata[subcategory_phrase].score.toFixed(2)}
            </span>
        </h2>
    </div>`;
	}
	template += `</div>`;
	document.querySelector("#charts-section-2").innerHTML = template;
	document.querySelector("#charts-section-2").classList.remove("hidden");
	for (const subcategory_phrase in subcategorydata) {
		new Chart(document.querySelector(`#${subcategory_phrase.replace(/ /g, "-")}`), {
			type: "doughnut",
			data: {
				datasets: [
					{
						data: [subcategorydata[subcategory_phrase].cp, subcategorydata[subcategory_phrase].cn],
						backgroundColor: ["#2ecc71", "#e74c3c"],
					},
				],
				labels: ["Positive", "Negative"],
			},
		});
	}

	document.onkeydown = function (evt) {
		evt = evt || window.event;
		var isEscape = false;
		if ("key" in evt) {
			isEscape = evt.key === "Escape" || evt.key === "Esc";
		} else {
			isEscape = evt.keyCode === 27;
		}
		if (isEscape && document.body.classList.contains("modal-active")) {
			toggleModal();
		}
	};
}

function canvasClickHandlers(selector) {
	document.querySelectorAll(selector).forEach((el) => {
		el.addEventListener("click", function (e) {
			const $canvasDataset = e.target.closest(selector).dataset;
			document.querySelector(`#${$canvasDataset.category}`).classList.add("hidden");
			createSecondDataSection($canvasDataset.category, $canvasDataset.tag);
		});
	});
}

function tabsHandler() {
	document.querySelectorAll("#category-tabs li").forEach((tab) => {
		tab.addEventListener("click", function (e) {
			const $curr = e.target.closest("li");
			const $prev = document.querySelector("#category-tabs li.border-primary2");
			console.log($curr, $prev);
			const prevCategory = $prev.dataset.value;
			const currCategory = $curr.dataset.value;
			if (prevCategory == currCategory) return;
			$curr.classList.add("border-primary2");
			$curr.classList.remove("border-gray-400");
			$prev.classList.remove("border-primary2");
			$prev.classList.add("border-gray-400");
			document.querySelector(`#${prevCategory}`).classList.add("hidden");
			document.querySelector(`#${currCategory}`).classList.remove("hidden");
			document.querySelector("#charts-section-2").classList.add("hidden");
		});
	});
}

function toggleModal(category, tag, phrase) {
	const body = document.querySelector("body");
	const modal = document.querySelector(".modal");
	modal.classList.toggle("opacity-0");
	modal.classList.toggle("pointer-events-none");
	body.classList.toggle("modal-active");
	if (!(category && tag && phrase)) return;
	document.querySelector(`#charts-section-1 .title`).innerText = phrase;
	var template = ``,
		i = 0;
	for (const text in data.main_data[category][tag][phrase]) {
		template += `
<tr class="${i++ % 2 == 0 ? "" : "bg-gray-100"} text-center">
    <td class="border px-4 py-2">${text}</td>
    <td class=
        "border px-4 py-2 capitalize text-${
					data.main_data[category][tag][phrase][text].label == "NEGATIVE" ? "red" : "green"
				}-600"
    >
        ${data.main_data[category][tag][phrase][text].label.toLowerCase()}
    </td>
    <td class="border px-4 py-2">${data.main_data[category][tag][phrase][text].score.toFixed(2)}</td>
</tr>`;
	}
	document.querySelector(`#charts-section-1 .modal-body tbody`).innerHTML = template;
}
