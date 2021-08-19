
import CfWindow from '../../../lib/dist/core/CfWindow'
import CfContainer from '../../../lib/dist/components/CfContainer'
import { CreateWebViewport } from '../../../lib/dist/core/CfCore'
import { Window1 } from './components/Window1';

document.addEventListener("DOMContentLoaded", function(e) { 
    CreateWebViewport(new Window1());
});


