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
import{SeverityEnum}from"TYPO3/CMS/Backend/Enum/Severity.js";import AjaxRequest from"TYPO3/CMS/Core/Ajax/AjaxRequest.js";import Modal from"TYPO3/CMS/Backend/Modal.js";import DocumentService from"TYPO3/CMS/Core/DocumentService.js";class RenameFile{constructor(){DocumentService.ready().then(()=>{this.initialize()})}initialize(){const e=document.querySelector(".t3js-submit-file-rename");null!==e&&e.addEventListener("click",this.checkForDuplicate)}checkForDuplicate(e){e.preventDefault();const t=e.currentTarget.form,a=t.querySelector('input[name="data[rename][0][target]"]'),n=t.querySelector('input[name="data[rename][0][destination]"]'),i=t.querySelector('input[name="data[rename][0][conflictMode]"]'),r={fileName:a.value};null!==n&&(r.fileTarget=n.value),new AjaxRequest(TYPO3.settings.ajaxUrls.file_exists).withQueryArguments(r).get({cache:"no-cache"}).then(async e=>{const n=void 0!==(await e.resolve()).uid,r=a.dataset.original,l=a.value;if(n&&r!==l){const e=TYPO3.lang["file_rename.exists.description"].replace("{0}",r).replace(/\{1\}/g,l);Modal.confirm(TYPO3.lang["file_rename.exists.title"],e,SeverityEnum.warning,[{active:!0,btnClass:"btn-default",name:"cancel",text:TYPO3.lang["file_rename.actions.cancel"]},{btnClass:"btn-primary",name:"rename",text:TYPO3.lang["file_rename.actions.rename"]},{btnClass:"btn-default",name:"replace",text:TYPO3.lang["file_rename.actions.override"]}]).on("button.clicked",e=>{"cancel"!==e.target.name&&(null!==i&&(i.value=e.target.name),t.submit()),Modal.dismiss()})}else t.submit()})}}export default new RenameFile;