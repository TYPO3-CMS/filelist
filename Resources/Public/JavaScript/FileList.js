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
define(["require","exports","TYPO3/CMS/Core/DocumentService","TYPO3/CMS/Backend/Notification","TYPO3/CMS/Backend/InfoWindow","TYPO3/CMS/Backend/BroadcastMessage","TYPO3/CMS/Backend/BroadcastService","TYPO3/CMS/Backend/Tooltip","TYPO3/CMS/Core/Event/RegularEvent","TYPO3/CMS/Backend/Storage/ModuleStateStorage"],(function(e,t,i,o,r,a,n,l,s,c){"use strict";var d;!function(e){e.fileListFormSelector='form[name="fileListForm"]',e.commandSelector='input[name="cmd"]',e.searchFieldSelector='input[name="searchTerm"]',e.pointerFieldSelector='input[name="pointer"]'}(d||(d={}));class m{constructor(){this.fileListForm=document.querySelector(d.fileListFormSelector),this.command=this.fileListForm.querySelector(d.commandSelector),this.searchField=this.fileListForm.querySelector(d.searchFieldSelector),this.pointerField=this.fileListForm.querySelector(d.pointerFieldSelector),this.activeSearch=""!==this.searchField.value,m.processTriggers(),i.ready().then(()=>{l.initialize(".table-fit a[title]"),new s("click",(e,t)=>{e.preventDefault(),m.openInfoPopup(t.dataset.filelistShowItemType,t.dataset.filelistShowItemIdentifier)}).delegateTo(document,"[data-filelist-show-item-identifier][data-filelist-show-item-type]"),new s("click",(e,t)=>{e.preventDefault(),m.openInfoPopup("_FILE",t.dataset.identifier)}).delegateTo(document,"a.filelist-file-info"),new s("click",(e,t)=>{e.preventDefault(),m.openInfoPopup("_FILE",t.dataset.identifier)}).delegateTo(document,"a.filelist-file-references"),new s("click",(e,t)=>{e.preventDefault();const i=t.getAttribute("href");let o=i?encodeURIComponent(i):encodeURIComponent(top.list_frame.document.location.pathname+top.list_frame.document.location.search);top.list_frame.location.href=i+"&redirect="+o}).delegateTo(document,"a.filelist-file-copy");const e=document.querySelector('[data-event-name="filelist:clipboard:cmd"]');null!==e&&new s("filelist:clipboard:cmd",(e,t)=>{e.detail.result&&this.submitClipboardFormWithCommand(e.detail.payload)}).bindTo(e),new s("click",(e,t)=>{const i=t.dataset.filelistClipboardCmd;this.submitClipboardFormWithCommand(i)}).delegateTo(document,'[data-filelist-clipboard-cmd]:not([data-filelist-clipboard-cmd=""])')}),new s("multiRecordSelection:action:edit",this.editFileMetadata).bindTo(document),new s("search",()=>{""===this.searchField.value&&this.activeSearch&&this.fileListForm.submit()}).bindTo(this.searchField)}static openInfoPopup(e,t){r.showItem(e,t)}static processTriggers(){const e=document.querySelector(".filelist-main");if(null===e)return;const t=encodeURIComponent(e.dataset.filelistCurrentIdentifier);c.ModuleStateStorage.update("file",t,!0,void 0),m.emitTreeUpdateRequest(e.dataset.filelistCurrentIdentifier)}static emitTreeUpdateRequest(e){const t=new a.BroadcastMessage("filelist","treeUpdateRequested",{type:"folder",identifier:e});n.post(t)}static parseQueryParameters(e){let t={};if(e&&Object.prototype.hasOwnProperty.call(e,"search")){let i=e.search.substr(1).split("&");for(let e=0;e<i.length;e++){const o=i[e].split("=");t[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}}return t}static getReturnUrl(e){return""===e&&(e=top.list_frame.document.location.pathname+top.list_frame.document.location.search),encodeURIComponent(e)}editFileMetadata(e){e.preventDefault();const t=e.detail,i=t.configuration;if(!i||!i.idField||!i.table)return;const r=[];t.checkboxes.forEach(e=>{const t=e.closest("tr");null!==t&&t.dataset[i.idField]&&r.push(t.dataset[i.idField])}),r.length?window.location.href=top.TYPO3.settings.FormEngine.moduleUrl+"&edit["+i.table+"]["+r.join(",")+"]=edit&returnUrl="+m.getReturnUrl(i.returnUrl||""):o.warning("The selected elements can not be edited.")}submitClipboardFormWithCommand(e){if(this.command.value=e,"setCB"===e){const e=m.parseQueryParameters(document.location).pointer;e&&(this.pointerField.value=e)}this.fileListForm.submit()}}return new m}));