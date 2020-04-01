const url = "https://rcslabs.ru/locations.json";

const request = new XMLHttpRequest();
request.open("GET", url);
request.responseType = "json";
request.send();
request.onload = function() {
    const res = request.response;
    let tree = buildTree(res);
    tree.forEach(item => {
        document.querySelector(".tree-view").innerHTML = viewTree(item);
    });

    let titles = document.querySelectorAll(".title");
    titles.forEach(item => {
        item.addEventListener("click", function() {
            this.nextElementSibling.classList.toggle("list-close");
        });
    });
};

let buildTree = obj => {
    const map = new Map(obj.map(item => [item.id, item]));
    for (let item of map.values()) {
        if (!map.has(item.parent_id)) {
            continue;
        }
        const parent = map.get(item.parent_id);
        parent.children = [...(parent.children || []), item];
        parent.children.sort((a, b) => (a.srt > b.srt ? 1 : -1));
    }

    return [...map.values()].filter(item => !item.parent_id);
};

let viewTree = node =>
    `<li class="list-group-item">${
        node.children
            ? `
    <span class="title">${node.title}</span>
    <ul class="list-group">${node.children.map(viewTree).join("")}</ul>`
            : node.title
    }</li>`;
