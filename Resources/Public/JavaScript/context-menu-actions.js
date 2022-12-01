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
import{lll}from"@typo3/core/lit-helper.js";import{SeverityEnum}from"@typo3/backend/enum/severity.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import Notification from"@typo3/backend/notification.js";import Modal from"@typo3/backend/modal.js";import Md5 from"@typo3/backend/hashing/md5.js";import{fileListOpenElementBrowser}from"@typo3/filelist/file-list.js";class ContextMenuActions{static getReturnUrl(){return encodeURIComponent(top.list_frame.document.location.pathname+top.list_frame.document.location.search)}static triggerFileDownload(t,e,n=!1){const o=document.createElement("a");o.href=t,o.download=e,document.body.appendChild(o),o.click(),n&&URL.revokeObjectURL(t),document.body.removeChild(o),Notification.success(lll("file_download.success"),"",2)}static renameFile(t,e,n){const o=n.actionUrl;top.TYPO3.Backend.ContentContainer.setUrl(o+"&target="+encodeURIComponent(e)+"&returnUrl="+ContextMenuActions.getReturnUrl())}static editFile(t,e,n){const o=n.actionUrl;top.TYPO3.Backend.ContentContainer.setUrl(o+"&target="+encodeURIComponent(e)+"&returnUrl="+ContextMenuActions.getReturnUrl())}static editMetadata(t,e,n){const o=n.metadataUid;o&&top.TYPO3.Backend.ContentContainer.setUrl(top.TYPO3.settings.FormEngine.moduleUrl+"&edit[sys_file_metadata]["+parseInt(o,10)+"]=edit&returnUrl="+ContextMenuActions.getReturnUrl())}static openInfoPopUp(t,e){"sys_file_storage"===t?top.TYPO3.InfoWindow.showItem(t,e):top.TYPO3.InfoWindow.showItem("_FILE",e)}static uploadFile(t,e,n){const o=n.actionUrl;top.TYPO3.Backend.ContentContainer.setUrl(o+"&target="+encodeURIComponent(e)+"&returnUrl="+ContextMenuActions.getReturnUrl())}static createFolder(t,e,n){top.TYPO3.Backend.ContentContainer.get().document.dispatchEvent(new CustomEvent(fileListOpenElementBrowser,{detail:{actionUrl:n.actionUrl,identifier:n.identifier,mode:n.mode}}))}static createFile(t,e,n){const o=n.actionUrl;top.TYPO3.Backend.ContentContainer.setUrl(o+"&target="+encodeURIComponent(e)+"&returnUrl="+ContextMenuActions.getReturnUrl())}static downloadFile(t,e,n){ContextMenuActions.triggerFileDownload(n.url,n.name)}static downloadFolder(t,e,n){Notification.info(lll("file_download.prepare"),"",2);const o=n.actionUrl;new AjaxRequest(o).post({items:[e]}).then((async t=>{let e=t.response.headers.get("Content-Disposition");if(!e){const e=await t.resolve();return void(!1===e.success&&e.status?Notification.warning(lll("file_download."+e.status),lll("file_download."+e.status+".message"),10):Notification.error(lll("file_download.error")))}e=e.substring(e.indexOf(" filename=")+10);const n=await t.raw().arrayBuffer(),o=new Blob([n],{type:t.raw().headers.get("Content-Type")});ContextMenuActions.triggerFileDownload(URL.createObjectURL(o),e,!0)})).catch((()=>{Notification.error(lll("file_download.error"))}))}static createFilemount(t,e){2===e.split(":").length&&top.TYPO3.Backend.ContentContainer.setUrl(top.TYPO3.settings.FormEngine.moduleUrl+"&edit[sys_filemounts][0]=new&defVals[sys_filemounts][identifier]="+encodeURIComponent(e)+"&returnUrl="+ContextMenuActions.getReturnUrl())}static deleteFile(t,e,n){const o=()=>{top.TYPO3.Backend.ContentContainer.setUrl(top.TYPO3.settings.FileCommit.moduleUrl+"&data[delete][0][data]="+encodeURIComponent(e)+"&data[delete][0][redirect]="+ContextMenuActions.getReturnUrl())};if(!n.title)return void o();const a=Modal.confirm(n.title,n.message,SeverityEnum.warning,[{text:n.buttonCloseText||TYPO3.lang["button.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:n.buttonOkText||TYPO3.lang["button.delete"]||"Delete",btnClass:"btn-warning",name:"delete"}]);a.addEventListener("button.clicked",(t=>{"delete"===t.target.name&&o(),a.hideModal()}))}static copyFile(t,e){const n=Md5.hash(e),o=TYPO3.settings.ajaxUrls.contextmenu_clipboard,a={CB:{el:{["_FILE%7C"+n]:e},setCopyMode:"1"}};new AjaxRequest(o).withQueryArguments(a).get().finally((()=>{top.TYPO3.Backend.ContentContainer.refresh(!0)}))}static copyReleaseFile(t,e){const n=Md5.hash(e),o=TYPO3.settings.ajaxUrls.contextmenu_clipboard,a={CB:{el:{["_FILE%7C"+n]:"0"},setCopyMode:"1"}};new AjaxRequest(o).withQueryArguments(a).get().finally((()=>{top.TYPO3.Backend.ContentContainer.refresh(!0)}))}static cutFile(t,e){const n=Md5.hash(e),o=TYPO3.settings.ajaxUrls.contextmenu_clipboard,a={CB:{el:{["_FILE%7C"+n]:e}}};new AjaxRequest(o).withQueryArguments(a).get().finally((()=>{top.TYPO3.Backend.ContentContainer.refresh(!0)}))}static cutReleaseFile(t,e){const n=Md5.hash(e),o=TYPO3.settings.ajaxUrls.contextmenu_clipboard,a={CB:{el:{["_FILE%7C"+n]:"0"}}};new AjaxRequest(o).withQueryArguments(a).get().finally((()=>{top.TYPO3.Backend.ContentContainer.refresh(!0)}))}static pasteFileInto(t,e,n){const o=()=>{top.TYPO3.Backend.ContentContainer.setUrl(top.TYPO3.settings.FileCommit.moduleUrl+"&CB[paste]=FILE|"+encodeURIComponent(e)+"&CB[pad]=normal&redirect="+ContextMenuActions.getReturnUrl())};if(!n.title)return void o();const a=Modal.confirm(n.title,n.message,SeverityEnum.warning,[{text:n.buttonCloseText||TYPO3.lang["button.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:n.buttonOkText||TYPO3.lang["button.ok"]||"OK",btnClass:"btn-warning",name:"ok"}]);a.addEventListener("button.clicked",(t=>{"ok"===t.target.name&&o(),a.hideModal()}))}}export default ContextMenuActions;