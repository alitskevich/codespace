import Details from "./atoms/Details.xml";
import QuickTabs from "./atoms/QuickTabs.xml";
import SearchInput from "./atoms/SearchInput.xml";
import Skeleton from "./atoms/Skeleton.xml";
import Tap from "./atoms/Tap.xml";
import dropdowns from "./atoms/dropdowns.xml";
import micro from "./atoms/micro.xml";
import Aside from "./components/Aside.xml";
import Nav from "./components/Nav.xml";
import NavControls from "./components/NavControls.xml";
import ProjectsList from "./components/ProjectsList.xml";
import EditorApp from "./editor/EditorApp.xml";
import EditorPreviewPanel from "./editor/EditorPreviewPanel.xml";
import EditorPropertiesPanel from "./editor/EditorPropertiesPanel.xml";
import { EditorService } from "./editor/EditorService";
import EditorStructurePanel from "./editor/EditorStructurePanel.xml"
import MarkupView from "./markup/MarkupView.xml";
import main from "./pages/main.xml";
import project from "./pages/project.xml";
import { PreviewWebPlatform } from "./preview/PreviewWebPlatform";
import preview from "./preview/preview.xml";
import DomNodeProperties from "./properties/DomNodeProperties.xml";
import DomNodePropertiesAppearance from "./properties/DomNodePropertiesAppearance.xml";
import DomNodePropertiesBehavior from "./properties/DomNodePropertiesBehavior.xml";
import DomNodePropertiesState from "./properties/DomNodePropertiesState.xml";
import DomNodePropertiesTypography from "./properties/DomNodePropertiesTypography.xml";
import { NodeController } from "./properties/NodeController";
import { NodeDesignController } from "./properties/NodeDesignController";
import tmp from "./properties/tmp.xml";
import EditorStructree from "./structree/EditorStructree.xml";
import icons from "./svg/icons.xml";
import picto from "./svg/picto.xml";

// all componets types:
export default [
  icons,
  picto,
  EditorStructree,
  Details,
  Tap,
  dropdowns,
  QuickTabs,
  micro,
  Skeleton,
  SearchInput,
  NavControls,
  Nav,
  ProjectsList,
  Aside,
  DomNodePropertiesAppearance,
  NodeController,
  MarkupView,
  tmp,
  DomNodeProperties,
  NodeDesignController,
  DomNodePropertiesTypography,
  DomNodePropertiesBehavior,
  DomNodePropertiesState,
  preview,
  PreviewWebPlatform,
  main,
  project,
  EditorPropertiesPanel,
  EditorService,
  EditorPreviewPanel,
  EditorApp,
  EditorStructurePanel
];