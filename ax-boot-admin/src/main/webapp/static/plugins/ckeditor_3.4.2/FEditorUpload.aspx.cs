using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

namespace GNICRM.Common.CKEditor
{
    public partial class FEditorUpload : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string UploadedPath = Server.MapPath("../../Data/WebEditor");

            if (!Directory.Exists(UploadedPath))
            {
                Directory.CreateDirectory(UploadedPath);
            }

            HttpFileCollection files = Request.Files;

            foreach (string key in files.Keys)
            {
                HttpPostedFile file = files[key] as HttpPostedFile;

                int idxFileName1 = file.FileName.LastIndexOf("\\");
                int idxFileName2 = file.FileName.LastIndexOf(".") - idxFileName1;

                int idxExtName1 = file.FileName.LastIndexOf(".");
                int idxExtName2 = file.FileName.Length - idxExtName1;

                string fileName = file.FileName.Substring(idxFileName1 + 1, idxFileName2 - 1);
                string extName = file.FileName.Substring(idxExtName1, idxExtName2);

                string saveFileName = FileNameCheck(UploadedPath, fileName, extName, 0);
                file.SaveAs(UploadedPath + "\\" + saveFileName);


                string targetEditID = Request["CKEditor"].ToString();
                string CKEditorFuncNum = Request["CKEditorFuncNum"].ToString();

                string url; // url to return

                string message; // message to display (optional)
                // here logic to upload image

                // and get file path of the image

                // path of the image

                string path = WPBase.Configuration.ApplicationSetting.GetAppSetting("gsPath") + "/Data/WebEditor/" + saveFileName;

                // will create http://localhost:1457/Content/Images/my_uploaded_image.jpg


                url = Request.Url.GetLeftPart(UriPartial.Authority) + path;
                // passing message success/failure
                message = "이미지 업로드가 완료 되었습니다.";
                // since it is an ajax request it requires this string
                string output = @"<html><body><script>window.parent.CKEDITOR.tools.callFunction(" + CKEditorFuncNum + ", \"" + url + "\", \"" + message + "\");</script></body></html>";

                Response.Write(output);
                Response.End();

            }
        }

        private string FileNameCheck(string UploadedPath, string fileName, string extName, int depth)
        {
            string str = string.Empty;
            string tempFIleName = string.Empty;
            if (depth == 0)
            {
                tempFIleName = UploadedPath + "\\" + fileName + extName;
                str = fileName + extName;
            }
            else
            {
                tempFIleName = UploadedPath + "\\" + fileName + "[" + depth + "]" + extName;
                str = fileName + "[" + depth + "]" + extName;
            }

            if (File.Exists(tempFIleName))
            {
                str = FileNameCheck(UploadedPath, fileName, extName, ++depth);
            }

            return str;
        }
    }
}
