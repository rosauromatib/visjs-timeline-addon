import { injectGlobalCss } from 'Frontend/generated/jar-resources/theme-util.js';

import { css, unsafeCSS, registerStyles } from '@vaadin/vaadin-themable-mixin';
import $cssFromFile_0 from 'vis-timeline/styles/vis-timeline-graph2d.min.css?inline';

injectGlobalCss($cssFromFile_0.toString(), 'CSSImport end', document);
import $cssFromFile_1 from 'Frontend/generated/jar-resources/styles/timeline.css?inline';

injectGlobalCss($cssFromFile_1.toString(), 'CSSImport end', document);
import '@vaadin/tooltip/theme/lumo/vaadin-tooltip.js';
import '@vaadin/polymer-legacy-adapter/style-modules.js';
import '@vaadin/app-layout/theme/lumo/vaadin-drawer-toggle.js';
import '@vaadin/button/theme/lumo/vaadin-button.js';
import 'Frontend/generated/jar-resources/buttonFunctions.js';
import 'Frontend/generated/jar-resources/src/arrow.js';
import 'Frontend/generated/jar-resources/src/vcf-timeline.js';
import '@vaadin/vertical-layout/theme/lumo/vaadin-vertical-layout.js';
import '@vaadin/app-layout/theme/lumo/vaadin-app-layout.js';
import '@vaadin/common-frontend/ConnectionIndicator.js';
import '@vaadin/vaadin-lumo-styles/color-global.js';
import '@vaadin/vaadin-lumo-styles/typography-global.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';

const loadOnDemand = (key) => {
  const pending = [];
  if (key === '9798161d055b39d1a9280bc641fa597e8609b15a284c41053fb86053d5ae9fa7') {
    pending.push(import('./chunks/chunk-9798161d055b39d1a9280bc641fa597e8609b15a284c41053fb86053d5ae9fa7.js'));
  }
  if (key === '0ee8c8893ebd227740a6acc0493a1d7fd12c9764d6530a23d5a267fe9240fa94') {
    pending.push(import('./chunks/chunk-0ee8c8893ebd227740a6acc0493a1d7fd12c9764d6530a23d5a267fe9240fa94.js'));
  }
  if (key === 'b22630907b7e4a1b70009695e40d8e364bbc9724b77d85570ce20e5b5274afda') {
    pending.push(import('./chunks/chunk-b22630907b7e4a1b70009695e40d8e364bbc9724b77d85570ce20e5b5274afda.js'));
  }
  if (key === '204ff647a369fa4a25548eef2b2e97c5fda24d354782846cf3c1c7e27bfaf9e4') {
    pending.push(import('./chunks/chunk-204ff647a369fa4a25548eef2b2e97c5fda24d354782846cf3c1c7e27bfaf9e4.js'));
  }
  if (key === '2fd571564bbb366bd0cbe942d3d4a70301ff23a994c7576244d97cc917f2a600') {
    pending.push(import('./chunks/chunk-2fd571564bbb366bd0cbe942d3d4a70301ff23a994c7576244d97cc917f2a600.js'));
  }
  if (key === 'fb43f4f592eb61dc3d677ced158b8b4c4bb76b61ea5e74004dfc1062d5ae59fe') {
    pending.push(import('./chunks/chunk-fb43f4f592eb61dc3d677ced158b8b4c4bb76b61ea5e74004dfc1062d5ae59fe.js'));
  }
  if (key === '2d93935a255a58e876210b38ce76846665165b956eff4dbb4308a1845434426c') {
    pending.push(import('./chunks/chunk-2d93935a255a58e876210b38ce76846665165b956eff4dbb4308a1845434426c.js'));
  }
  if (key === '98478a8f415391d18aa6837969f5e3679d663ff0df26748fcc62ebc629879839') {
    pending.push(import('./chunks/chunk-98478a8f415391d18aa6837969f5e3679d663ff0df26748fcc62ebc629879839.js'));
  }
  if (key === '3ebe914d0e26fd641996d4a770b374468d5158cd5490512ac3eaa833feac665f') {
    pending.push(import('./chunks/chunk-3ebe914d0e26fd641996d4a770b374468d5158cd5490512ac3eaa833feac665f.js'));
  }
  if (key === 'b58f4ad8f0373ab5a4d030ced780c4ad10b1c141fe883be23e462a569a453a8a') {
    pending.push(import('./chunks/chunk-b58f4ad8f0373ab5a4d030ced780c4ad10b1c141fe883be23e462a569a453a8a.js'));
  }
  if (key === '45d89fa3b2a7a6a72a5c45ece10b4202bd197f0f5c48966460d6eae2fd9e967a') {
    pending.push(import('./chunks/chunk-45d89fa3b2a7a6a72a5c45ece10b4202bd197f0f5c48966460d6eae2fd9e967a.js'));
  }
  if (key === 'f5384ab9ab0770694c27954a3d5ab5b4b17a1a94f94212fe2a2d6983fac928db') {
    pending.push(import('./chunks/chunk-f5384ab9ab0770694c27954a3d5ab5b4b17a1a94f94212fe2a2d6983fac928db.js'));
  }
  return Promise.all(pending);
}

window.Vaadin = window.Vaadin || {};
window.Vaadin.Flow = window.Vaadin.Flow || {};
window.Vaadin.Flow.loadOnDemand = loadOnDemand;