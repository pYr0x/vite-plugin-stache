import template from "./index.stache";
import partial from "./partial.stache";
document.querySelector('#test').appendChild(template({partial}));
