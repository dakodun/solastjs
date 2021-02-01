import GL, {glSetContext} from './engine/gl.js'
import GLStates from './engine/glstates.js'
import * as eng from './engine/exports.js';

var APP = new eng.App();

export {glSetContext, GL, GLStates, eng, APP as default};
