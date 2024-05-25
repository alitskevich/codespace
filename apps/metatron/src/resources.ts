import assets from "../assets";

import design from "./core/DesignSystem";
import { highlightElement } from "./preview/PreviewWebPlatform";
import { reactCodeGen } from "./utils/reactCodeGen";
import { resetComponentContent } from "./utils/resetComponentContent";
const functions = {
  reactCodeGen,
  resetComponentContent,
  highlightElement
};

export default {
  name: "Metatron",
  app: {
    logo: "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500",
  },
  assets,
  functions,
  symbols: {
    colon: ":",
  },
  ide: {
    defaultState: {
      showHtml: false,
      darkMode: true,
      locale: "en",
      viewportSize: 800,
    },
    markupDefaultState: {
      markupType: "html",
    },
    sidebarTabs: [
      { id: "pages", name: "Pages", icon: "File" },
      { id: "components", name: "Components", icon: "Cubes" },
      { id: "data", name: "Content", icon: "LayerGroup" },
    ],
    propsTabs: [
      { id: "appearance", name: "Appearance", icon: "Svg.Eye" },
      { id: "typography", name: "Typography", icon: "Svg.TableCellsLarge" },
      { id: "state", name: "State", icon: "Svg2.LayerGroup" },
      { id: "behavior", name: "Behavior", icon: "Svg2.Cubes" },
    ],
    align_lcr: [
      { id: 'align_left', name: 'Align left' },
      { id: 'align_centers', name: 'Align centers' },
      { id: 'align_right', name: 'Align right' },
    ],
    viewModes: [
      { id: "preview", name: "Preview", icon: "File" },
      { id: "markup", name: "HTML", icon: "LayerGroup" },
    ],
    nodeCommonProps: [
      { id: "id", name: "Set ID", icon: "LayerGroup" },
      { id: "ref", name: "Set reference", icon: "LayerGroup" },
    ],
    nodeLayoutProps: [
      { id: "sizing", name: "Sizing", icon: "LayerGroup" },
      { id: "spacing", name: "Spacing", icon: "LayerGroup" },
      { id: "overflow", name: "Overflow", icon: "LayerGroup" },
    ],
    treeOperations: [
      { id: "raw", name: "Edit as markup...", icon: "LayerGroup" },
    ],
    treeRoots: [
      { id: "main", name: "Main", icon: "LayerGroup" },
      { id: "add_variant", name: "(Add variant...)", icon: "LayerGroup" },
    ],
    treeRootsConditions: [
      { id: "true", name: "Always", icon: "LayerGroup" },
      { id: "@mode == 'main'", name: "mode is 'main'", icon: "LayerGroup" },
      { id: "expression", name: "(Set Custom expression...)", icon: "LayerGroup" },
    ],
    nodeOperations: [
      { id: "duplicate", name: "duplicate", icon: "LayerGroup" },
      { id: "remove", name: "remove", icon: "LayerGroup" },
      { id: "move_up", name: "move up", icon: "LayerGroup" },
      { id: "move_down", name: "move down", icon: "LayerGroup" },
      { id: "if", name: "Set If-condition", icon: "LayerGroup" },
      { id: "each", name: "Set Each-iteration", icon: "LayerGroup" },
    ],
    classTableColumns: [
      { id: 'ns', name: 'NS' },
      { id: 'type', name: 'TYPE' },
      { id: 'subtype', name: 'SUB' },
      { id: 'value', name: 'VALUE' }
    ],
    whMinMax: {
      width: { type: 'unit' },
      height: { type: 'unit' },
      minWidth: { type: 'unit' },
      minHeight: { type: 'unit' },
      maxWidth: { type: 'unit' },
      maxHeight: { type: 'unit' },
    },
    bounds: {
      l: { type: 'unit' },
      r: { type: 'unit' },
      t: { type: 'unit' },
      b: { type: 'unit' },
    },
    border: {
      width: { type: 'border' },
      color: { type: 'color' },
      style: { type: 'enum', typeSpec: ['solid', 'dashed', 'dotted'] },
    }
  },
  design,
  enums: {
    display: [
      { id: "block", name: "block" },
      { id: "inline", name: "inline" },
      { id: "inline-block", name: "inline-block" },
      { id: "flex-row", name: "flex-row" },
      { id: "flex-col", name: "flex-col" },
      { id: "grid", name: "grid" },
      { id: "hidden", name: "hidden" },
      { id: "invisible", name: "invisible" },
    ],
    position: [
      { id: "static", name: "static" },
      { id: "relative", name: "relative" },
      { id: "absolute", name: "absolute" },
      { id: "fixed", name: "fixed" },
      { id: "sticky", name: "sticky" },
    ],
    nodeType: [
      { id: "html", name: "HTML" },
      { id: "component", name: "Component" },
      { id: "service", name: "Service" },
      { id: "dynamic", name: "Dynamic" },
    ],
    tags: [
      { id: "div", name: "div" },
      { id: "span", name: "span" },
      { id: "a", name: "a" },
      { id: "p", name: "p" },
      { id: "button", name: "button" },
      { id: "input", name: "input" },
      { id: "img", name: "img" },
      { id: "svg", name: "SVG" },
    ],
    colors: [
      { id: "blue", name: "blue" },
      { id: "red", name: "red" },
      { id: "orange", name: "orange" },
      { id: "green", name: "green" },
      { id: "gray", name: "gray" },
    ],
    sizes: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "4", name: "4" },
      { id: "6", name: "6" },
      { id: "8", name: "8" },
    ],
    locale: [
      { id: "en", name: "En" },
      { id: "ar", name: "Ar" },
    ],
    viewportSizes: [
      { id: "375", name: "sm" },
      { id: "800", name: "md" },
      { id: "1182", name: "lg" },
    ],
  },
  forms: {
    listFilter: [
      { id: "type", placeholder: "Type", type: "enum", typeSpec: "trailType" },
    ],
    signIn: [
      { id: "username", name: "User name" },
      { id: "password", name: "Password", type: "password" },
    ],
    signUp: [
      { id: "username", name: "User name" },
      { id: "password", name: "Password", type: "password" },
      { id: "password2", name: "Retype Password", type: "password" },
    ],
  },
  project: {
    components: [
      { id: "C1", name: "C1" },
      { id: "C2", name: "C2" },
    ],
    services: [
      { id: "S1", name: "Service 1" },
      { id: "S2", name: "Service 2" },
    ],
    modifiers: [
      { id: "hover", name: "hover:" },
      { id: "focus", name: "focus:" },
    ],
  }
};
