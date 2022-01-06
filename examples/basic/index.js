import stache from "can-stache";
import template from "./basic.stache";

document.querySelector('#test').appendChild(template({message: "world"}));
console.log(stache(`<div>Hello {{message}}</div>`)({message: "world"}));
