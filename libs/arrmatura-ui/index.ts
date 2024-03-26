import AsyncLoader from "./api/AsyncLoader.xml";
import AuthenticatedFacility from "./auth/AuthenticatedFacility.xml";
import Auth2Facility from "./auth/Auth2Facility.xml";
import Avatar from "./atoms/Avatar.xml";
import Backdrop from "./atoms/Backdrop.xml";
import Badge from "./atoms/Badge.xml";
import Btn from "./atoms/Btn.xml";
import Checkbox from "./atoms/Checkbox.xml";
import Chip from "./atoms/Chip.xml";
import Chips from "./atoms/Chips.xml";
import Container from "./atoms/Container.xml";
import DarkModeToggler from "./browser/DarkModeToggler.xml";
import DbLoadingIndicator from "./api/DbLoadingIndicator.xml";
import Dropdown from "./atoms/Dropdown.xml";
import Field from "./fields/Field.xml";
import FieldBoolean from "./fields/Field.Boolean.xml";
import FieldCity from "./fields/Field.City.xml";
import FieldDate from "./fields/Field.Date.xml";
import FieldEnum from "./fields/Field.Enum.xml";
import FieldFile from "./fields/Field.File.xml";
import FieldItem from "./fields/FieldItem.xml";
import FieldMultiEnum from "./fields/Field.MultiEnum.xml";
import FieldRadio from "./fields/Field.Radio.xml";
import FieldSmartarea from "./fields/Field.Smartarea.xml";
import FieldSuggestion from "./fields/Field.Suggestion.xml";
import FieldTags from "./fields/Field.Tags.xml";
import FieldTextarea from "./fields/Field.Textarea.xml";
import Forma from "./form/Forma.xml";
import GreenAppFacility from "./green/GreenAppFacility.xml";
import Icon from "./atoms/Icon.xml";
import Img from "./atoms/Img.xml";
import Input from "./atoms/Input.xml";
import ItemCollectionFacility from "./items/ItemCollectionFacility.xml";
import ItemPage from "./items/ItemPage.xml";
import ItemsFilter from "./items/ItemsFilter.xml";
import JsonView from "./dataview/JsonView.xml";
import ListSortBy from "./dataview/ListSortBy.xml";
import ListView from "./dataview/ListView.xml";
import Logo from "./atoms/Logo.xml";
import LoadingIndicator from "./atoms/LoadingIndicator.xml";
import MainPage from "./items/MainPage.xml";
import MarkupView from "./markup/MarkupView.xml";
import Meta from "./atoms/Meta.xml";
import Modal from "./atoms/Modal.xml";
import Navbar from "./atoms/Navbar.xml";
import Pivot from "./dataview/Pivot.xml";
import Popover from "./atoms/Popover.xml";
import RadioGroup from "./atoms/RadioGroup.xml";
import ScrollToTopButton from "./atoms/ScrollToTopButton.xml";
import SearchBar from "./atoms/SearchBar.xml";
import Select from "./atoms/Select.xml";
import SignInPage from "./auth/SignInPage.xml";
import Skeleton from "./atoms/Skeleton.xml";
import Stub from "./atoms/Stub.xml";
import Table from "./dataview/Table.xml";
import Tabs from "./atoms/Tabs.xml";
import ToastFacility from "./toast/ToastFacility.xml";
import ToastList from "./toast/ToastList.xml";
import UserProfileModal from "./auth/UserProfileModal.xml";
import fab from "./atoms/fab.xml";
import navigation from "./atoms/navigation.xml";
import svg from "./atoms/svg.xml";
import user from "./auth/user.xml";
import { ApiEndpoint } from "./api/ApiEndpoint";
import { AuthService } from "./auth/AuthService";
import { Auth2Service } from "./auth/Auth2Service";
import { BrowserService } from "./browser/BrowserService";
import { DarkModeService } from "./browser/DarkModeService";
import { IndexedDbService } from "./browser/IndexedDbService";
import { DbCollection } from "./api/DbCollection";
import { FieldFileController } from "./fields/FieldFileController";
import { SpeechService } from "./browser/SpeechService";
import { StoredValue } from "./browser/StoredValue";
import { FormController } from "./form/FormController";
import { GreenAppService } from "./green/GreenAppService";
import { Item } from "./items/Item";
import { ItemSearchController } from "./items/ItemSearchController";
import { ItemCollectionController } from "./items/ItemCollectionController";
import { ItemController } from "./items/ItemController";
import { NewItemController } from "./items/NewItemController";
import { ItemsFilterController } from "./items/ItemsFilterController";
import { LocationHashService } from "./browser/LocationHashService";
import { MapaelService } from "./map/MapaelService";
import { NavigationService } from "./browser/NavigationService";
import { PostMessageSender } from "./browser/PostMessageSender";
import { PostMessageReceiver } from "./browser/PostMessageReceiver";
import { SSEventSourceService } from "./api/SSEventSourceService";
import { ServiceWorker } from "./browser/ServiceWorker";
import { SmartareaController } from "./fields/SmartareaController";
import { StoredData } from "./browser/StoredData";
import { TagsValueController } from "./fields/TagsValueController";
import { TgWebAppService } from "./integration/TgWebAppService";
import { ToastService } from "./toast/ToastService";
import { UserProfileService } from "./auth/UserProfileService"

// all componets types:
export default [
  ApiEndpoint,
  AsyncLoader,
  AuthService,
  Auth2Service,
  AuthenticatedFacility,
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
  DbCollection,
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
  FormController,
  Forma,
  GreenAppFacility,
  GreenAppService,
  Icon,
  Img,
  Input,
  IndexedDbService,
  Item,
  ItemCollectionController,
  ItemCollectionFacility,
  ItemSearchController,
  ItemController,
  ItemPage,
  ItemsFilter,
  ItemsFilterController,
  JsonView,
  ListSortBy,
  ListView,
  LoadingIndicator,
  LocationHashService,
  Logo,
  MainPage,
  MapaelService,
  MarkupView,
  Meta,
  Modal,
  Navbar,
  NavigationService,
  NewItemController,
  Pivot,
  Popover,
  PostMessageReceiver,
  PostMessageSender,
  RadioGroup,
  SSEventSourceService,
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
  fab,
  navigation,
  svg,
  user
];