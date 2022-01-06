import template from "./index.stache";
document.querySelector('#test').appendChild(template({whatYouTyped: "input binding"}));
