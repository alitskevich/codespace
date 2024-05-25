import Avatar from "./atoms/Avatar.xml";
import Backdrop from "./atoms/Backdrop.xml";
import Badge from "./atoms/Badge.xml";
import Btn from "./atoms/Btn.xml";
import Checkbox from "./atoms/Checkbox.xml";
import Chip from "./atoms/Chip.xml";
import Chips from "./atoms/Chips.xml";
import Container from "./atoms/Container.xml";
import Dropdown from "./atoms/Dropdown.xml";
import Icon from "./atoms/Icon.xml";
import Img from "./atoms/Img.xml";
import Input from "./atoms/Input.xml";
import Logo from "./atoms/Logo.xml";
import Meta from "./atoms/Meta.xml";
import Modal from "./atoms/Modal.xml";
import Popover from "./atoms/Popover.xml";
import RadioGroup from "./atoms/RadioGroup.xml";
import SearchBar from "./atoms/SearchBar.xml";
import Select from "./atoms/Select.xml";
import Skeleton from "./atoms/Skeleton.xml";
import Stub from "./atoms/Stub.xml";
import Tabs from "./atoms/Tabs.xml";
import fab from "./atoms/fab.xml";
import svg from "./atoms/svg.xml";
import typography from "./atoms/typography.xml"
import Auth2Facility from "./auth/Auth2Facility.xml";
import { Auth2Service } from "./auth/Auth2Service";
import { AuthService } from "./auth/AuthService";
import SignInPage from "./auth/SignInPage.xml";
import UserProfileModal from "./auth/UserProfileModal.xml";
import { UserProfileService } from "./auth/UserProfileService"
import user from "./auth/user.xml";
import { ApiEndpoint } from "./commons/ApiEndpoint";
import { BrowserService } from "./commons/BrowserService";
import { DarkModeService } from "./commons/DarkModeService";
import { PostMessageReceiver } from "./commons/PostMessageReceiver";
import { PostMessageSender } from "./commons/PostMessageSender";
import { SSEventSource } from "./commons/SSEventSource";
import { ServiceWorker } from "./commons/ServiceWorker";
import { SpeechService } from "./commons/SpeechService";
import { StoredData } from "./commons/StoredData";
import { StoredValue } from "./commons/StoredValue";
import JsonView from "./dataview/JsonView.xml";
import ListSortBy from "./dataview/ListSortBy.xml";
import ListView from "./dataview/ListView.xml";
import Pivot from "./dataview/Pivot.xml";
import Table from "./dataview/Table.xml";
import FieldBoolean from "./fields/Field.Boolean.xml";
import FieldCity from "./fields/Field.City.xml";
import FieldDate from "./fields/Field.Date.xml";
import FieldEnum from "./fields/Field.Enum.xml";
import FieldFile from "./fields/Field.File.xml";
import FieldMultiEnum from "./fields/Field.MultiEnum.xml";
import FieldRadio from "./fields/Field.Radio.xml";
import FieldRefs from "./fields/Field.Refs.xml";
import FieldSmartarea from "./fields/Field.Smartarea.xml";
import FieldSuggestion from "./fields/Field.Suggestion.xml";
import FieldTags from "./fields/Field.Tags.xml";
import FieldTextarea from "./fields/Field.Textarea.xml";
import Field from "./fields/Field.xml";
import { FieldFileController } from "./fields/FieldFileController";
import FieldItem from "./fields/FieldItem.xml";
import { SmartareaController } from "./fields/SmartareaController";
import { TagsValueController } from "./fields/TagsValueController";
import ItemsFilter from "./filters/ItemsFilter.xml";
import { ItemsFilterController } from "./filters/ItemsFilterController";
import { FormController } from "./form/FormController";
import Forma from "./form/Forma.xml";
import GreenAppFacility from "./green/GreenAppFacility.xml";
import { GreenAppService } from "./green/GreenAppService";
import { IndexedDbQuery } from "./idb/IndexedDbQuery";
import { IndexedDbService } from "./idb/IndexedDbService";
import { TgWebAppService } from "./integration/TgWebAppService";
import { ItemCollectionController } from "./items/ItemCollectionController";
import { ItemController } from "./items/ItemController";
import { ItemSearchController } from "./items/ItemSearchController";
import ItemTitle from "./items/ItemTitle.xml";
import { NewItemController } from "./items/NewItemController";
import { MapaelService } from "./map/MapaelService";
import { LocationHashService } from "./nav/LocationHashService";
import { NavigationService } from "./nav/NavigationService";
import navigation from "./nav/navigation.xml";
import { Item } from "./support/Item";
import ToastFacility from "./toast/ToastFacility.xml";
import ToastList from "./toast/ToastList.xml";
import { ToastService } from "./toast/ToastService";
import AsyncLoader from "./widgets/AsyncLoader.xml";
import DarkModeToggler from "./widgets/DarkModeToggler.xml";
import DbLoadingIndicator from "./widgets/DbLoadingIndicator.xml";
import LoadingIndicator from "./widgets/LoadingIndicator.xml";
import MenuButton from "./widgets/MenuButton.xml";
import ScrollToTopButton from "./widgets/ScrollToTopButton.xml";
import ViewModeSelector from "./widgets/ViewModeSelector.xml";

// all componets types:
export default [
  typography,
  ApiEndpoint,
  AsyncLoader,
  AuthService,
  Auth2Service,
  Auth2Facility,
  Avatar,
  Backdrop,
  Badge,
  BrowserService,
  Btn,
  Checkbox,
  Chip,
  Chips,
  Container,
  DarkModeService,
  DarkModeToggler,
  DbLoadingIndicator,
  Dropdown,
  Field,
  FieldBoolean,
  FieldCity,
  FieldDate,
  FieldEnum,
  FieldFile,
  FieldFileController,
  FieldItem,
  FieldMultiEnum,
  FieldRadio,
  FieldSmartarea,
  FieldSuggestion,
  FieldTags,
  FieldTextarea,
  FieldRefs,
  FormController,
  Forma,
  GreenAppFacility,
  GreenAppService,
  Icon,
  Img,
  Input,
  IndexedDbService,
  IndexedDbQuery,
  Item,
  ItemTitle,
  ItemCollectionController,
  ItemSearchController,
  ItemController,
  ItemsFilter,
  ItemsFilterController,
  JsonView,
  ListSortBy,
  ListView,
  LoadingIndicator,
  LocationHashService,
  Logo,
  MapaelService,
  Meta,
  Modal,
  MenuButton,
  NavigationService,
  NewItemController,
  Pivot,
  Popover,
  PostMessageReceiver,
  PostMessageSender,
  RadioGroup,
  SSEventSource,
  ScrollToTopButton,
  SearchBar,
  Select,
  ServiceWorker,
  SignInPage,
  Skeleton,
  SpeechService,
  SmartareaController,
  StoredData,
  Stub,
  Table,
  Tabs,
  StoredValue,
  TagsValueController,
  TgWebAppService,
  ToastFacility,
  ToastList,
  ToastService,
  UserProfileModal,
  UserProfileService,
  ViewModeSelector,
  fab,
  navigation,
  svg,
  user
];