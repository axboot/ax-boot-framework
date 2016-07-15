<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="FEditor.ascx.cs" Inherits="GNICRM.Common.CKEditor.FEditor" %>
<%--
 * FCKeditor - The text editor for Internet - http://www.fckeditor.net
 * Copyright (C) 2003-2008 Frederico Caldeira Knabben
 *
 * == BEGIN LICENSE ==
 *
 * Licensed under the terms of any of the following licenses at your
 * choice:
 *
 *  - GNU General Public License Version 2 or later (the "GPL")
 *    http://www.gnu.org/licenses/gpl.html
 *
 *  - GNU Lesser General Public License Version 2.1 or later (the "LGPL")
 *    http://www.gnu.org/licenses/lgpl.html
 *
 *  - Mozilla Public License Version 1.1 or later (the "MPL")
 *    http://www.mozilla.org/MPL/MPL-1.1.html
 *
 * == END LICENSE ==
 *
 * Sample page.



<!---
	Here we have the FCKeditor component tag. It has been created
	by dragging the FCKeditor icon from the toolbar to the page, in design mode.
--->
--%>
<script type="text/javascript" src="../../Common/CKeditor_3.4.2/ckeditor.js"></script>
<script src="../../Common/CKeditor_3.4.2/_samples/sample.js" type="text/javascript"></script>
<link href="../../Common/CKeditor_3.4.2/_samples/sample.css" rel="stylesheet" type="text/css" />

<asp:TextBox ID="txtContent" runat="server" TextMode="MultiLine">
</asp:TextBox>
<script type="text/javascript">
    //<![CDATA[

    // This call can be placed at any point after the
    // <textarea>, or inside a <head><script> in a
    // window.onload event handler.

    // Replace the <textarea id="editor"> with an CKEditor
    // instance, using default configurations.
  CKEDITOR.replace('<%=txtContent.ClientID %>', {
    filebrowserUploadUrl:
 	   '../../Common/CKeditor_3.4.2/FEditorUpload.asp?type=1',
    toolbar: "<%=this.Toolbars %>",
    enterMode : '2',
    shiftEnterMode: '1'
    , width: '<%=Width %>'
    , height: '200px;'
  });
    //]]>
</script>