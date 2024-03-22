/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
import{lll}from"@typo3/core/lit-helper.js";import DocumentService from"@typo3/core/document-service.js";import Notification from"@typo3/backend/notification.js";import InfoWindow from"@typo3/backend/info-window.js";import{BroadcastMessage}from"@typo3/backend/broadcast-message.js";import broadcastService from"@typo3/backend/broadcast-service.js";import{FileListActionEvent,FileListActionSelector,FileListActionUtility}from"@typo3/filelist/file-list-actions.js";import NProgress from"nprogress";import Icons from"@typo3/backend/icons.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import RegularEvent from"@typo3/core/event/regular-event.js";import{ModuleStateStorage}from"@typo3/backend/storage/module-state-storage.js";import{default as Modal}from"@typo3/backend/modal.js";import{SeverityEnum}from"@typo3/backend/enum/severity.js";import Severity from"@typo3/backend/severity.js";import{MultiRecordSelectionSelectors}from"@typo3/backend/multi-record-selection.js";import ContextMenu from"@typo3/backend/context-menu.js";var Selectors;!function(e){e.fileListFormSelector='form[name="fileListForm"]',e.commandSelector='input[name="cmd"]',e.searchFieldSelector='input[name="searchTerm"]',e.pointerFieldSelector='input[name="pointer"]'}(Selectors||(Selectors={}));export const fileListOpenElementBrowser="typo3:filelist:openElementBrowser";export default class Filelist{constructor(){this.downloadFilesAndFolders=e=>{e.preventDefault();const t=e.target,o=e.detail,i=o.configuration,n=[];o.checkboxes.forEach((e=>{if(e.checked){const t=e.closest(FileListActionSelector.elementSelector),o=FileListActionUtility.getResourceForElement(t);n.unshift(o.identifier)}})),n.length?this.triggerDownload(n,i.downloadUrl,t):Notification.warning(lll("file_download.invalidSelection"))},Filelist.processTriggers(),new RegularEvent(fileListOpenElementBrowser,(e=>{const t=new URL(e.detail.actionUrl,window.location.origin);t.searchParams.set("expandFolder",e.detail.identifier),t.searchParams.set("mode",e.detail.mode);Modal.advanced({type:Modal.types.iframe,content:t.toString(),size:Modal.sizes.large}).addEventListener("typo3-modal-hidden",(()=>{top.list_frame.document.location.reload()}))})).bindTo(document),new RegularEvent(FileListActionEvent.primary,(e=>{const t=e.detail,o=t.resources[0],i=t.trigger.closest("[data-default-language-access]");if("file"===o.type&&null!==i&&(window.location.href=top.TYPO3.settings.FormEngine.moduleUrl+"&edit[sys_file_metadata]["+o.metaUid+"]=edit&returnUrl="+Filelist.getReturnUrl("")),"folder"===o.type){const e=Filelist.parseQueryParameters(document.location);e.id=o.identifier;let t="";Object.keys(e).forEach((o=>{""!==e[o]&&(t=t+"&"+o+"="+e[o])})),window.location.href=window.location.pathname+"?"+t.substring(1)}})).bindTo(document),new RegularEvent(FileListActionEvent.primaryContextmenu,(e=>{const t=e.detail,o=t.resources[0];ContextMenu.show("sys_file",o.identifier,"","","",t.trigger,t.event)})).bindTo(document),new RegularEvent(FileListActionEvent.show,(e=>{const t=e.detail.resources[0];Filelist.openInfoPopup("_"+t.type.toUpperCase(),t.identifier)})).bindTo(document),new RegularEvent(FileListActionEvent.download,(e=>{const t=e.detail,o=t.resources[0];this.triggerDownload([o.identifier],t.url,t.trigger)})).bindTo(document),new RegularEvent(FileListActionEvent.updateOnlineMedia,(e=>{const t=e.detail,o=t.resources[0];this.updateOnlineMedia(o,t.url)})).bindTo(document),DocumentService.ready().then((()=>{new RegularEvent("click",((e,t)=>{e.preventDefault(),document.dispatchEvent(new CustomEvent(fileListOpenElementBrowser,{detail:{actionUrl:t.href,identifier:t.dataset.identifier,mode:t.dataset.mode}}))})).delegateTo(document,".t3js-element-browser")})),new RegularEvent("multiRecordSelection:action:edit",this.editFileMetadata).bindTo(document),new RegularEvent("multiRecordSelection:action:delete",this.deleteMultiple).bindTo(document),new RegularEvent("multiRecordSelection:action:download",this.downloadFilesAndFolders).bindTo(document),new RegularEvent("multiRecordSelection:action:copyMarked",(e=>{Filelist.submitClipboardFormWithCommand("copyMarked",e.target)})).bindTo(document),new RegularEvent("multiRecordSelection:action:removeMarked",(e=>{Filelist.submitClipboardFormWithCommand("removeMarked",e.target)})).bindTo(document);const e=""!==document.querySelector([Selectors.fileListFormSelector,Selectors.searchFieldSelector].join(" "))?.value;new RegularEvent("search",(t=>{const o=t.target;""===o.value&&e&&o.closest(Selectors.fileListFormSelector)?.submit()})).delegateTo(document,Selectors.searchFieldSelector)}static submitClipboardFormWithCommand(e,t){const o=t.closest(Selectors.fileListFormSelector);if(!o)return;const i=o.querySelector(Selectors.commandSelector);if(i){if(i.value=e,"copyMarked"===e||"removeMarked"===e){const e=o.querySelector(Selectors.pointerFieldSelector),t=Filelist.parseQueryParameters(document.location).pointer;e&&t&&(e.value=t)}o.submit()}}static openInfoPopup(e,t){InfoWindow.showItem(e,t)}static processTriggers(){const e=document.querySelector(".filelist-main");if(null===e)return;const t=encodeURIComponent(e.dataset.filelistCurrentIdentifier);ModuleStateStorage.update("media",t,!0,void 0),Filelist.emitTreeUpdateRequest(e.dataset.filelistCurrentIdentifier)}static emitTreeUpdateRequest(e){const t=new BroadcastMessage("filelist","treeUpdateRequested",{type:"folder",identifier:e});broadcastService.post(t)}static parseQueryParameters(e){const t={};if(e&&Object.prototype.hasOwnProperty.call(e,"search")){const o=e.search.substr(1).split("&");for(let e=0;e<o.length;e++){const i=o[e].split("=");t[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}}return t}static getReturnUrl(e){return""===e&&(e=top.list_frame.document.location.pathname+top.list_frame.document.location.search),encodeURIComponent(e)}deleteMultiple(e){e.preventDefault();const t=e.detail.configuration;Modal.advanced({title:t.title||"Delete",content:t.content||"Are you sure you want to delete those files and folders?",severity:SeverityEnum.warning,buttons:[{text:TYPO3.lang["button.close"]||"Close",active:!0,btnClass:"btn-default",trigger:(e,t)=>t.hideModal()},{text:t.ok||TYPO3.lang["button.ok"]||"OK",btnClass:"btn-"+Severity.getCssClass(SeverityEnum.warning),trigger:(t,o)=>{Filelist.submitClipboardFormWithCommand("delete",e.target),o.hideModal()}}]})}editFileMetadata(e){e.preventDefault();const t=e.detail,o=t.configuration;if(!o||!o.idField||!o.table)return;const i=[];t.checkboxes.forEach((e=>{const t=e.closest(MultiRecordSelectionSelectors.elementSelector);null!==t&&t.dataset[o.idField]&&i.push(t.dataset[o.idField])})),i.length?window.location.href=top.TYPO3.settings.FormEngine.moduleUrl+"&edit["+o.table+"]["+i.join(",")+"]=edit&returnUrl="+Filelist.getReturnUrl(o.returnUrl||""):Notification.warning("The selected elements can not be edited.")}triggerDownload(e,t,o){Notification.info(lll("file_download.prepare"),"",2);const i=o?.innerHTML;o&&(o.setAttribute("disabled","disabled"),Icons.getIcon("spinner-circle",Icons.sizes.small).then((e=>{o.innerHTML=e}))),NProgress.configure({parent:"#typo3-filelist",showSpinner:!1}).start(),new AjaxRequest(t).post({items:e}).then((async e=>{let t=e.response.headers.get("Content-Disposition");if(!t){const t=await e.resolve();return void(!1===t.success&&t.status?Notification.warning(lll("file_download."+t.status),lll("file_download."+t.status+".message"),10):Notification.error(lll("file_download.error")))}t=t.substring(t.indexOf(" filename=")+10);const o=await e.raw().arrayBuffer(),i=new Blob([o],{type:e.raw().headers.get("Content-Type")}),n=URL.createObjectURL(i),r=document.createElement("a");r.href=n,r.download=t,document.body.appendChild(r),r.click(),URL.revokeObjectURL(n),document.body.removeChild(r),Notification.success(lll("file_download.success"),"",2)})).catch((()=>{Notification.error(lll("file_download.error"))})).finally((()=>{NProgress.done(),o&&(o.removeAttribute("disabled"),o.innerHTML=i)}))}updateOnlineMedia(e,t){t&&e.uid&&"file"===e.type&&(NProgress.configure({parent:"#typo3-filelist",showSpinner:!1}).start(),new AjaxRequest(t).post({resource:e}).then((()=>{Notification.success(lll("online_media.update.success"))})).catch((()=>{Notification.error(lll("online_media.update.error"))})).finally((()=>{NProgress.done(),window.location.reload()})))}}