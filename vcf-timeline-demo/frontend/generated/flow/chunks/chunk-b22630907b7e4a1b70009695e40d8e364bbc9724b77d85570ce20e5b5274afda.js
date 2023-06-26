import '@vaadin/tooltip/theme/lumo/vaadin-tooltip.js';
import '@vaadin/polymer-legacy-adapter/style-modules.js';
import '@vaadin/app-layout/theme/lumo/vaadin-drawer-toggle.js';
import '@vaadin/button/theme/lumo/vaadin-button.js';
import 'Frontend/generated/jar-resources/buttonFunctions.js';
import 'Frontend/generated/jar-resources/src/arrow.js';
import 'Frontend/generated/jar-resources/src/vcf-timeline.js';
import '@vaadin/vertical-layout/theme/lumo/vaadin-vertical-layout.js';
import '@vaadin/app-layout/theme/lumo/vaadin-app-layout.js';
import { injectGlobalCss } from 'Frontend/generated/jar-resources/theme-util.js';

import { css, unsafeCSS, registerStyles } from '@vaadin/vaadin-themable-mixin';
import $cssFromFile_0 from 'vis-timeline/styles/vis-timeline-graph2d.min.css?inline';

injectGlobalCss($cssFromFile_0.toString(), 'CSSImport end', document);
import $cssFromFile_1 from 'Frontend/generated/jar-resources/styles/timeline.css?inline';

injectGlobalCss($cssFromFile_1.toString(), 'CSSImport end', document);
import $cssFromFile_2 from 'Frontend/styles/timeline-items-style.css?inline';

injectGlobalCss($cssFromFile_2.toString(), 'CSSImport end', document);