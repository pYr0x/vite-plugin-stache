import stache from "can-stache";

const template1 = /*stache*/`<h1>Hello {{message}}</h1>`;
window.TEMPLATE = template1;
const view = stache(window.TEMPLATE);
document.querySelector('#test').appendChild(view({message: "inline"}));


const view2 = stache('<h1>Hey {{message}}</h1>');
document.querySelector('#test').appendChild(view2({message: "stache call expression"}));
