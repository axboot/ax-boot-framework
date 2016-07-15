using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using GNICRM.Framework.Helper;

namespace GNICRM.Common.CKEditor
{
    public partial class FEditor : System.Web.UI.UserControl
    {
        #region Properties
        private bool isPropertyUpdate = false;
        private Unit width = new Unit("100%");
        /// <summary>
        /// Width
        /// </summary>
        public string Width
        {
            get
            {
                string str = string.Empty;
                switch (width.Type)
                {
                    case UnitType.Percentage:
                        str = width.Value.ToString() + "%";
                        break;
                    case UnitType.Pixel:
                        str = width.Value.ToString() + "px";
                        break;
                    default:
                        str = width.Value.ToString();
                        break;
                }

                return str;
            }
            set
            {
                isPropertyUpdate = true;
                Unit temp = new Unit(value);
                width = temp;
            }
        }
        private Unit height = new Unit("300px");
        /// <summary>
        /// Height
        /// </summary>
        public string Height
        {
            get
            {
                string str = string.Empty;
                switch (height.Type)
                {
                    case UnitType.Percentage:
                        str = height.Value.ToString() + "%";
                        break;
                    case UnitType.Pixel:
                        str = height.Value.ToString() + "px";
                        break;
                    default:
                        str = height.Value.ToString();
                        break;
                }

                return str;
            }
            set
            {
                isPropertyUpdate = true;
                Unit temp = new Unit(value);
                height = temp;
            }
        }
        private string skin = "Default";      //default, office2003, silver, Aluminum, office2007
        /// <summary>
        /// Skin
        /// </summary>
        public string Skin
        {
            get
            {

                return skin;
            }
            set
            {
                isPropertyUpdate = true;
                skin = value;
            }
        }
        private string lang = "ko";           //ko, en, ja, zh, etc
        /// <summary>
        /// Language
        /// </summary>
        public string Lang
        {
            get
            {

                return lang;
            }
            set
            {
                isPropertyUpdate = true;
                lang = value;
            }
        }
        private string toolbars = "Basic";  //Default, Basic
        /// <summary>
        /// Toobars
        /// </summary>
        public string Toolbars
        {
            get
            {

                return toolbars;
            }
            set
            {
                isPropertyUpdate = true;
                toolbars = value;
            }
        }
        private string contents = "";
        /// <summary>
        /// Contents
        /// </summary>
        public string Contents
        {
            get
            {
                contents = txtContent.Text;
                return contents;
            }
            set
            {
                isPropertyUpdate = true;
                txtContent.Text = CommUtil.Remove_Html_Tag(value, "colgroup");

            }
        }
        #endregion

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void BtnSubmit_Click(object sender, EventArgs e)
        {
            // For sample purposes, print the editor value at the bottom of the
            // page. Note that we are encoding the value, so it will be printed as
            // is, intead of rendering it.

            //LblPostedData.Text = HttpUtility.HtmlEncode(FCKeditor1.Value);
        }

        private string GetBasePath()
        {
            string path = Request.Url.AbsolutePath;
            int index = path.ToLower().LastIndexOf("workplace");
            return path.Remove(index, path.Length - index);
        }
    }
}