import template from "./index.stache";
window.IMPORT_MODULE += " before render view";
document.querySelector('#test').appendChild(template());
